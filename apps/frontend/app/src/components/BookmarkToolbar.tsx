import { Box, Button, HStack, Portal, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import type { BookmarkState } from "../hooks/useBookmark";
import type { SelectionInfo } from "../hooks/useTextSelection";

const PRESETS = ["#ffe066", "#b2f2bb", "#ffc9c9", "#a5d8ff", "#ffd8a8"];
const COLOR_KEY = "highlight-color";
const WIDTH = 280;

function savedColor(): string {
  try {
    return localStorage.getItem(COLOR_KEY) ?? PRESETS[0];
  } catch {
    return PRESETS[0];
  }
}

// Pops up beside selected reading text so the words can be bookmarked in a chosen color.
export function BookmarkToolbar({
  bookmark,
  selectionInfo,
}: {
  bookmark: BookmarkState;
  selectionInfo: () => SelectionInfo | null;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<SelectionInfo | null>(null);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(null);
  const [color, setColor] = useState(savedColor);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onSelectionChange = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const next = selectionInfo();
        setInfo(next);
        if (next) {
          const rect = next.rect;
          setAnchor({
            top: rect.bottom + window.scrollY + 8,
            left: Math.max(8, Math.min(rect.left + window.scrollX, window.scrollX + window.innerWidth - WIDTH - 8)),
          });
        }
      }, 120);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInfo(null);
    };

    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectionInfo]);

  if (!info || !anchor) return null;

  function pick(next: string) {
    setColor(next);
    try {
      localStorage.setItem(COLOR_KEY, next);
    } catch {
      // remembering the color is a convenience only
    }
  }

  return (
    <Portal>
      <Box
        ref={boxRef}
        role="dialog"
        aria-label="Bookmark selected text"
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
        onMouseDown={(e) => e.preventDefault()}
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
        <Text fontSize="xs" color="gray.500" mt={1} noOfLines={2}>
          &ldquo;{info.text}&rdquo;
        </Text>
        <HStack mt={2} justify="flex-end">
          <Button size="xs" variant="ghost" onClick={() => setInfo(null)}>
            Cancel
          </Button>
          <Button
            size="xs"
            colorScheme="yellow"
            leftIcon={<span aria-hidden="true">🔖</span>}
            onClick={() => {
              bookmark.saveText(info, color);
              window.getSelection()?.removeAllRanges();
              setInfo(null);
            }}
          >
            Bookmark
          </Button>
        </HStack>
      </Box>
    </Portal>
  );
}
