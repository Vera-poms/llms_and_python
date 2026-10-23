import { useColorMode } from "@chakra-ui/react";
import { python } from "@codemirror/lang-python";
import { indentWithTab } from "@codemirror/commands";
import { indentUnit, syntaxHighlighting, syntaxTree } from "@codemirror/language";
import { Diagnostic, linter, lintGutter } from "@codemirror/lint";
import { Compartment, EditorState, Prec } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { useEffect, useRef } from "react";

import { editorTheme, highlightFor, paletteFor } from "./codeTheme";

const MAX_LINE_LENGTH = 79;
const MAX_BLANK_LINES = 2;

function syntaxDiagnostics(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  syntaxTree(view.state).iterate({
    enter: (node) => {
      if (node.type.isError) {
        diagnostics.push({
          from: node.from,
          to: Math.max(node.to, node.from + 1),
          severity: "error",
          message: "Syntax error - this doesn't parse as valid Python.",
        });
      }
    },
  });
  return diagnostics;
}

function pep8Diagnostics(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const doc = view.state.doc;
  let blankRun = 0;

  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i);
    const text = line.text;

    if (text.trim() === "") {
      blankRun++;
      if (blankRun === MAX_BLANK_LINES + 1) {
        diagnostics.push({
          from: line.from,
          to: line.to,
          severity: "warning",
          message: `PEP8: more than ${MAX_BLANK_LINES} consecutive blank lines.`,
        });
      }
    } else {
      blankRun = 0;
    }

    if (text.length > MAX_LINE_LENGTH) {
      diagnostics.push({
        from: line.from + MAX_LINE_LENGTH,
        to: line.to,
        severity: "warning",
        message: `PEP8: line too long (${text.length} > ${MAX_LINE_LENGTH} characters).`,
      });
    }

    const trailingMatch = /[ \t]+$/.exec(text);
    if (trailingMatch) {
      diagnostics.push({
        from: line.from + trailingMatch.index,
        to: line.to,
        severity: "warning",
        message: "PEP8: trailing whitespace.",
      });
    }

    if (text.includes("\t")) {
      diagnostics.push({
        from: line.from,
        to: line.to,
        severity: "warning",
        message: "PEP8: use spaces, not tabs, for indentation.",
      });
    }
  }

  return diagnostics;
}

const pythonLinter = linter((view) => [...syntaxDiagnostics(view), ...pep8Diagnostics(view)]);

const themeCompartment = new Compartment();

export function CodeEditor({
  value,
  onChange,
  minHeight = "80px",
  onRun,
}: {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
  // Called on Shift+Enter; the editor is created once, so keep the latest callback in a ref.
  onRun?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!containerRef.current) return;

    const dark = colorMode === "dark";
    const palette = paletteFor(colorMode);

    const state = EditorState.create({
      doc: value,
      extensions: [
        Prec.highest(
          keymap.of([
            {
              key: "Shift-Enter",
              run: () => {
                onRunRef.current?.();
                return true;
              },
            },
          ]),
        ),
        indentUnit.of("    "),
        EditorState.tabSize.of(4),
        keymap.of([indentWithTab]),
        basicSetup,
        python(),
        pythonLinter,
        lintGutter(),
        themeCompartment.of([editorTheme(palette, dark), syntaxHighlighting(highlightFor(dark))]),
        EditorView.contentAttributes.of({ spellcheck: "false", autocorrect: "off", autocapitalize: "off" }),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const dark = colorMode === "dark";
    const palette = paletteFor(colorMode);
    view.dispatch({
      effects: themeCompartment.reconfigure([
        editorTheme(palette, dark),
        syntaxHighlighting(highlightFor(dark)),
      ]),
    });
  }, [colorMode]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } });
    }
  }, [value]);

  return <div ref={containerRef} style={{ minHeight, borderRadius: "0.375rem", overflow: "hidden" }} />;
}
