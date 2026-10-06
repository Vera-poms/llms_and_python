"""Runs real Python kernels server-side so notebook cells can execute from the web app.

This is not a full sandbox (no network or syscall filtering), but it keeps the server's secrets and
the course solutions out of reach and bounds the resources a kernel can use:

* the kernel gets a scrubbed environment (no DATABASE_URL, SECRET_KEY, API keys, ...);
* when the server runs as root (the production container) each kernel drops to its own unprivileged
  uid, so it cannot read /app or /course (root-only), the server's /proc entries, or the files and
  processes of other kernels. Otherwise (local dev as a normal user) the server instead marks itself
  non-dumpable so a kernel cannot read /proc/<server pid>/environ;
* each kernel runs in its own throwaway working directory (so `plt.savefig("x.png")` works);
* kernels are capped in number, one per user, reaped when idle, and every cell has a hard timeout.

Sized for a small instance (Render free tier: 512 MB RAM). Sessions live in this process's memory,
so run exactly one worker/instance.
"""

import ctypes
import os
import queue
import re
import shutil
import sys
import tempfile
import threading
import time
from pathlib import Path

try:
    import resource
except ImportError:  # Windows (local dev only)
    resource = None  # type: ignore[assignment]

from jupyter_client import KernelManager

# Each live kernel with numpy/matplotlib loaded holds ~100-150 MB; two fit beside the server in 512 MB.
MAX_KERNELS = int(os.getenv("KERNEL_MAX", "2"))
IDLE_SECONDS = int(os.getenv("KERNEL_IDLE_SECONDS", "300"))
CELL_TIMEOUT = int(os.getenv("KERNEL_CELL_TIMEOUT", "60"))
MAX_OUTPUT_CHARS = int(os.getenv("KERNEL_MAX_OUTPUT_CHARS", "100000"))
# Kernel slot N runs as uid/gid KERNEL_UID_BASE + N (no passwd entry needed).
KERNEL_UID_BASE = int(os.getenv("KERNEL_UID_BASE", "20000"))
_DROP_PRIVILEGES = hasattr(os, "geteuid") and os.geteuid() == 0

# matplotlib's font cache takes many seconds to build on a small CPU. It is pre-built in the Dockerfile
# and each kernel gets its own copy (a shared writable cache would let one kernel poison another's).
MPL_CACHE = Path(os.getenv("KERNEL_MPL_CACHE", Path(tempfile.gettempdir()) / "kernel_mpl"))

# Only these variables reach the kernel. Everything else (secrets included) is dropped.
_ENV_ALLOWLIST = ("PATH", "LANG", "LC_ALL", "TZ", "SYSTEMROOT", "SYSTEMDRIVE", "WINDIR", "COMSPEC", "PATHEXT")


class KernelBusy(Exception):
    """Every kernel slot is taken by a cell that is still running."""


def _harden_process() -> None:
    """Stop same-user processes from reading this process's environ and memory (Linux)."""
    if not sys.platform.startswith("linux"):
        return
    try:
        PR_SET_DUMPABLE = 4
        ctypes.CDLL(None).prctl(PR_SET_DUMPABLE, 0, 0, 0, 0)
    except Exception:
        pass


_harden_process()


def _remove_stale_workdirs() -> None:
    """A crash or kill leaves kernel_* directories behind. Only this one process owns them, so clear them at import."""
    for path in Path(tempfile.gettempdir()).glob("kernel_*"):
        if path != MPL_CACHE:
            shutil.rmtree(path, ignore_errors=True)


_remove_stale_workdirs()


def _kernel_env(workdir: Path) -> dict[str, str]:
    env = {k: os.environ[k] for k in _ENV_ALLOWLIST if k in os.environ}
    env.update(
        HOME=str(workdir),
        USERPROFILE=str(workdir),  # Windows equivalent of HOME (local dev)
        TMPDIR=str(workdir),
        MPLCONFIGDIR=str(workdir / ".mpl"),
        IPYTHONDIR=str(workdir / ".ipython"),
        PYTHONUNBUFFERED="1",
        # Small instances: don't let numpy spin up a thread per core in every kernel.
        OMP_NUM_THREADS="1",
        OPENBLAS_NUM_THREADS="1",
        MKL_NUM_THREADS="1",
    )
    return env


def _chown_tree(root: Path, uid: int) -> None:
    os.chown(root, uid, uid)
    os.chmod(root, 0o700)
    for path in root.rglob("*"):
        os.chown(path, uid, uid, follow_symlinks=False)


def _drop_privileges_fn(uid: int, manager: KernelManager):
    """Runs in the forked child just before exec: hand the kernel its connection file, then become `uid`."""

    def drop() -> None:
        # The path only exists once start_kernel has written the file, so read it at fork time.
        os.chown(manager.connection_file, uid, uid)
        resource.setrlimit(resource.RLIMIT_NPROC, (256, 256))  # fork-bomb guard; counted per uid
        resource.setrlimit(resource.RLIMIT_FSIZE, (64 << 20, 64 << 20))
        os.setgroups([])
        os.setgid(uid)
        os.setuid(uid)

    return drop


_ANSI = re.compile(r"\x1b\[[0-9;]*m")
# IPython marks the failing line of each frame like "----> 39     assert ...".
_ARROW_LINE = re.compile(r"^-+>\s*(\d+)\s?(.*)$")


_CELL_LINE = re.compile(r"Cell In\[\d+\], line (\d+)")


def _failing_line(traceback: list[str]) -> tuple[int | None, str | None]:
    """Line number and source of the innermost failing line in the user's cell."""
    found: tuple[int | None, str | None] = (None, None)
    for frame in traceback:
        for text in frame.splitlines():
            match = _ARROW_LINE.match(text)
            if match:
                found = (int(match.group(1)), match.group(2).strip())
        # Only the first frame is the user's cell; deeper ones are library or helper code.
        if found[0] is not None:
            return found
    # SyntaxErrors have no arrow line: "Cell In[5], line 1" followed by the offending source.
    for frame in traceback:
        lines = frame.splitlines()
        for i, text in enumerate(lines):
            match = _CELL_LINE.search(text)
            if match:
                code = lines[i + 1].strip() if i + 1 < len(lines) else None
                return int(match.group(1)), code
    return found

_sessions: dict[tuple[int, int], "KernelSession"] = {}
_sessions_lock = threading.Lock()


def _error_output(ename: str, evalue: str) -> dict:
    return {"type": "error", "ename": ename, "evalue": evalue, "traceback": [], "line": None, "code": None}


def error_result(ename: str, evalue: str) -> dict:
    """A failed run in the same shape as a real one, so the UI shows it like any cell error."""
    return {"outputs": [_error_output(ename, evalue)], "ok": False}


class KernelSession:
    def __init__(self, slot: int) -> None:
        self.slot = slot
        self.workdir = Path(tempfile.mkdtemp(prefix="kernel_"))
        self.last_used = time.monotonic()
        self.lock = threading.Lock()
        self._dead = False
        try:
            if MPL_CACHE.is_dir():
                shutil.copytree(MPL_CACHE, self.workdir / ".mpl", dirs_exist_ok=True)
            self.manager = KernelManager(kernel_name="python3")
            launch_args: dict = {}
            if _DROP_PRIVILEGES:
                uid = KERNEL_UID_BASE + slot
                _chown_tree(self.workdir, uid)
                # The connection file holds the channel auth key. start_kernel writes it as root; the
                # child chowns it to the kernel's uid just before exec so no other kernel can read it.
                launch_args["preexec_fn"] = _drop_privileges_fn(uid, self.manager)
            self.manager.start_kernel(cwd=str(self.workdir), env=_kernel_env(self.workdir), **launch_args)
            self.client = self.manager.client()
            self.client.start_channels()
            self.client.wait_for_ready(timeout=60)
        except Exception:
            self.shutdown()
            raise

    @property
    def running(self) -> bool:
        return self.lock.locked()

    def run(self, source: str) -> dict:
        with self.lock:
            self.last_used = time.monotonic()
            try:
                return self._execute(source)
            finally:
                self.last_used = time.monotonic()

    def _execute(self, source: str) -> dict:
        msg_id = self.client.execute(source)
        outputs: list[dict] = []
        ok = True
        chars = 0
        deadline = time.monotonic() + CELL_TIMEOUT
        interrupted = False
        while True:
            try:
                msg = self.client.get_iopub_msg(timeout=max(0.1, min(1.0, deadline - time.monotonic())))
            except queue.Empty:
                if time.monotonic() < deadline:
                    continue
                if interrupted:
                    # Ignored the interrupt too: kill it. The next cell gets a fresh kernel.
                    self._dead = True
                    return {
                        "outputs": [_error_output("TimeoutError", f"Cell stopped after {CELL_TIMEOUT}s and the kernel was restarted. Variables are lost.")],
                        "ok": False,
                    }
                interrupted = True
                self.manager.interrupt_kernel()
                deadline = time.monotonic() + 5
                ok = False
                outputs.append(_error_output("TimeoutError", f"Cell stopped after {CELL_TIMEOUT}s."))
                continue

            if msg["parent_header"].get("msg_id") != msg_id:
                continue

            msg_type = msg["msg_type"]
            content = msg["content"]

            if msg_type == "stream":
                if chars < MAX_OUTPUT_CHARS:
                    text = content["text"][: MAX_OUTPUT_CHARS - chars]
                    chars += len(text)
                    if chars >= MAX_OUTPUT_CHARS:
                        text += "\n[output truncated]\n"
                    outputs.append({"type": "stream", "name": content["name"], "text": text})
            elif msg_type in ("execute_result", "display_data"):
                data = content.get("data", {})
                if "image/png" in data:
                    outputs.append({"type": "image", "data": data["image/png"]})
                elif "text/plain" in data and chars < MAX_OUTPUT_CHARS:
                    text = data["text/plain"][: MAX_OUTPUT_CHARS - chars]
                    chars += len(text)
                    outputs.append({"type": "stream", "name": "stdout", "text": text})
            elif msg_type == "error":
                if interrupted:
                    continue  # the KeyboardInterrupt from our own timeout; already reported
                ok = False
                traceback = [_ANSI.sub("", frame) for frame in content["traceback"]]
                line, code = _failing_line(traceback)
                outputs.append(
                    {
                        "type": "error",
                        "ename": content["ename"],
                        "evalue": content["evalue"],
                        "traceback": traceback,
                        "line": line,
                        "code": code,
                    }
                )
            elif msg_type == "status" and content["execution_state"] == "idle":
                break

        return {"outputs": outputs, "ok": ok}

    def shutdown(self) -> None:
        try:
            self.client.stop_channels()
        except Exception:
            pass
        try:
            self.manager.shutdown_kernel(now=True)
        except Exception:
            pass
        shutil.rmtree(self.workdir, ignore_errors=True)


def _reap_idle_locked() -> list[KernelSession]:
    """Pop idle or dead kernels. Caller holds _sessions_lock and must shut the result down."""
    now = time.monotonic()
    stale = [
        key for key, s in _sessions.items()
        if not s.running and (s._dead or now - s.last_used > IDLE_SECONDS)
    ]
    return [_sessions.pop(key) for key in stale]


def get_or_start(user_id: int, lab_id: int) -> KernelSession:
    key = (user_id, lab_id)
    with _sessions_lock:
        doomed = _reap_idle_locked()
        session = _sessions.get(key)
        if session is None:
            # One kernel per user: opening another lab replaces the previous one.
            for other in [k for k in _sessions if k[0] == user_id]:
                if not _sessions[other].running:
                    doomed.append(_sessions.pop(other))
            if len(_sessions) >= MAX_KERNELS:
                idle = [(s.last_used, k) for k, s in _sessions.items() if not s.running]
                if not idle:
                    raise KernelBusy("The server is busy running other students' code. Try again in a moment.")
                doomed.append(_sessions.pop(min(idle)[1]))
        # Shut down inside the lock: a slot (and its uid) must be dead before it is handed out again.
        for old in doomed:
            old.shutdown()
        if session is None:
            used = {s.slot for s in _sessions.values()}
            session = KernelSession(slot=next(n for n in range(MAX_KERNELS) if n not in used))
            _sessions[key] = session
    return session


def run_cell(user_id: int, lab_id: int, source: str) -> dict:
    return get_or_start(user_id, lab_id).run(source)


def restart(user_id: int, lab_id: int) -> None:
    key = (user_id, lab_id)
    with _sessions_lock:
        session = _sessions.pop(key, None)
        if session is not None:
            session.shutdown()
