import userService from "#/users/userService";
import { createUserSchema } from "#/users/validations";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";



export const authRouter = createTRPCRouter({
	getServerSession: publicProcedure
		.query(async ({ ctx }) => {
            return ctx.session;
        } ),
    signUp: publicProcedure.input(createUserSchema).mutation(async ({ ctx, input }) => {
        return userService.createUser(input);
    }),
    isUsernameAvailable: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
        return userService.isUsernameAvailable(input);
    }),
    isEmailAvailable: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
        return userService.isEmailAvailable(input);
    }),

});


