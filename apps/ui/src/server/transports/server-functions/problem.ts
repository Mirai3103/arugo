import problemService from "@repo/backend/problems/problemService";
import { problemQuerySchema } from "@repo/backend/problems/validations/problem";
import { createServerFn } from "@tanstack/react-start";

import { z } from "zod";
export const getAllProblems = createServerFn({
	method: "GET",
})
	.validator(problemQuerySchema)
	.handler(async ({ data }) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return problemService.getAllProblems(data);
	});

export const getProblemBySlug = createServerFn({
	method: "GET",
})
	.validator(z.object({ slug: z.string() }))
	.handler(async ({ data }) => {
		const res = await problemService.getProblemBySlug(data.slug);
		return {
			...res,
		};
	});
