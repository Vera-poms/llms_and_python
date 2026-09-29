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
import ReactMarkdown from "react-markdown";

import { api } from "../api/client";
import { CodeEditor } from "./CodeEditor";

interface NotebookCell {
  index: number;
  cell_type: "markdown" | "code";
  role: "reading" | "setup" | "exercise" | "solution" | "project";
  source: string;
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

export function NotebookRunner({ labId, needsApiKey }: { labId: number; needsApiKey?: boolean }) {
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

      if (cell.role === "exercise" && result.ok) {
        await api.patch(`/labs/${labId}/progress`, { done: true });
        setJustCompleted(true);
      }
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
          Exercise passed - lab marked complete.
        </Alert>
      )}

      {cells.map((cell) => {
        if (cell.cell_type === "markdown") {
          return (
            <Box key={cell.index} className="markdown-cell">
              <ReactMarkdown>{cell.source}</ReactMarkdown>
            </Box>
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
