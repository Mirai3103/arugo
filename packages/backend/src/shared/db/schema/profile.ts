import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  index as pgIndex,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./auth-schema";
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    bio: text("bio"),
    image: text("image"),
    userId: varchar("user_id", { length: 100 })
      .unique()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gender: text("gender"),
    location: text("location"),
    birthdate: timestamp("birthdate", { mode: "date" }), 
    website: text("website"),
    github: text("github"),
    linkedin: text("linkedin"),
    twitter: text("twitter"),
    works: jsonb("works"),
    education: jsonb("education"),
    skills: jsonb("skills"),
    streak: integer("streak").default(0).notNull(),
    globalPoints: integer("global_points").default(0).notNull(),
    totalSolved: integer("total_solved").default(0).notNull(),
    lastActive: timestamp("last_active", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
  },
  (table) => [pgIndex("user_idx").on(table.userId)],
);

export type Profile = typeof profiles.$inferSelect;
