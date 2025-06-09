import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  index as pgIndex,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const problems = pgTable(
  "problems",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 255 }).unique().notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    description: json("description").$type<JSON>(),
    statement: json("problem_statement").notNull().$type<JSON>(),
    difficultyLevel: smallint("difficulty_level").default(1).notNull(),
    timeLimitMs: integer("time_limit_ms").default(1000).notNull(),
    memoryLimitKb: integer("memory_limit_kb").default(256000).notNull(),
    isPublic: boolean("is_public").default(true).notNull(),
    hints: json("hints").$type<JSON>(),
    metadata: json("metadata").$type<JSON>(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),
  },
  (table) => [
    pgIndex("Problem_Title_idx").on(table.title),
    pgIndex("Problem_DifficultyLevel_idx").on(table.difficultyLevel),
    pgIndex("Problem_IsPublic_idx").on(table.isPublic),
  ],
);

export const problemLanguages = pgTable(
  "problem_languages",
  {
    problemId: uuid("problem_id").notNull(), // .references(() => problems.id, { onDelete: 'cascade' }),
    languageId: integer("language_id").notNull(), // .references(() => languages.id, { onDelete: 'cascade' }),
    templateCode: text("template_code"),
    timeLimitMs: integer("time_limit_ms").default(1000).notNull(),
    memoryLimitKb: integer("memory_limit_kb").default(256000).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
  },
  (table) => [
    primaryKey({
      name: "ProblemLanguage_ProblemId_LanguageId_pk",
      columns: [table.problemId, table.languageId],
    }),
    pgIndex("ProblemLanguage_ProblemId_idx").on(table.problemId),
    pgIndex("ProblemLanguage_LanguageId_idx").on(table.languageId),
  ],
);

export const problemTags = pgTable(
  "problem_tags",
  {
    problemId: uuid("problem_id").notNull(), // .references(() => problems.id, { onDelete: 'cascade' }),
    tagId: integer("tag_id").notNull(), // .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
  },
  (table) => [
    primaryKey({
      name: "ProblemTag_ProblemId_TagId_pk",
      columns: [table.problemId, table.tagId],
    }),
    pgIndex("ProblemTag_ProblemId_idx").on(table.problemId),
    pgIndex("ProblemTag_TagId_idx").on(table.tagId),
  ],
);

export const testcases = pgTable(
  "testcases",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    index: smallint("index").default(1).notNull(),
    problemId: uuid("problem_id").notNull(), // .references(() => problems.id, { onDelete: 'cascade' }),
    inputData: text("input_data").notNull(),
    expectedOutput: text("expected_output").notNull(),
    isSample: boolean("is_sample").default(false).notNull(),
    isHidden: boolean("is_hidden").default(true).notNull(),
    points: smallint("points").default(0).notNull(),
    label: varchar("label", { length: 50 }),
    explanation: json("explanation").$type<object>(),
    metadata: json("metadata").$type<object>(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
  },
  (table) => [
    pgIndex("Testcase_ProblemId_idx").on(table.problemId),
    pgIndex("Testcase_IsSample_idx").on(table.isSample),
    pgIndex("Testcase_IsHidden_idx").on(table.isHidden),
  ],
);

export type Problem = typeof problems.$inferSelect;
export type ProblemLanguage = typeof problemLanguages.$inferSelect;
export type ProblemTag = typeof problemTags.$inferSelect;
export type Testcase = typeof testcases.$inferSelect;
