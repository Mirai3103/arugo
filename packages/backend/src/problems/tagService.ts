import db from "#/shared/db";
import { tags } from "#/shared/db/schema";
import type { CreateTagSchema, UpdateTagSchema } from "./validations/tag";
import { eq } from "drizzle-orm";

async function getAllTags() {
  const allTag = await db
    .select({
      id: tags.id,
      name: tags.name,
      description: tags.description,
      createdAt: tags.createdAt,
      createdBy: tags.createdBy,
    })
    .from(tags);
  return allTag;
}

async function createTag(tag: CreateTagSchema) {
  const newTag = await db
    .insert(tags)
    .values({
      ...tag,
    })
    .returning();
  return newTag;
}

async function updateTag(tag: UpdateTagSchema) {
  const updatedTag = await db
    .update(tags)
    .set({
      name: tag.name,
      description: tag.description,
    })
    .where(eq(tags.id, tag.id))
    .returning();
  return updatedTag;
}

async function deleteTag(tagId: number) {
  const deletedTag = await db.delete(tags).where(eq(tags.id, tagId));
  return deletedTag;
}

async function getTagById(tagId: number) {
  const tag = await db.select().from(tags).where(eq(tags.id, tagId));
  return tag.length ? tag[0] : null;
}

export default {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getTagById,
};
