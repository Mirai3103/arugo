export interface Problem {
	_id: Id;
	original_id: number;
	name: string;
	description: string;
	source: string;
	difficulty: number;
	cf_contest_id: number;
	cf_index: string;
	cf_points: number;
	cf_rating: number;
	cf_tags: any[];
	untranslated_description: string;
	time_limit: number;
	memory_limit: number;
	input_file: string;
	output_file: string;
	public_tests_count: number;
	private_tests_count: number;
	generated_tests_count: number;
	correct_solutions_count: number;
	incorrect_solutions_count: number;
	description_vi: string;
	title_vi: string;
}

type Id = string;

function codesByTier(tier: number) {
	switch (tier) {
		case 1: // easy
			return [1, 7, 8];

		case 2: // medium
			return [2, 9, 10];

		case 3: // hard
			return [
				3, 4, 5, // HARD, HARDER, HARDEST
				11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
			];

		case 0: // unknown / external
			return [0, 6];

		default: // tier không hợp lệ
			return [];
	}
}

import { MongoClient } from "mongodb";
import { db as drizzleDb } from "#/shared/db";
import { problems, problemTags, tags, testcases } from "../schema";
import slugify from "slugify";
import { generateJSONFromMarkdown } from "@repo/tiptap";
type TestcaseInsert= typeof testcases.$inferInsert;
const mongoClient = new MongoClient(process.env.MONGO_URI!);
await mongoClient.connect();
const db = mongoClient.db('google_deepmind');
const problemsCollection = db.collection<Problem>("problems");
const testcasesCollection = db.collection<Testcase>("testcases");


export interface Testcase {
  _id: Id
  problem_id: ProblemId
  test_type: string
  test_index: number
  input: string
  output: string
}


export type ProblemId = string;

// Tag cache to avoid repeated database queries
const tagCache = new Map<string, number>();

async function getOrCreateTagIfNotExist(tagName: string): Promise<number> {
	if (tagCache.has(tagName)) {
		return tagCache.get(tagName)!;
	}

	const existingTag = await drizzleDb.query.tags.findFirst({
		where: (tags, { eq }) => eq(tags.name, tagName),
	});

	if (existingTag) {
		tagCache.set(tagName, existingTag.id);
		return existingTag.id;
	}

	const newTag = await drizzleDb
		.insert(tags)
		.values({
			name: tagName,
			createdAt: new Date(),
			createdBy: "system",
		})
		.returning()
		.then((res) => res[0]!);

	tagCache.set(tagName, newTag.id);
	return newTag.id;
}

// Batch create tags to reduce database calls
async function createTagsBatch(tagNames: string[]): Promise<Map<string, number>> {
	const uniqueTagNames = [...new Set(tagNames)];
	const tagMap = new Map<string, number>();
	
	// Check existing tags first
	const existingTags = await drizzleDb.query.tags.findMany({
		where: (tags, { inArray }) => inArray(tags.name, uniqueTagNames),
	});
	
	for (const tag of existingTags) {
		tagMap.set(tag.name, tag.id);
		tagCache.set(tag.name, tag.id);
	}
	
	// Create missing tags
	const missingTagNames = uniqueTagNames.filter(name => !tagMap.has(name));
	
	if (missingTagNames.length > 0) {
		const newTags = await drizzleDb
			.insert(tags)
			.values(
				missingTagNames.map(name => ({
					name,
					createdAt: new Date(),
					createdBy: "system",
				}))
			)
			.returning();
		
		for (const tag of newTags) {
			tagMap.set(tag.name, tag.id);
			tagCache.set(tag.name, tag.id);
		}
	}
	
	return tagMap;
}

const tierCodes = {
	easy: codesByTier(1),
	medium: codesByTier(2),
	hard: codesByTier(3),
};

const tierNumbers = {
	easy: 1,
	medium: 2,
	hard: 3,
};

async function main() {
	const startTime = Date.now();
	console.log("🚀 Starting database seed...");

	try {
		// Delete old data
		console.log("🗑️  Deleting existing data...");
		const deleteStart = Date.now();
		
		await drizzleDb.transaction(async (tx) => {
			await tx.delete(problemTags); // Delete problem tags first due to foreign key
			await tx.delete(problems);
			await tx.delete(tags);
		});
		
		console.log(`✅ Deleted existing data in ${Date.now() - deleteStart}ms`);

		// Fetch all problems at once with optimized aggregation
		console.log("📊 Fetching problems from MongoDB...");
		const fetchStart = Date.now();
		const aggregate=[
				{
					$match: {
						title_vi: { $exists: true, $ne: "" },
						difficulty: { $in: [...tierCodes.easy, ...tierCodes.medium, ...tierCodes.hard] },
					},
				},
				{
					$addFields: {
						tier: {
							$switch: {
								branches: [
									{ case: { $in: ["$difficulty", tierCodes.easy] }, then: "easy" },
									{ case: { $in: ["$difficulty", tierCodes.medium] }, then: "medium" },
									{ case: { $in: ["$difficulty", tierCodes.hard] }, then: "hard" },
								],
								default: "unknown"
							}
						},
						randomSort: { $rand: {} }
					}
				},
				{ $sort: { tier: 1, randomSort: 1 } },
				{
					$group: {
						_id: "$tier",
						problems: { $push: "$$ROOT" },
					}
				},
				{
					$project: {
						_id: 1,
						problems: { $slice: ["$problems", 50] }
					}
				}
			]
		const allProblemsData = await problemsCollection
			.aggregate<{ _id: string; problems: Problem[] }>(aggregate)
			.toArray();
		console.log(`✅ Fetched ${allProblemsData.length} problem groups`);
		console.log(`📝 Fetched problems data in ${Date.now() - fetchStart}ms`);

		// Process each tier
		for (const tierGroup of allProblemsData) {
			const tier = tierGroup._id as keyof typeof tierCodes;
			const rawProblems = tierGroup.problems;
			
			if (!tierNumbers[tier]) {
				console.log(`⚠️  Skipping unknown tier: ${tier}`);
				continue;
			}
			
			const tierStart = Date.now();
			console.log(`📊 Processing ${rawProblems.length} ${tier} problems...`);

			// Collect all unique tags for batch creation
			const allTags = rawProblems.flatMap(p => p.cf_tags || []);
			const uniqueTags = [...new Set(allTags)];
			
			console.log(`🏷️  Creating ${uniqueTags.length} unique tags for ${tier} tier...`);
			const tagMap = await createTagsBatch(uniqueTags);
			type ProblemInsert = typeof problems.$inferInsert;
			// Prepare batch data
			const problemsToInsert:ProblemInsert[] = [];
			const problemTagsToInsert:any = [];
			const testcasesToInsert:TestcaseInsert[] = [];

			for await (const rawProblem of rawProblems) {
				const id = Bun.randomUUIDv7();
				const slug = slugify(rawProblem.title_vi, { lower: true, strict: true });
				const isExisting = await drizzleDb.query.problems.findFirst({
					where: (problems, { eq }) => eq(problems.slug, slug),
				});
				if (isExisting) {
					console.log(`⚠️ Problem with slug "${slug}" already exists, skipping...`);
					continue;
				}
				// Prepare problem data
				problemsToInsert.push({
					slug: slugify(rawProblem.title_vi, { lower: true, strict: true }),
					title: rawProblem.title_vi,
					statement: generateJSONFromMarkdown(rawProblem.description_vi),
					createdAt: new Date(),
					createdBy: "system",
					difficultyLevel: tierNumbers[tier],
					id: id,
					isPublic: true,
					metadata:{
						originalId: rawProblem.original_id,
						mongoId: rawProblem._id,
						contestId: rawProblem.cf_contest_id,
					}
				});
				const allTestcases = await testcasesCollection
					.find<Testcase>({ problem_id: rawProblem._id })
					.toArray();
				const testcasesToInsertBatch = allTestcases.map((testcase, index) => ({
					expectedOutput: testcase.output,
					inputData: testcase.input,
					problemId: id,
					isSample: testcase.test_type === "public",
					isHidden: testcase.test_type !== "public",
					index: testcase.test_index,
					label: `Test ${testcase.test_index}`,
					points:1,

				}) as TestcaseInsert);
				testcasesToInsert.push(...testcasesToInsertBatch);

				// Prepare problem-tag relationships
				const problemTags = (rawProblem.cf_tags || [])
					.map(tagName => tagMap.get(tagName))
					.filter(tagId => tagId !== undefined)
					.map(tagId => ({
						problemId: id,
						tagId: tagId!,
					}));
				
				problemTagsToInsert.push(...problemTags);
			}

			// Batch insert with transaction
			console.log(`💾 Inserting ${problemsToInsert.length} problems and ${problemTagsToInsert.length} problem-tag relationships for ${tier} tier...`);
			const insertStart = Date.now();
			
			await drizzleDb.transaction(async (tx) => {
				if (problemsToInsert.length > 0) {
					await tx.insert(problems).values(problemsToInsert);
				}
				if (testcasesToInsert.length > 0) {
					await tx.insert(testcases).values(testcasesToInsert);
				}
				
				if (problemTagsToInsert.length > 0) {
					await tx.insert(problemTags).values(problemTagsToInsert);
				}
			});
			
			console.log(`✅ Completed ${tier} tier in ${Date.now() - tierStart}ms (insert: ${Date.now() - insertStart}ms)`);
		}

		const totalTime = Date.now() - startTime;
		console.log(`🎉 Seed completed successfully in ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);
		
		// Show final statistics
		const finalStats = await drizzleDb.transaction(async (tx) => {
			const problemCount = await tx.select({ count: problems.id }).from(problems);
			const tagCount = await tx.select({ count: tags.id }).from(tags);
			const relationCount = await tx.select({ count: problemTags.problemId }).from(problemTags);
			
			return {
				problems: problemCount.length,
				tags: tagCount.length,
				relationships: relationCount.length,
			};
		});
		
		console.log("📈 Final Statistics:");
		console.log(`   - Problems created: ${finalStats.problems}`);
		console.log(`   - Tags created: ${finalStats.tags}`);
		console.log(`   - Problem-tag relationships: ${finalStats.relationships}`);

	} catch (error) {
		console.error("❌ Error during seed:", error);
		throw error;
	} finally {
		// Close MongoDB connection
		await mongoClient.close();
		console.log("🔌 MongoDB connection closed");
	}
}

main()
	.then(() => {
		console.log("✨ Process completed successfully");
		process.exit(0);
	})
	.catch((error) => {
		console.error("💥 Process failed:", error);
		process.exit(1);
	});