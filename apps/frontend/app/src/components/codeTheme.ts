import { HighlightStyle } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

// Palettes modeled on VS Code's built-in "Dark+" and "Light+" themes - this app
// runs as a standalone browser tab, so it can't read your actual installed
// VS Code theme live; these are the closest static approximation.
export const DARK_PLUS = {
  background: "#1e1e1e",
  foreground: "#d4d4d4",
  gutterBackground: "#1e1e1e",
  gutterForeground: "#858585",
  caret: "#aeafad",
  selection: "#3a73b0",
  activeLine: "#ffffff0d",
};

export const LIGHT_PLUS = {
  background: "#ffffff",
  foreground: "#000000",
  gutterBackground: "#ffffff",
  gutterForeground: "#237893",
  caret: "#000000",
  selection: "#7ab8f5",
  activeLine: "#0000000a",
};

export type Palette = typeof DARK_PLUS;

export function paletteFor(colorMode: string): Palette {
  return colorMode === "dark" ? DARK_PLUS : LIGHT_PLUS;
}

export function editorTheme(palette: Palette, dark: boolean) {
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
      // Selection layer is drawn beneath the content, so an opaque active-line background
      // (above) would hide it; both focused and unfocused states need an explicit color.
      ".cm-selectionBackground, &.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
        backgroundColor: palette.selection,
      },
      // Read-only snippets (CodeBlock) have no drawSelection, so the browser's native selection is used.
      ".cm-content ::selection, .cm-line::selection": { backgroundColor: palette.selection },
    },
    { dark },
  );
}

export const darkHighlight = HighlightStyle.define([
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

export const lightHighlight = HighlightStyle.define([
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

export function highlightFor(dark: boolean) {
  return dark ? darkHighlight : lightHighlight;
}
