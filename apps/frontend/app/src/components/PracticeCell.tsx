import { Alert, AlertIcon, Badge, Box, Button, HStack, Text, Textarea, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { api } from "../api/client";
import { CellOutput, RunResult } from "./NotebookRunner";

function normalize(text: string): string {
  return text.trim().replace(/\r\n/g, "\n");
}

function actualStdout(result: RunResult): string {
  return result.outputs
    .filter((o) => o.type === "stream")
    .map((o) => o.text ?? "")
    .join("");
}

export function PracticeCell({
  labId,
  code,
  expectedOutput,
}: {
  labId: number;
  code: string;
  expectedOutput?: string;
}) {
  const [source, setSource] = useState(code);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    try {
      const response = await api.post(`/notebooks/${labId}/run`, { source });
      setResult(response.data);
    } finally {
      setRunning(false);
    }
  }

  let checkStatus: "idle" | "pass" | "fail" = "idle";
  if (result && result.ok && expectedOutput !== undefined) {
    checkStatus = normalize(actualStdout(result)) === normalize(expectedOutput) ? "pass" : "fail";
  }

  return (
    <Box borderWidth="1px" borderRadius="md" p={3} bg="blue.50" _dark={{ bg: "blue.900" }}>
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <Badge colorScheme="blue">Try it live</Badge>
          <Button size="xs" colorScheme="blue" onClick={run} isLoading={running}>
            Run
          </Button>
        </HStack>
        <Textarea
          fontFamily="mono"
          fontSize="sm"
          bg="white"
          _dark={{ bg: "gray.800" }}
          rows={Math.min(20, source.split("\n").length)}
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        {result && <CellOutput result={result} />}
        {checkStatus === "pass" && (
          <Alert status="success" borderRadius="md" py={2}>
            <AlertIcon />
            Output matches what's expected.
          </Alert>
        )}
        {checkStatus === "fail" && (
          <Alert status="warning" borderRadius="md" py={2} flexDirection="column" alignItems="start">
            <HStack>
              <AlertIcon />
              <Text fontWeight="bold">Output doesn't match yet - expected:</Text>
            </HStack>
            <Text as="pre" fontFamily="mono" fontSize="xs" whiteSpace="pre-wrap" mt={1}>
              {expectedOutput}
            </Text>
          </Alert>
        )}
      </VStack>
    </Box>
  );
}
