import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { trpcClient } from "./trpc";
import type { TRPCRouter } from "@repo/backend/trpc/routers/index";
import { queryClient } from "./tanstack-query/root-provider";

export const trpc = createTRPCOptionsProxy<TRPCRouter>({
    client: trpcClient,
    queryClient,
  })
  export function getContext() {
    return {
      queryClient,
    };
  }