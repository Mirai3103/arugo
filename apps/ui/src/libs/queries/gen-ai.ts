import { getAiReview } from "@/server/transports/server-functions/gen-ai";
export function getAiReviewQueryOptions(submissionId: string) {
  return {
    queryKey: ["ai-review", submissionId],
    queryFn: () => getAiReview({ data: { submissionId } }),
  };
}
