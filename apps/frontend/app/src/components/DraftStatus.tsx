import { Text } from "@chakra-ui/react";

import type { DraftStatus as Status } from "../hooks/useCodeDraft";

const LABELS: Record<Status, string> = {
  idle: "",
  saving: "Saving draft…",
  saved: "Draft saved",
  error: "Couldn't save draft - will retry when you type",
};

export function DraftStatus({ status }: { status: Status }) {
  if (status === "idle") return null;
  return (
    <Text fontSize="xs" color={status === "error" ? "red.500" : "gray.500"} aria-live="polite">
      {LABELS[status]}
    </Text>
  );
}
