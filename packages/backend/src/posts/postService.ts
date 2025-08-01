import db from "#/shared/db";
import { posts, topics, users } from "#/shared/db/schema";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import type { CreatePostSchema, GetPostQuerySchema } from "./validations";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

async function createPost(post: CreatePostSchema, authorId: string) {
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  const newPost = await db
    .insert(posts)
    .values({
      title: post.title,
      content: post.content,
      topicId: post.topicId,
      authorId,
      slug:
        randomNumber + "-" + slugify(post.title, { lower: true, strict: true }),
      tags: post.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      shortDescription: post.shortDescription,
      id: uuidv4(),
    })
    .returning();
  return newPost;
}

async function getPostById(id: string) {
  const post = await db.select().from(posts).where(eq(posts.id, id));
  return post;
}

async function getPostBySlug(slug: string) {
  const post = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      tags: posts.tags,
      topicId: posts.topicId,
      totalLikes: posts.totalLikes,
      author: {
        id: users.id,
        name: users.name,
        avatar: users.image,
      },
      topic: {
        id: topics.id,
        name: topics.name,
      },
      createdAt: posts.createdAt,
      content: posts.content,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .innerJoin(topics, eq(posts.topicId, topics.id))
    .where(eq(posts.slug, slug));
  return post;
}

async function getPosts(params: GetPostQuerySchema) {
  const { page, pageSize, order, search, orderBy, tag, authorId, topicId } =
    params;
  const whereClause = [];
  if (tag) {
    whereClause.push(sql`tags @> ARRAY[${tag}]`);
  }
  if (authorId) {
    whereClause.push(eq(posts.authorId, authorId));
  }
  if (topicId) {
    whereClause.push(eq(posts.topicId, topicId));
  }
  if (search) {
    whereClause.push(sql`title ILIKE ${`%${search}%`}`);
  }
  const orderFunc = order === "asc" ? asc : desc;
  const postsResult = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      tags: posts.tags,
      topicId: posts.topicId,
      totalLikes: posts.totalLikes,
      shortDescription: posts.shortDescription,
      author: {
        id: users.id,
        name: users.name,
        avatar: users.image,
      },
      topic: {
        id: topics.id,
        name: topics.name,
      },
      createdAt: posts.createdAt,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .innerJoin(topics, eq(posts.topicId, topics.id))
    .where(and(...whereClause))
    .orderBy(orderFunc(posts[orderBy as keyof typeof posts] as any))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  const total = await db
    .select({ count: count() })
    .from(posts)
    .where(and(...whereClause));
  return {
    posts: postsResult,
    total: total[0]?.count ?? 0,
  };
}
async function getTopTags(limit = 10) {
  const result = await db.execute(
    sql`
        SELECT tag, COUNT(*) AS count
        FROM (
          SELECT unnest(tags) AS tag
          FROM posts
        ) AS unnested_tags
        GROUP BY tag
        ORDER BY count DESC
        LIMIT ${sql.raw(limit.toString())};
      `,
  );

  return result.map((row) => ({
    tag: row.tag as string,
    count: Number(row.count),
  }));
}

export default {
  createPost,
  getPostById,
  getPostBySlug,
  getPosts,
  getTopTags,
};
export type PostDetail = Awaited<ReturnType<typeof getPostBySlug>>[0];
export type PostBrief = Awaited<ReturnType<typeof getPosts>>["posts"][0];
