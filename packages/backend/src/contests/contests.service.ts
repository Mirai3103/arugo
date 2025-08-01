import { z } from "zod";
import { db } from "#/shared/db";
import { contests } from "#/shared/db/schema";
import { contestStatusEnum } from "./validations/enum";
import { and, asc, count, desc, eq, gt, lt } from "drizzle-orm";

export const contestQuerySchema = z.object({
  isFeatured: z.boolean().optional().describe("Lọc các cuộc thi nổi bật"),
  status: contestStatusEnum.optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(20),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z
    .enum(["startTime", "createdAt"])
    .optional()
    .default("startTime")
    .describe("Sắp xếp theo trường nào"),
  isBefore: z.coerce
    .date()
    .optional()
    .describe("Lọc các cuộc thi bắt đầu trước thời điểm này"),
  isAfter: z.coerce
    .date()
    .optional()
    .describe("Lọc các cuộc thi bắt đầu sau thời điểm này"),
});
export type ContestQuery = z.infer<typeof contestQuerySchema>;

async function getPublishContests(query: ContestQuery) {
  const { isFeatured, status, page, pageSize, order, orderBy } = query;

  const whereConditions = [eq(contests.isPublic, true)];
  if (isFeatured !== undefined) {
    whereConditions.push(eq(contests.isFeatured, isFeatured));
  }
  if (status) {
    whereConditions.push(eq(contests.status, status));
  }
  if (query.isBefore) {
    whereConditions.push(lt(contests.startTime, query.isBefore));
  }
  if (query.isAfter) {
    whereConditions.push(gt(contests.startTime, query.isAfter));
  }
  const orderField =
    orderBy === "startTime" ? contests.startTime : contests.createdAt;
  const orderDirection = order === "asc" ? asc : desc;
  const baseQuery = db
    .select()
    .from(contests)
    .where(and(...whereConditions))
    .limit(pageSize!)
    .offset((page! - 1) * pageSize!)
    .orderBy(orderDirection(orderField));
  const totalQuery = db
    .select({ count: count() })
    .from(contests)
    .where(and(...whereConditions));
  const [contestsData, totalResult] = await Promise.all([
    baseQuery,
    totalQuery,
  ]);
  return {
    data: contestsData,
    page,
    pageSize,
    total: totalResult[0]?.count ?? 0,
  };
}

export default {
  getPublishContests,
};

export type ContestBrief = Awaited<
  ReturnType<typeof getPublishContests>
>["data"][number];
