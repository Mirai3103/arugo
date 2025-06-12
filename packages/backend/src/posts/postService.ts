import db from "#/shared/db";
import { posts } from "#/shared/db/schema";
import { and, count, eq, sql } from "drizzle-orm";
import type { CreatePostSchema, GetPostQuerySchema } from "./validations";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";


async function createPost(post: CreatePostSchema, authorId: string) {
    const randomNumber= Math.floor(Math.random() * 9000) + 1000;
    const newPost = await db.insert(posts).values({
        title: post.title,
        content: post.content,
        topicId: post.topicId,
        authorId,
        slug: randomNumber + "-" + slugify(post.title, { lower: true, strict: true }),
        tags: post.tags,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: uuidv4(),
    }).returning();
    return newPost;
}

async function getPostById(id: string) {
    const post = await db.select().from(posts).where(eq(posts.id, id));
    return post;
}

async function getPostBySlug(slug: string) {
    const post = await db.select().from(posts).where(eq(posts.slug, slug));
    return post;
}

async function getPosts(params: GetPostQuerySchema) {
    const { page, pageSize, order, search, orderBy, tag, authorId, topicId } = params;
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

    const postsResult = await db.select().from(posts).where(and(...whereClause)).orderBy(
        sql`${posts[orderBy as keyof typeof posts]} ${order}`
    ).limit(pageSize).offset((page - 1) * pageSize);
    const total = await db.select({ count: count() }).from(posts).where(and(...whereClause));
    return {
        posts: postsResult,
        total: total[0]?.count ?? 0,
    };
}


export default {
    createPost,
    getPostById,
    getPostBySlug,
    getPosts,
};