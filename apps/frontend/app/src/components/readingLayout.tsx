import { Box, Heading, useColorModeValue, VStack } from "@chakra-ui/react";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

import { useLabPages } from "./labPager";

import { RevealWords } from "./prose";

// Layout pieces for the lab readings: one card per concept, a coloured band for each part of it
// (plain Python / up close / applied to the lab) and a frame around the "Your turn" exercise.
// Headings stay real h3/h4 elements, because the lab sidebar builds its outline from them.

export type Accent = "blue" | "purple" | "teal" | "orange" | "pink" | "cyan";

export function ConceptCard({
  number,
  title,
  continued,
  children,
}: {
  number: number;
  title: string;
  accent?: Accent; // kept so existing readings still compile; the cards are no longer colour-coded
  pageLabel?: string; // the part this page shows; the pager uses it as the page name
  continued?: boolean; // a later page of the same concept: the title is shown but is not a new outline heading
  children: ReactNode;
}) {
  const border = useColorModeValue("gray.200", "gray.600");
  const badgeBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box as="section" borderWidth="1px" borderColor={border} borderRadius="xl" p={{ base: 4, md: 8 }}>
      <VStack align="stretch" spacing={7}>
        <Box display="flex" alignItems="center" gap={4}>
          <Box
            flexShrink={0}
            w={10}
            h={10}
            borderRadius="full"
            bg={badgeBg}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            fontSize="lg"
            aria-hidden="true"
          >
            {number}
          </Box>
          <Heading as={continued ? "p" : "h3"} size="md">
            <RevealWords>{`Concept ${number}: ${title}`}</RevealWords>
          </Heading>
        </Box>
        {children}
      </VStack>
    </Box>
  );
}

export type PartKind = "plain" | "close" | "applied";

export function ConceptPart({ title, children }: { kind?: PartKind; title: string; children: ReactNode }) {
  return (
    <VStack align="stretch" spacing={5}>
      <Heading as="h4" size="xs" color="gray.600">
        <RevealWords>{title}</RevealWords>
      </Heading>
      {children}
    </VStack>
  );
}

// Groups the "Your turn" text, steps and the practice cell.
export function YourTurn({ children }: { children: ReactNode }) {
  return (
    <VStack align="stretch" spacing={4}>
      {children}
    </VStack>
  );
}

type PageEl = ReactElement<{ title?: string }>;

// A concept card is split into one page per part (plain Python / up close / applied), so each page is short.
// The card's opening paragraphs go on its first page; the card header repeats on every page of the concept.
function expandPages(children: ReactNode): PageEl[] {
  const pages: PageEl[] = [];
  for (const child of Children.toArray(children)) {
    if (!isValidElement<{ number: number; title: string; accent?: Accent; children?: ReactNode }>(child)) continue;
    if (child.type !== ConceptCard) {
      pages.push(child as PageEl);
      continue;
    }
    const kids = Children.toArray(child.props.children);
    const groups: ReactNode[][] = [];
    let intro: ReactNode[] = [];
    for (const kid of kids) {
      if (isValidElement(kid) && kid.type === ConceptPart) groups.push([...intro, kid]), (intro = []);
      else if (groups.length === 0) intro.push(kid);
      else groups[groups.length - 1].push(kid);
    }
    if (groups.length === 0) groups.push(intro);
    groups.forEach((group, i) => {
      const part = group.find((k) => isValidElement(k) && k.type === ConceptPart) as PageEl | undefined;
      pages.push(
        <ConceptCard
          key={`${child.key}-${i}`}
          {...child.props}
          continued={i > 0}
          title={child.props.title}
          pageLabel={part?.props.title}
        >
          {group}
        </ConceptCard>,
      );
    });
  }
  return pages;
}

// A plain page (e.g. the introduction) for ReadingPager.
export function ReadingPage({ children }: { title: string; children: ReactNode }) {
  return <VStack align="stretch" spacing={5}>{children}</VStack>;
}

// Shows a reading one page at a time. The Previous / Next buttons come from the surrounding LabPager. Every page
// stays mounted (hidden with display: none) so the sidebar outline, the code editors and what the reader typed
// all survive a page turn.
export function ReadingPager({ children }: { children: ReactNode }) {
  const pages = expandPages(children);
  const titleOf = (i: number) => {
    const props = pages[i].props as { title?: string; number?: number; pageLabel?: string };
    return props.pageLabel ? `Concept ${props.number}: ${props.pageLabel}` : (props.title ?? "");
  };
  const { offset, isActive } = useLabPages("reading", pages.map((_, i) => titleOf(i)));

  return (
    <>
      {pages.map((child, i) => (
        <Box
          key={i}
          data-page-index={offset + i}
          data-active={isActive(i) ? "true" : "false"}
          display={isActive(i) ? "block" : "none"}
        >
          {child as ReactNode}
        </Box>
      ))}
    </>
  );
}

function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

type HeadingEl = ReactElement<{ as?: string; size?: string; children?: ReactNode }>;
const isHeading = (n: ReactNode, level: string): n is HeadingEl =>
  isValidElement<{ as?: string }>(n) && n.type === Heading && n.props.as === level;

// Paging for the readings that are written as one flat list: every h2/h3 heading opens a section and every
// h4 heading (In plain Python / Up close / Applied to this lab) opens a new page inside it. A section's
// title is repeated, as plain text, at the top of each of its later pages. Nothing in the reading changes.
export function FlatReadingPager({ children }: { children: ReactNode }) {
  const pages: { title: string; nodes: ReactNode[] }[] = [];
  let section: HeadingEl | null = null;
  let sectionTitle = "";
  const open = (title: string, nodes: ReactNode[]) => pages.push({ title, nodes });

  Children.toArray(children).forEach((child) => {
    if (isHeading(child, "h2") || isHeading(child, "h3")) {
      section = child;
      sectionTitle = textOf(child.props.children);
      open(sectionTitle, [child]);
    } else if (isHeading(child, "h4") && section) {
      const again = cloneElement(section, { as: "p", key: `${section.key}-again` } as object);
      open(`${sectionTitle}: ${textOf(child.props.children)}`, [again, child]);
    } else if (pages.length === 0) {
      open("Introduction", [child]);
    } else {
      pages[pages.length - 1].nodes.push(child);
    }
  });

  const { offset, isActive } = useLabPages("reading", pages.map((p) => p.title));
  const border = useColorModeValue("gray.200", "gray.600");

  return (
    <>
      {pages.map((page, i) => (
        <Box
          key={i}
          data-page-index={offset + i}
          data-active={isActive(i) ? "true" : "false"}
          display={isActive(i) ? "block" : "none"}
        >
          <VStack
            align="stretch"
            spacing={5}
            borderWidth="1px"
            borderColor={border}
            borderRadius="xl"
            p={{ base: 4, md: 8 }}
          >
            {page.nodes.map((node) =>
              isHeading(node, "h2") || isHeading(node, "h3") || isHeading(node, "p")
                ? cloneElement(node, {}, <RevealWords>{node.props.children}</RevealWords>)
                : node,
            )}
          </VStack>
        </Box>
      ))}
    </>
  );
}
