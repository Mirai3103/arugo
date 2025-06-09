import { createAuthClient } from "better-auth/react";
import { env } from "@repo/env";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.VITE_SERVER_URL,
  redirectTo: "/home",
});

export const { signIn, signUp, useSession, linkSocial, signOut, getSession } =
  createAuthClient();
