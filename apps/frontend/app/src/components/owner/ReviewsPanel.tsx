import { Badge, Box, HStack, Select, Stack, Text, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import { errorMessage, listReviews, type Review } from "../../api/ownerEndpoints";

function Stars({ rating }: { rating: number }) {
  return (
    <Text as="span" color="yellow.400" flexShrink={0} aria-label={`${rating} out of 5`}>
      {"★".repeat(rating)}
      <Text as="span" color="gray.300">
        {"★".repeat(5 - rating)}
      </Text>
    </Text>
  );
}

export function ReviewsPanel() {
  const toast = useToast();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [labId, setLabId] = useState("");

  useEffect(() => {
    listReviews()
      .then(setReviews)
      .catch((e) => toast({ status: "error", title: errorMessage(e, "Could not load reviews.") }));
  }, [toast]);

  const labs = useMemo(() => {
    const seen = new Map<number, string>();
    reviews?.forEach((r) => seen.set(r.lab_id, r.lab_title));
    return [...seen].sort((a, b) => a[0] - b[0]);
  }, [reviews]);

  if (reviews === null) return <Text color="gray.500">Loading reviews…</Text>;

  const shown = reviews.filter((r) => !labId || r.lab_id === Number(labId));
  const average = shown.length ? (shown.reduce((sum, r) => sum + r.rating, 0) / shown.length).toFixed(1) : null;

  return (
    <VStack align="stretch" spacing={4}>
      <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ sm: "center" }}>
        <Text color="gray.600">
          {shown.length} review{shown.length === 1 ? "" : "s"}
          {average && ` · average ${average}/5`}
        </Text>
        <Select size="sm" maxW="xs" value={labId} onChange={(e) => setLabId(e.target.value)} aria-label="Filter by lab">
          <option value="">All labs</option>
          {labs.map(([id, title]) => (
            <option key={id} value={id}>
              Lab {id}: {title}
            </option>
          ))}
        </Select>
      </Stack>
      {shown.length === 0 && <Text color="gray.500">No reviews yet.</Text>}
      {shown.map((r) => (
        <Box key={r.id} borderWidth="1px" borderRadius="md" p={3}>
          <HStack justify="space-between" align="start" spacing={3}>
            <Box minW={0}>
              <Text fontWeight="semibold" noOfLines={2}>
                Lab {r.lab_id}: {r.lab_title}
              </Text>
              <Badge colorScheme={r.topic ? "purple" : "blue"} whiteSpace="normal">
                {r.topic || "Whole lab"}
              </Badge>
            </Box>
            <Stars rating={r.rating} />
          </HStack>
          {r.comment && (
            <Text mt={2} whiteSpace="pre-wrap">
              {r.comment}
            </Text>
          )}
          <Text mt={2} fontSize="xs" color="gray.500">
            {r.user_email} · {new Date(r.updated_at).toLocaleString()}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
