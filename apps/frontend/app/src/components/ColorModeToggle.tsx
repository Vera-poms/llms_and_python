import { IconButton, useColorMode } from "@chakra-ui/react";

const svgProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function SunIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg {...svgProps}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

// Floating light/dark switch, shown on every page (including login).
export function ColorModeToggle({ floating = false, display }: { floating?: boolean; display?: object }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const dark = colorMode === "dark";
  return (
    <IconButton
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      icon={dark ? <SunIcon /> : <MoonIcon />}
      onClick={toggleColorMode}
      {...(floating ? { position: "fixed" as const, top: 3, right: 3, zIndex: "banner" } : {})}
      flexShrink={0}
      display={display}
      size="sm"
      variant="outline"
      borderRadius="full"
      bg="white"
      color="black"
      borderColor="red.500"
      _dark={{ bg: "black", color: "white" }}
      _hover={{ bg: "red.500", color: "white" }}
    />
  );
}
