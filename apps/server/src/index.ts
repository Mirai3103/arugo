import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { trpcRouter } from "@repo/backend/trpc/routers/index";
import { createTRPCContext } from "@repo/backend/trpc/trpc";
import type { AuthType } from "@repo/auth/server";
import { auth } from "@repo/auth/server";
import { cors } from "hono/cors";
import { initConsumer } from '@repo/backend/index'
initConsumer();
const app = new Hono<{ Variables: AuthType }>({
	strict: false,
});
// app.use('*',async (c, next) => {
//  const session = await auth.api.getSession({ headers: c.req.raw.headers });

//   	if (!session) {
//     	c.set("user", null);
//     	c.set("session", null);
//     	return next();
//   	}

//   	c.set("user", session.user);
//   	c.set("session", session.session);
//   	return next();
// })
app.use(
	"*", // or replace with "*" to enable cors for all routes
	cors({
		origin: "http://localhost:3000", // replace with your origin
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	})
);
app.use("*", (c, next) => {
  console.log("Request received:", c.req.method, c.req.url);
  return next();
});
app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return auth.handler(c.req.raw);
});
app.use(
	"/trpc/*",
	trpcServer({
		router: trpcRouter as any,
		createContext: async (c) => {
			const session = await auth.api.getSession({
				headers: c.req.headers,
			});
			return await createTRPCContext({ session });
		},
	})
);

export default {
	port: 8080,
	fetch: app.fetch,
};
