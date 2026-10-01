import { Badge, Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { LABS } from "../data/labs";

interface LabApiResult {
  id: number;
  title: string;
  progress: { done: boolean; hint_count: number };
}

interface ScoreApiResult {
  earned: number;
  possible: number;
  percent: number;
  labs: { lab_id: number; earned: number; possible: number; percent: number }[];
}

export function LabListPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [progressById, setProgressById] = useState<Record<number, LabApiResult["progress"]>>({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<ScoreApiResult | null>(null);

  useEffect(() => {
    api
      .get<LabApiResult[]>("/labs")
      .then((response) => {
        const byId: Record<number, LabApiResult["progress"]> = {};
        for (const lab of response.data) {
          byId[lab.id] = lab.progress;
        }
        setProgressById(byId);
      })
      .finally(() => setLoading(false));
    api
      .get<ScoreApiResult>("/labs/scores")
      .then((response) => setScore(response.data))
      .catch(() => {
        // scores are optional on this page
      });
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Box maxW="2xl" mx="auto" my={12} px={4}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">LLM Foundations Course</Heading>
        <Button size="sm" variant="outline" onClick={handleLogout}>
          Log out
        </Button>
      </HStack>

      {score && (
        <Box mb={6} p={4} borderWidth="1px" borderRadius="md">
          <Text fontWeight="bold">
            Course score: {score.percent}% ({score.earned}/{score.possible} points)
          </Text>
          <Text fontSize="xs" color="gray.500">
            Python exercises 5 pts &middot; LLM exercises 10 pts &middot; projects 20 pts. Hints are free.
          </Text>
        </Box>
      )}

      <VStack align="stretch" spacing={3}>
        {LABS.map((lab) => {
          const done = progressById[lab.id]?.done ?? false;
          const labScore = score?.labs.find((l) => l.lab_id === lab.id);
          const content = (
            <HStack justify="space-between">
              <Box>
                <Text fontWeight="bold">
                  {lab.id}. {lab.title}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {lab.summary}
                </Text>
              </Box>
              <VStack spacing={1} align="end">
                {labScore && <Badge colorScheme="teal">{labScore.percent}%</Badge>}
                {!loading && done && <Badge colorScheme="green">Done</Badge>}
              </VStack>
            </HStack>
          );

          return lab.hasContent ? (
            <Box
              key={lab.id}
              as={RouterLink}
              to={`/labs/${lab.id}`}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              _hover={{ borderColor: "blue.400" }}
            >
              {content}
            </Box>
          ) : (
            <Box key={lab.id} p={4} borderWidth="1px" borderRadius="md" opacity={0.5}>
              {content}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
