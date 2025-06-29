import type { TRPCRouter } from "@repo/backend/trpc/routers/index";
import { env } from "@repo/env";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";
export const { TRPCProvider, useTRPC, useTRPCClient } =
	createTRPCContext<TRPCRouter>();
export const trpcCreateOptions = {
	links: [
		httpBatchLink({
			url: env.VITE_SERVER_URL + "/trpc",
			transformer: superjson,
			fetch: (input, init) =>
				fetch(input, { ...init, credentials: "include" } as any),
		}),
	],
}
export const trpcClient = createTRPCClient<TRPCRouter>(trpcCreateOptions);
