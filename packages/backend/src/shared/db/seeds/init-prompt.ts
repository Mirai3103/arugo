import { db } from "..";
import { genAiPrompts } from "../schema";

async function main() {
  // Xoá dữ liệu cũ
  await db.delete(genAiPrompts);

  // Danh sách prompt khởi tạo
  const prompts = [
    {
      key: "gen_ai_score_submission",
      prompt: await Bun.file(
        "/home/laffy/workspaces/code-stack/packages/backend/src/gen_ai/prompts/analyze-code.eta",
      ).text(),
      description:
        "Prompt for analyzing code submissions and providing a detailed score report",
    },
    {
      key: "gen_ai_review_code",
      prompt: await Bun.file(
        "/home/laffy/workspaces/code-stack/packages/backend/src/gen_ai/prompts/review-code.eta",
      ).text(),
      description:
        "Prompt for reviewing code submissions and providing feedback",
    },
  ];

  // Thêm các prompt vào cơ sở dữ liệu
  for (const prompt of prompts) {
    await db.insert(genAiPrompts).values(prompt);
  }
}

await main();
