import {
    pgTable,
    serial,
    text,
    varchar
} from "drizzle-orm/pg-core";

export const genAiPrompts = pgTable(
    "gen_ai_prompts",
    {
        id: serial("id").primaryKey(),
        prompt: text("prompt").notNull(),
        key: varchar("key", { length: 100 }).notNull().unique(),
        description: text("description")
        
    },
);