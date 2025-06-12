import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  index as pgIndex,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: jsonb("content").notNull(),
  tags: text("tags").array(),
  topicId: integer("topic_id").notNull(),
  totalLikes: integer("total_likes").notNull().default(0),
  totalComments: integer("total_comments").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  authorId: varchar("author_id", { length: 100 }).notNull(),

}, (table) => [
  pgIndex("posts_author_id_idx").on(table.authorId),
  pgIndex("posts_topic_id_idx").on(table.topicId),
]);

export const postLikes = pgTable("post_likes", {
  id: uuid("id").primaryKey(),
  postId: uuid("post_id").notNull(),
  userId: varchar("user_id", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  pgIndex("post_likes_post_id_idx").on(table.postId),
  pgIndex("post_likes_user_id_idx").on(table.userId),
]);

export const postComments = pgTable("post_comments", {
  id: uuid("id").primaryKey(),
  postId: uuid("post_id").notNull(),
  userId: varchar("user_id", { length: 100 }).notNull(),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  pgIndex("post_comments_post_id_idx").on(table.postId),
  pgIndex("post_comments_user_id_idx").on(table.userId),
]);

