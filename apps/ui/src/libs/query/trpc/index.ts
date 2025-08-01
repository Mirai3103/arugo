import type { TRPCRouter } from "@repo/backend/trpc/routers/index";
import { env } from "@repo/env";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";

import superjson from "superjson";
import {
	httpLink,
	isNonJsonSerializable,
	loggerLink,
	splitLink,
} from "@trpc/client";
import { createIsomorphicFn, createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'
export const { TRPCProvider, useTRPC, useTRPCClient } =
	createTRPCContext<TRPCRouter>();
const getRequestHandler = createServerFn({
	method: "GET"
}).
	handler(async () => {
		const request = getWebRequest();
		const headers = new Headers(request.headers);
		return Object.fromEntries(headers);
	});

const headers = createIsomorphicFn().client(() => ({}))
	.server(getRequestHandler)




export const trpcCreateOptions = {
	links: [
		loggerLink({
			enabled: op =>
				 (op.direction === "down" && op.result instanceof Error),
		}),
		splitLink({
			condition: op => isNonJsonSerializable(op.input),
			true: httpLink({
				url: env.VITE_SERVER_URL + "/trpc",
				fetch(url, options) {
					return fetch(url, {
						...options,
						credentials: "include",
					} as any);
				},
				headers,
			}),
			false: httpBatchLink({
				url: env.VITE_SERVER_URL + "/trpc",
				headers,
				fetch(url, options) {
					return fetch(url, {
						...options,
						credentials: "include",
					} as any);
				},
			}),
		}),
	],
}
export const trpcClient = createTRPCClient<TRPCRouter>(trpcCreateOptions);
