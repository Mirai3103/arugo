import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

 type Session ={
    session: {
        id: string;
        token: string;
        userId: string;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
        ipAddress?: string | null | undefined | undefined;
        userAgent?: string | null | undefined | undefined;
    };
    user: {
        id: string;
        name: string;
        emailVerified: boolean;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        image?: string | null | undefined | undefined;
    };
}
export const createTRPCContext = async ({session}:{session:Session|undefined|null}) => {
	// opts: { headers: Headers }
	return {
		session: session || null,
	};
};
const t = initTRPC.context<typeof createTRPCContext>().create({
});

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(async (opts) => {
    const { ctx } = opts;
    if (!ctx.session?.session?.userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return opts.next({
      ctx: ctx,
    });
  });
