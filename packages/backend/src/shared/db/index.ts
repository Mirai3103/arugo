import { env } from "@repo/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import kleur from "kleur";
// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(env.DATABASE_URL, { prepare: false });
export const db = drizzle(client, {
  logger: {
    logQuery: (query, params) => {
      console.log(
        `${kleur.gray(`[${new Date().toISOString()}]`)} ${kleur.green("Executing")} ${kleur.yellow(query)} ${kleur.cyan(`[${params.join(", ")}]`)}`,
      );
    },
  },
  schema: {
    ...schema,
  },
});
export default db;

// import { env } from "@repo/env";
// import kleur from "kleur";
// import { drizzle } from "drizzle-orm/bun-sqlite";
// import * as schema from "./schema";
// export const db = drizzle(env.DATABASE_URL, {
// 	logger: {
// 		logQuery: (query, params) => {
// 			console.log(
// 				`${kleur.gray(`[${new Date().toISOString()}]`)} ${kleur.green("Executing")} ${kleur.yellow(query)} ${kleur.cyan(`[${params.join(", ")}]`)}`,
// 			);
// 		},
// 	},
// 	schema: {
// 		...schema,
// 	},
// });
// export default db;
