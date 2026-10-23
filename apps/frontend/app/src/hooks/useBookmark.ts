import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "../api/client";
import type { LabOutline } from "../components/LabSidebar";

interface SavedBookmark {
  anchor_id: string;
  label: string;
}

export interface BookmarkState {
  // The saved spot's heading text, or null when there is no bookmark.
  label: string | null;
  // The element id of that heading on the current page, or null if it can't be found.
  targetId: string | null;
  save: (item: { id: string; label: string }) => void;
  clear: () => void;
  goTo: () => void;
}

// One "where I left off" bookmark per lab. The bookmarked heading is highlighted in the page and the
// outline, and the lab page offers to jump back to it.
export function useBookmark(labId: number, outline: LabOutline): BookmarkState {
  const toast = useToast();
  const [saved, setSaved] = useState<SavedBookmark | null>(null);

  useEffect(() => {
    setSaved(null);
    api
      .get(`/labs/${labId}/bookmark`)
      .then((response) => setSaved(response.data))
      .catch(() => {
        // 404 just means nothing is bookmarked yet
      });
  }, [labId]);

  // Heading ids are generated from page order, so prefer a match on both id and text, then text alone.
  const targetId = useMemo(() => {
    if (!saved) return null;
    const items = [...outline.groups.concepts, ...outline.groups.coding];
    const match =
      items.find((i) => i.id === saved.anchor_id && i.label === saved.label) ??
      items.find((i) => i.label === saved.label);
    return match?.id ?? null;
  }, [saved, outline.groups]);

  useEffect(() => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    el?.setAttribute("data-bookmarked", "true");
    return () => el?.removeAttribute("data-bookmarked");
  }, [targetId]);

  const save = useCallback(
    (item: { id: string; label: string }) => {
      const previous = saved;
      setSaved({ anchor_id: item.id, label: item.label });
      api.put(`/labs/${labId}/bookmark`, { anchor_id: item.id, label: item.label }).catch(() => {
        setSaved(previous);
        toast({ status: "error", title: "Couldn't save your bookmark", duration: 3000 });
      });
    },
    [labId, saved, toast],
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
  }, [targetId, outline]);

  return { label: saved?.label ?? null, targetId, save, clear, goTo };
}
