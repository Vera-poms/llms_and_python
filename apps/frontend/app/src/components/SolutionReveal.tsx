import { Alert, AlertIcon, Badge, Box, Button, Collapse, HStack, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { api } from "../api/client";
import { CodeEditor } from "./CodeEditor";
import { CellOutput, RunResult } from "./NotebookRunner";

interface Part {
  id: string;
  label: string;
  kind: "line" | "block";
  lines: number;
  cost: number;
  written: boolean;
  code?: string | null;
}

interface SolutionView {
  user_lines: number;
  total_lines: number;
  penalty: number;
  whole_cost: number;
  solved: boolean;
  whole_code?: string | null;
  parts: Part[];
}

function assemble(view: SolutionView): string {
  if (view.whole_code) return view.whole_code;
  return view.parts
    .map((part) => part.code ?? `# [hidden] ${part.label} - ${part.lines} line${part.lines === 1 ? "" : "s"}`)
    .join("\n\n");
}

const costLabel = (cost: number) => (cost === 0 ? "free" : `-${cost} pt${cost === 1 ? "" : "s"}`);

// Reveals the reference solution piece by piece. A single line costs 1 point, a function/block costs 3, and
// the whole solution costs 5 (piecemeal reveals never add up to more than that).
export function SolutionReveal({
  labId,
  cellId,
  getSource,
  onChanged,
  apiKey,
}: {
  labId: number;
  cellId: string;
  getSource: () => string;
  onChanged?: () => void;
  apiKey?: string;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<SolutionView | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<"line" | "block" | null>(null);
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  // The solution cell shows what has been paid for; everything else stays a locked placeholder.
  useEffect(() => {
    if (view) setDraft(assemble(view));
  }, [view]);

  const hiddenAtLevel = view ? view.parts.filter((part) => part.kind === level && !part.code) : [];

  async function run() {
    setRunning(true);
    try {
      const response = await api.post(`/notebooks/${labId}/run`, { source: draft, api_key: apiKey || undefined });
      setResult(response.data);
    } finally {
      setRunning(false);
    }
  }

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (!next) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/labs/${labId}/cells/${cellId}/solution`, { source: getSource() });
      setView(response.data);
    } catch {
      setError("Couldn't load the solution options - try again.");
    } finally {
      setLoading(false);
    }
  }

  async function reveal(partId: string, cost: number, label: string) {
    const price = cost === 0 ? "This part is free." : `This will cost you ${cost} point${cost === 1 ? "" : "s"}.`;
    if (!window.confirm(`Reveal "${label}"? ${price}`)) return;
    setBusy(partId);
    setError(null);
    try {
      const response = await api.post(`/labs/${labId}/cells/${cellId}/solution/reveal`, {
        part: partId,
        source: getSource(),
      });
      setView(response.data.parts);
      onChanged?.();
    } catch {
      setError("Couldn't reveal that part - try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Box>
      <Button size="xs" variant="outline" onClick={toggle}>
        {open ? "Hide solution" : "Show solution"}
      </Button>
      <Collapse in={open} animateOpacity>
        <VStack align="stretch" spacing={2} mt={2} borderWidth="1px" borderRadius="md" p={3}>
          {loading && <Spinner size="sm" />}
          {error && (
            <Alert status="error" borderRadius="md" py={2}>
              <AlertIcon />
              {error}
            </Alert>
          )}
          {view && (
            <>
              {view.solved ? (
                <Text fontSize="sm">You solved this one - here's the reference solution, free of charge.</Text>
              ) : (
                <Text fontSize="sm">
                  You've written <b>{view.user_lines}</b> line{view.user_lines === 1 ? "" : "s"}; the full solution is{" "}
                  <b>{view.total_lines}</b>. Pick only the part you're stuck on - a single line costs 1 point,
                  a function or block costs 3, the whole solution costs 5 (so you never pay more than 5 in total).
                  {view.penalty > 0 && ` You've spent ${view.penalty} so far.`}
                </Text>
              )}

              {!view.whole_code && (
                <>
                  <Text fontSize="sm" fontWeight="medium">
                    How much do you want to see?
                  </Text>
                  <Stack direction={{ base: "column", sm: "row" }} spacing={2}>
                    <Button size="sm" variant={level === "line" ? "solid" : "outline"} colorScheme="blue" onClick={() => setLevel("line")}>
                      One line of code (-1 pt)
                    </Button>
                    <Button size="sm" variant={level === "block" ? "solid" : "outline"} colorScheme="blue" onClick={() => setLevel("block")}>
                      A function / block (-3 pts)
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      isLoading={busy === "all"}
                      onClick={() => reveal("all", view.whole_cost, "the whole solution")}
                    >
                      Whole solution ({costLabel(view.whole_cost)})
                    </Button>
                  </Stack>
                  {level && hiddenAtLevel.length === 0 && (
                    <Text fontSize="xs" color="gray.500">
                      Nothing left to reveal at this level.
                    </Text>
                  )}
                  {level && hiddenAtLevel.length > 0 && (
                    <VStack align="stretch" spacing={1}>
                      <Text fontSize="xs" color="gray.500">
                        Pick which {level === "line" ? "line" : "function or block"} to reveal:
                      </Text>
                      {hiddenAtLevel.map((part) => (
                        <HStack key={part.id} justify="space-between" spacing={2}>
                          <HStack spacing={2} wrap="wrap" minW={0}>
                            <Text fontSize="sm">{part.label}</Text>
                            <Text fontSize="xs" color="gray.500">
                              {part.lines} line{part.lines === 1 ? "" : "s"}
                            </Text>
                            {part.written && <Badge colorScheme="green">looks like you've written this</Badge>}
                          </HStack>
                          <Button
                            size="xs"
                            flexShrink={0}
                            isLoading={busy === part.id}
                            onClick={() => reveal(part.id, part.cost, part.label)}
                          >
                            Reveal ({costLabel(part.cost)})
                          </Button>
                        </HStack>
                      ))}
                    </VStack>
                  )}
                </>
              )}

              <Box borderWidth="1px" borderRadius="md" p={3}>
                <HStack justify="space-between" mb={2}>
                  <Badge colorScheme="purple">solution</Badge>
                  <Button size="xs" colorScheme="blue" onClick={run} isLoading={running}>
                    Run
                  </Button>
                </HStack>
                <CodeEditor value={draft} onChange={setDraft} />
                {result && <CellOutput result={result} />}
              </Box>
            </>
          )}
        </VStack>
      </Collapse>
    </Box>
  );
}
