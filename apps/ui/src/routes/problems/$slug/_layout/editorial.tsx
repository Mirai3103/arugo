import { createFileRoute } from "@tanstack/react-router"
import { Prose } from "@/components/ui/prose";

import { generateHTMLFromJSON } from "@repo/tiptap";

import React from "react";

export const Route = createFileRoute("/problems/$slug/_layout/editorial")({
  component: RouteComponent,
});

function RouteComponent() {
  const { problem } = Route.parentRoute.useLoaderData();
  const editorial = React.useMemo(() => {
    return generateHTMLFromJSON((problem.description as JSON) ?? {});
  }, [problem.description]);
  return (
    <Prose size={"lg"}>
      <div
        dangerouslySetInnerHTML={{
          __html: editorial,
        }}
      />
    </Prose>
  );
}
