import { Badge, Box, Button, HStack, Textarea, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { api } from "../api/client";
import { CellOutput, RunResult } from "./NotebookRunner";

export function RunnableExample({ labId, code }: { labId: number; code: string }) {
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

  return (
    <Box borderWidth="1px" borderRadius="md" p={3} bg="gray.50" _dark={{ bg: "gray.700" }}>
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <Badge colorScheme="gray">Run it</Badge>
          <Button size="xs" onClick={run} isLoading={running}>
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
      </VStack>
    </Box>
  );
}
