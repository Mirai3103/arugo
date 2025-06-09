import { getSession } from "@/libs/auth/client";
import { createServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";

export const getServerSession = createServerFn({
  method: "GET",
}).handler(async () => {
  const headers = getHeaders();
  const session = await getSession({
    fetchOptions: {
      headers: headers as HeadersInit,
    },
  });
  return session;
});
