// export default {
//   schema: './src/server/db/schema/*.ts',
//   out: './src/server/db/migrations',
//   driver: 'pg',
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/leetcode_clone',
//   },
// } satisfies Config;

import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./src/shared/db/migrations",
	dialect: "postgresql",
	schema: "./src/shared/db/schema/index.ts",

	dbCredentials: {
		url: process.env.DATABASE_URL || "postgres://localhost:5432/leetcode_clone",
	},
	schemaFilter: "public",
	tablesFilter: "*",
	introspect: {
		casing: "camel",
	},
	migrations: {
		prefix: "timestamp",
		table: "__drizzle_migrations__",
		schema: "public",
	},
	breakpoints: true,
	strict: true,
	verbose: true,
});
