import { sql } from "drizzle-orm";
import {
	integer,
	jsonb,
	index as pgIndex,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const roles = pgTable(
	"roles",
	{
		id: serial("id").primaryKey(),
		name: text("role_name").unique().notNull(),
		description: text("description"),
		rules: jsonb("rules"),
		createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
		createdBy: varchar("created_by", { length: 100 })
			.default("system")
			.notNull(),
	},
	(table) => [pgIndex("Role_Name_idx").on(table.name)],
);

// Bảng trung gian cho Users (uuid) và Roles (integer)
export const userToRoles = pgTable(
	"user_roles",
	{
		// Đổi tên từ _UserToRole cho rõ ràng
		userId: varchar("user_id", { length: 100 }).notNull(), // Sẽ reference users.id
		roleId: integer("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.userId, table.roleId] })],
);

export const resources = pgTable(
	"resources",
	{
		id: serial("id").primaryKey(),
		name: text("resource_name").unique().notNull(),
		description: text("description"),
		fields: text().array().default(sql`'{}'::text[]`).notNull(),
		validActionIds: text()
			.array()
			.default(sql`'{read,create,update,delete}'::text[]`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
		createdBy: varchar("created_by", { length: 100 })
			.default("system")
			.notNull(),
	},
	(table) => [pgIndex("Resource_Name_idx").on(table.name)],
);

export const actions = pgTable(
	"actions",
	{
		id: serial("id").primaryKey(),
		name: text("action_name").unique().notNull(),
		description: text("description"),
		createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
		createdBy: varchar("created_by", { length: 100 })
			.default("system")
			.notNull(),
	},
	(table) => [pgIndex("Action_Name_idx").on(table.name)],
);

export type Role = typeof roles.$inferSelect;
export type UserToRole = typeof userToRoles.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type Action = typeof actions.$inferSelect;
