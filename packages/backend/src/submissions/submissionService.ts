import { scoreSubmission } from "#/gen_ai/gen-ai.service";
import { EVENT_TYPES } from "#/shared/constants/event-types";
import db from "#/shared/db";
import {
  type SubmissionTestcase,
  submissionTestcases,
  submissions,
} from "#/shared/db/schema";
import { natsClient } from "#/shared/nats/nats-client";
import { SubmissionStatus, SubmissionTestcaseStatus } from "./validations/enum";
import type { ExecutionResult } from "./validations/executionSchema";
import type { CreateSubmission } from "./validations/submission";
import { and, eq, sql } from "drizzle-orm";
import { v4 as uuid } from "uuid";

const FAILED_STATUSES = [
  SubmissionTestcaseStatus.CompileError,
  SubmissionTestcaseStatus.MemoryLimitExceeded,
  SubmissionTestcaseStatus.RuntimeError,
  SubmissionTestcaseStatus.TimeLimitExceeded,
  SubmissionTestcaseStatus.WrongAnswer,
];

function calculateSubmissionStatus(
  testcases: SubmissionTestcase[],
): SubmissionStatus {
  const failedTestcases = testcases.filter((tc) =>
    FAILED_STATUSES.includes(tc.status as SubmissionTestcaseStatus),
  );
  if (failedTestcases.length > 0) return SubmissionStatus.Failed;

  const pendingTestcases = testcases.filter(
    (tc) => tc.status === SubmissionTestcaseStatus.Running,
  );
  if (pendingTestcases.length > 0) return SubmissionStatus.Running;

  return SubmissionStatus.Success;
}

async function updateResult(result: ExecutionResult): Promise<void> {
  const {
    error,
    memoryUsedInKb,
    output,
    status,
    submissionId,
    testCaseId,
    timeUsedInMs,
  } = result;

  await db
    .update(submissionTestcases)
    .set({
      createdAt: new Date(),
      createdBy: "system",
      memoryUsedKb: memoryUsedInKb,
      runtimeMs: timeUsedInMs,
      status,
      stdout: `${output} \n  ${error} `,
    })
    .where(
      and(
        eq(submissionTestcases.submissionId, submissionId),
        eq(submissionTestcases.testcaseId, testCaseId),
      ),
    );

  await checkAndUpdateSubmissionStatus(submissionId);
}

async function checkAndUpdateSubmissionStatus(
  submissionId: string,
): Promise<void> {
  const result = await db
    .update(submissions)
    .set({
      runningTestcaseCount: sql`${submissions.runningTestcaseCount} - 1`,
    })
    .where(eq(submissions.id, submissionId))
    .returning({
      remainingTestcaseCount: submissions.runningTestcaseCount,
    });

  const remaining = result?.[0]?.remainingTestcaseCount ?? 100;
  console.log(
    `Submission ${submissionId} updated, remaining test cases: ${remaining}`,
  );
  if (remaining > 0) return;

  const submissionTests = await db.query.submissionTestcases.findMany({
    where: (st, { eq }) => eq(st.submissionId, submissionId),
  });

  const overallStatus = calculateSubmissionStatus(submissionTests);
  const maxExecutionTime = Math.max(
    ...submissionTests.map((tc) => tc.runtimeMs),
  );
  const maxMemoryUsage = Math.max(
    ...submissionTests.map((tc) => tc.memoryUsedKb),
  );

  await db
    .update(submissions)
    .set({
      status: overallStatus,
      executionTimeMs: maxExecutionTime,
      memoryUsageKb: maxMemoryUsage,
    })
    .where(eq(submissions.id, submissionId));
}

async function createSubmission(input: CreateSubmission): Promise<string> {
  const { problemId, languageId, code, isTest, id = uuid(), userId } = input;

  const problem = await db.query.problems.findFirst({
    where: (problems, { eq }) => eq(problems.id, problemId),
  });

  if (!problem) throw new Error("Problem not found");

  const problemLanguages = await db.query.problemLanguages.findFirst({
    where: (pl, { eq }) =>
      eq(pl.problemId, problemId) && eq(pl.languageId, languageId),
    with: {
      language: true,
    },
  });

  if (!problemLanguages) {
    throw new Error("Language not supported for this problem");
  }

  const listTestCases = await db.query.testcases.findMany({
    where: (testcases, { eq, and }) =>
      !isTest
        ? eq(testcases.problemId, problemId)
        : and(eq(testcases.problemId, problemId), eq(testcases.isSample, true)),
    columns: {
      id: true,
      inputData: true,
      expectedOutput: true,
    },
  });

  const submission = await db
    .insert(submissions)
    .values({
      languageId,
      code,
      executionTimeMs: -1,
      memoryUsageKb: -1,
      status: SubmissionTestcaseStatus.Running.toString(),
      id,
      submittedAt: new Date(),
      createdAt: new Date(),
      userId: userId ?? "",
      createdBy: userId,
      problemId,
      isTest,
      runningTestcaseCount: listTestCases.length,
    })
    .returning();

  await db.insert(submissionTestcases).values(
    listTestCases.map((tc) => ({
      submissionId: submission[0]!.id,
      createdAt: new Date(),
      createdBy: userId ?? "",
      memoryUsedKb: -1,
      problemId,
      runtimeMs: -1,
      status: SubmissionTestcaseStatus.Running.toString(),
      stdout: "",
      testcaseId: tc.id,
    })),
  );

  natsClient.publish(EVENT_TYPES.SUBMISSION.CREATED, {
    code,
    id,
    language: {
      binaryFile: problemLanguages.language.binaryFile ?? "",
      compileCommand: problemLanguages.language.compileCommand ?? "",
      runCommand: problemLanguages.language.runCommand ?? "",
      sourceFile: problemLanguages.language.sourceFile ?? "",
      id: problemLanguages.languageId.toString(),
    },
    memoryLimitInKb: problemLanguages.memoryLimitKb,
    testCases: listTestCases.map((tc) => ({
      expectOutput: tc.expectedOutput ?? "",
      input: tc.inputData ?? "",
      id: tc.id,
    })),
    timeLimitInMs: problemLanguages.timeLimitMs,
    settings: {
      withCaseSensitive: false,
      withTrim: true,
      withWhitespace: true,
    },
  });
  if (!input.isTest) {
    scoreSubmission(id);
  }

  return id;
}

async function getSubmission(id: string) {
  return db.query.submissions.findFirst({
    columns: {
      id: true,
      problemId: true,
      languageId: true,
      code: true,
      executionTimeMs: true,
      memoryUsageKb: true,
      status: true,
      submittedAt: true,
      userId: true,
      isTest: true,
      runningTestcaseCount: true,
      aiScore: true,
    },
    where: (submissions, { eq }) => eq(submissions.id, id),
    with: {
      language: {
        columns: {
          monacoCodeLanguage: true,
          name: true,
          version: true,
          id: true,
        },
      },
      submissionTestcases: {
        columns: {
          testcaseId: true,
          status: true,
          stdout: true,
          runtimeMs: true,
          memoryUsedKb: true,
        },
        with: {
          testcase: {
            columns: {
              id: true,
              label: true,
              points: true,
              isSample: true,
            },
          },
        },
      },
    },
  });
}

async function getMySubmissionsOfProblem(userId: string, problemId: string) {
  return db.query.submissions.findMany({
    where: (submissions, { eq, and }) =>
      and(eq(submissions.userId, userId), eq(submissions.problemId, problemId)),
  });
}
export type SubmissionDetails = Awaited<ReturnType<typeof getSubmission>>;

export default {
  updateResult,
  checkAndUpdateSubmissionStatus,
  createSubmission,
  getSubmission,
  getMySubmissionsOfProblem,
};
