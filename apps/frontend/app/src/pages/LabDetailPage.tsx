import { Badge, Box, Button, Flex, HStack, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import { api } from "../api/client";
import { LabNav, LabSidebar, useLabOutline } from "../components/LabSidebar";
import { MobileNav, StickyHeader } from "../components/MobileNav";
import { NotebookRunner } from "../components/NotebookRunner";
import { ReviewModal, type ReviewTarget } from "../components/ReviewModal";
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

  const readingRef = useRef<HTMLDivElement>(null);
  const notebookRef = useRef<HTMLDivElement>(null);
  const outline = useLabOutline(readingRef, notebookRef);
  const [reviewing, setReviewing] = useState<ReviewTarget | null>(null);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState<{ earned: number; possible: number; percent: number } | null>(null);

  // Completion is earned, not ticked: the server sets it once every graded item in the lab passes.
  const refresh = useCallback(() => {
    api.get(`/labs`).then((response) => {
      const match = response.data.find((l: { id: number }) => l.id === id);
      if (match) {
        setDone(match.progress.done);
      }
    });
    api.get(`/labs/scores`).then((response) => {
      setScore(response.data.labs.find((l: { lab_id: number }) => l.lab_id === id) ?? null);
    });
  }, [id]);

  useEffect(refresh, [refresh]);

  useEffect(() => {
    window.addEventListener("lab-progress", refresh);
    return () => window.removeEventListener("lab-progress", refresh);
  }, [refresh]);

  const openReview = (topic: string) => lab && setReviewing({ labId: lab.id, labTitle: lab.title, topic });

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
    <Flex maxW="6xl" mx="auto" mt={{ base: 6, md: 12 }} px={{ base: 3, md: 4 }} mb={16} gap={8}>
      <LabSidebar outline={outline} onReview={openReview} />
      <Box flex="1" minW={0} maxW="4xl">
      <StickyHeader hideFrom="lg">
        <HStack minW={0} spacing={3}>
          <MobileNav title="Lab sections" hideFrom="lg">
            {(close) => <LabNav outline={outline} onNavigate={close} onReview={openReview} />}
          </MobileNav>
          <Link as={RouterLink} to="/labs" color="blue.500">
            &larr; All labs
          </Link>
        </HStack>
      </StickyHeader>

      <VStack align="stretch" spacing={6}>
        <Box ref={readingRef}>
          <Reading />
        </Box>

        <Box ref={notebookRef} borderTopWidth="1px" pt={4}>
          <NotebookRunner labId={id} needsApiKey={lab.needsApiKey} onProgress={refresh} />
        </Box>

        <Box borderTopWidth="1px" pt={4}>
          <Stack direction={{ base: "column", sm: "row" }} justify="space-between" spacing={2}>
            {done ? (
              <Badge colorScheme="green" fontSize="sm" px={2} py={1} alignSelf="start">
                Lab complete
              </Badge>
            ) : (
              <Text fontSize="sm" color="gray.500">
                Pass every exercise and the project to complete this lab.
              </Text>
            )}
            {score && (
              <Text fontSize="sm" color="gray.500">
                Score: {score.earned}/{score.possible} points ({score.percent}%)
              </Text>
            )}
          </Stack>
        </Box>
      </VStack>
      </Box>
      <ReviewModal target={reviewing} onClose={() => setReviewing(null)} />
    </Flex>
  );
}
