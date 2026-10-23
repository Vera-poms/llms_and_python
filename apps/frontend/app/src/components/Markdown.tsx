import {
  Box,
  Code,
  Divider,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";
import ReactMarkdown from "react-markdown";

import { CodeBlock } from "./CodeBlock";
import { isNumericExpression, NUMBER_PATTERN } from "./prose";

// Chakra's CSS reset strips default heading sizes, list bullets and indentation, so raw
// ReactMarkdown output renders as one flat wall of text. Every element is mapped explicitly here.
const components: ComponentProps<typeof ReactMarkdown>["components"] = {
  h1: ({ children }) => (
    <Heading as="h1" size="lg" mt={6} mb={3} pb={2} borderBottomWidth="1px" lineHeight="1.3">
      {children}
    </Heading>
  ),
  h2: ({ children }) => (
    <Heading as="h2" size="md" mt={6} mb={2} lineHeight="1.3">
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading as="h3" size="sm" mt={5} mb={2} lineHeight="1.3">
      {children}
    </Heading>
  ),
  h4: ({ children }) => (
    <Heading as="h4" size="xs" mt={4} mb={2} textTransform="none">
      {children}
    </Heading>
  ),
  p: ({ children }) => (
    <Text mb={3} lineHeight="tall">
      {children}
    </Text>
  ),
  ul: ({ children }) => (
    <UnorderedList pl={6} mb={3} spacing={1} styleType="disc">
      {children}
    </UnorderedList>
  ),
  ol: ({ children }) => (
    <OrderedList pl={6} mb={3} spacing={1}>
      {children}
    </OrderedList>
  ),
  li: ({ children }) => <ListItem lineHeight="tall">{children}</ListItem>,
  strong: ({ children, className }) => (
    <Text as="strong" fontWeight={className === NUMBER_CLASS ? "bold" : "semibold"}>
      {children}
    </Text>
  ),
  em: ({ children }) => <Text as="em">{children}</Text>,
  a: ({ href, children }) => (
    <Link href={href} color="blue.500" isExternal textDecoration="underline">
      {children}
    </Link>
  ),
  blockquote: ({ children }) => (
    <Box borderLeftWidth="4px" borderColor="blue.300" pl={4} py={1} my={3} color="gray.600" _dark={{ color: "gray.300" }}>
      {children}
    </Box>
  ),
  hr: () => <Divider my={5} />,
  table: ({ children }) => (
    <TableContainer my={4}>
      <Table size="sm" variant="simple">
        {children}
      </Table>
    </TableContainer>
  ),
  thead: ({ children }) => <Thead>{children}</Thead>,
  tbody: ({ children }) => <Tbody>{children}</Tbody>,
  tr: ({ children }) => <Tr>{children}</Tr>,
  th: ({ children }) => <Th>{children}</Th>,
  td: ({ children }) => <Td>{children}</Td>,
  // react-markdown v9 passes inline code and fenced blocks through the same `code` slot; a fenced
  // block is the one wrapped in <pre>, which arrives with a language-* class or an embedded newline.
  code: ({ className, children }) => {
    const text = String(children ?? "");
    const fenced = /language-/.test(className ?? "") || text.includes("\n");
    if (fenced) {
      return <CodeBlock code={text} />;
    }
    // Code spans that are just numbers or arithmetic on them (e.g. `7.39 + 2.72`) are worked
    // numbers too, so they get the same emphasis as numbers in plain text.
    const numeric = isNumericExpression(text);
    return (
      <Code
        px={1.5}
        py={0.5}
        borderRadius="sm"
        colorScheme="purple"
        fontSize="0.875em"
        fontWeight={numeric ? "bold" : undefined}
        whiteSpace="pre-wrap"
      >
        {children}
      </Code>
    );
  },
  pre: ({ children }: { children?: ReactNode }) => <>{children}</>,
};

const NUMBER_CLASS = "md-number";
const SKIP_TAGS = new Set(["code", "pre", "strong", "a"]);

type HastNode = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function boldNumbers(node: HastNode): void {
  if (!node.children || (node.type === "element" && SKIP_TAGS.has(node.tagName ?? ""))) return;

  const next: HastNode[] = [];
  for (const child of node.children) {
    if (child.type !== "text" || !child.value) {
      boldNumbers(child);
      next.push(child);
      continue;
    }
    let last = 0;
    for (const match of child.value.matchAll(NUMBER_PATTERN)) {
      if (match.index > last) next.push({ type: "text", value: child.value.slice(last, match.index) });
      next.push({
        type: "element",
        tagName: "strong",
        properties: { className: NUMBER_CLASS },
        children: [{ type: "text", value: match[0] }],
      });
      last = match.index + match[0].length;
    }
    if (last === 0) {
      next.push(child);
    } else if (last < child.value.length) {
      next.push({ type: "text", value: child.value.slice(last) });
    }
  }
  node.children = next;
}

// Rehype plugin: walks the parsed tree and wraps numbers in plain text with <strong>.
function rehypeBoldNumbers() {
  return (tree: HastNode) => boldNumbers(tree);
}

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown components={components} rehypePlugins={[rehypeBoldNumbers]}>
      {children}
    </ReactMarkdown>
  );;
}
