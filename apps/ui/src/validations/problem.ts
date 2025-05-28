import type { problems } from "@/server/shared/db/schema";
import z from "zod";
import { createPaginationQuerySchema } from "./paginationQuerySchema";
export type ProblemFields = keyof typeof problems._.columns;

export const problemQuerySchema = createPaginationQuerySchema(
	z.object({
		search: z.string().optional().nullable(),
		tags: z.array(z.number()).optional().nullable(),
		difficultyLevels: z.array(z.number()).optional(),
		isPublic: z.boolean().optional(),
		orderBy: z.string().optional(),
	}),
);

export type ProblemQuerySchema = z.infer<typeof problemQuerySchema>;
