import db from "#/shared/db";
import type { ProblemFields, ProblemQuerySchema } from "./validations/problem";
import {
    type Tag,
    languages,
    problemLanguages,
    problemTags,
    problems,
    tags,
    testcases,
} from "#/shared/db/schema";
import { and, asc, count, desc, eq, ilike, inArray, sql } from "drizzle-orm";

async function getAllProblems(params: ProblemQuerySchema) {
	const whereClauses = [eq(problems.isDeleted, false)];

	if (params.search) {
		whereClauses.push(ilike(problems.title, `%${params.search}%`));
	}

	if (params.difficultyLevels?.length) {
		whereClauses.push(
			inArray(problems.difficultyLevel, params.difficultyLevels),
		);
	}

	if (typeof params.isPublic !== "undefined") {
		whereClauses.push(eq(problems.isPublic, params.isPublic));
	}

	const defaultOrderColumn = params.orderBy
	// @ts-ignore
		? problems._.columns[params.orderBy as ProblemFields ]
		: problems.createdAt;

	const skip = (params.page - 1) * params.pageSize;
	const take = params.pageSize;

	let query = db
		.select({
			id: problems.id,
			title: problems.title,
			difficultyLevel: problems.difficultyLevel,
			isPublic: problems.isPublic,
			createdAt: problems.createdAt,
			metadata: problems.metadata,
			slug: problems.slug,
			tags: sql<
				Tag[]
			>`array_agg(json_build_object('id', ${tags.id}, 'name', ${tags.name}))`,
		})
		.from(problems)
		.leftJoin(problemTags, eq(problems.id, problemTags.problemId))
		.leftJoin(tags, eq(problemTags.tagId, tags.id))
		.$dynamic();

	if (params.tags?.length) {
		query = query.where(
			and(...whereClauses, inArray(problemTags.tagId, params.tags)),
		);
	} else {
		query = query.where(and(...whereClauses));
	}

	query = query
		.groupBy(
			problems.id,
			problems.title,
			problems.difficultyLevel,
			problems.isPublic,
			problems.createdAt,
			problems.slug,
		)
		.orderBy(
			params.order?.toUpperCase() === "ASC"
				? asc(defaultOrderColumn)
				: desc(defaultOrderColumn),
		)
		.offset(skip)
		.limit(take);

	let countQuery = db
		.select({ count: count(problems.id) })
		.from(problems)
		.$dynamic();

	if (params.tags?.length) {
		countQuery = countQuery
			.innerJoin(problemTags, eq(problems.id, problemTags.problemId))
			.where(and(...whereClauses, inArray(problemTags.tagId, params.tags)));
	} else {
		countQuery = countQuery.where(and(...whereClauses));
	}

	const [data, totalResult] = await Promise.all([query, countQuery]);

	const total = Number(totalResult[0]!.count);

	return {
		total,
		page: params.page,
		pageSize: params.pageSize,
		pageCount: Math.ceil(total / params.pageSize),
		data,
	};
}

async function getProblemBySlug(slug: string) {
	const problem = await db
		.select()
		.from(problems)
		.where(eq(problems.slug, slug))
		.limit(1)
		.execute();

	if (!problem.length) {
		throw new Error("Problem not found");
	}

	const problemId = problem[0]!.id;

	const tagsOfProblem = await db
		.select({
			id: tags.id,
			name: tags.name,
		})
		.from(tags)
		.innerJoin(problemTags, eq(tags.id, problemTags.tagId))
		.where(eq(problemTags.problemId, problemId))
		.execute();

	const languagesOfProblem = await db
		.select({
			id: languages.id,
			name: languages.name,
			version: languages.version,
			monacoCodeLanguage: languages.monacoCodeLanguage,
		})
		.from(languages)
		.innerJoin(problemLanguages, eq(languages.id, problemLanguages.languageId))
		.where(eq(problemLanguages.problemId, problemId))
		.execute();

	const sampleTestCases = await db
		.select({
			id: testcases.id,
			inputData: testcases.inputData,
			expectedOutput: testcases.expectedOutput,
			explanation: testcases.explanation,
			points: testcases.points,
			label: testcases.label,
		})
		.from(testcases)
		.where(
			and(eq(testcases.problemId, problemId), eq(testcases.isSample, true)),
		)
		.execute();

	return {
		...problem[0],
		tags: tagsOfProblem,
		languages: languagesOfProblem,
		sampleTestCases,
	};
}

export type BriefProblem = Awaited<
	ReturnType<typeof getAllProblems>
>["data"][number];

export type FullProblem = Awaited<ReturnType<typeof getProblemBySlug>>;

export type ProblemSampleTestCase = FullProblem["sampleTestCases"][number];

export default {
	getAllProblems,
	getProblemBySlug,
};
