// Finds passages of rendered text again after a reload. A passage is saved as its text plus a little
// text on each side; DOM offsets can't be saved because the page is rebuilt on every visit.

export const CONTEXT_CHARS = 40;

export interface TextIndex {
  text: string;
  nodes: { node: Text; start: number }[];
}

// All of `root`'s text nodes, in order, with the running offset where each one begins.
export function buildIndex(root: HTMLElement): TextIndex {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: TextIndex["nodes"] = [];
  let text = "";
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    nodes.push({ node, start: text.length });
    text += node.data;
  }
  return { text, nodes };
}

// Offset into buildIndex(root).text of a DOM point. Range.toString joins the same text nodes.
export function offsetOf(root: HTMLElement, node: Node, offset: number): number {
  const range = document.createRange();
  range.setStart(root, 0);
  range.setEnd(node, offset);
  return range.toString().length;
}

function commonTail(a: string, b: string): number {
  let n = 0;
  while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) n += 1;
  return n;
}

function commonHead(a: string, b: string): number {
  let n = 0;
  while (n < a.length && n < b.length && a[n] === b[n]) n += 1;
  return n;
}

// Start offset of the occurrence of `needle` whose surroundings best match, or -1 if it is gone.
export function locate(text: string, needle: string, prefix: string, suffix: string): number {
  let best = -1;
  let bestScore = -1;
  let from = 0;
  for (;;) {
    const i = text.indexOf(needle, from);
    if (i < 0) break;
    const before = text.slice(Math.max(0, i - prefix.length), i);
    const after = text.slice(i + needle.length, i + needle.length + suffix.length);
    const score = commonTail(before, prefix) + commonHead(after, suffix);
    if (score > bestScore) {
      best = i;
      bestScore = score;
    }
    from = i + 1;
  }
  return best;
}

function pointAt(index: TextIndex, pos: number, isEnd: boolean): [Text, number] | null {
  for (const { node, start } of index.nodes) {
    const end = start + node.data.length;
    if (isEnd ? pos > start && pos <= end : pos >= start && pos < end) return [node, pos - start];
  }
  return null;
}

export function toRange(index: TextIndex, start: number, end: number): Range | null {
  const from = pointAt(index, start, false);
  const to = pointAt(index, end, true);
  if (!from || !to) return null;
  const range = document.createRange();
  range.setStart(from[0], from[1]);
  range.setEnd(to[0], to[1]);
  return range;
}
