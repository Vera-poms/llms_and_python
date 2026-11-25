import { Box, useColorMode } from "@chakra-ui/react";
import { python } from "@codemirror/lang-python";
import { syntaxHighlighting } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { useEffect, useRef } from "react";

import { CodeHint, codeHints } from "./codeHints";
import { editorTheme, highlightFor, paletteFor } from "./codeTheme";
import { HintLegend } from "./HintLegend";

// Read-only, highlighted snippet for fenced code blocks inside readings and project briefs.
// Deliberately without basicSetup: no gutters, no linter, no cursor - it's prose, not an exercise.
// `hints` underlines pieces of the code and explains each one on hover (see codeHints.ts).
export function CodeBlock({ code, hints }: { code: string; hints?: CodeHint[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { colorMode } = useColorMode();
  // Hints are fixed per block; keep the latest in a ref so an inline array doesn't rebuild the view.
  const hintsRef = useRef(hints);
  hintsRef.current = hints;

  useEffect(() => {
    if (!containerRef.current) return;
    const dark = colorMode === "dark";
    const blockHints = hintsRef.current;

    const view = new EditorView({
      state: EditorState.create({
        doc: code.replace(/\n$/, ""),
        extensions: [
          python(),
          syntaxHighlighting(highlightFor(dark)),
          editorTheme(paletteFor(colorMode), dark),
          EditorView.lineWrapping,
          EditorView.editable.of(false),
          EditorState.readOnly.of(true),
          blockHints && blockHints.length > 0 ? codeHints(blockHints) : [],
        ],
      }),
      parent: containerRef.current,
    });

    return () => view.destroy();
  }, [code, colorMode]);

  const box = (
    <Box
      ref={containerRef}
      my={hints && hints.length > 0 ? 0 : 3}
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      sx={{ ".cm-editor": { padding: "0.5rem 0" }, ".cm-editor.cm-focused": { outline: "none" } }}
    />
  );

  if (!hints || hints.length === 0) return box;
  return (
    <Box my={3} display="flex" flexDirection="column" gap={2}>
      <HintLegend hints={hints} />
      {box}
    </Box>
  );
}
