import { sql } from "drizzle-orm";
import {
	boolean,
	index as pgIndex,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
// import { users } from './users';

export const notifications = pgTable(
	"notifications",
	{
		id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
		userId: varchar("user_id", { length: 100 }).notNull(),
		type: text("type").notNull(),
		content: text("content").notNull(),
		isRead: boolean("is_read").default(false).notNull(),
		createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
		createdBy: varchar("created_by", { length: 100 })
			.default("system")
			.notNull(),
	},
	(table) => [
		pgIndex("Notification_UserId_idx").on(table.userId),
		pgIndex("Notification_Type_idx").on(table.type),
		pgIndex("Notification_IsRead_idx").on(table.isRead),
	],
);

export type Notification = typeof notifications.$inferSelect;
