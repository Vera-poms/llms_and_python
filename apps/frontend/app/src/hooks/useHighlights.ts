import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { api } from "../api/client";
import { buildIndex, CONTEXT_CHARS, locate, offsetOf, toRange } from "../lib/textAnchor";

export interface Highlight {
  id: number;
  text: string;
  prefix: string;
  suffix: string;
  color: string;
  note: string;
}

export interface SelectionInfo {
  text: string;
  prefix: string;
  suffix: string;
  rect: DOMRect;
}

export interface HighlightsState {
  supported: boolean;
  items: Highlight[];
  // The current text selection inside the reading, if it can be highlighted.
  selectionInfo: () => SelectionInfo | null;
  // Id of the highlight under the caret (a click on highlighted text), if any.
  hitTest: () => number | null;
  rectOf: (id: number) => DOMRect | null;
  create: (info: SelectionInfo, color: string, note: string) => Promise<void>;
  update: (id: number, changes: { color?: string; note?: string }) => Promise<void>;
  remove: (id: number) => Promise<void>;
  jump: (id: number) => void;
}

const STYLE_ID = "user-highlight-styles";
const MAX_TEXT = 1000;
// Code editors, runnable cells and form controls change as the student types, so they can't be anchored.
const EXCLUDED = ".cm-editor, [data-nav='try-it'], textarea, input, button";

// The browser's Custom Highlight API paints ranges without touching the DOM, which keeps React's tree intact.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry = (): Map<string, unknown> | null => (typeof CSS !== "undefined" ? (CSS as any).highlights ?? null : null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HighlightCtor = (): (new (...ranges: Range[]) => unknown) | null => (window as any).Highlight ?? null;

function ruleName(color: string): string {
  return `hl-${color.slice(1).toLowerCase()}`;
}

function clearPainted(reg: Map<string, unknown>) {
  for (const name of Array.from(reg.keys())) if (name.startsWith("hl-")) reg.delete(name);
}

function isExcluded(node: Node): boolean {
  const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return !!el?.closest(EXCLUDED);
}

// Highlights of the lab's reading text: loads the student's saved ones, paints them, and creates, edits and deletes them.
export function useHighlights(labId: number, rootRef: RefObject<HTMLElement>): HighlightsState {
  const supported = useMemo(() => registry() !== null && HighlightCtor() !== null, []);
  const [items, setItems] = useState<Highlight[]>([]);
  const resolved = useRef(new Map<number, Range>());

  useEffect(() => {
    setItems([]);
    if (!supported) return;
    api
      .get(`/labs/${labId}/highlights`)
      .then((response) => setItems(response.data))
      .catch(() => {
        // nothing to show without them
      });
  }, [labId, supported]);

  // Re-find every passage and repaint. Runs whenever the highlights change or the reading's DOM does
  // (the readings render lazily, and practice cells change as they run).
  const paint = useCallback(() => {
    const root = rootRef.current;
    const reg = registry();
    const Ctor = HighlightCtor();
    if (!root || !reg || !Ctor) return;

    const index = buildIndex(root);
    const byColor = new Map<string, Range[]>();
    resolved.current.clear();
    for (const item of items) {
      const start = locate(index.text, item.text, item.prefix, item.suffix);
      if (start < 0) continue;
      const range = toRange(index, start, start + item.text.length);
      if (!range) continue;
      resolved.current.set(item.id, range);
      byColor.set(item.color, [...(byColor.get(item.color) ?? []), range]);
    }

    clearPainted(reg);
    let css = "";
    byColor.forEach((ranges, color) => {
      reg.set(ruleName(color), new Ctor(...ranges));
      css += `::highlight(${ruleName(color)}){background-color:${color};color:#1a202c;}`;
    });
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = css;
  }, [items, rootRef]);

  useEffect(() => {
    if (!supported) return;
    paint();
    const root = rootRef.current;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(paint, 150);
    });
    if (root) observer.observe(root, { childList: true, subtree: true });
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [paint, supported, rootRef]);

  useEffect(
    () => () => {
      const reg = registry();
      if (reg) clearPainted(reg);
      document.getElementById(STYLE_ID)?.remove();
    },
    [],
  );

  const selectionInfo = useCallback((): SelectionInfo | null => {
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

  const hitTest = useCallback((): number | null => {
    const selection = window.getSelection();
    if (!selection || !selection.isCollapsed || !selection.anchorNode) return null;
    for (const [id, range] of resolved.current) {
      if (range.isPointInRange(selection.anchorNode, selection.anchorOffset)) return id;
    }
    return null;
  }, []);

  const rectOf = useCallback((id: number) => resolved.current.get(id)?.getBoundingClientRect() ?? null, []);

  const create = useCallback(
    async (info: SelectionInfo, color: string, note: string) => {
      const response = await api.post(`/labs/${labId}/highlights`, {
        text: info.text,
        prefix: info.prefix,
        suffix: info.suffix,
        color,
        note,
      });
      setItems((prev) => [...prev, response.data]);
    },
    [labId],
  );

  const update = useCallback(
    async (id: number, changes: { color?: string; note?: string }) => {
      const response = await api.patch(`/labs/${labId}/highlights/${id}`, changes);
      setItems((prev) => prev.map((h) => (h.id === id ? response.data : h)));
    },
    [labId],
  );

  const remove = useCallback(
    async (id: number) => {
      await api.delete(`/labs/${labId}/highlights/${id}`);
      setItems((prev) => prev.filter((h) => h.id !== id));
    },
    [labId],
  );

  const jump = useCallback((id: number) => {
    resolved.current.get(id)?.startContainer.parentElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return { supported, items, selectionInfo, hitTest, rectOf, create, update, remove, jump };
}
