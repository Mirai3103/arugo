import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createTRPCContext } from "@repo/trpc/caller";
import { createQueryClient } from "./query-client";
import { createCaller, type AppRouter } from "@repo/trpc";



const createContext = cache(async () => {
//   const heads = new Headers(await headers());
//   heads.set("x-trpc-source", "rsc");

  return createTRPCContext();
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext)

export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
);


