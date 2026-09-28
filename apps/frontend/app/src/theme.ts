import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    heading: "system-ui, sans-serif",
    body: "system-ui, sans-serif",
  },
});
