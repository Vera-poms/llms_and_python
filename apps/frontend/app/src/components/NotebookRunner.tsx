import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Code,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { api } from "../api/client";
import { useCodeDraft } from "../hooks/useCodeDraft";
import { CodeEditor } from "./CodeEditor";
import { DraftStatus } from "./DraftStatus";
import { emphasizeNumbers } from "./prose";
import { HintButton } from "./HintButton";
import { Markdown } from "./Markdown";
import { SolutionReveal } from "./SolutionReveal";

interface NotebookCell {
  index: number;
  cell_type: "markdown" | "code";
  role: "reading" | "setup" | "exercise" | "solution" | "project";
  source: string;
  // Present on the scored exercise and project cells.
  graded_cell_id?: string | null;
  points?: number | null;
}

export interface OutputItem {
  type: "stream" | "image" | "error";
  name?: string;
  text?: string;
  data?: string;
  ename?: string;
  evalue?: string;
  traceback?: string[];
  line?: number | null;
  code?: string | null;
}

export interface RunResult {
  outputs: OutputItem[];
  ok: boolean;
}

const ROLE_COLORS: Record<string, string> = {
  exercise: "orange",
  solution: "purple",
  project: "green",
  setup: "gray",
};

// Card background per role, matching the role badge color.
export const CARD_TINT: Record<string, { light: string; dark: string }> = {
  exercise: { light: "orange.50", dark: "orange.900" },
  project: { light: "green.50", dark: "green.900" },
};

export function CellOutput({ result }: { result: RunResult }) {
  return (
    <VStack align="stretch" spacing={2} mt={2}>
      {result.outputs.map((output, i) => {
        if (output.type === "image") {
          return <img key={i} src={`data:image/png;base64,${output.data}`} alt="plot output" style={{ maxWidth: "100%" }} />;
        }
        if (output.type === "error") {
          return (
            <Code
              key={i}
              as="pre"
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              overflowX="auto"
              maxW="100%"
              bg="red.50"
              color="red.700"
              p={2}
              borderRadius="md"
            >
              {output.ename}
              {output.evalue ? `: ${output.evalue}` : ""}
              {output.line != null && `\n\nFailed at line ${output.line}${output.code ? `:  ${output.code}` : ""}`}
              {output.traceback && output.traceback.length > 0 && (
                <details style={{ marginTop: 8 }}>
                  <summary style={{ cursor: "pointer" }}>Full traceback</summary>
                  {output.traceback.join("\n")}
                </details>
              )}
            </Code>
          );
        }
        return (
          <Code key={i} as="pre" colorScheme="gray" whiteSpace="pre-wrap" wordBreak="break-word" overflowX="auto" maxW="100%" p={2} borderRadius="md">
            {output.text}
          </Code>
        );
      })}
    </VStack>
  );
}

function stdoutOf(result: RunResult): string {
  return result.outputs
    .filter((o) => o.type === "stream")
    .map((o) => o.text ?? "")
    .join("");
}

// A scored notebook cell (the lab exercise or the project): run it, get it judged against the server's
// reference, and ask for free hints. The solution is only released piece by piece, at a point cost (SolutionReveal).
function GradedCell({
  labId,
  cell,
  apiKey,
  onLabDone,
  onJudged,
  onSourceChange,
}: {
  labId: number;
  cell: NotebookCell;
  apiKey: string;
  onLabDone: () => void;
  onJudged?: () => void;
  onSourceChange: (gradedId: string, source: string) => void;
}) {
  const gradedId = cell.graded_cell_id as string;
  const [source, setSource] = useState(cell.source);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const draft = useCodeDraft(labId, gradedId, source);

  function edit(next: string) {
    draft.markEdited();
    setSource(next);
  }

  useEffect(() => onSourceChange(gradedId, source), [gradedId, source]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    api
      .get(`/labs/${labId}/cells/${gradedId}/code`)
      .then((response) => {
        // Don't clobber code the student started typing while this was loading.
        if (!draft.hasUnsavedEdit()) setSource(response.data.source);
      })
      .catch(() => {
        // nothing saved yet - keep the starter source
      });
    api
      .get(`/labs/${labId}/cells/results`)
      .then((response) => {
        const saved = (response.data as { cell_id: string; passed: boolean; feedback: string | null }[]).find(
          (r) => r.cell_id === gradedId,
        );
        if (saved?.passed) {
          setStatus("pass");
          setFeedback(saved.feedback);
        }
      })
      .catch(() => {
        // no recorded result
      });
  }, [labId, gradedId]);

  async function execute(): Promise<RunResult | null> {
    setRunning(true);
    setErrorMessage(null);
    try {
      const response = await api.post(`/notebooks/${labId}/run`, { source, api_key: apiKey || undefined });
      const runResult: RunResult = response.data;
      setResult(runResult);
      return runResult;
    } catch {
      setErrorMessage("Couldn't run your code - check your connection and try again.");
      return null;
    } finally {
      setRunning(false);
    }
  }

  // Run only tries the code and shows its output; nothing is graded or saved.
  async function run() {
    if (running || checking) return;
    await execute();
  }

  async function submit() {
    const runResult = await execute();
    if (!runResult) return;
    if (!runResult.ok) {
      setStatus("idle");
      setFeedback(null);
      return;
    }
    setChecking(true);
    try {
      const judged = await api.post(`/labs/${labId}/cells/${gradedId}/judge`, {
        source,
        output: stdoutOf(runResult),
      });
      setStatus(judged.data.correct ? "pass" : "fail");
      setFeedback(judged.data.feedback ?? null);
      if (judged.data.lab_done) onLabDone();
      onJudged?.();
      if (judged.data.correct) {
        try {
          await api.put(`/labs/${labId}/cells/${gradedId}/code`, { source });
        } catch {
          setErrorMessage("Couldn't save your code - check your connection and submit it again.");
        }
      }
    } catch {
      setStatus("idle");
      setErrorMessage("Couldn't check your code - check your connection and submit it again.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <Box
      data-nav={cell.role}
      borderWidth="1px"
      borderRadius="md"
      p={{ base: 2, md: 3 }}
      minW={0}
      bg={CARD_TINT[cell.role]?.light}
      _dark={CARD_TINT[cell.role] ? { bg: CARD_TINT[cell.role].dark } : undefined}
    >
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between" align="start" spacing={2}>
          <HStack wrap="wrap" spacing={2} minW={0}>
            <Badge colorScheme={ROLE_COLORS[cell.role] ?? "gray"}>{cell.role}</Badge>
            <Badge colorScheme="teal">{cell.points} pts</Badge>
            {status === "pass" && <Badge colorScheme="green">passed</Badge>}
          </HStack>
          <Button size="xs" colorScheme="blue" flexShrink={0} onClick={run} isLoading={running} isDisabled={checking}>
            Run
          </Button>
        </HStack>
        <CodeEditor value={source} onChange={edit} onRun={run} />
        <HStack>
          <Button size="sm" colorScheme="green" onClick={submit} isLoading={checking} isDisabled={running || !result || result.outputs.length === 0}>
            Submit
          </Button>
          <DraftStatus status={draft.status} />
        </HStack>
        {result && <CellOutput result={result} />}
        {status === "pass" && (
          <Alert status="success" borderRadius="md" py={2}>
            <AlertIcon />
            {feedback ? emphasizeNumbers(feedback) : "Correct!"}
          </Alert>
        )}
        {status === "fail" && (
          <Alert status="warning" borderRadius="md" py={2} flexDirection="column" alignItems="start">
            <HStack>
              <AlertIcon />
              <Text fontWeight="bold">Not quite right yet</Text>
            </HStack>
            {feedback && (
              <Text fontSize="sm" mt={1}>
                {emphasizeNumbers(feedback)}
              </Text>
            )}
          </Alert>
        )}
        {errorMessage && (
          <Alert status="error" borderRadius="md" py={2}>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
        <HintButton
          labId={labId}
          cellId={gradedId}
          getSource={() => source}
          getOutput={() => (result ? stdoutOf(result) : "")}
        />
      </VStack>
    </Box>
  );
}

export function NotebookRunner({
  labId,
  needsApiKey,
  onProgress,
}: {
  labId: number;
  needsApiKey?: boolean;
  onProgress?: () => void;
}) {
  const [cells, setCells] = useState<NotebookCell[] | null>(null);
  const [sources, setSources] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, RunResult>>({});
  const [running, setRunning] = useState<Record<number, boolean>>({});
  const [apiKey, setApiKey] = useState("");
  const [justCompleted, setJustCompleted] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const gradedSources = useRef<Record<string, string>>({});

  useEffect(() => {
    api.get(`/notebooks/${labId}`).then((response) => {
      const fetchedCells: NotebookCell[] = response.data.cells;
      setCells(fetchedCells);
      const initialSources: Record<number, string> = {};
      for (const cell of fetchedCells) {
        initialSources[cell.index] = cell.source;
      }
      setSources(initialSources);
    });
  }, [labId]);

  async function runCell(cell: NotebookCell) {
    if (running[cell.index]) return;
    setRunning((prev) => ({ ...prev, [cell.index]: true }));
    try {
      const response = await api.post(`/notebooks/${labId}/run`, {
        source: sources[cell.index],
        api_key: apiKey || undefined,
      });
      const result: RunResult = response.data;
      setResults((prev) => ({ ...prev, [cell.index]: result }));

    } finally {
      setRunning((prev) => ({ ...prev, [cell.index]: false }));
    }
  }

  async function restartKernel() {
    setRestarting(true);
    try {
      await api.post(`/notebooks/${labId}/restart`);
      setResults({});
    } finally {
      setRestarting(false);
    }
  }

  if (!cells) {
    return <Spinner />;
  }

  return (
    <VStack align="stretch" spacing={4}>
      <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "stretch", sm: "center" }} spacing={2}>
        <Text fontSize="sm" color="gray.500">
          Notebook - edit any cell, then Run it. Cells share state, just like a real notebook.
        </Text>
        <Button size="xs" variant="outline" onClick={restartKernel} isLoading={restarting}>
          Restart kernel
        </Button>
      </Stack>

      {needsApiKey && (
        <Box>
          <Text fontSize="sm" mb={1}>
            Enter your Groq API key here before running the Setup cell (get a free one at console.groq.com/keys - only kept in memory here)
          </Text>
          <Input
            type="password"
            size="sm"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="gsk_..."
          />
        </Box>
      )}

      {justCompleted && (
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          All exercises and the project passed - lab complete.
        </Alert>
      )}

      {cells.map((cell) => {
        if (cell.cell_type === "markdown") {
          return (
            <Box key={cell.index}>
              <Markdown>{cell.source}</Markdown>
            </Box>
          );
        }

        if (cell.role === "solution" && cell.graded_cell_id) {
          const solutionFor = cell.graded_cell_id;
          return (
            <SolutionReveal
              key={cell.index}
              labId={labId}
              cellId={solutionFor}
              activityRole={cells.find((c) => c.role !== "solution" && c.graded_cell_id === solutionFor)?.role}
              getSource={() => gradedSources.current[solutionFor] ?? ""}
              onChanged={onProgress}
              apiKey={apiKey}
            />
          );
        }

        if (cell.graded_cell_id) {
          return (
            <GradedCell
              key={cell.index}
              labId={labId}
              cell={cell}
              apiKey={apiKey}
              onLabDone={() => setJustCompleted(true)}
              onJudged={onProgress}
              onSourceChange={(id, value) => {
                gradedSources.current[id] = value;
              }}
            />
          );
        }

        const result = results[cell.index];
        // A setup cell takes the color of the activity (exercise or project) it prepares for: the next one after it.
        const activityRole =
          cell.role === "setup"
            ? cells.find((c) => c.index > cell.index && (c.role === "exercise" || c.role === "project"))?.role
            : undefined;
        const tint = activityRole ? CARD_TINT[activityRole] : undefined;
        const cellBody = (
          <Box borderWidth="1px" borderRadius="md" p={3} bg={tint?.light} _dark={tint ? { bg: tint.dark } : undefined}>
            <HStack justify="space-between" mb={2}>
              <Badge colorScheme={ROLE_COLORS[cell.role] ?? "gray"}>{cell.role}</Badge>
              <Button
                size="xs"
                colorScheme="blue"
                onClick={() => runCell(cell)}
                isLoading={running[cell.index]}
              >
                Run
              </Button>
            </HStack>
            <CodeEditor
              value={sources[cell.index] ?? ""}
              onChange={(value) => setSources((prev) => ({ ...prev, [cell.index]: value }))}
              onRun={() => runCell(cell)}
            />
            {result && <CellOutput result={result} />}
          </Box>
        );

        return <Box key={cell.index}>{cellBody}</Box>;
      })}
    </VStack>
  );
}
