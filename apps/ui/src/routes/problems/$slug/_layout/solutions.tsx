import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/problems/$slug/_layout/solutions')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/problems/$slug/_layout/solutions"!</div>;
}
