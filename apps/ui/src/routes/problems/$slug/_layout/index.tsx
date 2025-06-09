import { redirect } from "@tanstack/react-router";
export const Route = createFileRoute({
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
