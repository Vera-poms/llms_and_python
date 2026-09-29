import { Alert, AlertIcon, Badge, Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { api } from "../api/client";
import { CodeEditor } from "./CodeEditor";
import { CellOutput, RunResult } from "./NotebookRunner";

function actualStdout(result: RunResult): string {
  return result.outputs
    .filter((o) => o.type === "stream")
    .map((o) => o.text ?? "")
    .join("");
}

function draftKey(labId: number, cellId: string): string {
  return `practice-cell:${labId}:${cellId}`;
}

function readDraft(labId: number, cellId: string): string | null {
  try {
    return sessionStorage.getItem(draftKey(labId, cellId));
  } catch {
    return null;
  }
}

function writeDraft(labId: number, cellId: string, source: string): void {
  try {
    sessionStorage.setItem(draftKey(labId, cellId), source);
  } catch {
    // ignore (e.g. private browsing storage restrictions)
  }
}

export function PracticeCell({
  labId,
  cellId,
  code,
  expectedOutput,
}: {
  labId: number;
  cellId: string;
  code: string;
  expectedOutput?: string;
}) {
  const [source, setSource] = useState(() => readDraft(labId, cellId) ?? "# write your code here");
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkStatus, setCheckStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const hadDraft = readDraft(labId, cellId) !== null;
    api
      .get(`/labs/${labId}/cells/${cellId}/code`)
      .then((response) => {
        if (!hadDraft) {
          setSource(response.data.source);
        }
      })
      .catch(() => {
        // no saved code yet - leave the textarea as-is
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labId, cellId]);

  function updateSource(next: string) {
    setSource(next);
    writeDraft(labId, cellId, next);
  }

  async function run() {
    setRunning(true);
    setErrorMessage(null);
    try {
      const response = await api.post(`/notebooks/${labId}/run`, { source });
      const runResult: RunResult = response.data;
      setResult(runResult);

      if (!runResult.ok) {
        setCheckStatus("idle");
        setFeedback(null);
        return;
      }

      setChecking(true);
      try {
        const judgeResponse = await api.post(`/labs/${labId}/cells/${cellId}/judge`, {
          source,
          output: actualStdout(runResult),
          reference_source: code,
          reference_output: expectedOutput,
        });
        const { correct, feedback: judgeFeedback } = judgeResponse.data;
        setCheckStatus(correct ? "pass" : "fail");
        setFeedback(judgeFeedback ?? null);

        if (correct) {
          try {
            await api.put(`/labs/${labId}/cells/${cellId}/code`, { source });
          } catch {
            setErrorMessage("Couldn't save your code - check your connection and try running it again.");
          }
        }
      } catch {
        setCheckStatus("idle");
        setErrorMessage("Couldn't check your code - check your connection and try running it again.");
      } finally {
        setChecking(false);
      }
    } finally {
      setRunning(false);
    }
  }

  return (
    <Box borderWidth="1px" borderRadius="md" p={3} bg="blue.50" _dark={{ bg: "blue.900" }}>
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <Badge colorScheme="blue">Try it live</Badge>
          <Button size="xs" colorScheme="blue" onClick={run} isLoading={running || checking}>
            Run
          </Button>
        </HStack>
        <CodeEditor value={source} onChange={updateSource} minHeight="60px" />
        {result && <CellOutput result={result} />}
        {checkStatus === "pass" && (
          <Alert status="success" borderRadius="md" py={2}>
            <AlertIcon />
            {feedback ?? "Correct!"}
          </Alert>
        )}
        {checkStatus === "fail" && (
          <Alert status="warning" borderRadius="md" py={2} flexDirection="column" alignItems="start">
            <HStack>
              <AlertIcon />
              <Text fontWeight="bold">Not quite right yet</Text>
            </HStack>
            {feedback && (
              <Text fontSize="sm" mt={1}>
                {feedback}
              </Text>
            )}
            {expectedOutput && (
              <>
                <Text fontSize="sm" mt={1}>
                  Expected output:
                </Text>
                <Text as="pre" fontFamily="mono" fontSize="xs" whiteSpace="pre-wrap" mt={1}>
                  {expectedOutput}
                </Text>
              </>
            )}
          </Alert>
        )}
        {errorMessage && (
          <Alert status="error" borderRadius="md" py={2}>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
      </VStack>
    </Box>
  );
}
