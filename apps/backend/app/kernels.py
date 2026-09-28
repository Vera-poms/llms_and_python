"""Runs real Python kernels server-side so notebook cells can execute from the web app.

Single-user, local, personal tool only - this has no code sandboxing beyond
the OS process. Never expose these endpoints to untrusted users.
"""

import threading

from jupyter_client import KernelManager

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
                    outputs.append(
                        {
                            "type": "error",
                            "ename": content["ename"],
                            "evalue": content["evalue"],
                            "traceback": content["traceback"],
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
