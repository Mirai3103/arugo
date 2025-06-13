import { Provider } from "@/components/ui/provider";
import TanstackQueryLayout from "@/libs/tanstack-query/layout";
import NotFoundPage from "@/components/common/NotFoundPage";
import ErrorPage from "@/components/common/ErrorPage";
import PendingPage from "@/components/common/PendingPage";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/vi";
import dayjs from "dayjs";
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.locale("vi");

import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type { ReactNode } from "react";
interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} resetError={reset} />
  ),
  pendingComponent: PendingPage,
});

function RootComponent() {
  return (
    <RootDocument>
      <Provider>
        <Outlet />
        <TanStackRouterDevtools />

        <TanstackQueryLayout />
      </Provider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning={false}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono&display=swap"
          rel="stylesheet"
        />
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        ></script>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
