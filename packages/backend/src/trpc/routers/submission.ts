
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import submissionService from "#/submissions/submissionService";
import { createSubmissionSchema } from "#/submissions/validations/submission";
import { z } from "zod";

export const submissionRouter = createTRPCRouter({
    createSubmission: protectedProcedure.input(createSubmissionSchema)
        .mutation(async ({ input, ctx }) => {
            const { user } = ctx.session!;
            const submission = await submissionService.createSubmission({
                ...input,
                isTest: false,
                userId: user?.id,
            });
            return submission;
        }),
    testSubmission: protectedProcedure.input(createSubmissionSchema)
        .mutation(async ({ input, ctx }) => {
            const { user } = ctx.session!;
            const submission = await submissionService.createSubmission({
                ...input,
                isTest: true,
                userId: user?.id,
            });
            return submission;
        }),
    getSubmissionById: protectedProcedure.input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const submission = await submissionService.getSubmission(input.id);
            return submission;
        }),
    getMySubmissionsOfProblem: protectedProcedure.input(z.object({ problemId: z.string() }))
        .query(async ({ input, ctx }) => {
            const { user } = ctx.session!;
            const submissions = await submissionService.getMySubmissionsOfProblem(user!.id, input.problemId);
            return submissions;
        }),
});
