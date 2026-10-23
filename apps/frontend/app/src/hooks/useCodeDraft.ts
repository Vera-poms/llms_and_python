import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "../api/client";

export type DraftStatus = "idle" | "saving" | "saved" | "error";

const SAVE_DELAY_MS = 1000;

// Saves what the student is typing to the server a moment after they stop, so unsubmitted code
// survives a reload, a closed tab or a different device. Nothing is saved until they actually edit,
// so the starter code never overwrites a real draft that is still loading.
export function useCodeDraft(labId: number, cellId: string, source: string) {
  const [status, setStatus] = useState<DraftStatus>("idle");
  const edited = useRef(false);
  const latest = useRef(source);
  latest.current = source;

  const flush = useCallback(async () => {
    if (!edited.current) return;
    edited.current = false;
    setStatus("saving");
    try {
      await api.put(`/labs/${labId}/cells/${cellId}/code`, { source: latest.current });
      setStatus("saved");
    } catch {
      edited.current = true;
      setStatus("error");
    }
  }, [labId, cellId]);

  useEffect(() => {
    if (!edited.current) return;
    const timer = setTimeout(flush, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [source, flush]);

  // Don't lose the last few keystrokes when the tab is hidden or the cell goes away.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      void flush();
    };
  }, [flush]);

  return {
    status,
    // Call from the editor's onChange, before setting the new source.
    markEdited: () => {
      edited.current = true;
    },
    // True once the student has typed something that hasn't been saved yet.
    hasUnsavedEdit: () => edited.current,
  };
}
