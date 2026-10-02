import { Badge, Box, Button, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";

import { api } from "../api/client";
import type { Resource } from "../api/resourceManagement";
import { ResourceRenderer } from "../components/resources/ResourceRenderer";
import { CourseNav, CourseSidebar } from "../components/CourseSidebar";
import { MobileNav, StickyHeader } from "../components/MobileNav";
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
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Week 1 is the static lab list; later weeks exist only once an admin has released a resource.
  const weeks = [1, ...new Set(resources.map((r) => r.week))].sort((a, b) => a - b);
  const doneIds = new Set(
    Object.entries(progressById)
      .filter(([, p]) => p.done)
      .map(([id]) => Number(id)),
  );
  const requestedWeek = Number(searchParams.get("week")) || 1;
  const week = weeks.includes(requestedWeek) ? requestedWeek : 1;

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
    api
      .get<Resource[]>("/resources")
      .then((response) => setResources(response.data))
      .catch(() => {
        // weekly resources are optional on this page
      });
  }, []);

  function selectWeek(w: number) {
    setSearchParams(w === 1 ? {} : { week: String(w) });
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Flex maxW="5xl" mx="auto" my={{ base: 6, md: 12 }} px={{ base: 3, md: 4 }} gap={8}>
      <CourseSidebar
        weeks={weeks}
        active={week}
        labs={LABS}
        doneIds={doneIds}
        onSelectWeek={selectWeek}
      />
      <Box flex="1" minW={0} maxW="2xl">
      <StickyHeader>
        <HStack minW={0} spacing={3}>
          <MobileNav title="Course navigation">
            {(close) => (
              <CourseNav
                weeks={weeks}
                active={week}
                labs={LABS}
                doneIds={doneIds}
                onSelectWeek={selectWeek}
                onNavigate={close}
              />
            )}
          </MobileNav>
          <Heading size={{ base: "sm", md: "lg" }} minW={0}>
            LLM Foundations Course
          </Heading>
        </HStack>
        <Button size="sm" variant="outline" flexShrink={0} onClick={handleLogout}>
          Log out
        </Button>
      </StickyHeader>

      {week !== 1 &&
        resources
          .filter((r) => r.week === week)
          .map((r) => (
            <Box key={r.id} mb={8}>
              <Heading size={{ base: "sm", md: "md" }}>{r.title}</Heading>
              {r.summary && (
                <Text color="gray.600" _dark={{ color: "gray.300" }} mb={3}>
                  {r.summary}
                </Text>
              )}
              <ResourceRenderer
                blocks={r.blocks}
                run={(source) => api.post(`/resources/${r.id}/run`, { source }).then((res) => res.data)}
              />
            </Box>
          ))}

      {week === 1 && score && (
        <Box mb={6} p={4} borderWidth="1px" borderRadius="md">
          <Text fontWeight="bold">
            Course score: {score.percent}% ({score.earned}/{score.possible} points)
          </Text>
          <Text fontSize="xs" color="gray.500">
            Python exercises 5 pts &middot; LLM exercises 10 pts &middot; projects 20 pts. Hints are free.
          </Text>
        </Box>
      )}

      {week === 1 && (
      <VStack align="stretch" spacing={3}>
        {LABS.map((lab) => {
          const done = progressById[lab.id]?.done ?? false;
          const labScore = score?.labs.find((l) => l.lab_id === lab.id);
          const content = (
            <HStack justify="space-between" align="start" spacing={3}>
              <Box minW={0}>
                <Text fontWeight="bold">
                  {lab.id}. {lab.title}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {lab.summary}
                </Text>
              </Box>
              <VStack spacing={1} align="end" flexShrink={0}>
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
      )}
      </Box>
    </Flex>
  );
}
