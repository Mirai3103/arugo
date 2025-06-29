import { SubmissionDetailPanel } from "@/components/features/solving/SubmissionDetailPanel";
import { trpc } from "@/libs/tanstack-query/root-provider";
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
        trpc.submission.getSubmissionById.queryOptions({ id: id || "" }),
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
  const query = useQuery(trpc.submission.getSubmissionById.queryOptions({ id: params.id || "" }));
  return <SubmissionDetailPanel submissionData={query.data!} />;
}
