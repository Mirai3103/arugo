import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_home/contests/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_home/contests/$id"!</div>;
}
