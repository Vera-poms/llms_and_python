import { Box, useColorMode } from "@chakra-ui/react";
import { python } from "@codemirror/lang-python";
import { syntaxHighlighting } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { useEffect, useRef } from "react";

import { editorTheme, highlightFor, paletteFor } from "./codeTheme";

// Read-only, highlighted snippet for fenced code blocks inside readings and project briefs.
// Deliberately without basicSetup: no gutters, no linter, no cursor - it's prose, not an exercise.
export function CodeBlock({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!containerRef.current) return;
    const dark = colorMode === "dark";

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
        ],
      }),
      parent: containerRef.current,
    });

    return () => view.destroy();
  }, [code, colorMode]);

  return (
    <Box
      ref={containerRef}
      my={3}
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      sx={{ ".cm-editor": { padding: "0.5rem 0" }, ".cm-editor.cm-focused": { outline: "none" } }}
    />
  );
}
