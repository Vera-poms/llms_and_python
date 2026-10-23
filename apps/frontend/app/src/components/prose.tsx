import {
  Code as ChakraCode,
  CodeProps,
  ListItem as ChakraListItem,
  ListItemProps,
  Text as ChakraText,
  TextProps,
} from "@chakra-ui/react";
import { Children, cloneElement, isValidElement, ReactNode } from "react";

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
  return <ChakraText {...props}>{emphasizeNumbers(children)}</ChakraText>;
}

export function ListItem({ children, ...props }: ListItemProps) {
  return <ChakraListItem {...props}>{emphasizeNumbers(children)}</ChakraListItem>;
}

export function Code({ children, ...props }: CodeProps) {
  const numeric = typeof children === "string" && isNumericExpression(children);
  return (
    <ChakraCode fontWeight={numeric ? "bold" : undefined} {...props}>
      {children}
    </ChakraCode>
  );
}
