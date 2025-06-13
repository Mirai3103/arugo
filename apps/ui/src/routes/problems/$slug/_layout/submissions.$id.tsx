import { SubmissionDetailPanel } from "@/components/features/solving/SubmissionDetailPanel";
import { getSubmissionByIdQueryOptions } from "@/libs/queries/submission";
import { useQuery } from "@tanstack/react-query";
import { redirect, createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/problems/$slug/_layout/submissions/$id")(
  {
    loader: async ({ params, context: { queryClient }, route }) => {
      const { id } = params;
      if (!id) {
        throw redirect({
          to: "/problems/$slug/histories",
          params: {
            slug: params.slug || "",
          },
        });
      }
      const res = await queryClient.ensureQueryData(
        getSubmissionByIdQueryOptions(id || ""),
      );
      if (!res) {
        throw redirect({
          to: "/problems/$slug/histories",
          params: {
            slug: params.slug || "",
          },
        });
      }
    },
    component: RouteComponent,
  },
);

function RouteComponent() {
  const params = Route.useParams();
  const query = useQuery(getSubmissionByIdQueryOptions(params.id || ""));
  return <SubmissionDetailPanel submissionData={query.data!} />;
}
