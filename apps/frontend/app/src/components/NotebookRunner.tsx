import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Code,
  Collapse,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { api } from "../api/client";
import { CodeEditor } from "./CodeEditor";
import { HintButton } from "./HintButton";
import { Markdown } from "./Markdown";

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

export function CellOutput({ result }: { result: RunResult }) {
  return (
    <VStack align="stretch" spacing={2} mt={2}>
      {result.outputs.map((output, i) => {
        if (output.type === "image") {
          return <img key={i} src={`data:image/png;base64,${output.data}`} alt="plot output" />;
        }
        if (output.type === "error") {
          return (
            <Code key={i} as="pre" whiteSpace="pre-wrap" bg="red.50" color="red.700" p={2} borderRadius="md">
              {output.ename}: {output.evalue}
            </Code>
          );
        }
        return (
          <Code key={i} as="pre" whiteSpace="pre-wrap" p={2} borderRadius="md">
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
// hidden reference, and ask for free hints. The reference solution is never sent to the browser.
function GradedCell({
  labId,
  cell,
  apiKey,
  onLabDone,
  onJudged,
}: {
  labId: number;
  cell: NotebookCell;
  apiKey: string;
  onLabDone: () => void;
  onJudged?: () => void;
}) {
  const gradedId = cell.graded_cell_id as string;
  const [source, setSource] = useState(cell.source);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/labs/${labId}/cells/${gradedId}/code`)
      .then((response) => setSource(response.data.source))
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

  async function run() {
    setRunning(true);
    setErrorMessage(null);
    try {
      const response = await api.post(`/notebooks/${labId}/run`, { source, api_key: apiKey || undefined });
      const runResult: RunResult = response.data;
      setResult(runResult);
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
            setErrorMessage("Couldn't save your code - check your connection and run it again.");
          }
        }
      } catch {
        setStatus("idle");
        setErrorMessage("Couldn't check your code - check your connection and run it again.");
      } finally {
        setChecking(false);
      }
    } finally {
      setRunning(false);
    }
  }

  return (
    <Box borderWidth="1px" borderRadius="md" p={3}>
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <HStack>
            <Badge colorScheme={ROLE_COLORS[cell.role] ?? "gray"}>{cell.role}</Badge>
            <Badge colorScheme="teal">{cell.points} pts</Badge>
            {status === "pass" && <Badge colorScheme="green">passed</Badge>}
          </HStack>
          <Button size="xs" colorScheme="blue" onClick={run} isLoading={running || checking}>
            Run
          </Button>
        </HStack>
        <CodeEditor value={source} onChange={setSource} />
        {result && <CellOutput result={result} />}
        {status === "pass" && (
          <Alert status="success" borderRadius="md" py={2}>
            <AlertIcon />
            {feedback ?? "Correct!"}
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
                {feedback}
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
  const [solutionOpen, setSolutionOpen] = useState<Record<number, boolean>>({});

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
      <HStack justify="space-between">
        <Text fontSize="sm" color="gray.500">
          Notebook - edit any cell, then Run it. Cells share state, just like a real notebook.
        </Text>
        <Button size="xs" variant="outline" onClick={restartKernel} isLoading={restarting}>
          Restart kernel
        </Button>
      </HStack>

      {needsApiKey && (
        <Box>
          <Text fontSize="sm" mb={1}>
            Groq API key (get a free one at console.groq.com/keys - only kept in memory here)
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

        if (cell.graded_cell_id) {
          return (
            <GradedCell
              key={cell.index}
              labId={labId}
              cell={cell}
              apiKey={apiKey}
              onLabDone={() => setJustCompleted(true)}
              onJudged={onProgress}
            />
          );
        }

        const result = results[cell.index];
        const cellBody = (
          <Box borderWidth="1px" borderRadius="md" p={3}>
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
            />
            {result && <CellOutput result={result} />}
          </Box>
        );

        if (cell.role === "solution") {
          const isOpen = !!solutionOpen[cell.index];
          return (
            <Box key={cell.index}>
              <Button
                size="xs"
                variant="outline"
                mb={2}
                onClick={() => setSolutionOpen((prev) => ({ ...prev, [cell.index]: !isOpen }))}
              >
                {isOpen ? "Hide solution" : "Show solution"}
              </Button>
              <Collapse in={isOpen} animateOpacity>
                {cellBody}
              </Collapse>
            </Box>
          );
        }

        return <Box key={cell.index}>{cellBody}</Box>;
      })}
    </VStack>
  );
}
