import { createTRPCRouter, publicProcedure } from "../trpc";



export const authRouter = createTRPCRouter({
	getServerSession: publicProcedure
		.query(async ({ ctx }) => {
            return ctx.session;
        } ),
});


