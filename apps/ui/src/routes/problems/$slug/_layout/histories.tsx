import { createFileRoute } from "@tanstack/react-router"
import SubmissionHistory from "@/components/features/solving/SubmissionHistory";

export const Route = createFileRoute("/problems/$slug/_layout/histories")({
  component: RouteComponent,
});

function RouteComponent() {
  const { problem } = Route.parentRoute.useLoaderData();
  const navigate = Route.useNavigate();
  return (
    <SubmissionHistory
      problemId={problem!.id!}
      onSubmissionClick={(submissionId) => {
        navigate({
          to: "/problems/$slug/submissions/$id",
          params: { slug: problem!.slug, id: submissionId },
        });
      }}
    />
  );
}
