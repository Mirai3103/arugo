import { SubmissionTestcaseStatus } from "./enum";
import { z } from "zod";

export const languageSchema = z.object({
	id: z.string(),
	sourceFile: z.string(),
	binaryFile: z.string(),
	compileCommand: z.string(),
	runCommand: z.string(),
});
export const testCaseSchema = z.object({
	id: z.string(),
	input: z.string(),
	expectOutput: z.string(),
});

export const submissionSettingsSchema = z.object({
	withTrim: z.boolean(),
	withCaseSensitive: z.boolean(),
	withWhitespace: z.boolean(),
});

export const submissionExecutionRequestSchema = z.object({
	id: z.string(),
	language: languageSchema,
	code: z.string(),
	timeLimitInMs: z.number(),
	memoryLimitInKb: z.number(),
	testCases: z.array(testCaseSchema),
	settings: submissionSettingsSchema,
});
export const executionResultSchema = z.object({
	submissionId: z.string(),
	testCaseId: z.string(),
	status: z.nativeEnum(SubmissionTestcaseStatus),
	timeUsedInMs: z.number(),
	memoryUsedInKb: z.number(),
	output: z.string(),
	error: z.string(),
});

export type SubmissionExecutionRequest = z.infer<
	typeof submissionExecutionRequestSchema
>;
export type ExecutionResult = z.infer<typeof executionResultSchema>;
export type Language = z.infer<typeof languageSchema>;
export type TestCase = z.infer<typeof testCaseSchema>;
export type SubmissionSettings = z.infer<typeof submissionSettingsSchema>;
