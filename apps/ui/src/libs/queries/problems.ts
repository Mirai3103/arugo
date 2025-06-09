import {
  getAllProblems,
  getProblemBySlug,
} from "@/server/transports/server-functions/problem";
import type { ProblemQuerySchema } from "@/validations/problem";
export function getAllProblemsQueryOptions(query: ProblemQuerySchema) {
  return {
    queryKey: ["problems", query],
    queryFn: () =>
      getAllProblems({
        data: query,
      }),
    experimental_prefetchInRender: true,
  };
}

export function getProblemBySlugQueryOptions(slug: string) {
  return {
    queryKey: ["problem", slug],
    queryFn: () =>
      getProblemBySlug({
        data: { slug },
      }),
  };
}
