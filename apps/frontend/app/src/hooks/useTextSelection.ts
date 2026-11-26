import { type RefObject, useCallback } from "react";

import { buildIndex, CONTEXT_CHARS, offsetOf } from "../lib/textAnchor";

export interface SelectionInfo {
  text: string;
  prefix: string;
  suffix: string;
  rect: DOMRect;
}

const MAX_TEXT = 1000;
// Code editors, runnable cells and form controls change as the student types, so they can't be anchored.
const EXCLUDED = ".cm-editor, [data-nav='try-it'], textarea, input, button";

function isExcluded(node: Node): boolean {
  const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return !!el?.closest(EXCLUDED);
}

// Returns a function that reads the current text selection inside the reading, if it can be bookmarked.
export function useTextSelection(rootRef: RefObject<HTMLElement>): () => SelectionInfo | null {
  return useCallback((): SelectionInfo | null => {
    const root = rootRef.current;
    const selection = window.getSelection();
    if (!root || !selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
    const range = selection.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) return null;
    if (isExcluded(range.startContainer) || isExcluded(range.endContainer)) return null;

    const index = buildIndex(root);
    const rawStart = offsetOf(root, range.startContainer, range.startOffset);
    const rawEnd = offsetOf(root, range.endContainer, range.endOffset);
    const raw = index.text.slice(rawStart, rawEnd);
    const text = raw.trim();
    if (!text || text.length > MAX_TEXT) return null;

    const start = rawStart + (raw.length - raw.trimStart().length);
    const end = start + text.length;
    return {
      text,
      prefix: index.text.slice(Math.max(0, start - CONTEXT_CHARS), start),
      suffix: index.text.slice(end, end + CONTEXT_CHARS),
      rect: range.getBoundingClientRect(),
    };
  }, [rootRef]);
}
