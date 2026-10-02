import { Box, Text, VStack } from "@chakra-ui/react";
import { type RefObject, useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
}

interface NavGroups {
  concepts: NavItem[];
  coding: NavItem[];
}

// Reading headings that are sub-sections or boilerplate rather than concepts.
const NOT_A_CONCEPT = /^(in plain python|applied to this lab|further reading|notebook\b)/i;

function ensureId(el: Element, id: string): string {
  if (!el.id) el.id = id;
  return el.id;
}

// Builds the lab's outline from the rendered page: concept headings from the reading, and the coding
// sections (plain Python, try it live, exercise, project) from markers the lab components render.
function scan(reading: HTMLElement | null, notebook: HTMLElement | null): NavGroups {
  const concepts: NavItem[] = [];
  const coding: NavItem[] = [];

  const headings = Array.from(reading?.querySelectorAll("h2") ?? []);
  headings.forEach((h, i) => {
    const text = h.textContent?.trim() ?? "";
    if (text && !NOT_A_CONCEPT.test(text)) {
      concepts.push({ id: ensureId(h, `nav-concept-${i}`), label: text });
    }
  });

  const plain = headings.find((h) => /^in plain python/i.test(h.textContent?.trim() ?? ""));
  if (plain) coding.push({ id: ensureId(plain, "nav-plain"), label: "In plain Python" });

  const tryIt = reading?.querySelector('[data-nav="try-it"]');
  if (tryIt) coding.push({ id: ensureId(tryIt, "nav-try-it"), label: "Try it live" });

  const exercise = notebook?.querySelector('[data-nav="exercise"]');
  if (exercise) coding.push({ id: ensureId(exercise, "nav-exercise"), label: "Exercises" });

  const project = notebook?.querySelector('[data-nav="project"]');
  if (project) coding.push({ id: ensureId(project, "nav-project"), label: "Project" });

  return { concepts, coding };
}

function sameGroups(a: NavGroups, b: NavGroups): boolean {
  const flat = (g: NavGroups) => [...g.concepts, ...g.coding].map((i) => `${i.id}|${i.label}`).join("\n");
  return flat(a) === flat(b);
}

export function LabSidebar({
  readingRef,
  notebookRef,
}: {
  readingRef: RefObject<HTMLElement>;
  notebookRef: RefObject<HTMLElement>;
}) {
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
                px={2}
                py={1}
                fontSize="sm"
                borderRadius="md"
                borderLeftWidth="2px"
                borderLeftColor={isActive ? "blue.500" : "transparent"}
                fontWeight={isActive ? "bold" : "normal"}
                color={isActive ? "blue.600" : undefined}
                _hover={{ bg: "blackAlpha.50" }}
                aria-current={isActive ? "true" : undefined}
                onClick={() => jump(item.id)}
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
    <Box
      as="nav"
      aria-label="Lab sections"
      w={{ base: "full", lg: 56 }}
      flexShrink={0}
      display={{ base: "none", lg: "block" }}
      position="sticky"
      top={8}
      alignSelf="flex-start"
      maxH="calc(100vh - 4rem)"
      overflowY="auto"
    >
      <VStack align="stretch" spacing={5}>
        {renderGroup("Concepts", groups.concepts)}
        {renderGroup("Coding", groups.coding)}
      </VStack>
    </Box>
  );
}
