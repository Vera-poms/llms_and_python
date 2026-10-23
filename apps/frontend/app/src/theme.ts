import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  components: {
    // Inline code (calculations, names) uses the same purple as the notebook's markdown cells.
    Code: {
      defaultProps: { colorScheme: "purple" },
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
