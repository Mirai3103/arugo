import { getAllPublishContests } from "@/server/transports/server-functions/contest";
import { ContestQuery } from "@repo/backend/contests/contests.service";
import stringify from "fast-json-stable-stringify";
export function getPublishContestQueryOptions(query: ContestQuery) {
  return {
    queryKey: ["contest", stringify(query)],
    queryFn: () => getAllPublishContests({ data: query }),
  };
}
