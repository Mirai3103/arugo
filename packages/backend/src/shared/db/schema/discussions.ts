import { sql } from "drizzle-orm";
import {
  index as pgIndex,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";



export const discussions = pgTable(
  "discussions",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    problemId: uuid("problem_id").notNull(),
    userId: varchar("user_id", { length: 100 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
  },
  (table) => [
    pgIndex("Discussion_ProblemId_idx").on(table.problemId),
    pgIndex("Discussion_UserId_idx").on(table.userId),
  ],
);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    discussionId: uuid("discussion_id").notNull(),
    userId: varchar("user_id", { length: 100 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
  },
  (table) => [
    pgIndex("Comment_DiscussionId_idx").on(table.discussionId),
    pgIndex("Comment_UserId_idx").on(table.userId),
  ],
);

export type Discussion = typeof discussions.$inferSelect;
export type Comment = typeof comments.$inferSelect;
