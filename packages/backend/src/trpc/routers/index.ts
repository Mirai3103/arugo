// import { z } from 'zod'

import { createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { problemRouter } from "./problem";
import { tagRouter } from "./tag";
import { postRouter } from "./post";
import { contestRouter } from "./contest";
import { genAiRouter } from "./gen-ai";
import { submissionRouter } from "./submission";
import { topicRouter } from "./topic";

export const trpcRouter = createTRPCRouter({
	auth: authRouter,
	problem: problemRouter,
	tag: tagRouter,
	post: postRouter,
	contest: contestRouter,
	genAi: genAiRouter,
	submission: submissionRouter,
	topic: topicRouter,
});
export type TRPCRouter = typeof trpcRouter;
