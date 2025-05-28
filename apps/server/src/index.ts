import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@repo/trpc";
import { auth, type AuthType } from "@repo/auth/server";
import { cors } from "hono/cors";
import { createTRPCContext } from "@repo/trpc/caller";
const app = new Hono<{ Variables: AuthType }>();


app.use(
	"/api/auth/*",
	cors({
		origin: "http://localhost:3000",
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	})
);

app.on(["POST", "GET"], "/auth/*", (c) => {
	return auth.handler(c.req.raw);
});
app.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	c.set("user", session.user);
	c.set("session", session.session);
	return next();
});

app.use(
	"/api/trpc/*",
	cors({
		origin: "*",
		allowMethods: ["*"],
		allowHeaders: ["*"],
	})
).use(
	"/api/trpc/*",
	trpcServer({
		endpoint: "/api/trpc",
		router: appRouter,
		createContext(opts, c) {
			return createTRPCContext({
				headers: c.req.raw.headers,
				auth: {
					user: c.get("user"),
					session: c.get("session"),
				},
			});
		},
	})
);
export type AppType = typeof app;
export default { port: 8080, fetch: app.fetch };
