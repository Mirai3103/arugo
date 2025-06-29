import { getSession } from "@/libs/auth/client";
import { createMiddleware } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await getSession({
      fetchOptions: {
        headers: getHeaders() as HeadersInit,
      },
    });
    return await next({
      context: {
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email,
            }
          : null,
      },
    });
  },
);

export const requireAuthMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    const { user } = context;
    if (!user) throw new Error("Unauthorized");
    return await next({
      context,
    });
  });
