import { sql } from "drizzle-orm";
import {
  jsonb,
  index as pgIndex,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";


export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    action: text("action").notNull(),
    tableName: text("table_name").notNull(),
    recordId: text("record_id").notNull(), 
    userId: varchar("user_id", { length: 100 }), 
    timestamp: timestamp("timestamp", { mode: "date" }).defaultNow().notNull(),
    details: jsonb("details"),
  },
  (table) => [
    pgIndex("AuditLog_TableName_idx").on(table.tableName),
    pgIndex("AuditLog_RecordId_idx").on(table.recordId),
    pgIndex("AuditLog_UserId_idx").on(table.userId),
    pgIndex("AuditLog_Timestamp_idx").on(table.timestamp),
  ],
);

export type AuditLog = typeof auditLogs.$inferSelect;
