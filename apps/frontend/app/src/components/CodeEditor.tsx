import { useColorMode } from "@chakra-ui/react";
import { python } from "@codemirror/lang-python";
import { HighlightStyle, syntaxHighlighting, syntaxTree } from "@codemirror/language";
import { Diagnostic, linter, lintGutter } from "@codemirror/lint";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { basicSetup } from "codemirror";
import { useEffect, useRef } from "react";

const MAX_LINE_LENGTH = 79;
const MAX_BLANK_LINES = 2;

// Palettes modeled on VS Code's built-in "Dark+" and "Light+" themes - this app
// runs as a standalone browser tab, so it can't read your actual installed
// VS Code theme live; these are the closest static approximation.
const DARK_PLUS = {
  background: "#1e1e1e",
  foreground: "#d4d4d4",
  gutterBackground: "#1e1e1e",
  gutterForeground: "#858585",
  caret: "#aeafad",
  selection: "#264f78",
  activeLine: "#2a2d2e",
};

const LIGHT_PLUS = {
  background: "#ffffff",
  foreground: "#000000",
  gutterBackground: "#ffffff",
  gutterForeground: "#237893",
  caret: "#000000",
  selection: "#add6ff",
  activeLine: "#f3f3f3",
};

function editorTheme(palette: typeof DARK_PLUS, dark: boolean) {
  return EditorView.theme(
    {
      "&": {
        color: palette.foreground,
        backgroundColor: palette.background,
        fontSize: "0.875rem",
      },
      ".cm-content": { fontFamily: "SFMono-Regular, Menlo, Consolas, monospace", caretColor: palette.caret },
      ".cm-gutters": {
        backgroundColor: palette.gutterBackground,
        color: palette.gutterForeground,
        border: "none",
      },
      ".cm-activeLine": { backgroundColor: palette.activeLine },
      ".cm-activeLineGutter": { backgroundColor: palette.activeLine },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
        backgroundColor: palette.selection,
      },
    },
    { dark },
  );
}

const darkHighlight = HighlightStyle.define([
  { tag: [t.keyword, t.bool, t.null, t.controlKeyword, t.operatorKeyword], color: "#569cd6" },
  { tag: [t.string, t.special(t.string)], color: "#ce9178" },
  { tag: t.comment, color: "#6a9955", fontStyle: "italic" },
  { tag: t.number, color: "#b5cea8" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#dcdcaa" },
  { tag: t.variableName, color: "#9cdcfe" },
  { tag: t.className, color: "#4ec9b0" },
  { tag: t.definition(t.variableName), color: "#9cdcfe" },
  { tag: t.propertyName, color: "#9cdcfe" },
]);

const lightHighlight = HighlightStyle.define([
  { tag: [t.keyword, t.bool, t.null, t.controlKeyword, t.operatorKeyword], color: "#0000ff" },
  { tag: [t.string, t.special(t.string)], color: "#a31515" },
  { tag: t.comment, color: "#008000", fontStyle: "italic" },
  { tag: t.number, color: "#098658" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#795e26" },
  { tag: t.variableName, color: "#001080" },
  { tag: t.className, color: "#267f99" },
  { tag: t.definition(t.variableName), color: "#001080" },
  { tag: t.propertyName, color: "#001080" },
]);

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
}: {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!containerRef.current) return;

    const dark = colorMode === "dark";
    const palette = dark ? DARK_PLUS : LIGHT_PLUS;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        python(),
        pythonLinter,
        lintGutter(),
        themeCompartment.of([editorTheme(palette, dark), syntaxHighlighting(dark ? darkHighlight : lightHighlight)]),
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
    const palette = dark ? DARK_PLUS : LIGHT_PLUS;
    view.dispatch({
      effects: themeCompartment.reconfigure([
        editorTheme(palette, dark),
        syntaxHighlighting(dark ? darkHighlight : lightHighlight),
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
