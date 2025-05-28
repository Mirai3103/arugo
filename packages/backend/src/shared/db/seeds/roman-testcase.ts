import { eq, inArray } from "drizzle-orm";
import { db } from ".."; // Drizzle instance
import { problems, testcases } from "../schema";

// Map giá trị La Mã ngược lại để sinh input từ số
const intToRoman = (n: number) => {
	let num = n;
	const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
	const symbols = [
		"M",
		"CM",
		"D",
		"CD",
		"C",
		"XC",
		"L",
		"XL",
		"X",
		"IX",
		"V",
		"IV",
		"I",
	];
	let result = "";

	for (let i = 0; i < values.length && num > 0; i++) {
		while (num >= values[i]) {
			num -= values[i];
			result += symbols[i];
		}
	}

	return result;
};

// Sinh test case: N test
function generateTestCases(N = 50) {
	const testCases = [];

	for (let i = 0; i < N; i++) {
		// Số từ 1 đến 3999 (giới hạn chuẩn của La Mã cổ điển)
		const num = Math.floor(Math.random() * 3999) + 1;
		const roman = intToRoman(num);
		testCases.push({ input: roman, output: num });
	}

	return testCases;
}
const romanToIntegerProblem = await db.query.problems.findFirst({
	where: eq(problems.slug, "roman-to-integer"),
});
if (!romanToIntegerProblem) {
	process.exit(1);
}
const inputs = generateTestCases(50).map((tc, index) => ({
	id: Bun.randomUUIDv7(),
	index,
	createdAt: new Date(),
	createdBy: "system",
	expectedOutput: tc.output.toString(),
	inputData: tc.input,
	isHidden: true,
	isSample: false,
	label: `Test case ${index + 1}`,
	points: 1,
	problemId: romanToIntegerProblem.id,
}));
await db.insert(testcases).values(inputs);

const top4TestCases = inputs
	.sort((a, b) => Number(a.expectedOutput) - Number(b.expectedOutput))
	.slice(0, 4);
await db
	.update(testcases)
	.set({
		isSample: true,
	})
	.where(
		inArray(
			testcases.id,
			top4TestCases.map((tc) => tc.id),
		),
	);
