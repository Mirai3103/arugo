// import { z } from 'zod'

import { createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { problemRouter } from "./problem";
import { tagRouter } from "./tag";

export const trpcRouter = createTRPCRouter({
	auth: authRouter,
	problem: problemRouter,
	tag: tagRouter,
});
export type TRPCRouter = typeof trpcRouter;
