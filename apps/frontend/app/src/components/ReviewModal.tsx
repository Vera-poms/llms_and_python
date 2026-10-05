import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { submitReview } from "../api/reviews";
import { errorMessage } from "../api/userManagement";

export interface ReviewTarget {
  labId: number;
  labTitle: string;
  // "" reviews the whole lab; otherwise the topic/sub-topic heading.
  topic: string;
}

export function ReviewModal({ target, onClose }: { target: ReviewTarget | null; onClose: () => void }) {
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (target) {
      setRating(0);
      setComment("");
    }
  }, [target]);

  async function submit() {
    if (!target || rating === 0) return;
    setSaving(true);
    try {
      await submitReview({ lab_id: target.labId, topic: target.topic, rating, comment });
      toast({ status: "success", title: "Thanks for your review!" });
      onClose();
    } catch (e) {
      toast({ status: "error", title: errorMessage(e, "Could not send your review.") });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={target !== null} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx={3}>
        <ModalHeader pr={10}>
          {target?.topic ? "Review this topic" : "Review this lab"}
          <Text fontSize="sm" fontWeight="normal" color="gray.500" noOfLines={2}>
            {target?.topic || target?.labTitle}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack spacing={1} mb={3} role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <Box
                key={n}
                as="button"
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                fontSize="3xl"
                lineHeight={1}
                color={n <= rating ? "yellow.400" : "gray.300"}
                onClick={() => setRating(n)}
              >
                ★
              </Box>
            ))}
          </HStack>
          <Textarea
            placeholder="What worked, what was confusing? (optional)"
            value={comment}
            maxLength={2000}
            rows={5}
            onChange={(e) => setComment(e.target.value)}
          />
          <Text fontSize="xs" color="gray.500" mt={2}>
            Only the course owner can see your review.
          </Text>
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" isDisabled={rating === 0} isLoading={saving} onClick={submit}>
            Send review
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
