import { createTRPCClient, httpBatchStreamLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '@repo/trpc';
import { env } from '@repo/env';
import SuperJSON from 'superjson';
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
         loggerLink({
           enabled: (op) =>
             process.env.NODE_ENV === "development" ||
             (op.direction === "down" && op.result instanceof Error),
         }),
         httpBatchStreamLink({
           transformer: SuperJSON,
           url: getBaseUrl() + "/api/trpc",
           headers: () => ({
             "x-trpc-source": "rsc",
           }),
         }),
       ],
});
function getBaseUrl() {

  return env.PUBLIC_SERVER_URL
}
