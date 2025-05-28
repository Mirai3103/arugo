"use client";

import { trpcHooks } from "../lib/trpc/client";

export default function A() {
  const getTingQuery = trpcHooks.problem.hello.useQuery({
    text: "hello",
  })
  return (
    <div>a</div>
  )
}
