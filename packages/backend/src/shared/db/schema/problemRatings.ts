import {
  index as pgIndex,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";



export const problemRatings = pgTable(
  "problem_ratings",
  {
    problemId: uuid("problem_id").notNull(),
    userId: varchar("user_id", { length: 100 }).notNull(),
    rating: smallint("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
  },
  (table) => [
    primaryKey({
      name: "ProblemRating_ProblemId_UserId_pk",
      columns: [table.problemId, table.userId],
    }),
    pgIndex("ProblemRating_ProblemId_idx").on(table.problemId),
    pgIndex("ProblemRating_UserId_idx").on(table.userId),
  ],
);

export type ProblemRating = typeof problemRatings.$inferSelect;
