import { z } from "zod";
import { db } from "..";
import { contests } from "../schema";
import { generateObject } from "ai";
import { LLM_REGISTRY } from "#/gen_ai/registry";
import { generateJSONFromMarkdown } from "@repo/tiptap";
import { faker } from "@faker-js/faker";
const responseObject = z.object({
  title: z.string().max(255).describe("Tiêu đề cuộc thi"),
  description: z.string().max(255).optional().describe("Mô tả cuộc thi"),
  details: z.string().describe(` Mô tả chi tiết về cuộc thi, bao gồm:
            -   Mô tả tổng quan (dùng # cho tiêu đề).
            -   Các phần như "Quy tắc", "Đối tượng tham gia", "Chủ đề" (dùng ##).
            -   Danh sách bài toán hoặc yêu cầu (dùng - hoặc *).
            Sử dụng markdown để định dạng nội dung chi tiết cuộc thi.
            `),
  prizes: z.string().optional().describe(`
        Mô tả giải thưởng, bao gồm:
            -   Tiêu đề "Giải thưởng" (dùng #).
            -   Danh sách giải thưởng theo hạng (dùng - hoặc *, ví dụ: "Hạng 1: 5.000.000 VNĐ").
            -   Có thể thêm phần "Phần thưởng bổ sung" nếu phù hợp.
            Sử dụng markdown để định dạng nội dung giải thưởng.
        `),
  totalProblems: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(1)
    .describe("Tổng số bài tập trong cuộc thi"),
  image: z
    .string()
    .optional()
    .describe(
      "Ảnh banner của cuộc thi, cung cấp URL giả định sài https://placewaifu.com/image/:w/:h (ví dụ: https://placewaifu.com/image/300/400)",
    ),
});

await db.delete(contests);

for (let i = 0; i < 10; i++) {
  const { object } = await generateObject({
    model: LLM_REGISTRY.languageModel("google > gemini-2.0-flash"),
    schema: responseObject,
    prompt: `Tạo dữ liệu mẫu cho bảng contests trong cơ sở dữ liệu của một website clone LeetCode, sử dụ. Dữ liệu phải bằng tiếng Việt và phù hợp với bối cảnh các cuộc thi lập trình trực tuyến.
  **Yêu cầu dữ liệu**:
- mỗi bản ghi đại diện cho một cuộc thi lập trình (ví dụ: thi thuật toán, thi code nhanh, thi AI, Cuộc thi đồ thị).
    -   **Ngôn ngữ**: Tất cả tiêu đề, mô tả, và nội dung trong details và prizes phải bằng tiếng Việt.
    
            **Lưu ý**:
-   Dữ liệu phải thực tế, sáng tạo và phù hợp với văn hóa Việt Nam (ví dụ: giải thưởng có thể bao gồm tiền mặt, quà tặng như áo thun, hoặc voucher).
-   Tránh sử dụng thông tin không liên quan hoặc không thực tế.
-   Đảm bảo các cột jsonb (details, prizes) chứa chuỗi Markdown hợp lệ.
    `,
  });
  const startTime = faker.date.between({
    from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // Từ 30 ngày trước
    to: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // Từ hôm nay đến 30 ngày sau
  });
  await db.insert(contests).values({
    ...object,
    details: generateJSONFromMarkdown(object.details),
    prizes: generateJSONFromMarkdown(object.prizes!),
    createdBy: "system",
    status: "DRAFT",
    createdAt: new Date(),
    startTime: startTime,
    isPublic: true,
    isFeatured: faker.number.int({ min: 0, max: 6 }) === 1,
    endTime: faker.date.between({
      from: startTime,
      to: new Date(startTime.getTime() + 1000 * 60 * 60 * 24), // Kết thúc trong vòng 1 ngày kể từ startTime
    }),
  });
  console.log(`Đã tạo cuộc thi số ${i + 1}:`);
  await new Promise((resolve) => setTimeout(resolve, 15000)); // Giữ 15 giây giữa các lần tạo để tránh quá tải API
}
