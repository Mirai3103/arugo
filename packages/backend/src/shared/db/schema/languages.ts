import {
  boolean,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const languages = pgTable(
  "languages",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    version: varchar("version", { length: 50 }),
    sourceFile: varchar("sourceFile", { length: 100 }),
    binaryFile: varchar("binaryFile", { length: 100 }),
    compileCommand: varchar("compileCommand", { length: 100 }),
    runCommand: varchar("runCommand", { length: 100 }),
    isActive: boolean("isActive").default(true),
    canDelete: boolean("canDelete").default(true),
    monacoCodeLanguage: varchar("monacoCodeLanguage", {
      length: 50,
    }).default("plaintext"),
    templateCode: text("templateCode").default(""),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 100 })
      .default("system")
      .notNull(),
  },
  (table) => [index("Language_Name_idx").on(table.name)],
);

export type Language = typeof languages.$inferSelect;
