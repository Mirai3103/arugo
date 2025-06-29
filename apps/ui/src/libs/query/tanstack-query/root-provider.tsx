import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from 'react';
import { TRPCProvider, trpcClient as libClient, trpcClient } from '@/libs/query/trpc';
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { TRPCRouter } from "@repo/backend/trpc/routers/index";
import superjson from "superjson";
export const queryClient = new QueryClient({
  
  queryCache: new QueryCache()

});

export function getContext() {
  return {
    queryClient,
  };
}


export function Provider({ children }: { children: React.ReactNode }) {
  const [trpcClient] = useState(() =>
    libClient
  );
  return (
    <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
