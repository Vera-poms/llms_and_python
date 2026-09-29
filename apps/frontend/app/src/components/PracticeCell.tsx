import { Alert, AlertIcon, Badge, Box, Button, HStack, Text, Textarea, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

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
  cellId,
  code: _code,
  expectedOutput,
}: {
  labId: number;
  cellId: string;
  code: string;
  expectedOutput?: string;
}) {
  const [source, setSource] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/labs/${labId}/cells/${cellId}/code`)
      .then((response) => {
        if (!cancelled) {
          setSource(response.data.source);
        }
      })
      .catch(() => {
        // no saved code yet - leave the textarea blank
      });
    return () => {
      cancelled = true;
    };
  }, [labId, cellId]);

  async function run() {
    setRunning(true);
    try {
      const response = await api.post(`/notebooks/${labId}/run`, { source });
      setResult(response.data);

      const passed =
        response.data.ok &&
        expectedOutput !== undefined &&
        normalize(actualStdout(response.data)) === normalize(expectedOutput);
      if (passed) {
        api.put(`/labs/${labId}/cells/${cellId}/code`, { source }).catch(() => {
          // best-effort save
        });
      }
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
          placeholder="# write your code here"
        />
        {result && <CellOutput result={result} />}
        {checkStatus === "pass" && (
          <Alert status="success" borderRadius="md" py={2}>
            <AlertIcon />
            Correct!
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
