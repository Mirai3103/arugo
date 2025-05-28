import {
	index as pgIndex,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
export const tags = pgTable(
	"tags",
	{
		id: serial("id").primaryKey(),
		name: varchar("tag_name", { length: 100 }).unique().notNull(),
		description: text("description"),
		createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
		createdBy: varchar("created_by", { length: 100 })
			.default("system")
			.notNull(),
	},
	(table) => [pgIndex("Tag_Name_idx").on(table.name)],
);

export type Tag = typeof tags.$inferSelect;
