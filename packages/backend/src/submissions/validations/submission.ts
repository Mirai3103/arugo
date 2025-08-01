import { z } from "zod";
export const createSubmissionSchema = z.object({
  problemId: z.string(),
  languageId: z.coerce.number(),
  code: z.string(),
  isTest: z.boolean().optional().default(false),
  id: z.string().uuid().optional(),
  userId: z.string().optional(),
});

export type CreateSubmission = z.infer<typeof createSubmissionSchema>;
