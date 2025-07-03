import { createAuthClient } from "better-auth/react";
import { env } from "@repo/env";
import { inferAdditionalFields } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.VITE_SERVER_URL,
  redirectTo: "/home",
  plugins: [inferAdditionalFields({
    user:{
      username:{
        type:"string",
        input:true,
        unique:true,
      }
    }
  })],
});

export const { signIn, signUp, useSession, linkSocial, signOut, getSession } =
  authClient
