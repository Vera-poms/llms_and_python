import { Box, Text, VStack } from "@chakra-ui/react";
import { type RefObject, useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
  // 0 = topic, 1 = sub-topic, 2 = sub-sub-topic; drives the indentation.
  level: number;
}

interface NavGroups {
  concepts: NavItem[];
  coding: NavItem[];
}

const HEADING_LEVEL: Record<string, number> = { H2: 0, H3: 1, H4: 2 };

function ensureId(el: Element, id: string): string {
  if (!el.id) el.id = id;
  return el.id;
}

// Every heading (h2-h4) under `root`, in page order, plus any "Try it live" cells when `withCells` is set.
// The page's own h1 title is left out - it is not a section of the lab.
function collect(root: HTMLElement | null, prefix: string, withCells: boolean): NavItem[] {
  const items: NavItem[] = [];
  const selector = withCells ? 'h2, h3, h4, [data-nav="try-it"]' : "h2, h3, h4";
  let tryItCount = 0;
  Array.from(root?.querySelectorAll(selector) ?? []).forEach((el, i) => {
    if (el.getAttribute("data-nav") === "try-it") {
      tryItCount += 1;
      items.push({ id: ensureId(el, `${prefix}-try-it-${i}`), label: `Try it live (${tryItCount})`, level: 2 });
      return;
    }
    const text = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
    if (text) items.push({ id: ensureId(el, `${prefix}-${i}`), label: text, level: HEADING_LEVEL[el.tagName] ?? 0 });
  });
  return items;
}

// Builds the lab's outline from the rendered page: the reading's topics and sub-topics, and the
// notebook's own sections (setup, exercise, solution, project and any practice blocks).
function scan(reading: HTMLElement | null, notebook: HTMLElement | null): NavGroups {
  return { concepts: collect(reading, "nav-reading", true), coding: collect(notebook, "nav-notebook", false) };
}

function sameGroups(a: NavGroups, b: NavGroups): boolean {
  const flat = (g: NavGroups) => [...g.concepts, ...g.coding].map((i) => `${i.id}|${i.label}|${i.level}`).join("\n");
  return flat(a) === flat(b);
}

export interface LabOutline {
  groups: NavGroups;
  activeId: string | null;
  jump: (id: string) => void;
}

// Shared by the desktop sidebar and the mobile drawer, so the page scans and scroll-spies only once.
export function useLabOutline(readingRef: RefObject<HTMLElement>, notebookRef: RefObject<HTMLElement>): LabOutline {
  const [groups, setGroups] = useState<NavGroups>({ concepts: [], coding: [] });
  const [activeId, setActiveId] = useState<string | null>(null);

  // The notebook loads from the server after first paint, so keep rescanning as the page changes.
  useEffect(() => {
    const update = () => {
      const next = scan(readingRef.current, notebookRef.current);
      setGroups((prev) => (sameGroups(prev, next) ? prev : next));
    };
    update();
    const observer = new MutationObserver(update);
    for (const ref of [readingRef, notebookRef]) {
      if (ref.current) observer.observe(ref.current, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [readingRef, notebookRef]);

  // Scroll-spy: the active entry is the last one whose top has passed the top of the viewport.
  useEffect(() => {
    const ids = [...groups.concepts, ...groups.coding].map((i) => i.id);
    const onScroll = () => {
      let current: string | null = ids[0] ?? null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [groups]);

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return { groups, activeId, jump };
}

// The outline entries themselves. `onNavigate` lets the mobile drawer close after a jump.
export function LabNav({ outline, onNavigate }: { outline: LabOutline; onNavigate?: () => void }) {
  const { groups, activeId, jump } = outline;

  function renderGroup(title: string, items: NavItem[]) {
    if (items.length === 0) return null;
    return (
      <Box>
        <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="gray.500" px={2} mb={1}>
          {title}
        </Text>
        <VStack align="stretch" spacing={0}>
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <Box
                key={item.id}
                as="button"
                type="button"
                textAlign="left"
                pl={2 + item.level * 3}
                pr={2}
                py={1}
                fontSize={item.level === 0 ? "sm" : "xs"}
                borderRadius="md"
                borderLeftWidth="2px"
                borderLeftColor={isActive ? "blue.500" : "transparent"}
                fontWeight={isActive ? "bold" : item.level === 0 ? "semibold" : "normal"}
                color={isActive ? "blue.600" : undefined}
                _hover={{ bg: "blackAlpha.50" }}
                aria-current={isActive ? "true" : undefined}
                onClick={() => {
                  jump(item.id);
                  onNavigate?.();
                }}
              >
                {item.label}
              </Box>
            );
          })}
        </VStack>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={5}>
      {renderGroup("Concepts", groups.concepts)}
      {renderGroup("Coding", groups.coding)}
    </VStack>
  );
}

// Sticky outline on wide screens. Below `lg` the page puts <LabNav> in a drawer instead.
export function LabSidebar({ outline }: { outline: LabOutline }) {
  return (
    <Box
      as="nav"
      aria-label="Lab sections"
      w={56}
      flexShrink={0}
      display={{ base: "none", lg: "block" }}
      position="sticky"
      top={8}
      alignSelf="flex-start"
      maxH="calc(100vh - 4rem)"
      overflowY="auto"
    >
      <LabNav outline={outline} />
    </Box>
  );
}
