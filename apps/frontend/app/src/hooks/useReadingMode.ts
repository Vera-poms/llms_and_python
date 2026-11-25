import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

export const SPEED_PRESETS = { Slow: 120, Normal: 240, Fast: 400 } as const;
export const MIN_WPM = 60;
export const MAX_WPM = 600;
const STORAGE_KEY = "reading-mode-wpm";

function loadSpeed(): number {
  try {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    if (saved >= MIN_WPM && saved <= MAX_WPM) return saved;
  } catch {
    // storage can be blocked; fall back to the default
  }
  return SPEED_PRESETS.Normal;
}

export interface ReadingMode {
  active: boolean;
  paused: boolean;
  following: boolean;
  speed: number;
  progress: number; // 0-100
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  follow: () => void;
  setSpeed: (wpm: number) => void;
}

// Reveals the reading word by word, at a speed the reader picks. While `active`, the prose components
// wrap each word in <span data-w> and every code box / exercise carries data-reveal-block (see
// prose.tsx). This hook only sets `data-seen` on those elements, one at a time, in page order.
// Nothing React renders is changed, so the page behaves normally once the mode is switched off.
export function useReadingMode(readingRef: RefObject<HTMLElement>): ReadingMode {
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [following, setFollowing] = useState(true);
  const [speed, setSpeedState] = useState(loadSpeed);
  const [progress, setProgress] = useState(0);
  // Bumped when a paged reading turns a page, so the reveal restarts on the new page.
  const [pageTurn, setPageTurn] = useState(0);

  const speedRef = useRef(speed);
  const pausedRef = useRef(false);
  const followingRef = useRef(true);
  const itemsRef = useRef<HTMLElement[]>([]);
  const indexRef = useRef(0);
  const timerRef = useRef<number | undefined>(undefined);
  const jumpRef = useRef<string | null>(null);

  const setSpeed = useCallback((wpm: number) => {
    const clamped = Math.min(MAX_WPM, Math.max(MIN_WPM, Math.round(wpm)));
    speedRef.current = clamped;
    setSpeedState(clamped);
    try {
      localStorage.setItem(STORAGE_KEY, String(clamped));
    } catch {
      // ignore: the speed just won't be remembered
    }
  }, []);

  const clearTimer = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
  };

  const collect = useCallback(() => {
    const root = readingRef.current;
    if (!root) return [];
    // Words inside a code box or exercise are not split, so only the block itself is an item.
    return Array.from(root.querySelectorAll<HTMLElement>("[data-w], [data-reveal-block]")).filter(
      (el) =>
        !el.closest('[data-active="false"]') &&
        (el.hasAttribute("data-reveal-block") || !el.closest("[data-reveal-block]")),
    );
  }, [readingRef]);

  const tick = useCallback(() => {
    timerRef.current = undefined;
    if (pausedRef.current) return;
    const items = itemsRef.current;
    const el = items[indexRef.current];
    if (!el) {
      setProgress(100);
      return;
    }
    el.setAttribute("data-seen", "");
    indexRef.current += 1;
    setProgress(Math.round((indexRef.current / items.length) * 100));

    if (followingRef.current) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > window.innerHeight * 0.8) {
        window.scrollBy({ top: rect.bottom - window.innerHeight * 0.55 });
      }
    }
    // A code box or exercise takes a little longer than a word, so the reader can take it in.
    const words = el.hasAttribute("data-reveal-block") ? 4 : 1;
    timerRef.current = window.setTimeout(tick, (60000 / speedRef.current) * words);
  }, []);

  // Skip the reveal to the section with this id: everything before it is shown at once, and the reveal
  // carries on from its heading. Returns false if the section is on a page that is not showing yet.
  const applyJump = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target || target.closest('[data-active="false"]')) return false;
    const items = itemsRef.current;
    let at = items.findIndex(
      (item) => item === target || target.contains(item) || !!(target.compareDocumentPosition(item) & Node.DOCUMENT_POSITION_FOLLOWING),
    );
    if (at < 0) at = items.length;
    items.forEach((item, i) => (i < at ? item.setAttribute("data-seen", "") : item.removeAttribute("data-seen")));
    indexRef.current = at;
    setProgress(items.length ? Math.round((at / items.length) * 100) : 100);
    followingRef.current = true;
    setFollowing(true);
    clearTimer();
    if (!pausedRef.current) timerRef.current = window.setTimeout(tick, 200);
    return true;
  }, [tick]);

  const start = useCallback(() => {
    pausedRef.current = false;
    followingRef.current = true;
    setPaused(false);
    setFollowing(true);
    setProgress(0);
    setActive(true);
  }, []);

  // The words are only wrapped after `active` turns on, so collect them once that render is done.
  useEffect(() => {
    const root = readingRef.current;
    if (!active || !root) return;
    root.setAttribute("data-reading-mode", "");
    itemsRef.current = collect();
    indexRef.current = 0;
    setProgress(0);
    const pending = jumpRef.current;
    jumpRef.current = null;
    // A sidebar click turned the page: carry on from the section that was clicked. Otherwise start at the top.
    if (!(pending && applyJump(pending))) {
      if (pageTurn === 0) root.scrollIntoView({ block: "start" });
      timerRef.current = window.setTimeout(tick, 300);
    }

    // Scrolling by hand means "let me look around": stop following the reveal until Follow is pressed.
    const manual = () => {
      followingRef.current = false;
      setFollowing(false);
    };
    window.addEventListener("wheel", manual, { passive: true });
    window.addEventListener("touchmove", manual, { passive: true });

    return () => {
      clearTimer();
      window.removeEventListener("wheel", manual);
      window.removeEventListener("touchmove", manual);
      root.removeAttribute("data-reading-mode");
      root.querySelectorAll("[data-seen]").forEach((el) => el.removeAttribute("data-seen"));
    };
  }, [active, readingRef, collect, tick, pageTurn]);

  // Clicking a section in the sidebar while reading mode is on skips the reveal to that section.
  useEffect(() => {
    if (!active) return;
    const onJump = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!applyJump(id)) jumpRef.current = id; // on another page: applied once that page has turned
    };
    window.addEventListener("reading-mode-jump", onJump);
    return () => window.removeEventListener("reading-mode-jump", onJump);
  }, [active, applyJump]);

  useEffect(() => {
    const onTurn = () => setPageTurn((n) => n + 1);
    window.addEventListener("reading-page-changed", onTurn);
    return () => window.removeEventListener("reading-page-changed", onTurn);
  }, []);

  const stop = useCallback(() => setActive(false), []);

  const pause = useCallback(() => {
    pausedRef.current = true;
    setPaused(true);
    clearTimer();
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
    followingRef.current = true;
    setPaused(false);
    setFollowing(true);
    if (timerRef.current === undefined) timerRef.current = window.setTimeout(tick, 0);
  }, [tick]);

  // Starts the page that is showing again from its first word.
  const restart = useCallback(() => {
    const items = itemsRef.current;
    items.forEach((item) => item.removeAttribute("data-seen"));
    indexRef.current = 0;
    pausedRef.current = false;
    followingRef.current = true;
    setPaused(false);
    setFollowing(true);
    setProgress(0);
    clearTimer();
    items[0]?.scrollIntoView({ block: "center" });
    timerRef.current = window.setTimeout(tick, 300);
  }, [tick]);

  const follow = useCallback(() => {
    followingRef.current = true;
    setFollowing(true);
    const el = itemsRef.current[Math.max(0, indexRef.current - 1)];
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  return { active, paused, following, speed, progress, start, stop, pause, resume, restart, follow, setSpeed };
}
