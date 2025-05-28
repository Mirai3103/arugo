import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import { generateJSON } from "@tiptap/html";
import { Mutex } from "async-mutex";
import axios from "axios";
import PQueue from "p-queue";
import slugify from "slugify";
import UserAgent from "user-agents";
import { v4 as uuid } from "uuid";
import db from "..";
import {
	type Problem,
	type ProblemTag,
	type Tag,
	languages,
	problemLanguages,
	problemTags,
} from "../schema";
import { problems, tags as tagsTable } from "../schema";

const userAgent = new UserAgent();

// Proxy format: http://username:password@host:port
const queue = new PQueue({ concurrency: 1 });

export interface ProblemsResponse {
	totalQuestions: number;
	count: number;
	problemsetQuestionList: ProblemsetQuestionList[];
}

export interface ProblemsetQuestionList {
	acRate: number;
	difficulty: Difficulty;
	freqBar: null;
	questionFrontendId: string;
	isFavor: boolean;
	isPaidOnly: boolean;
	status: null;
	title: string;
	titleSlug: string;
	topicTags: TopicTag[];
	hasSolution: boolean;
	hasVideoSolution: boolean;
}

export enum Difficulty {
	Easy = "Easy",
	Hard = "Hard",
	Medium = "Medium",
}

const difficulties = {
	Easy: 1,
	Medium: 2,
	Hard: 3,
};

export interface TopicTag {
	name: string;
	id?: string;
	slug: string;
	translatedName?: null;
}

export interface ProblemDetail {
	link: string;
	questionId: string;
	questionFrontendId: string;
	questionTitle: string;
	titleSlug: string;
	difficulty: string;
	isPaidOnly: boolean;
	question: string;
	exampleTestcases: string;
	topicTags: TopicTag[];
	hints: string[];
	solution: Solution;
	companyTagStats: null;
	likes: number;
	dislikes: number;
	similarQuestions: string;
}

export interface Solution {
	id: string;
	canSeeDetail: boolean;
	paidOnly: boolean;
	hasVideoSolution: boolean;
	paidOnlyVideo: boolean;
}

const mutex = new Mutex();

async function saveTags(tags: TopicTag[]): Promise<Partial<Tag>[]> {
	const newTags: Partial<Tag>[] = tags.map((tag) => ({
		name: tag.name,
		createdAt: new Date(),
		createdBy: "system",
		description: "",
	}));

	const release = await mutex.acquire();
	try {
		for (const tag of newTags) {
			const exist = await db.query.tags.findFirst({
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				where: (tags, { eq }) => eq(tags.name, tag.name!),
			});

			if (!exist) {
				const inserted = await db
					.insert(tagsTable)
					.values({
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						name: tag.name!,
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						description: tag.description!,
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						createdAt: tag.createdAt!,
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						createdBy: tag.createdBy!,
					})
					.returning({ tagId: tagsTable.id });

				tag.id = inserted[0].tagId;
			} else {
				tag.id = exist.id;
			}
		}
	} finally {
		release();
	}

	return newTags;
}

const extensions = [
	Blockquote.configure({ HTMLAttributes: { class: "blockquote" } }),
	Bold,
	BulletList,
	Code,
	CodeBlock.configure({ HTMLAttributes: { class: "code-block" } }),
	Color,
	Document,
	HardBreak,
	Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
	HorizontalRule,
	Italic,
	ListItem,
	OrderedList,
	Paragraph,
	Strike,
	Text,
	TextAlign,
	TextStyle,
	Typography,
];

async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getProblemsDetail(
	briefProblem: ProblemsetQuestionList,
): Promise<Partial<Problem>> {
	try {
		await sleep(1000);
		const existTitle = await db.query.problems.findFirst({
			where: (problems, { eq }) => eq(problems.title, briefProblem.title),
		});

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		if (existTitle) return null as any;
		const response = await axios.get<ProblemDetail>(
			`http://localhost:3000/select?titleSlug=${briefProblem.titleSlug}`,
			{
				headers: {
					"User-Agent": userAgent.toString(),
				},
			},
		);

		const rest = {
			title: response.data.questionTitle,
			createdAt: new Date(),
			difficultyLevel: difficulties[briefProblem.difficulty],
			problemStatement: generateJSON(response.data.question, extensions),
			description: generateJSON(
				response.data.hints.map((hint) => `<p>${hint}</p>`).join(""),
				extensions,
			),
		};

		const tags = await saveTags(response.data.topicTags); // cần refactor hàm này dùng drizzle

		const inserted = await db
			.insert(problems)
			.values({
				slug: slugify(rest.title, {
					lower: true,
					strict: true,
					replacement: "-",
					locale: "vi",
				}),
				title: rest.title,
				createdAt: rest.createdAt,
				difficultyLevel: rest.difficultyLevel,
				statement: rest.problemStatement,
				description: rest.description,
				isPublic: true,
				hints: response.data.hints,
				metadata: {
					likes: response.data.likes,
					dislikes: response.data.dislikes,
					acRate: briefProblem.acRate,
				},
				timeLimitMs: 1000,
				memoryLimitKb: 256000,
				isDeleted: false,
				createdBy: "system",
				id: uuid(),
			})
			.returning({ problemId: problems.id });

		const problemId = inserted[0].problemId;

		const problemTagsValue: ProblemTag[] = tags.map((tag) => ({
			problemId,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			tagId: tag.id!,
			createdAt: new Date(),
			createdBy: "system",
		}));

		await db.insert(problemTags).values(problemTagsValue).onConflictDoNothing();

		const availableLanguages = await db.select().from(languages);

		await db
			.insert(problemLanguages)
			.values(
				availableLanguages.map((lang) => ({
					problemId,
					languageId: lang.id,
					createdAt: new Date(),
					createdBy: "system",
				})),
			)
			.onConflictDoNothing();

		return rest;
	} catch (error) {
		console.error(`Error fetching problem ${briefProblem.titleSlug}:`, error);
		throw error;
	}
}

async function main() {
	try {
		// Uncomment to fetch from API instead of using local file
		const response = await axios.get<ProblemsResponse>(
			"http://localhost:3000/problems?limit=100",
			{
				headers: {
					"User-Agent": userAgent.toString(),
				},
			},
		);
		const briefProblems = response.data.problemsetQuestionList;

		for (const briefProblem of briefProblems) {
			queue.add(() =>
				getProblemsDetail(briefProblem).catch((err) => {
					console.error(
						`Failed to process problem ${briefProblem.titleSlug}:`,
						err,
					);
				}),
			);
		}

		await queue.onIdle();
		console.log("All problems processed successfully");
	} catch (error) {
		console.error("Error in main function:", error);
	} finally {
	}
}

main()
	.then(() => console.log("Done"))
	.catch((error) => {
		console.error("Fatal error:", error);
		process.exit(1);
	});
