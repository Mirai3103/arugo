import z from "zod";

const createUserSchema = z.object({
  username: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-zA-Z0-9]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export { createUserSchema };

export type CreateUserInput = z.infer<typeof createUserSchema>;
