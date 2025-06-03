import { Prose } from "@/components/ui/prose";
import { DEFAULT_EXTENSIONS } from "@/libs/tiptap/extension";
import { generateHTML } from "@tiptap/html";
import React from "react";

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  const { problem } = Route.parentRoute.useLoaderData()
    const editorial = React.useMemo(() => {
      return generateHTML(
        (problem.description as JSON) ?? {},
        DEFAULT_EXTENSIONS
      );
    }, [problem.description]);
  return <Prose size={"lg"}>
							<div
								// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
								dangerouslySetInnerHTML={{
									__html: editorial,
								}}
							/>
						</Prose>
}
