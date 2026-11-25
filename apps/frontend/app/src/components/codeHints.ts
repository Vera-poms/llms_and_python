import { Range, Text } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  hoverTooltip,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";

// Something in the code to explain on hover. In `text`, wrap code in backticks and key
// words in **double stars** to style them.
//
// - Plain hint: every place `code` appears gets a dotted underline; hovering it shows `text`.
// - Block hint (`block` set): the line that contains `code` plus all the lines indented under
//   it (a function body, a loop body, ...) get a bar down the left side, and the first line
//   gets a small label such as "ⓘ function". Hovering the label, or any part of the block
//   that has no plain hint of its own, shows `text`.
export type CodeHint = { code: string; text: string; block?: string };

type HintRange = { from: number; to: number; text: string };
type BlockRange = HintRange & { label: string; firstLine: number; lastLine: number; headerEnd: number };

function findTokenHints(doc: string, hints: CodeHint[]): HintRange[] {
  const ranges: HintRange[] = [];
  for (const hint of hints) {
    if (!hint.code || hint.block) continue;
    let at = doc.indexOf(hint.code);
    while (at !== -1) {
      ranges.push({ from: at, to: at + hint.code.length, text: hint.text });
      at = doc.indexOf(hint.code, at + hint.code.length);
    }
  }
  // Marks must not overlap; drop any range that overlaps an earlier one.
  ranges.sort((a, b) => a.from - b.from || b.to - a.to);
  const kept: HintRange[] = [];
  for (const range of ranges) {
    if (kept.length === 0 || range.from >= kept[kept.length - 1].to) kept.push(range);
  }
  return kept;
}

function indentOf(line: string): number {
  return line.length - line.trimStart().length;
}

function findBlockHints(doc: Text, hints: CodeHint[]): BlockRange[] {
  const text = doc.toString();
  const blocks: BlockRange[] = [];
  for (const hint of hints) {
    if (!hint.code || !hint.block) continue;
    let at = text.indexOf(hint.code);
    while (at !== -1) {
      const first = doc.lineAt(at);
      const indent = indentOf(first.text);
      // The block runs on while lines are indented deeper than its first line; blank lines
      // inside it count, blank lines after it don't.
      let last = first.number;
      for (let n = first.number + 1; n <= doc.lines; n++) {
        const line = doc.line(n).text;
        if (line.trim() === "") continue;
        if (indentOf(line) <= indent) break;
        last = n;
      }
      blocks.push({
        from: first.from,
        to: doc.line(last).to,
        text: hint.text,
        label: hint.block,
        firstLine: first.number,
        lastLine: last,
        headerEnd: first.to,
      });
      at = text.indexOf(hint.code, first.to);
    }
  }
  return blocks;
}

class BlockBadge extends WidgetType {
  constructor(readonly label: string) {
    super();
  }

  eq(other: BlockBadge) {
    return other.label === this.label;
  }

  toDOM() {
    const badge = document.createElement("span");
    badge.className = "cm-codeBlockBadge";
    badge.textContent = `ⓘ ${this.label}`;
    return badge;
  }
}

const hintMark = Decoration.mark({ class: "cm-codeHint" });
const depthLine = [1, 2, 3].map((depth) => Decoration.line({ class: `cm-codeBlockDepth${depth}` }));

// Hint text may wrap code in `backticks` and key words in **double stars**; those parts are
// styled. Built with DOM nodes (not innerHTML) so the text is never parsed as HTML.
function renderHintText(dom: HTMLElement, text: string) {
  for (const part of text.split(/(`[^`]+`|\*\*[^*]+\*\*)/)) {
    if (!part) continue;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      const code = document.createElement("code");
      code.className = "cm-codeHintCode";
      code.textContent = part.slice(1, -1);
      dom.appendChild(code);
    } else if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
      const strong = document.createElement("strong");
      strong.className = "cm-codeHintTerm";
      strong.textContent = part.slice(2, -2);
      dom.appendChild(strong);
    } else {
      dom.appendChild(document.createTextNode(part));
    }
  }
}

export function codeHints(hints: CodeHint[]) {
  const marks = ViewPlugin.fromClass(
    class {
      tokens: HintRange[] = [];
      blocks: BlockRange[] = [];
      decorations: DecorationSet = Decoration.none;

      constructor(view: EditorView) {
        this.compute(view.state.doc);
      }

      update(update: ViewUpdate) {
        if (update.docChanged) this.compute(update.state.doc);
      }

      compute(doc: Text) {
        this.tokens = findTokenHints(doc.toString(), hints);
        this.blocks = findBlockHints(doc, hints);

        const decorations: Range<Decoration>[] = [];
        // One bar per block a line sits in, so a loop inside a function shows two bars.
        const depth = new Map<number, number>();
        for (const block of this.blocks) {
          for (let n = block.firstLine; n <= block.lastLine; n++) depth.set(n, (depth.get(n) ?? 0) + 1);
          decorations.push(Decoration.widget({ widget: new BlockBadge(block.label), side: 1 }).range(block.headerEnd));
        }
        for (const [n, d] of depth) {
          decorations.push(depthLine[Math.min(d, depthLine.length) - 1].range(doc.line(n).from));
        }
        for (const token of this.tokens) decorations.push(hintMark.range(token.from, token.to));
        this.decorations = Decoration.set(decorations, true);
      }
    },
    { decorations: (plugin) => plugin.decorations },
  );

  const tooltip = hoverTooltip((view, pos) => {
    const plugin = view.plugin(marks);
    if (!plugin) return null;
    // A plain hint wins; otherwise use the smallest block around the mouse.
    const token = plugin.tokens.find((r) => pos >= r.from && pos <= r.to);
    const block = plugin.blocks
      .filter((b) => pos >= b.from && pos <= b.to)
      .sort((a, b) => a.to - a.from - (b.to - b.from))[0];
    const hit = token ?? block;
    if (!hit) return null;
    return {
      pos: hit.from,
      end: hit.to,
      above: true,
      create: () => {
        const dom = document.createElement("div");
        dom.className = "cm-codeHintTooltip";
        if (!token && block) {
          const title = document.createElement("div");
          title.className = "cm-codeHintTitle";
          title.textContent = `This ${block.label}`;
          dom.appendChild(title);
        }
        renderHintText(dom, hit.text);
        // CodeMirror wraps the popup in its own square box; tag it so the theme can round it.
        return { dom, mount: () => dom.parentElement?.classList.add("cm-codeHintWrap") };
      },
    };
  });

  const theme = EditorView.baseTheme({
    ".cm-codeHint": {
      textDecoration: "underline dotted",
      textUnderlineOffset: "3px",
      textDecorationColor: "#3182ce",
      cursor: "help",
    },
    ".cm-codeBlockDepth1": { boxShadow: "inset 3px 0 0 #90cdf4" },
    ".cm-codeBlockDepth2": { boxShadow: "inset 3px 0 0 #90cdf4, inset 7px 0 0 transparent, inset 9px 0 0 #3182ce" },
    ".cm-codeBlockDepth3": {
      boxShadow:
        "inset 3px 0 0 #90cdf4, inset 7px 0 0 transparent, inset 9px 0 0 #3182ce, " +
        "inset 13px 0 0 transparent, inset 15px 0 0 #2c5282",
    },
    ".cm-codeBlockBadge": {
      marginLeft: "10px",
      padding: "0 6px",
      borderRadius: "999px",
      fontFamily: "system-ui, sans-serif",
      fontSize: "0.72rem",
      cursor: "help",
      userSelect: "none",
    },
    "&light .cm-codeBlockBadge": { backgroundColor: "#ebf4ff", color: "#2b6cb0" },
    "&dark .cm-codeBlockBadge": { backgroundColor: "#1a365d", color: "#90cdf4" },
    ".cm-tooltip.cm-codeHintWrap": {
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.18)",
    },
    "&light .cm-tooltip.cm-codeHintWrap": { border: "1px solid #e2e8f0", backgroundColor: "#ffffff" },
    "&dark .cm-tooltip.cm-codeHintWrap": { border: "1px solid #4a5568", backgroundColor: "#2d3748" },
    ".cm-codeHintTooltip": {
      maxWidth: "340px",
      borderRadius: "10px",
      padding: "8px 12px",
      fontFamily: "system-ui, sans-serif",
      fontSize: "0.85rem",
      lineHeight: "1.4",
      whiteSpace: "normal",
    },
    ".cm-codeHintTitle": {
      fontSize: "0.7rem",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginBottom: "2px",
      opacity: "0.7",
    },
    ".cm-codeHintCode": {
      fontFamily: "SFMono-Regular, Menlo, Consolas, monospace",
      fontSize: "0.8rem",
      padding: "1px 5px",
      borderRadius: "4px",
      whiteSpace: "nowrap",
    },
    ".cm-codeHintTerm": { fontWeight: "600" },
    "&light .cm-codeHintTooltip": { backgroundColor: "#ffffff", color: "#1a202c" },
    "&dark .cm-codeHintTooltip": { backgroundColor: "#2d3748", color: "#f7fafc" },
    "&light .cm-codeHintCode": { backgroundColor: "#ebf4ff", color: "#2b6cb0" },
    "&dark .cm-codeHintCode": { backgroundColor: "#1a365d", color: "#90cdf4" },
    "&light .cm-codeHintTerm": { color: "#2c5282" },
    "&dark .cm-codeHintTerm": { color: "#bee3f8" },
    "&dark .cm-codeHint": { textDecorationColor: "#63b3ed" },
  });

  return [marks, tooltip, theme];
}
