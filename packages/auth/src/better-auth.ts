import { env } from "@repo/env";
import * as schema from "@repo/backend/schema";
import { db } from "@repo/backend/db";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

export const auth = betterAuth({
  //...
  emailAndPassword: {
    enabled: true,
    requireEmailVerification:false, // for development
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
  database: (options: BetterAuthOptions) => {
    const adapter = drizzleAdapter(db, {
      provider: "pg", // or "mysql", "postgresql", ...etc
      schema: {
        ...schema,
      },
      usePlural: true,
    })(options)
    return adapter;
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60,
    },
  },
  baseURL: env.VITE_SERVER_URL,
  trustedOrigins: [env.VITE_SERVER_URL, "http://localhost:3000"],
  plugins: [reactStartCookies()],
  user: {
    additionalFields: {
      username: {
        type: "string",
        input: true,
        unique: true,
      }
    }
  }
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
