import { Box, Link, Text, VStack } from "@chakra-ui/react";

import type { ResourceBlock } from "../../api/resourceManagement";
import { CodeBlock } from "../CodeBlock";
import { Markdown } from "../Markdown";
import type { RunResult } from "../NotebookRunner";
import { RunnableExample } from "../RunnableExample";

// Turns bare URLs into markdown links so they get the same styling as every other link in the
// readings. Fenced and inline code are left untouched, as are URLs already inside a markdown link.
export function autolink(markdown: string): string {
  return markdown
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part.replace(/(^|[^\]\(\[<"'=])(https?:\/\/[^\s<>)\]]+)/g, (_m, pre: string, url: string) => {
            const trimmed = url.replace(/[.,;:!?]+$/, "");
            const trailing = url.slice(trimmed.length);
            return `${pre}[${trimmed}](${trimmed})${trailing}`;
          }),
    )
    .join("");
}

export function ResourceRenderer({
  blocks,
  run,
}: {
  blocks: ResourceBlock[];
  run: (source: string) => Promise<RunResult>;
}) {
  return (
    <VStack align="stretch" spacing={3}>
      {blocks.map((block, i) => {
        if (block.type === "text") {
          return <Markdown key={i}>{autolink(block.markdown)}</Markdown>;
        }
        if (block.type === "code") {
          return block.runnable ? (
            <RunnableExample key={i} code={block.code} run={run} />
          ) : (
            <CodeBlock key={i} code={block.code} />
          );
        }
        return (
          <Box key={i} p={3} borderWidth="1px" borderRadius="md" _hover={{ borderColor: "blue.400" }}>
            <Link href={block.url} isExternal color="blue.500" textDecoration="underline" fontWeight="semibold">
              {block.title || block.url}
            </Link>
            {block.note && (
              <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }}>
                {block.note}
              </Text>
            )}
          </Box>
        );
      })}
    </VStack>
  );
}
