import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { type RefObject, useEffect, useState } from "react";

import type { BookmarkState } from "../hooks/useBookmark";

interface NavItem {
  id: string;
  label: string;
  // 0 = topic, 1 = sub-topic, 2 = sub-sub-topic; drives the indentation.
  level: number;
  // Which lab page (see labPager) the heading is on, or null when the lab is not paged.
  page: number | null;
}

interface NavGroups {
  concepts: NavItem[];
  coding: NavItem[];
}

const HEADING_LEVEL: Record<string, number> = { H2: 0, H3: 1, H4: 2 };

function pageOf(el: Element): number | null {
  const holder = el.closest("[data-page-index]");
  return holder ? Number(holder.getAttribute("data-page-index")) : null;
}

function ensureId(el: Element, id: string): string {
  if (!el.id) el.id = id;
  return el.id;
}

// Every heading (h2-h4) under `root`, in page order, plus any "Try it live" cells when `withCells` is set.
// The page's own h1 title is left out - it is not a section of the lab.
function collect(root: HTMLElement | null, prefix: string, withCells: boolean): NavItem[] {
  const items: NavItem[] = [];
  const selector = withCells
    ? 'h2, h3, h4, [data-nav="try-it"]'
    : 'h1, h2, h3, h4, [data-nav="setup"], [data-nav="exercise"], [data-nav="solution"], [data-nav="project"]';
  let tryItCount = 0;
  const roleCount: Record<string, number> = {};
  Array.from(root?.querySelectorAll(selector) ?? []).forEach((el, i) => {
    const role = el.getAttribute("data-nav");
    if (role && role !== "try-it") {
      roleCount[role] = (roleCount[role] ?? 0) + 1;
      const label = `${role[0].toUpperCase()}${role.slice(1)} code (${roleCount[role]})`;
      items.push({ id: ensureId(el, `${prefix}-${role}-${i}`), label, level: 2, page: pageOf(el) });
      return;
    }
    if (el.getAttribute("data-nav") === "try-it") {
      tryItCount += 1;
      items.push({ id: ensureId(el, `${prefix}-try-it-${i}`), label: `Try it live (${tryItCount})`, level: 2, page: pageOf(el) });
      return;
    }
    const text = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
    if (text) items.push({ id: ensureId(el, `${prefix}-${i}`), label: text, level: HEADING_LEVEL[el.tagName] ?? 0, page: pageOf(el) });
  });
  return items;
}

// Builds the lab's outline from the rendered page: the reading's topics and sub-topics, and the
// notebook's own sections (setup, exercise, solution, project and any practice blocks).
function scan(reading: HTMLElement | null, notebook: HTMLElement | null): NavGroups {
  return { concepts: collect(reading, "nav-reading", true), coding: collect(notebook, "nav-notebook", false) };
}

function sameGroups(a: NavGroups, b: NavGroups): boolean {
  const flat = (g: NavGroups) => [...g.concepts, ...g.coding].map((i) => `${i.id}|${i.label}|${i.level}|${i.page}`).join("\n");
  return flat(a) === flat(b);
}

export interface LabOutline {
  groups: NavGroups;
  activeId: string | null;
  currentPage: number;
  jump: (id: string) => void;
}

// Shared by the desktop sidebar and the mobile drawer, so the page scans and scroll-spies only once.
export function useLabOutline(readingRef: RefObject<HTMLElement>, notebookRef: RefObject<HTMLElement>): LabOutline {
  const [groups, setGroups] = useState<NavGroups>({ concepts: [], coding: [] });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const onChange = (e: Event) => setCurrentPage((e as CustomEvent<number>).detail);
    window.addEventListener("reading-page-changed", onChange);
    return () => window.removeEventListener("reading-page-changed", onChange);
  }, []);

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
        // Elements on a page that is not showing have no layout; skip them.
        if (el && el.getClientRects().length > 0 && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [groups]);

  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    // Reading mode (if on) skips the reveal ahead to this section.
    window.dispatchEvent(new CustomEvent("reading-mode-jump", { detail: id }));
    // Paged readings: turn to the page that holds the heading first, then scroll to it.
    const page = el.closest("[data-page-index]");
    if (page && page.getAttribute("data-active") !== "true") {
      window.dispatchEvent(new CustomEvent("reading-page", { detail: Number(page.getAttribute("data-page-index")) }));
      requestAnimationFrame(() => requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" })));
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return { groups, activeId, currentPage, jump };
}

// The outline entries themselves. `onNavigate` lets the mobile drawer close after a jump.
// `onReview` adds the review entry points: one for the whole lab and one beside every topic.
export function LabNav({
  outline,
  onNavigate,
  onReview,
  bookmark,
}: {
  outline: LabOutline;
  onNavigate?: () => void;
  onReview?: (topic: string) => void;
  bookmark?: BookmarkState;
}) {
  const { groups, activeId, currentPage, jump } = outline;
  const activeItem = [...groups.concepts, ...groups.coding].find((i) => i.id === activeId);

  function renderGroup(title: string, allItems: NavItem[], topicsAlwaysShown: boolean) {
    // Collapsed outline: the reading's topics stay listed, but a page's own sub-sections only show while you are
    // on that page. The coding part (exercise, solution, project) only shows on its own pages.
    const items = allItems.filter(
      (i) => i.page === null || i.page === currentPage || (topicsAlwaysShown && i.level <= 1),
    );
    if (items.length === 0) return null;
    return (
      <Box>
        <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="gray.500" px={2} mb={1}>
          {title}
        </Text>
        <VStack align="stretch" spacing={0}>
          {items.map((item) => {
            const isActive = item.id === activeId;
            const isMarked = !!bookmark && item.id === bookmark.sectionId;
            return (
              <Box key={item.id}>
              <Flex
                align="center"
                _hover={{ bg: "blackAlpha.50" }}
                borderRadius="md"
                bg={isMarked ? "yellow.100" : undefined}
                _dark={{ bg: isMarked ? "yellow.900" : undefined }}
              >
                <Box
                  as="button"
                  type="button"
                  flex="1"
                  minW={0}
                  textAlign="left"
                  pl={2 + item.level * 3}
                  pr={2}
                  py={1}
                  fontSize={item.level === 0 ? "sm" : "xs"}
                  borderLeftWidth="2px"
                  borderLeftColor={isActive ? "blue.500" : "transparent"}
                  fontWeight={isActive ? "bold" : item.level === 0 ? "semibold" : "normal"}
                  color={isActive ? "blue.600" : undefined}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => {
                    jump(item.id);
                    onNavigate?.();
                  }}
                >
                  {item.label}
                </Box>
                {bookmark && (
                  <Box
                    as="button"
                    type="button"
                    aria-label={isMarked ? "Remove bookmark" : `Bookmark: ${item.label}`}
                    title={isMarked ? "Remove bookmark" : "Bookmark this spot"}
                    px={1}
                    fontSize="xs"
                    opacity={isMarked ? 1 : 0.35}
                    _hover={{ opacity: 1 }}
                    onClick={() => (isMarked ? bookmark.clear() : bookmark.save(item))}
                  >
                    🔖
                  </Box>
                )}
                {onReview && (
                  <Box
                    as="button"
                    type="button"
                    aria-label={`Review: ${item.label}`}
                    title="Leave a review"
                    px={2}
                    color="gray.400"
                    _hover={{ color: "yellow.400" }}
                    onClick={() => {
                      onReview(item.label);
                      onNavigate?.();
                    }}
                  >
                    ☆
                  </Box>
                )}
              </Flex>
              {isMarked && bookmark?.kind === "text" && (
                <Text
                  fontSize="xs"
                  color="yellow.800"
                  _dark={{ color: "yellow.200" }}
                  fontStyle="italic"
                  noOfLines={2}
                  pl={2 + (item.level + 1) * 3}
                  pr={2}
                  pb={1}
                >
                  🔖 &ldquo;{bookmark.label}&rdquo;
                </Text>
              )}
              </Box>
            );
          })}
        </VStack>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={5}>
      {bookmark && (
        <VStack align="stretch" spacing={1}>
          {bookmark.found && (
            <Button
              size="sm"
              colorScheme="yellow"
              variant="outline"
              whiteSpace="normal"
              height="auto"
              py={1}
              onClick={() => {
                bookmark.goTo();
                onNavigate?.();
              }}
            >
              {bookmark.kind === "text" ? "Resume: “" : "Resume: "}
              {bookmark.label}
              {bookmark.kind === "text" ? "”" : ""}
            </Button>
          )}
          {bookmark.label && (
            <Button size="xs" variant="ghost" colorScheme="red" onClick={bookmark.clear}>
              Remove bookmark
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            leftIcon={<span aria-hidden="true">🔖</span>}
            isDisabled={!activeItem}
            onClick={() => activeItem && bookmark.save(activeItem)}
          >
            Bookmark where I am
          </Button>
        </VStack>
      )}
      {onReview && (
        <Button
          size="sm"
          variant="outline"
          leftIcon={<span aria-hidden="true">★</span>}
          onClick={() => {
            onReview("");
            onNavigate?.();
          }}
        >
          Review this lab
        </Button>
      )}
      {renderGroup("Concepts", groups.concepts, true)}
      {renderGroup("Coding", groups.coding, true)}
    </VStack>
  );
}

// Sticky outline on wide screens. Below `lg` the page puts <LabNav> in a drawer instead.
export function LabSidebar({
  outline,
  onReview,
  bookmark,
}: {
  outline: LabOutline;
  onReview?: (topic: string) => void;
  bookmark?: BookmarkState;
}) {
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
      <LabNav outline={outline} onReview={onReview} bookmark={bookmark} />
    </Box>
  );
}
