import { readFileSync } from "node:fs";
import { faker } from "@faker-js/faker";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
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
import { StarterKit } from "novel";
import { env } from "@/env";
const extensions = [
	StarterKit,
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
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const prompt = readFileSync("src/constants/prompts/problem_gen.txt", "utf-8");
enum Difficulty {
	Easy = "Easy",
	Hard = "Hard",
	Medium = "Medium",
}
const difficulties = {
	Easy: 1,
	Medium: 2,
	Hard: 3,
};

const chatSession = model.startChat({
	history: [
		{
			role: "user",
			parts: [{ text: prompt }],
		},
	],
});
enum Style {
	Technical = "Technical",
	Story = "Story",
}

const prismaClient = new PrismaClient();
const tags = await prismaClient.tag.findMany({});
const validLanguages = await prismaClient.language.findMany({});
interface Response {
	title: string;
	problemStatement: string;
	constraints: string;
	inOutFormat: string;
	example: string;
	tag: string[];
	hints: string[];
	testcaseExamples: {
		stdin: string;
		expectStdout: string;
	}[];
}

for (let i = 0; i < 10; i++) {
	const randomTag = faker.helpers.arrayElement(tags);
	const randomDifficulty = faker.helpers.arrayElement(
		Object.values(Difficulty)
	);
	const randomStyle = faker.helpers.arrayElement(Object.values(Style));
	const input = `
    -Tag: ${randomTag.tagName}
    -Difficulty: ${randomDifficulty}
    -Style: ${randomStyle}
   `;
	const chatOutput = await chatSession.sendMessage(input);
	const rawMarkDown = chatOutput.response.text();
	console.log(rawMarkDown);

	const json = rawMarkDown.replace(/^```json\n/, "").replace(/```$/, "");
	const translatedJson = JSON.parse(json) as Response;
	const combinedMarkdown = `
    ${translatedJson.problemStatement}
    **Ràng buộc:** 
    ${translatedJson.constraints}
    ${translatedJson.inOutFormat}
    ${translatedJson.example}
  `;
	const tiptapDoc = generateJSON(combinedMarkdown, extensions);

	const problem = await prismaClient.problem.create({
		data: {
			title: translatedJson.title,
			problemStatement: JSON.stringify(tiptapDoc),
			createdAt: new Date(),
			difficultyLevel: difficulties[randomDifficulty],
			acceptedSubmissions: 0,
			totalSubmissions: 0,
			hints: JSON.stringify(translatedJson.hints),
			isPublic: true,
			memoryLimitInKb: 5 * 1024,
			timeLimitInMs: 2000,
		},
	});
	await prismaClient.problemTag.create({
		data: {
			problemId: problem.problemId,
			tagId: randomTag.tagId,
		},
	});
	await prismaClient.problemLanguage.createMany({
		data: validLanguages.map((language) => ({
			languageId: language.languageId,
			problemId: problem.problemId,
		})),
	});

	await prismaClient.testcase.createMany({
		data: translatedJson.testcaseExamples.map((testcase, index) => ({
			problemId: problem.problemId,
			inputData: testcase.stdin,
			expectedOutput: testcase.expectStdout,
			isSample: true,
			label: `Sample ${index}${1}`,
			createdAt: new Date(),
			createdBy: "system",
			points: 1,
		})),
	});
	await sleep(1000); // Thêm delay giữa các lần gọi API để tránh bị rate limit
}
