import { Box, HStack, Text, VStack } from "@chakra-ui/react";

import { CodeHint } from "./codeHints";

// Tells the reader a code box has hover hints, with small samples of what to look for.
// The samples are taken from the box's own hints. Renders nothing when there are no hints.
export function HintLegend({ hints }: { hints?: CodeHint[] }) {
  if (!hints || hints.length === 0) return null;
  const pieceSample = hints.find((h) => !h.block)?.code;
  const blockSample = hints.find((h) => h.block)?.block;

  return (
    <Box
      borderWidth="1px"
      borderColor="blue.200"
      bg="blue.50"
      borderRadius="lg"
      px={3}
      py={2}
      _dark={{ bg: "blue.900", borderColor: "blue.700" }}
    >
      <Text fontSize="sm" fontWeight="semibold" color="blue.800" _dark={{ color: "blue.100" }}>
        💡 This code explains itself. Hover your mouse over it.
      </Text>
      <VStack align="stretch" spacing={1} mt={1} fontSize="sm" color="gray.700" _dark={{ color: "gray.200" }}>
        {pieceSample && (
          <HStack spacing={2} flexWrap="wrap">
            <Text
              as="span"
              fontFamily="mono"
              textDecoration="underline dotted"
              textDecorationColor="blue.500"
              sx={{ textUnderlineOffset: "3px" }}
            >
              {pieceSample}
            </Text>
            <Text as="span">Dotted underline: hover it to see what that piece of code does.</Text>
          </HStack>
        )}
        {blockSample && (
          <HStack spacing={2} flexWrap="wrap">
            <Text
              as="span"
              px={2}
              borderRadius="full"
              fontSize="xs"
              bg="blue.100"
              color="blue.700"
              _dark={{ bg: "blue.800", color: "blue.200" }}
            >
              ⓘ {blockSample}
            </Text>
            <Text as="span">
              Label and a blue bar on the left: hover it to see what the whole block does.
            </Text>
          </HStack>
        )}
      </VStack>
    </Box>
  );
}
