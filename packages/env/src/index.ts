import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
export const env = createEnv({
	server: {
		SERVER_URL: z.string().url().default("http://localhost:8080"),
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_URL: z.string().url(),
		BETTER_AUTH_SECRET: z.string().min(1),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		GEMINI_API_KEY: z.string().min(1).optional(),
		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),
		NATS_SERVER_URL: z.string().url(),
	},
	client: {
		PUBLIC_SERVER_URL: z.string().url().default("http://localhost:8080"),
	},
	/**
	 * The prefix that client-side variables must have. This is enforced both at
	 * a type-level and at runtime.
	 */
	clientPrefix: "PUBLIC_",

	// client: {
	// 	VITE_APP_TITLE: z.string().min(1).optional(),
	// },

	/**
	 * What object holds the environment variables at runtime. This is usually
	 * `process.env` or `import.meta.env`.
	 */

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	runtimeEnv: process.env as any,

	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 *
	 * In order to solve these issues, we recommend that all new projects
	 * explicitly specify this option as true.
	 */
	emptyStringAsUndefined: true,
});