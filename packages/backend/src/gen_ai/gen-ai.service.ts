import db from "#/shared/db";
import { submissions as submissionTable } from "#/shared/db/schema";
import { z } from "zod";
import { LLM_REGISTRY } from "./registry";
import { Eta } from "eta";
import { generateObject, generateText, streamText } from "ai";
import { env } from "@repo/env";
import { generateMarkdownFromJSON } from "@repo/tiptap";
import { eq } from "drizzle-orm";

const eta = new Eta({});
export enum GEN_AI_PROMPT_KEYS {
  SCORE_SUBMISSION = "gen_ai_score_submission",
  REVIEW_CODE = "gen_ai_review_code",
}

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
  summary: z
    .string()
    .min(1)
    .max(500)
    .describe(
      "Đánh giá tổng quan về các tiêu chí trên tối đa 500 ký tự bằng tiếng việt",
    ),
});

type Response = z.infer<typeof responseSchema>;
export async function scoreSubmission(submissionId: string): Promise<Response> {
  const prompt = await db.query.genAiPrompts.findFirst({
    where: (genAiPrompts, { eq }) =>
      eq(genAiPrompts.key, GEN_AI_PROMPT_KEYS.SCORE_SUBMISSION),
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
  if (submission?.isTest) {
    return {
      details: {
        correctness: 0,
        efficiency: 0,
        readability: 0,
        structure: 0,
        best_practices: 0,
      },
      summary: "Đây là bài test, điểm số được mặc định là 0.",
    }
  }
  if (submission?.aiScore) {
    return submission.aiScore as any;
  }


  if (!submission) {
    throw new Error(`Submission with id ${submissionId} not found`);
  }
  (submission.problem.statement as any) = generateMarkdownFromJSON(
    submission.problem.statement,
  );
  const promptText = eta.compile(prompt.prompt, {});

  const { object, usage, request } = await generateObject({
    model: LLM_REGISTRY.languageModel(
      (env.GEN_AI_PROVIDER + " > " + env.GEN_AI_MODEL) as any,
    ),
    prompt: eta.render(promptText, {
      submission,
    }) + "user code pass ratio: " + submission.passRatio + "%",
    maxTokens: 1000,
    schema: responseSchema,
  });

  await db
    .update(submissionTable)
    .set({
      aiScore: {
        correctness: object.details.correctness,
        efficiency: object.details.efficiency,
        readability: object.details.readability,
        structure: object.details.structure,
        best_practices: object.details.best_practices,
        summary: object.summary,
      },
    })
    .where(eq(submissionTable.id, submissionId));
  return object;
}
type AsyncIterableStream<T> = AsyncIterable<T> & ReadableStream<T>;
type GenAiMode = 'block' | 'stream';

export function getSubmissionReview(
  submissionId: string,
  mode: 'block'
): Promise<string>;

export function getSubmissionReview(
  submissionId: string,
  mode: 'stream'
): Promise<AsyncIterableStream<string>>;
export async function getSubmissionReview(
  submissionId: string,
  mode: GenAiMode = 'block'
): Promise<string|AsyncIterableStream<string>> {
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
  const prompt = await db.query.genAiPrompts.findFirst({
    where: (genAiPrompts, { eq }) =>
      eq(genAiPrompts.key, GEN_AI_PROMPT_KEYS.REVIEW_CODE),
  });
  if (!prompt) {
    throw new Error(`this feature is not available yet`);
  }
  (submission.problem.statement as any) = generateMarkdownFromJSON(
    submission.problem.statement,
  );
  const promptText = eta.compile(prompt.prompt, {});
  if (mode === 'stream') {
    const { textStream } = streamText({
      model: LLM_REGISTRY.languageModel(
        (env.GEN_AI_PROVIDER + " > " + env.GEN_AI_MODEL) as any,
      ),
      prompt: eta.render(promptText, {
        submission,
      }),
    });
    return textStream;
  }
  const { text } = await generateText({
    model: LLM_REGISTRY.languageModel(
      (env.GEN_AI_PROVIDER + " > " + env.GEN_AI_MODEL) as any,
    ),
    prompt: eta.render(promptText, {
      submission,
    }),
  });


  return text; // markdown
}
