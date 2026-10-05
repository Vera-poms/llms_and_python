import { api } from "./client";

// `topic` is the outline heading being reviewed; "" reviews the lab as a whole.
export const submitReview = (review: { lab_id: number; topic: string; rating: number; comment: string }) =>
  api.post("/reviews", review);
