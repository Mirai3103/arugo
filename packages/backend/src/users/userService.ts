import { db } from "#/shared/db";
import { users, type User } from "#/shared/db/schema";
import { eq } from "drizzle-orm";
import type { CreateUserInput } from "./validations";


async function isUsernameAvailable(username: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.username, username),
    });
    return !user;
}
async function isEmailAvailable(email: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });
    return !user;
}

async function createUser(user: CreateUserInput) {
    const { email, password, username } = user;
    const usernameAvailable = await isUsernameAvailable(username);
    if (!usernameAvailable) {
        throw new Error("Username already exists");
    }
    const emailAvailable = await isEmailAvailable(email);
    if (!emailAvailable) {
        throw new Error("Email already exists");
    }
    const hashedPassword =  await Bun.password.hash(password);
    const newUser = await db.insert(users).values({
        email,
        id:Bun.randomUUIDv7(),
        name:username,
        username,
        emailVerified:false,
        hashPassword:hashedPassword,
        createdAt:new Date(),
        updatedAt:new Date(),
    });
    return newUser;
}

export default {
    createUser,
    isUsernameAvailable,
    isEmailAvailable,
}