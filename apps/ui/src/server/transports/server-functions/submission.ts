import { createSubmissionSchema } from "@repo/backend/submissions/validations/submission";
import { createServerFn } from "@tanstack/react-start";
import { requireAuthMiddleware } from "../middleware/authMiddleware";

import submissionService from "@repo/backend/submissions/submissionService";
import { z } from "zod";
export const createSubmission = createServerFn({
  method: "POST",
})
  .middleware([requireAuthMiddleware])
  .validator(createSubmissionSchema)
  .handler(async ({ data, context }) => {
    const { user } = context;
    const submission = await submissionService.createSubmission({
      ...data,
      isTest: false,
      userId: user?.id,
    });
    return submission;
  });

export const testSubmission = createServerFn({
  method: "POST",
})
  .middleware([requireAuthMiddleware])
  .validator(createSubmissionSchema)
  .handler(async ({ data, context }) => {
    const { user } = context;
    const submission = await submissionService.createSubmission({
      ...data,
      isTest: true,
      userId: user?.id,
    });
    return submission;
  });

export const getSubmissionById = createServerFn({
  method: "GET",
})
  .middleware([requireAuthMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const submission = await submissionService.getSubmission(data.id);
    return submission;
  });

export const getMySubmissionsOfProblem = createServerFn({
  method: "GET",
})
  .middleware([requireAuthMiddleware])
  .validator(z.object({ problemId: z.string() }))
  .handler(async ({ data, context }) => {
    const { user } = context;
    const submissions = await submissionService.getMySubmissionsOfProblem(
      user!.id,
      data.problemId,
    );
    return submissions;
  });
