import db from "#/shared/db";
import { topics } from "#/shared/db/schema";
import { and, count, eq, sql } from "drizzle-orm";

async function getTopics() {
  return await db.select().from(topics);
}

export default {
  getTopics,
};
