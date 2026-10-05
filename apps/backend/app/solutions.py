"""Splits a reference solution into revealable parts and prices them.

A student can reveal the solution piece by piece: each function/class/block or single statement
costs PART_COST (single line) or BLOCK_COST (function/block), the whole solution costs the points the exercise is worth (its cap). Revealing several parts never costs more
than that cap (so asking for everything after a few parts only costs the difference). Imports are free.
"""

import ast
from dataclasses import dataclass

PART_COST = 1  # a single line
BLOCK_COST = 3  # a function, class, loop or other multi-line block
WHOLE_ID = "all"


@dataclass(frozen=True)
class Part:
    id: str
    label: str
    code: str
    lines: int
    cost: int
    kind: str = "line"  # "line" (a single statement or imports) or "block" (function, class, loop, if, multi-line)


def cost_for(kind: str) -> int:
    return BLOCK_COST if kind == "block" else PART_COST


def code_lines(source: str) -> list[str]:
    """Lines that actually do something: no blanks, no comment-only lines, whitespace collapsed."""
    out = []
    for raw in source.replace("\r\n", "\n").splitlines():
        line = " ".join(raw.split())
        if line and not line.startswith("#"):
            out.append(line)
    return out


_BLOCKS = (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef, ast.For, ast.While, ast.If, ast.With, ast.Try)


def _label(node: ast.stmt, start: int, end: int) -> str:
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        return f"Function {node.name}()"
    if isinstance(node, ast.ClassDef):
        return f"Class {node.name}"
    where = f"Line {start}" if start == end else f"Lines {start}-{end}"
    if isinstance(node, (ast.For, ast.While)):
        return f"Loop ({where})"
    if isinstance(node, ast.If):
        return f"If block ({where})"
    return where


def split_parts(source: str) -> list[Part]:
    lines = source.replace("\r\n", "\n").splitlines()
    try:
        tree = ast.parse(source)
    except SyntaxError:
        return _split_on_blank_lines(lines)

    parts: list[Part] = []
    imports: list[tuple[int, int]] = []

    def add(label: str, start: int, end: int, kind: str) -> None:
        code = "\n".join(lines[start - 1 : end])
        cost = 0 if label == "Imports" else cost_for(kind)
        parts.append(Part(f"p{len(parts)}", label, code, len(code_lines(code)), cost, kind))

    def flush_imports() -> None:
        if imports:
            add("Imports", imports[0][0], imports[-1][1], "line")
            imports.clear()

    for node in tree.body:
        start = min([node.lineno] + [d.lineno for d in getattr(node, "decorator_list", [])])
        end = node.end_lineno or node.lineno
        # Keep a comment that sits directly above a statement with it.
        while start > 1 and lines[start - 2].strip().startswith("#"):
            start -= 1
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            imports.append((start, end))
            continue
        flush_imports()
        if isinstance(node, ast.Expr) and isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
            continue  # module docstring
        is_block = isinstance(node, _BLOCKS) or len(code_lines(chr(10).join(lines[start - 1 : end]))) > 1
        add(_label(node, start, end), start, end, "block" if is_block else "line")
    flush_imports()
    return parts


def _split_on_blank_lines(lines: list[str]) -> list[Part]:
    parts: list[Part] = []
    block: list[str] = []
    start = 1
    for number, line in enumerate(lines + [""], start=1):
        if line.strip():
            if not block:
                start = number
            block.append(line)
        elif block:
            code = "\n".join(block)
            end = number - 1
            n = len(code_lines(code))
            kind = "line" if n <= 1 else "block"
            parts.append(Part(f"p{len(parts)}", f"Lines {start}-{end}", code, n, cost_for(kind), kind))
            block = []
    return parts


def penalty_for(revealed: set[str], parts: list[Part], cap: int) -> int:
    """Points to deduct for the revealed parts; `cap` is the exercise's own points."""
    if WHOLE_ID in revealed:
        return cap
    return min(cap, sum(p.cost for p in parts if p.id in revealed))


def parse_revealed(stored: str) -> set[str]:
    return {x for x in (stored or "").split(",") if x}


def written_by_student(part: Part, student_source: str) -> bool:
    """True when every meaningful line of the part already appears in the student's code."""
    needed = code_lines(part.code)
    have = set(code_lines(student_source))
    return bool(needed) and all(line in have for line in needed)
