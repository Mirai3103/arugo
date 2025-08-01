import * as TanstackQuery from "@/libs/query/tanstack-query/root-provider";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";
export function createRouter() {
  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: {
        ...TanstackQuery.getContext(),
      },
      defaultPreloadStaleTime: 0,
      defaultPreload: "intent",
      defaultErrorComponent: (err) => <p>{err.error.stack}</p>,
      defaultNotFoundComponent: () => <p>not found</p>,
      scrollRestoration: true,
      Wrap: (props: { children: React.ReactNode }) => {
        return (
          <TanstackQuery.Provider>{props.children}</TanstackQuery.Provider>
        );
      },
    }),
    TanstackQuery.getContext().queryClient,
  );

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
