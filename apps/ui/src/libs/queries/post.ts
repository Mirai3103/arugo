import { getPosts } from "@/server/transports/server-functions/post";
import type { GetPostQuerySchema } from "@repo/backend/posts/validations/index";
export function getAllPostsQueryOptions(query: GetPostQuerySchema) {
  return {
    queryKey: ["posts", query],
    queryFn: () => getPosts({ data: query }),
    experimental_prefetchInRender: true,
  };
}
