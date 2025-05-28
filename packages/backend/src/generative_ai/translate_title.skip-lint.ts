import { readFileSync } from "node:fs";
import { env } from "@/env";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma-app/client";
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const prompt = readFileSync(
	"C:/Users/BaoBao/Desktop/code-master/src/constants/prompts/translate_leetcode_title.txt",
	"utf-8"
);

const chatSession = model.startChat({
	history: [
		{
			role: "user",
			parts: [{ text: prompt }],
		},
	],
});

//  Bạn là một trợ lý dịch thuật chuyên nghiệp có kiến thức về lập trình và đã có kinh nghiệm với bài toán từ LeetCode. Nhiệm vụ của bạn là dịch các tên bài toán từ tiếng Anh sang tiếng Việt.
//  Đây là ví dụ đầu vào:
//      - "Two Sum"
//      - "Find the Index of the First Occurrence in a String"
//      - "Longest Substring Without Repeating Characters"
//      - "Median of Two Sorted Arrays"
//  Hãy cung cấp đầu ra với các tên bài toán đã được dịch sang tiếng Việt. Đầu ra là một mảng chứa các tên bài toán đã được dịch. Ví dụ:
//  ["Tổng của Hai Số", "Cộng Hai Số", "Tìm vị trí xuất hiện đầu tiên trong một chuỗi", "Chuỗi Dài Nhất Không Lặp Lại", "Trung Vị của Hai Mảng Đã Sắp Xếp"]
//  Lưu ý:
//      - Các tên bài toán dịch sang tiếng Việt cần phải chính xác và phù hợp với ngữ cảnh lập trình, những từ nào chuyên ngành quá có thể giữ nguyên tiếng anh.
//      - Đầu ra phải là 1 mảng json, không markdown  chứa các tên bài toán đã được dịch đúng theo thứ tự đầu vào.

const rawTitles = [
	"Letter Combinations of a Phone Number",
	"Generate Parentheses",
	"Permutations",
	"Subsets",
	"Rotate Image",
];

// const chatInput = rawTitles.join(", ");

// const chatOutput = await chatSession.sendMessage(chatInput);
// console.log(chatOutput.response.text());
const prismaClient = new PrismaClient();
const problems = await prismaClient.problem.findMany({
	select: {
		title: true,
		problemId: true,
	},
});
let waitForProcess: { title: string; problemId: string }[] = [];

async function processTranslate() {
	const chatInput = waitForProcess.map((problem) => problem.title).join(", ");
	const chatOutput = await chatSession.sendMessage(chatInput);
	// gỡ  ```json ở đầu và ``` ở cuối nếu có
	const rawMarkDown = chatOutput.response.text();
	const json = rawMarkDown.replace(/^```json\n/, "").replace(/```$/, "");
	const translatedTitles = JSON.parse(json);
	for (let i = 0; i < waitForProcess.length; i++) {
		const problem = waitForProcess[i];
		const translatedTitle = translatedTitles[i] as string;
		await prismaClient.problem.update({
			where: {
				problemId: problem.problemId,
			},
			data: {
				title: translatedTitle,
			},
		});
	}
	waitForProcess = [];
}

for await (const problem of problems) {
	waitForProcess.push(problem);

	if (waitForProcess.length >= 10) {
		await processTranslate();
	}
}
if (waitForProcess.length > 0) {
	await processTranslate();
}
