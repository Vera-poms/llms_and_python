import { useToast } from "@chakra-ui/react";
import { type RefObject, useCallback, useEffect, useMemo, useState } from "react";

import { api } from "../api/client";
import type { LabOutline } from "../components/LabSidebar";
import { buildIndex, locate, toRange } from "../lib/textAnchor";
import type { SelectionInfo } from "./useHighlights";

interface SavedBookmark {
  anchor_id: string;
  label: string;
  // Only set for a bookmarked line or word.
  text: string;
  prefix: string;
  suffix: string;
  color: string;
}

export interface BookmarkState {
  // The saved spot's heading text (or the bookmarked words), or null when there is no bookmark.
  label: string | null;
  // "text" for a bookmarked line or word, "heading" for a topic.
  kind: "heading" | "text" | null;
  // The element id of the bookmarked heading on the current page, or null if it can't be found.
  targetId: string | null;
  // True when the bookmarked spot can be found on the page right now.
  found: boolean;
  // The outline entry to mark: the bookmarked heading, or the last heading above bookmarked words.
  sectionId: string | null;
  save: (item: { id: string; label: string }) => void;
  saveText: (info: SelectionInfo, color: string) => void;
  clear: () => void;
  goTo: () => void;
}

const STYLE_ID = "reading-bookmark-style";
const HIGHLIGHT_NAME = "reading-bookmark";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry = (): Map<string, unknown> | null => (typeof CSS !== "undefined" ? (CSS as any).highlights ?? null : null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HighlightCtor = (): (new (...ranges: Range[]) => unknown) | null => (window as any).Highlight ?? null;

function snippet(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > 80 ? `${flat.slice(0, 77)}...` : flat;
}

// One "where I left off" bookmark per lab: either a topic heading or a selected line/word. Saving a new
// one replaces the old. The bookmarked spot is highlighted in the page, and the lab page and its
// outline offer to jump back to it.
export function useBookmark(labId: number, outline: LabOutline, readingRef: RefObject<HTMLElement>): BookmarkState {
  const toast = useToast();
  const [saved, setSaved] = useState<SavedBookmark | null>(null);
  // Bumped when the reading's DOM changes, so a text bookmark is looked up again once the page has rendered.
  const [domVersion, setDomVersion] = useState(0);

  useEffect(() => {
    setSaved(null);
    api
      .get(`/labs/${labId}/bookmark`)
      .then((response) => setSaved(response.data))
      .catch(() => {
        // 404 just means nothing is bookmarked yet
      });
  }, [labId]);

  const isText = !!saved?.text;
  const textColor = saved?.color || "#fde047";

  // Heading ids are generated from page order, so prefer a match on both id and text, then text alone.
  const targetId = useMemo(() => {
    if (!saved || isText) return null;
    const items = [...outline.groups.concepts, ...outline.groups.coding];
    const match =
      items.find((i) => i.id === saved.anchor_id && i.label === saved.label) ??
      items.find((i) => i.label === saved.label);
    return match?.id ?? null;
  }, [saved, isText, outline.groups]);

  useEffect(() => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    el?.setAttribute("data-bookmarked", "true");
    return () => el?.removeAttribute("data-bookmarked");
  }, [targetId]);

  useEffect(() => {
    if (!isText) return;
    const root = readingRef.current;
    if (!root) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => setDomVersion((v) => v + 1), 150);
    });
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isText, readingRef]);

  const textRange = useMemo((): Range | null => {
    void domVersion;
    const root = readingRef.current;
    if (!saved || !isText || !root) return null;
    const index = buildIndex(root);
    const start = locate(index.text, saved.text, saved.prefix, saved.suffix);
    if (start < 0) return null;
    return toRange(index, start, start + saved.text.length);
  }, [saved, isText, readingRef, domVersion]);

  const sectionId = useMemo((): string | null => {
    if (targetId) return targetId;
    if (!textRange) return null;
    let found: string | null = null;
    for (const item of [...outline.groups.concepts, ...outline.groups.coding]) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      // The heading (or cell) starts before the bookmarked words.
      if (el.compareDocumentPosition(textRange.startContainer) & Node.DOCUMENT_POSITION_FOLLOWING) found = item.id;
    }
    return found;
  }, [targetId, textRange, outline.groups]);

  // Paint the bookmarked words with the browser's Custom Highlight API (no DOM changes).
  useEffect(() => {
    const reg = registry();
    const Ctor = HighlightCtor();
    if (!textRange || !reg || !Ctor) return;
    reg.set(HIGHLIGHT_NAME, new Ctor(textRange));
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = `::highlight(${HIGHLIGHT_NAME}){background-color:${textColor};color:#1a202c;text-decoration:underline wavy #d97706;}`;
    return () => {
      reg.delete(HIGHLIGHT_NAME);
      document.getElementById(STYLE_ID)?.remove();
    };
  }, [textRange, textColor]);

  const put = useCallback(
    (next: SavedBookmark) => {
      const previous = saved;
      setSaved(next);
      api.put(`/labs/${labId}/bookmark`, next).catch(() => {
        setSaved(previous);
        toast({ status: "error", title: "Couldn't save your bookmark", duration: 3000 });
      });
    },
    [labId, saved, toast],
  );

  const save = useCallback(
    (item: { id: string; label: string }) => put({ anchor_id: item.id, label: item.label, text: "", prefix: "", suffix: "", color: "" }),
    [put],
  );

  const saveText = useCallback(
    (info: SelectionInfo, color: string) =>
      put({ anchor_id: "text", label: snippet(info.text), text: info.text, prefix: info.prefix, suffix: info.suffix, color }),
    [put],
  );

  const clear = useCallback(() => {
    const previous = saved;
    setSaved(null);
    api.delete(`/labs/${labId}/bookmark`).catch(() => {
      setSaved(previous);
      toast({ status: "error", title: "Couldn't remove your bookmark", duration: 3000 });
    });
  }, [labId, saved, toast]);

  const goTo = useCallback(() => {
    if (targetId) outline.jump(targetId);
    else textRange?.startContainer.parentElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [targetId, textRange, outline]);

  return {
    label: saved?.label ?? null,
    kind: saved ? (isText ? "text" : "heading") : null,
    targetId,
    sectionId,
    found: isText ? textRange !== null : targetId !== null,
    save,
    saveText,
    clear,
    goTo,
  };
}
