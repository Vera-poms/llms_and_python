import { HStack, Spinner, Text } from "@chakra-ui/react";

// One loading sign for every panel, so "still loading" looks the same everywhere.
export function LoadingSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <HStack justify="center" spacing={3} py={8} role="status" color="gray.500">
      <Spinner size="md" thickness="3px" color="blue.500" />
      <Text>{label}</Text>
    </HStack>
  );
}
