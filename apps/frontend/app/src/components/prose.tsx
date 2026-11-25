import {
  Code as ChakraCode,
  CodeProps,
  Kbd,
  Link as ChakraLink,
  ListItem as ChakraListItem,
  ListItemProps,
  Text as ChakraText,
  TextProps,
} from "@chakra-ui/react";
import { Children, cloneElement, createContext, Fragment, isValidElement, ReactNode, useContext } from "react";

// True while the reader has "Reading mode" on. Only then are words wrapped in <span data-w>, so the
// reveal animation can show them one by one; otherwise the text renders exactly as before.
export const ReadingModeContext = createContext(false);

const HOST_WRAPPERS = new Set(["b", "strong", "em", "i", "span", "u", "a"]);

// Splits plain-text children into one <span data-w> per word, recursing into simple inline wrappers.
// Code spans carry their own data-w (see Code below) and are revealed as a single unit.
export function wrapWords(children: ReactNode): ReactNode {
  return Children.map(children, (child, index) => {
    if (typeof child === "string") {
      return (
        <>
          {child.split(/(\s+)/).map((part, i) =>
            part === "" || /^\s+$/.test(part) ? (
              part
            ) : (
              <span key={`${index}-${i}`} data-w="">
                {part}
              </span>
            ),
          )}
        </>
      );
    }
    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children != null) {
      const hostTag = typeof child.type === "string" && HOST_WRAPPERS.has(child.type);
      if (hostTag || child.type === ChakraLink || child.type === Fragment) return cloneElement(child, undefined, wrapWords(child.props.children));
    }
    return child;
  });
}

// Heading text for the reading-mode reveal; a no-op when the mode is off.
export function RevealWords({ children }: { children: ReactNode }) {
  const active = useContext(ReadingModeContext);
  return <>{active ? wrapWords(children) : children}</>;
}

// Whole numbers, decimals, thousands separators and percentages; not digits inside words like "x2" or "v1.2",
// nor numbers that are part of a name like "GPT-2".
export const NUMBER_PATTERN = /(?<![\w.])(?<![A-Za-z]-)\d[\d,]*(?:\.\d+)?%?(?!\w)/g;

// A code span that is only numbers and arithmetic on them, e.g. `7.39 + 2.72`.
export function isNumericExpression(text: string): boolean {
  return /\d/.test(text) && /^[\d\s.,+\-*/%()=]+$/.test(text);
}

const SKIP_TAGS = new Set(["code", "pre", "strong", "b", "a"]);

function skipElement(type: unknown): boolean {
  return type === ChakraCode || type === Code || (typeof type === "string" && SKIP_TAGS.has(type));
}

// Wraps every number found in plain-text children in <strong>, recursing into inline wrappers
// (em, span, ...) but leaving code, links and already-bold text alone.
export function emphasizeNumbers(children: ReactNode): ReactNode {
  return Children.map(children, (child, index) => {
    if (typeof child === "string") {
      const parts: ReactNode[] = [];
      let last = 0;
      for (const match of child.matchAll(NUMBER_PATTERN)) {
        if (match.index > last) parts.push(child.slice(last, match.index));
        parts.push(
          <strong key={`${index}-${match.index}`} style={{ fontWeight: 700 }}>
            {match[0]}
          </strong>,
        );
        last = match.index + match[0].length;
      }
      if (parts.length === 0) return child;
      if (last < child.length) parts.push(child.slice(last));
      return <>{parts}</>;
    }
    if (isValidElement<{ children?: ReactNode }>(child) && !skipElement(child.type) && child.props.children != null) {
      return cloneElement(child, undefined, emphasizeNumbers(child.props.children));
    }
    return child;
  });
}

// Drop-in replacements for the Chakra components the lab readings are written with.
export function Text({ children, ...props }: TextProps) {
  const active = useContext(ReadingModeContext);
  const content = emphasizeNumbers(children);
  return <ChakraText {...props}>{active ? wrapWords(content) : content}</ChakraText>;
}

export function ListItem({ children, ...props }: ListItemProps) {
  const active = useContext(ReadingModeContext);
  const content = emphasizeNumbers(children);
  return <ChakraListItem {...props}>{active ? wrapWords(content) : content}</ChakraListItem>;
}

export function Code({ children, ...props }: CodeProps) {
  const numeric = typeof children === "string" && isNumericExpression(children);
  return (
    <ChakraCode data-w="" fontWeight={numeric ? "bold" : undefined} {...props}>
      {children}
    </ChakraCode>
  );
}

// "Run (Shift + Enter) and Submit (Ctrl + Enter)" for the "Your turn" sentences. The keys match the
// keymap in CodeEditor, so change them in both places together.
export function RunSubmitKeys() {
  return (
    <>
      <b>Run</b> (<Kbd>Shift</Kbd> + <Kbd>Enter</Kbd>) and <b>Submit</b> (<Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd>)
    </>
  );
}
