import { readFileSync } from "node:fs";
import { env } from "@/env";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma-app/client";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const prompt = readFileSync(
	"C:/Users/BaoBao/Desktop/code-master/src/constants/prompts/translate_tiptap.txt",
	"utf-8"
);

let chatSession = model.startChat({
	history: [
		{
			role: "user",
			parts: [{ text: prompt }],
		},
	],
});

const prismaClient = new PrismaClient();
const problems = await prismaClient.problem.findMany({
	select: {
		problemStatement: true,
		problemId: true,
		title: true,
		metadata: true,
	},
});

async function processTranslate(problem: {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	problemStatement: any;
	problemId: string;
	title: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	metadata: any;
}) {
	const chatInput = JSON.stringify(problem.problemStatement);
	const chatOutput = await chatSession.sendMessage(chatInput);
	// gỡ  ```json ở đầu và ``` ở cuối nếu có
	const rawMarkDown = chatOutput.response.text();
	const json = rawMarkDown.replace(/^```json\n/, "").replace(/```$/, "");
	const translatedJson = JSON.parse(json);

	await prismaClient.problem.update({
		where: {
			problemId: problem.problemId,
		},
		data: {
			problemStatement: translatedJson,
			metadata: {
				...(problem.metadata || {}),
				isTranslatedStatement: true,
			},
		},
	});
	console.log(`Translated problem ${problem.title}`);
}
let processCount = 0;
for await (const problem of problems) {
	// biome-ignore lint/complexity/noExtraBooleanCast: <explanation>
	if (!!problem.metadata?.isTranslatedStatement) {
		continue;
	}
	await processTranslate(problem);
	processCount++;
	// nếu độ dài đoạn chat quá dài thì reset chatSession
	if (processCount > 11) {
		chatSession = model.startChat({
			history: [
				{
					role: "user",
					parts: [{ text: prompt }],
				},
			],
		});
		processCount = 0;
	}
}
