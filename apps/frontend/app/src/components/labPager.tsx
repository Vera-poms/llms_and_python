import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// One page-by-page flow for a whole lab: the reading's pages first, then the notebook's (exercise, solution,
// project). The provider owns the current page and draws the Previous / Next buttons; the reading and the
// notebook each register their page titles and show only the page that is current.

export const PAGE_EVENT = "reading-page"; // ask the lab to show page `detail` (a lab-wide page number)
export const PAGE_CHANGED_EVENT = "reading-page-changed"; // the lab now shows another page

type Source = "reading" | "notebook";

interface LabPagerValue {
  page: number;
  register: (source: Source, titles: string[]) => void;
  offsetOf: (source: Source) => number;
}

const LabPagerContext = createContext<LabPagerValue | null>(null);

export function LabPager({ children }: { children: ReactNode }) {
  const [titlesBySource, setTitlesBySource] = useState<Record<Source, string[]>>({ reading: [], notebook: [] });
  const [page, setPage] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const titles = useMemo(() => [...titlesBySource.reading, ...titlesBySource.notebook], [titlesBySource]);
  const last = Math.max(titles.length - 1, 0);

  const register = useCallback((source: Source, next: string[]) => {
    setTitlesBySource((prev) => (prev[source].join("\n") === next.join("\n") ? prev : { ...prev, [source]: next }));
  }, []);

  const offsetOf = useCallback(
    (source: Source) => (source === "reading" ? 0 : titlesBySource.reading.length),
    [titlesBySource.reading.length],
  );

  const go = useCallback((n: number) => setPage(Math.min(Math.max(n, 0), last)), [last]);

  useEffect(() => {
    const onGo = (e: Event) => go((e as CustomEvent<number>).detail);
    window.addEventListener(PAGE_EVENT, onGo);
    return () => window.removeEventListener(PAGE_EVENT, onGo);
  }, [go]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(PAGE_CHANGED_EVENT, { detail: page }));
    if (first.current) {
      first.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ block: "start" });
  }, [page]);

  const nav = (
    <HStack justify="space-between" spacing={3}>
      <Button size="sm" variant="outline" onClick={() => go(page - 1)} isDisabled={page === 0}>
        &larr; Previous
      </Button>
      <Text fontSize="sm" color="gray.500" textAlign="center" noOfLines={1}>
        Page {page + 1} of {titles.length}: {titles[page] ?? ""}
      </Text>
      <Button size="sm" onClick={() => go(page + 1)} isDisabled={page >= last}>
        Next &rarr;
      </Button>
    </HStack>
  );

  return (
    <LabPagerContext.Provider value={{ page, register, offsetOf }}>
      <VStack align="stretch" spacing={6} ref={topRef} sx={{ scrollMarginTop: "80px" }}>
        <VStack align="stretch" spacing={2}>
          {nav}
          <HStack spacing={1} justify="center" flexWrap="wrap" role="tablist" aria-label="Lab pages">
            {titles.map((title, i) => (
              <Box
                key={i}
                as="button"
                role="tab"
                aria-selected={i === page}
                aria-label={`Page ${i + 1}: ${title}`}
                title={title}
                onClick={() => go(i)}
                h={2}
                w={i === page ? 8 : 2}
                borderRadius="full"
                bg={i === page ? "gray.600" : "gray.300"}
                _dark={{ bg: i === page ? "gray.200" : "gray.600" }}
                transition="width 0.2s"
              />
            ))}
          </HStack>
        </VStack>
        {children}
        {titles.length > 1 && nav}
      </VStack>
    </LabPagerContext.Provider>
  );
}

// For a part of the lab (the reading or the notebook) that is split into pages. Registers the page titles and
// says where this part's pages start. Without a LabPager around it, `paged` is false and everything shows.
export function useLabPages(source: Source, titles: string[]) {
  const ctx = useContext(LabPagerContext);
  const key = titles.join("\n");
  useLayoutEffect(() => {
    ctx?.register(source, key ? key.split("\n") : []);
    // `register` is stable; only the titles matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx?.register, source, key]);

  if (!ctx) return { paged: false as const, offset: 0, isActive: (_i: number) => true, anyActive: true };
  const offset = ctx.offsetOf(source);
  const anyActive = ctx.page >= offset && ctx.page < offset + titles.length;
  return {
    paged: true as const,
    offset,
    isActive: (i: number) => ctx.page === offset + i,
    anyActive,
  };
}
