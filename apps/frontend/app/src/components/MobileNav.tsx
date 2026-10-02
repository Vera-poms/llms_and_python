import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

// Chakra's icon package isn't a dependency, so the hamburger is drawn here.
function HamburgerIcon() {
  return (
    <Box as="svg" viewBox="0 0 24 24" boxSize={5} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
      <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
    </Box>
  );
}

// The sidebar nav as a slide-in drawer on small screens. `hideFrom` is the breakpoint at which the
// page shows its own static sidebar instead, so the hamburger disappears from that width up.
export function MobileNav({
  title,
  hideFrom = "md",
  children,
}: {
  title: string;
  hideFrom?: "md" | "lg";
  children: (close: () => void) => ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label={`Open ${title.toLowerCase()}`}
        icon={<HamburgerIcon />}
        variant="outline"
        size="sm"
        flexShrink={0}
        display={{ base: "inline-flex", [hideFrom]: "none" }}
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" fontSize="md" pr={12}>
            {title}
          </DrawerHeader>
          <DrawerBody px={3} py={4}>
            {children(onClose)}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

// The page's top bar. Below `hideFrom` it stays pinned to the top of the viewport while the
// content scrolls, so the hamburger is always reachable; from `hideFrom` up the static sidebar
// is on screen instead and the bar scrolls away with the page as before.
export function StickyHeader({
  hideFrom = "md",
  children,
}: {
  hideFrom?: "md" | "lg";
  children: ReactNode;
}) {
  return (
    <Flex
      as="header"
      justify="space-between"
      align="center"
      gap={3}
      position={{ base: "sticky", [hideFrom]: "static" }}
      top={0}
      zIndex="docked"
      bg="chakra-body-bg"
      py={{ base: 2, [hideFrom]: 0 }}
      borderBottomWidth={{ base: "1px", [hideFrom]: 0 }}
      mb={{ base: 4, [hideFrom]: 6 }}
    >
      {children}
    </Flex>
  );
}

// A plain list of nav entries, used inside the drawer where tabs don't fit.
export function NavList({
  items,
  active,
  onSelect,
}: {
  items: string[];
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <VStack align="stretch" spacing={1}>
      {items.map((label, i) => {
        const isActive = i === active;
        return (
          <Box
            key={label}
            as="button"
            type="button"
            textAlign="left"
            px={3}
            py={2}
            borderRadius="md"
            fontWeight={isActive ? "bold" : "normal"}
            bg={isActive ? "blue.50" : "transparent"}
            color={isActive ? "blue.700" : undefined}
            _dark={{ bg: isActive ? "blue.900" : "transparent", color: isActive ? "blue.100" : undefined }}
            _hover={{ bg: isActive ? undefined : "blackAlpha.50" }}
            aria-current={isActive ? "true" : undefined}
            onClick={() => onSelect(i)}
          >
            {label}
          </Box>
        );
      })}
    </VStack>
  );
}
