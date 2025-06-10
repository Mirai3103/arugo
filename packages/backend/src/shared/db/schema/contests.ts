import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  index as pgIndex,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const contests = pgTable(
  "contests",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    totalParticipants: integer("total_participants").default(0).notNull(),
    startTime: timestamp("start_time", { mode: "date" }).notNull(),
    endTime: timestamp("end_time", { mode: "date" }).notNull(),
    details: jsonb("details").$type<JSONObject>().notNull(),
    prizes: jsonb("prizes").$type<JSONObject>(),
    isPublic: boolean("is_public").default(true).notNull(),
    totalProblems: integer("total_problems").default(0).notNull(),
    image: text("image"),
    status: varchar({ length: 100 }).default("DRAFT").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
  },
  (table) => [
    pgIndex("Contest_Title_idx").on(table.title),
    pgIndex("Contest_Status_idx").on(table.status),
    pgIndex("Contest_StartTime_idx").on(table.startTime),
  ],
);

export const problemContests = pgTable(
  "problem_contests",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    contestId: uuid("contest_id").notNull(),
    problemId: uuid("problem_id").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
  },
  (table) => [
    pgIndex("ProblemContest_ContestId_idx").on(table.contestId),
    pgIndex("ProblemContest_ProblemId_idx").on(table.problemId),
  ],
);

export const leaderboards = pgTable(
  "leaderboards",
  {
    contestId: uuid("contest_id").notNull(),
    userId: varchar("user_id", { length: 100 }).notNull(),
    points: integer("points").default(0).notNull(),
    rank: integer("rank").default(0).notNull(),
    totalTime: integer("total_time").default(0).notNull(),
    totalSolved: integer("total_solved").default(0).notNull(),
    submittedAt: timestamp("submitted_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
  },
  (table) => [
    primaryKey({
      name: "Leaderboard_ContestId_UserId_pk",
      columns: [table.contestId, table.userId],
    }),
    pgIndex("Leaderboard_ContestId_idx").on(table.contestId),
    pgIndex("Leaderboard_UserId_idx").on(table.userId),
    pgIndex("Leaderboard_Rank_idx").on(table.rank),
  ],
);

export const contestParticipants = pgTable(
  "contest_participants",
  {
    contestId: uuid("contest_id").notNull(),
    userId: varchar("user_id", { length: 100 }).notNull(),
    registeredAt: timestamp("registered_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
  },
  (table) => [
    primaryKey({
      name: "ContestParticipant_ContestId_UserId_pk",
      columns: [table.contestId, table.userId],
    }),
    pgIndex("ContestParticipant_ContestId_idx").on(table.contestId),
    pgIndex("ContestParticipant_UserId_idx").on(table.userId),
  ],
);

export type Contest = typeof contests.$inferSelect;
export type ProblemContest = typeof problemContests.$inferSelect;
export type Leaderboard = typeof leaderboards.$inferSelect;
export type ContestParticipant = typeof contestParticipants.$inferSelect;
