
import { createTRPCRouter, publicProcedure } from "../trpc";
import submissionService from "#/submissions/submissionService";
import { createSubmissionSchema } from "#/submissions/validations/submission";
import { z } from "zod";
// todo add middleware to check if user is authenticated
export const submissionRouter = createTRPCRouter({
    createSubmission: publicProcedure.input(createSubmissionSchema)
        .mutation(async ({ input, ctx }) => {
            const { user } = ctx.session!;
            const submission = await submissionService.createSubmission({
                ...input,
                isTest: false,
                userId: user?.id,
            });
            return submission;
        }),
    testSubmission: publicProcedure.input(createSubmissionSchema)
        .mutation(async ({ input, ctx }) => {
            const { user } = ctx.session!;
            const submission = await submissionService.createSubmission({
                ...input,
                isTest: true,
                userId: user?.id,
            });
            return submission;
        }),
    getSubmissionById: publicProcedure.input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const submission = await submissionService.getSubmission(input.id);
            return submission;
        }),
    getMySubmissionsOfProblem: publicProcedure.input(z.object({ problemId: z.string() }))
        .query(async ({ input, ctx }) => {
            const { user } = ctx.session!;
            const submissions = await submissionService.getMySubmissionsOfProblem(user!.id, input.problemId);
            return submissions;
        }),
});
