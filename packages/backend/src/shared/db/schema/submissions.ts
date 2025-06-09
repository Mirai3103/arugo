import { sql } from "drizzle-orm";
import { json } from "drizzle-orm/pg-core";
import {
  boolean,
  integer,
  index as pgIndex,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 100 }).notNull(), // FKs defined in index.ts or after all tables
    problemId: uuid("problem_id").notNull(),
    languageId: integer("language_id").notNull(),
    code: text("code").notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    executionTimeMs: integer("execution_time_ms").notNull(), // Should not have default if always set
    memoryUsageKb: integer("memory_usage_kb").default(256000).notNull(),
    submittedAt: timestamp("submitted_at", { mode: "date", precision: 6 }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),

    aiScore: json("ai_score").$type<{
      correctness: number;
      efficiency: number;
      readability: number;
      structure: number;
      best_practices: number;
      summary: string;
    }>(),

    problemContestId: uuid("problem_contest_id"),
    isTest: boolean("is_test").default(false).notNull(),
    runningTestcaseCount: integer("running_testcase_count")
      .default(0)
      .notNull(),
  },
  (table) => [
    pgIndex("Submission_UserId_idx").on(table.userId),
    pgIndex("Submission_ProblemId_idx").on(table.problemId),
    pgIndex("Submission_LanguageId_idx").on(table.languageId),
    pgIndex("Submission_Status_idx").on(table.status),
    pgIndex("Submission_SubmittedAt_idx").on(table.submittedAt),
  ],
);

export const submissionTestcases = pgTable(
  "submission_testcases",
  {
    submissionId: uuid("submission_id").notNull(),
    testcaseId: uuid("testcase_id").notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    stdout: text("stdout"),
    problemId: uuid("problem_id").notNull(), // Prisma has this, though seems redundant if submission has problemId
    runtimeMs: integer("runtime_ms").default(1000).notNull(),
    memoryUsedKb: integer("memory_used_kb").default(256000).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
  },
  (table) => [
    primaryKey({
      name: "SubmissionTestcase_SubmissionId_TestcaseId_pk",
      columns: [table.submissionId, table.testcaseId],
    }),
    pgIndex("SubmissionTestcase_SubmissionId_idx").on(table.submissionId),
    pgIndex("SubmissionTestcase_TestcaseId_idx").on(table.testcaseId),
    pgIndex("SubmissionTestcase_ProblemId_idx").on(table.problemId),
  ],
);

export type Submission = typeof submissions.$inferSelect;

export type SubmissionTestcase = typeof submissionTestcases.$inferSelect;
