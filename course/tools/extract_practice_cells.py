"""Extract every <PracticeCell> from the frontend readings into course/exercises/practice_cells.json.

The backend grades and hints against this server-side answer key, so the reference code never has
to be trusted from the browser. Re-run after adding or editing a PracticeCell:

    python course/tools/extract_practice_cells.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
READINGS = ROOT / "apps" / "frontend" / "app" / "src" / "data" / "readings"
OUT = ROOT / "course" / "exercises" / "practice_cells.json"

TEMPLATE = r"`((?:[^`\\]|\\.)*)`"
CELL = re.compile(
    r'<PracticeCell\s+labId=\{(\d+)\}\s+cellId="([^"]+)"\s+code=\{' + TEMPLATE + r"\}"
    r"(?:\s+expectedOutput=\{" + TEMPLATE + r"\})?\s*/>",
    re.DOTALL,
)
SIMPLE_ESCAPES = {"n": "\n", "t": "\t", "r": "\r", "b": "\b", "f": "\f", "v": "\v", "0": "\0"}


def cook(raw: str) -> str:
    """Evaluate JS template-literal escapes the way the browser does."""
    out, i = [], 0
    while i < len(raw):
        ch = raw[i]
        if ch != "\\":
            out.append(ch)
            i += 1
            continue
        nxt = raw[i + 1]
        if nxt in SIMPLE_ESCAPES:
            out.append(SIMPLE_ESCAPES[nxt])
            i += 2
        elif nxt == "u":
            out.append(chr(int(raw[i + 2 : i + 6], 16)))
            i += 6
        elif nxt == "x":
            out.append(chr(int(raw[i + 2 : i + 4], 16)))
            i += 4
        elif nxt == "\n":
            i += 2
        else:
            out.append(nxt)
            i += 2
    return "".join(out)


def main() -> None:
    cells = []
    for path in sorted(READINGS.glob("Lab*Reading.tsx")):
        text = path.read_text(encoding="utf-8")
        found = CELL.findall(text)
        expected = text.count("<PracticeCell")
        if len(found) != expected:
            raise SystemExit(f"{path.name}: matched {len(found)} of {expected} PracticeCells - fix the pattern")
        for lab_id, cell_id, code, expected_output in found:
            cells.append(
                {
                    "lab_id": int(lab_id),
                    "cell_id": cell_id,
                    "code": cook(code),
                    "expected_output": cook(expected_output) if expected_output else None,
                }
            )
    OUT.write_text(json.dumps(cells, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {len(cells)} cells to {OUT}")


if __name__ == "__main__":
    main()
