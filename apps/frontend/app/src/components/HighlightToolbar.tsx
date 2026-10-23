import { Box, Button, HStack, Input, Portal, Text, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { HighlightsState, SelectionInfo } from "../hooks/useHighlights";

const PRESETS = ["#ffe066", "#b2f2bb", "#ffc9c9", "#a5d8ff", "#ffd8a8"];
const COLOR_KEY = "highlight-color";
const WIDTH = 280;

type Target = { kind: "new"; info: SelectionInfo } | { kind: "edit"; id: number };

function savedColor(): string {
  try {
    return localStorage.getItem(COLOR_KEY) ?? PRESETS[0];
  } catch {
    return PRESETS[0];
  }
}

// Pops up beside selected reading text so it can be highlighted in a chosen color with an optional note,
// and beside an existing highlight (when it is clicked) so its color or note can be changed or it can be removed.
export function HighlightToolbar({ highlights }: { highlights: HighlightsState }) {
  const toast = useToast();
  const boxRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<Target | null>(null);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(null);
  const [color, setColor] = useState(savedColor);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const { supported, items, selectionInfo, hitTest, rectOf } = highlights;

  const place = useCallback((rect: DOMRect) => {
    setAnchor({
      top: rect.bottom + window.scrollY + 8,
      left: Math.max(8, Math.min(rect.left + window.scrollX, window.scrollX + window.innerWidth - WIDTH - 8)),
    });
  }, []);

  const openNew = useCallback(
    (info: SelectionInfo) => {
      setTarget({ kind: "new", info });
      setNote("");
      place(info.rect);
    },
    [place],
  );

  useEffect(() => {
    if (!supported) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onSelectionChange = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Typing in the note box collapses the page selection; keep the toolbar open while it has focus.
        if (boxRef.current?.contains(document.activeElement)) return;
        const info = selectionInfo();
        if (info) openNew(info);
        else setTarget((prev) => (prev?.kind === "new" ? null : prev));
      }, 120);
    };

    const onClick = (event: MouseEvent) => {
      if (boxRef.current?.contains(event.target as Node)) return;
      const id = hitTest();
      if (id === null) {
        setTarget((prev) => (prev?.kind === "edit" ? null : prev));
        return;
      }
      const item = items.find((h) => h.id === id);
      const rect = rectOf(id);
      if (!item || !rect) return;
      setColor(item.color);
      setNote(item.note);
      setTarget({ kind: "edit", id });
      place(rect);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTarget(null);
    };

    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [supported, selectionInfo, hitTest, rectOf, items, openNew, place]);

  if (!supported || !target || !anchor) return null;

  function pick(next: string) {
    setColor(next);
    try {
      localStorage.setItem(COLOR_KEY, next);
    } catch {
      // remembering the color is a convenience only
    }
  }

  async function save() {
    if (!target) return;
    setBusy(true);
    try {
      if (target.kind === "new") await highlights.create(target.info, color, note);
      else await highlights.update(target.id, { color, note });
      window.getSelection()?.removeAllRanges();
      setTarget(null);
    } catch {
      toast({ status: "error", title: "Couldn't save your highlight", duration: 3000 });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (target?.kind !== "edit") return;
    setBusy(true);
    try {
      await highlights.remove(target.id);
      setTarget(null);
    } catch {
      toast({ status: "error", title: "Couldn't remove your highlight", duration: 3000 });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Portal>
      <Box
        ref={boxRef}
        role="dialog"
        aria-label={target.kind === "new" ? "Highlight selected text" : "Edit highlight"}
        position="absolute"
        top={`${anchor.top}px`}
        left={`${anchor.left}px`}
        w={`${WIDTH}px`}
        maxW="calc(100vw - 16px)"
        zIndex="popover"
        p={3}
        borderWidth="1px"
        borderRadius="md"
        boxShadow="lg"
        bg="white"
        _dark={{ bg: "gray.700" }}
        // Buttons shouldn't steal focus, or the page selection collapses before they are clicked.
        onMouseDown={(e) => {
          const tag = (e.target as HTMLElement).tagName;
          if (tag !== "INPUT" && tag !== "TEXTAREA") e.preventDefault();
        }}
      >
        <HStack spacing={2} mb={2} align="center">
          {PRESETS.map((preset) => (
            <Box
              key={preset}
              as="button"
              type="button"
              aria-label={`Color ${preset}`}
              w={6}
              h={6}
              borderRadius="full"
              bg={preset}
              borderWidth="2px"
              borderColor={color.toLowerCase() === preset ? "gray.700" : "transparent"}
              _dark={{ borderColor: color.toLowerCase() === preset ? "white" : "transparent" }}
              onClick={() => pick(preset)}
            />
          ))}
          <input
            type="color"
            aria-label="Pick any color"
            title="Pick any color"
            value={color}
            onChange={(e) => pick(e.target.value)}
            style={{ width: 32, height: 32, padding: 0, border: "none", background: "transparent", cursor: "pointer" }}
          />
        </HStack>
        <Input
          size="sm"
          placeholder="Add a note (optional)"
          value={note}
          maxLength={500}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void save();
          }}
        />
        {target.kind === "new" && (
          <Text fontSize="xs" color="gray.500" mt={1} noOfLines={1}>
            &ldquo;{target.info.text}&rdquo;
          </Text>
        )}
        <HStack mt={2} justify="space-between">
          {target.kind === "edit" ? (
            <Button size="xs" variant="ghost" colorScheme="red" onClick={remove} isDisabled={busy}>
              Remove
            </Button>
          ) : (
            <span />
          )}
          <HStack>
            <Button size="xs" variant="ghost" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button size="xs" colorScheme="blue" onClick={save} isLoading={busy}>
              {target.kind === "new" ? "Highlight" : "Save"}
            </Button>
          </HStack>
        </HStack>
      </Box>
    </Portal>
  );
}
