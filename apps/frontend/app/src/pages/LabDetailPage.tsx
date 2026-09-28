import { Box, Button, Checkbox, Code, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import { api } from "../api/client";
import { NotebookRunner } from "../components/NotebookRunner";
import { LABS } from "../data/labs";
import { Lab01Reading } from "../data/readings/Lab01Reading";
import { Lab02Reading } from "../data/readings/Lab02Reading";
import { Lab03Reading } from "../data/readings/Lab03Reading";
import { Lab04Reading } from "../data/readings/Lab04Reading";
import { Lab05Reading } from "../data/readings/Lab05Reading";
import { Lab06Reading } from "../data/readings/Lab06Reading";
import { Lab07Reading } from "../data/readings/Lab07Reading";
import { Lab08Reading } from "../data/readings/Lab08Reading";
import { Lab09Reading } from "../data/readings/Lab09Reading";
import { Lab10Reading } from "../data/readings/Lab10Reading";
import { Lab11Reading } from "../data/readings/Lab11Reading";
import { Lab12Reading } from "../data/readings/Lab12Reading";
import { Lab13Reading } from "../data/readings/Lab13Reading";
import { Lab14Reading } from "../data/readings/Lab14Reading";
import { Lab15Reading } from "../data/readings/Lab15Reading";

const READINGS: Record<number, () => JSX.Element> = {
  1: Lab01Reading,
  2: Lab02Reading,
  3: Lab03Reading,
  4: Lab04Reading,
  5: Lab05Reading,
  6: Lab06Reading,
  7: Lab07Reading,
  8: Lab08Reading,
  9: Lab09Reading,
  10: Lab10Reading,
  11: Lab11Reading,
  12: Lab12Reading,
  13: Lab13Reading,
  14: Lab14Reading,
  15: Lab15Reading,
};

export function LabDetailPage() {
  const { labId } = useParams<{ labId: string }>();
  const navigate = useNavigate();
  const id = Number(labId);
  const lab = LABS.find((l) => l.id === id);
  const Reading = READINGS[id];

  const [done, setDone] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/labs`).then((response) => {
      const match = response.data.find((l: { id: number }) => l.id === id);
      if (match) {
        setDone(match.progress.done);
        setHintCount(match.progress.hint_count);
      }
    });
  }, [id]);

  async function toggleDone() {
    setSaving(true);
    try {
      const response = await api.patch(`/labs/${id}/progress`, { done: !done });
      setDone(response.data.done);
    } finally {
      setSaving(false);
    }
  }

  async function useHint() {
    const response = await api.patch(`/labs/${id}/progress`, { increment_hint: true });
    setHintCount(response.data.hint_count);
  }

  if (!lab || !Reading) {
    return (
      <Box maxW="2xl" mx="auto" mt={12} px={4}>
        <Text>Lab not found.</Text>
        <Button mt={4} onClick={() => navigate("/labs")}>
          Back to labs
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="4xl" mx="auto" mt={12} px={4} mb={16}>
      <Link as={RouterLink} to="/labs" color="blue.500">
        &larr; All labs
      </Link>

      <VStack align="stretch" spacing={6} mt={4}>
        <Text fontSize="sm" color="gray.500">
          Lab {lab.id} &middot; also available as a real file at <Code>{lab.coursePath}</Code>
        </Text>

        <Reading />

        <Box borderTopWidth="1px" pt={4}>
          <NotebookRunner labId={id} needsApiKey={lab.needsApiKey} />
        </Box>

        <Box borderTopWidth="1px" pt={4}>
          <HStack justify="space-between">
            <Checkbox isChecked={done} onChange={toggleDone} isDisabled={saving}>
              Mark this lab complete
            </Checkbox>
            <Button size="sm" variant="ghost" onClick={useHint}>
              I used a hint ({hintCount})
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
