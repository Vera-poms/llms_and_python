import { extendTheme } from "@chakra-ui/react";

// Brand palette: red, black and white. Every accent color the components ask for
// (blue, purple, teal, ...) resolves to this red scale, so the whole site follows it.
const red = {
  50: "#fff1f1",
  100: "#ffdede",
  200: "#ffbdbd",
  300: "#ff8f8f",
  400: "#f45b5b",
  500: "#e11d2e",
  600: "#c8101f",
  700: "#a20d19",
  800: "#7d0a14",
  900: "#55070e",
};

// Neutral scale (true black/white, no blue tint) for backgrounds, borders and text.
const gray = {
  50: "#f7f7f7",
  100: "#ededed",
  200: "#dcdcdc",
  300: "#bdbdbd",
  400: "#9a9a9a",
  500: "#737373",
  600: "#525252",
  700: "#333333",
  800: "#1a1a1a",
  900: "#0d0d0d",
};

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    red,
    gray,
    blue: red,
    purple: red,
    teal: red,
    cyan: red,
    pink: red,
    orange: red,
  },
  semanticTokens: {
    colors: {
      "chakra-body-bg": { _light: "#ffffff", _dark: "#000000" },
      "chakra-body-text": { _light: "#0d0d0d", _dark: "#f5f5f5" },
      "chakra-border-color": { _light: "#dcdcdc", _dark: "#333333" },
    },
  },
  components: {
    Code: {
      defaultProps: { colorScheme: "red" },
    },
    Button: {
      variants: {
        // Solid buttons: red in light mode, red in dark mode too, with white text.
        solid: ({ colorScheme: c }: { colorScheme: string }) =>
          c === "gray"
            ? {}
            : { bg: `${c}.500`, color: "white", _hover: { bg: `${c}.600`, _disabled: { bg: `${c}.500` } }, _active: { bg: `${c}.700` } },
      },
    },
  },
  fonts: {
    heading: "system-ui, sans-serif",
    body: "system-ui, sans-serif",
  },
  styles: {
    global: {
      // Phone-width defence against overflow: long words, URLs and API keys wrap instead of
      // pushing the page sideways, and nothing can scroll the document horizontally.
      // `clip` rather than `hidden`: `hidden` would make body a scroll container and stop
      // `position: sticky` headers from sticking to the viewport.
      "html, body": {
        overflowX: "clip",
        maxW: "100%",
      },
      body: {
        overflowWrap: "break-word",
      },
      "p, li, h1, h2, h3, h4, h5, h6, td, th": {
        overflowWrap: "break-word",
      },
      // Pre-formatted output (tracebacks, stdout) scrolls inside its own box rather than the page.
      pre: {
        maxW: "100%",
        overflowX: "auto",
      },
      img: {
        maxW: "100%",
        height: "auto",
      },
    },
  },
});
