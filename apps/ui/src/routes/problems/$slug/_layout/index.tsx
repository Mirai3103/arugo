import { redirect, createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/problems/$slug/_layout/")({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: "/problems/$slug/description",
      params: { slug: params.slug },
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return null;
}
