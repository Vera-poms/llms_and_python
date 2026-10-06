import { Alert, AlertIcon, Box, Button, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { api } from "../api/client";
import { Markdown } from "./Markdown";

interface Props {
  labId: number;
  cellId: string;
  getSource: () => string;
  getOutput?: () => string;
}

// Each press asks the tutor for the next, more specific hint. Hints are free - they never cost points.
export function HintButton({ labId, cellId, getSource, getOutput }: Props) {
  const [hints, setHints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestHint() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/labs/${labId}/cells/${cellId}/hint`, {
        source: getSource(),
        output: getOutput?.() ?? "",
      });
      setHints((prev) => [...prev, response.data.hint]);
    } catch (e) {
      const detail = (e as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Couldn't get a hint - try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <VStack align="stretch" spacing={2}>
      <Button size="xs" variant="outline" onClick={requestHint} isLoading={loading} alignSelf="start">
        {hints.length === 0 ? "Get a hint" : "Another hint"}
      </Button>
      {hints.map((hint, i) => (
        <Alert key={i} status="info" borderRadius="md" py={2} alignItems="start">
          <AlertIcon />
          <Box fontSize="sm" minW={0} sx={{ "& > :last-child": { mb: 0 } }}>
            <Markdown>{hint}</Markdown>
          </Box>
        </Alert>
      ))}
      {hints.length > 0 && (
        <Text fontSize="xs" color="gray.500">
          Hints are free - they don't reduce your score.
        </Text>
      )}
      {error && (
        <Alert status="error" borderRadius="md" py={2}>
          <AlertIcon />
          {error}
        </Alert>
      )}
    </VStack>
  );
}
