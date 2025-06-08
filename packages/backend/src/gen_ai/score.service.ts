import db from "#/shared/db";
import { z } from "zod";
import { getModel } from "./model";
import { Eta } from "eta";
import { generateObject } from "ai";

const eta = new Eta({});
const model = await getModel();

const responseSchema = z.object({
	details: z.object({
		correctness: z
			.number()
			.int()
			.min(0)
			.max(100)
			.describe("Correctness score out of 100"),
		efficiency: z
			.number()
			.int()
			.min(0)
			.max(100)
			.describe("Efficiency score out of 100"),
		readability: z
			.number()
			.int()
			.min(0)
			.max(100)
			.describe("Readability score out of 100"),
		structure: z
			.number()
			.int()
			.min(0)
			.max(100)
			.describe("Structure score out of 100"),
		best_practices: z
			.number()
			.int()
			.min(0)
			.max(100)
			.describe("Best practices score out of 100"),
	}),
	summary: z.string().min(1).max(500).describe("Summary of the evaluation"),
});

type Response = z.infer<typeof responseSchema>;
const PROMPT_KET = "gen_ai_score_submission";
async function scoreSubmission(submissionId: string): Promise<Response> {
	const prompt = await db.query.genAiPrompts.findFirst({
		where: (genAiPrompts, { eq }) => eq(genAiPrompts.key, PROMPT_KET),
	});
	if (!prompt) {
		throw new Error(`this feature is not available yet`);
	}
	const submission = await db.query.submissions.findFirst({
		where: (submissions, { eq }) => eq(submissions.id, submissionId),
		with: {
			problem: true,
			language: true,
		},
	});
	if (!submission) {
		throw new Error(`Submission with id ${submissionId} not found`);
	}

	const promptText = eta.render(prompt.prompt, {
		submission,
	});

	const { object } = await generateObject({
		model,
		prompt: promptText,
		maxTokens: 1000,
		schema: responseSchema,
	});
    return object;
}
