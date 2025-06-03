export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/problems/$slug/_layout/submissions/$id"!</div>
}
