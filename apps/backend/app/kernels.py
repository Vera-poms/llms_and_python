"""Runs real Python kernels server-side so notebook cells can execute from the web app.

Single-user, local, personal tool only - this has no code sandboxing beyond
the OS process. Never expose these endpoints to untrusted users.
"""

import re
import threading

from jupyter_client import KernelManager

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


class KernelSession:
    def __init__(self) -> None:
        self.manager = KernelManager(kernel_name="python3")
        self.manager.start_kernel()
        self.client = self.manager.client()
        self.client.start_channels()
        self.client.wait_for_ready(timeout=60)
        self.lock = threading.Lock()

    def run(self, source: str) -> dict:
        with self.lock:
            msg_id = self.client.execute(source)
            outputs: list[dict] = []
            ok = True
            while True:
                msg = self.client.get_iopub_msg(timeout=120)
                if msg["parent_header"].get("msg_id") != msg_id:
                    continue

                msg_type = msg["msg_type"]
                content = msg["content"]

                if msg_type == "stream":
                    outputs.append({"type": "stream", "name": content["name"], "text": content["text"]})
                elif msg_type in ("execute_result", "display_data"):
                    data = content.get("data", {})
                    if "image/png" in data:
                        outputs.append({"type": "image", "data": data["image/png"]})
                    elif "text/plain" in data:
                        outputs.append({"type": "stream", "name": "stdout", "text": data["text/plain"]})
                elif msg_type == "error":
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
        self.client.stop_channels()
        self.manager.shutdown_kernel(now=True)


def get_or_start(user_id: int, lab_id: int) -> KernelSession:
    key = (user_id, lab_id)
    with _sessions_lock:
        session = _sessions.get(key)
        if session is None:
            session = KernelSession()
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
