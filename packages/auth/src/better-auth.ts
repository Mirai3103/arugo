import { env } from "@repo/env";
import * as schema from "@repo/backend/schema";
import { db } from "@repo/backend/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
	//...
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg", // or "mysql", "postgresql", ...etc
		schema: {
			...schema,
		},
		usePlural: true,
	}),
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 10 * 60,
		},
	}
});

export type AuthType = {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
}