import { pgEnum } from "drizzle-orm/pg-core";

export const submissionStatusEnum = pgEnum("submission_status", [
	"PENDING",
	"ACCEPTED",
	"REJECTED",
	"TIME_LIMIT_EXCEEDED",
	"MEMORY_LIMIT_EXCEEDED",
]);

export const contestStatusEnum = pgEnum("contest_status", [
	"DRAFT",
	"ACTIVE",
	"FINISHED",
	"CANCELLED",
]);
