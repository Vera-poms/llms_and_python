import { Box, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import type { LabMeta } from "../data/labs";

// Left-hand course navigation: one entry per week; Week 1 also lists its labs as quick links.
export function CourseSidebar({
  weeks,
  active,
  labs,
  doneIds,
  onSelectWeek,
}: {
  weeks: number[];
  active: number;
  labs: LabMeta[];
  doneIds: Set<number>;
  onSelectWeek: (week: number) => void;
}) {
  return (
    <Box
      as="nav"
      aria-label="Course navigation"
      w={{ base: "full", md: 64 }}
      flexShrink={0}
      position={{ base: "static", md: "sticky" }}
      top={8}
      alignSelf="flex-start"
      maxH={{ base: "none", md: "calc(100vh - 4rem)" }}
      overflowY="auto"
      pr={{ base: 0, md: 2 }}
    >
      <VStack align="stretch" spacing={1}>
        {weeks.map((w) => {
          const isActive = w === active;
          return (
            <Box key={w}>
              <Box
                as="button"
                type="button"
                w="full"
                textAlign="left"
                px={3}
                py={2}
                borderRadius="md"
                fontWeight="bold"
                bg={isActive ? "blue.50" : "transparent"}
                color={isActive ? "blue.700" : undefined}
                _dark={{ bg: isActive ? "blue.900" : "transparent", color: isActive ? "blue.100" : undefined }}
                _hover={{ bg: isActive ? undefined : "blackAlpha.50" }}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelectWeek(w)}
              >
                Week {w}
              </Box>
              {w === 1 && isActive && (
                <VStack align="stretch" spacing={0} mt={1} ml={3} pl={2} borderLeftWidth="1px">
                  {labs.map((lab) =>
                    lab.hasContent ? (
                      <Box
                        key={lab.id}
                        as={RouterLink}
                        to={`/labs/${lab.id}`}
                        px={2}
                        py={1}
                        fontSize="sm"
                        borderRadius="md"
                        _hover={{ bg: "blackAlpha.50", color: "blue.500" }}
                      >
                        <Text noOfLines={1}>
                          {doneIds.has(lab.id) ? "✓ " : ""}
                          {lab.id}. {lab.title}
                        </Text>
                      </Box>
                    ) : (
                      <Text key={lab.id} px={2} py={1} fontSize="sm" opacity={0.5} noOfLines={1}>
                        {lab.id}. {lab.title}
                      </Text>
                    ),
                  )}
                </VStack>
              )}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
