import { auth } from "@repo/auth/server";
import { createServerFileRoute } from "@tanstack/react-start/server";



export const ServerRoute = createServerFileRoute().methods({
  GET: ({ request }) => {
    return auth.handler(request)
  },
  POST: ({ request }) => {
    return auth.handler(request)
  },
})

