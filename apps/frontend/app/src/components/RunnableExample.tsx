import { Badge, Box, Button, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { api } from "../api/client";
import { CodeEditor } from "./CodeEditor";
import { CellOutput, RunResult } from "./NotebookRunner";

type RunFn = (source: string) => Promise<RunResult>;

// `run` overrides the default lab-notebook endpoint, e.g. for weekly resources.
export function RunnableExample({ labId, code, run }: { labId?: number; code: string; run?: RunFn }) {
  const [source, setSource] = useState(code);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  async function execute() {
    setRunning(true);
    try {
      if (run) {
        setResult(await run(source));
      } else {
        const response = await api.post(`/notebooks/${labId}/run`, { source });
        setResult(response.data);
      }
    } finally {
      setRunning(false);
    }
  }

  return (
    <Box borderWidth="1px" borderRadius="md" p={3} bg="gray.50" _dark={{ bg: "gray.700" }}>
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <Badge colorScheme="gray">Run it</Badge>
          <Button size="xs" onClick={execute} isLoading={running}>
            Run
          </Button>
        </HStack>
        <CodeEditor value={source} onChange={setSource} minHeight="60px" />
        {result && <CellOutput result={result} />}
      </VStack>
    </Box>
  );
}
