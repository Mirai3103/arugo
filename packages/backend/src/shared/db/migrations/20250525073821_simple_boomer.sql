CREATE TYPE "public"."contest_status" AS ENUM('DRAFT', 'ACTIVE', 'FINISHED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" varchar(100) NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"password" text,
	"rules" jsonb,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bio" text,
	"image" text,
	"user_id" varchar(100) NOT NULL,
	"gender" text,
	"location" text,
	"birthdate" timestamp,
	"website" text,
	"github" text,
	"linkedin" text,
	"twitter" text,
	"works" jsonb,
	"education" jsonb,
	"skills" jsonb,
	"streak" integer DEFAULT 0 NOT NULL,
	"global_points" integer DEFAULT 0 NOT NULL,
	"total_solved" integer DEFAULT 0 NOT NULL,
	"last_active" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"action_name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	CONSTRAINT "actions_action_name_unique" UNIQUE("action_name")
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"resource_name" text NOT NULL,
	"description" text,
	"fields" text[] DEFAULT '{}'::text[] NOT NULL,
	"validActionIds" text[] DEFAULT '{read,create,update,delete}'::text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	CONSTRAINT "resources_resource_name_unique" UNIQUE("resource_name")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_name" text NOT NULL,
	"description" text,
	"rules" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	CONSTRAINT "roles_role_name_unique" UNIQUE("role_name")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" varchar(100) NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"version" varchar(50),
	"sourceFile" varchar(100),
	"binaryFile" varchar(100),
	"compileCommand" varchar(100),
	"runCommand" varchar(100),
	"isActive" boolean DEFAULT true,
	"canDelete" boolean DEFAULT true,
	"monacoCodeLanguage" varchar(50) DEFAULT 'plaintext',
	"templateCode" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	CONSTRAINT "languages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	CONSTRAINT "tags_tag_name_unique" UNIQUE("tag_name")
);
--> statement-breakpoint
CREATE TABLE "problem_languages" (
	"problem_id" uuid NOT NULL,
	"language_id" integer NOT NULL,
	"template_code" text,
	"time_limit_ms" integer DEFAULT 1000 NOT NULL,
	"memory_limit_kb" integer DEFAULT 256000 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	CONSTRAINT "ProblemLanguage_ProblemId_LanguageId_pk" PRIMARY KEY("problem_id","language_id")
);
--> statement-breakpoint
CREATE TABLE "problem_tags" (
	"problem_id" uuid NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	CONSTRAINT "ProblemTag_ProblemId_TagId_pk" PRIMARY KEY("problem_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" json,
	"problem_statement" json NOT NULL,
	"difficulty_level" smallint DEFAULT 1 NOT NULL,
	"time_limit_ms" integer DEFAULT 1000 NOT NULL,
	"memory_limit_kb" integer DEFAULT 256000 NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"hints" json,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "problems_title_unique" UNIQUE("title"),
	CONSTRAINT "problems_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "testcases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"index" smallint DEFAULT 1 NOT NULL,
	"problem_id" uuid NOT NULL,
	"input_data" text NOT NULL,
	"expected_output" text NOT NULL,
	"is_sample" boolean DEFAULT false NOT NULL,
	"is_hidden" boolean DEFAULT true NOT NULL,
	"points" smallint DEFAULT 0 NOT NULL,
	"label" varchar(50),
	"explanation" json,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission_testcases" (
	"submission_id" uuid NOT NULL,
	"testcase_id" uuid NOT NULL,
	"status" varchar(50) NOT NULL,
	"stdout" text,
	"problem_id" uuid NOT NULL,
	"runtime_ms" integer DEFAULT 1000 NOT NULL,
	"memory_used_kb" integer DEFAULT 256000 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	CONSTRAINT "SubmissionTestcase_SubmissionId_TestcaseId_pk" PRIMARY KEY("submission_id","testcase_id")
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"problem_id" uuid NOT NULL,
	"language_id" integer NOT NULL,
	"code" text NOT NULL,
	"status" varchar(50) NOT NULL,
	"execution_time_ms" integer NOT NULL,
	"memory_usage_kb" integer DEFAULT 256000 NOT NULL,
	"submitted_at" timestamp (6),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	"problem_contest_id" uuid,
	"is_test" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contest_participants" (
	"contest_id" uuid NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"registered_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	CONSTRAINT "ContestParticipant_ContestId_UserId_pk" PRIMARY KEY("contest_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "contests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255),
	"total_participants" integer DEFAULT 0 NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"details" jsonb,
	"prizes" jsonb,
	"is_public" boolean DEFAULT true NOT NULL,
	"image" text,
	"status" "contest_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaderboards" (
	"contest_id" uuid NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"rank" integer DEFAULT 0 NOT NULL,
	"total_time" integer DEFAULT 0 NOT NULL,
	"total_solved" integer DEFAULT 0 NOT NULL,
	"submitted_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	CONSTRAINT "Leaderboard_ContestId_UserId_pk" PRIMARY KEY("contest_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "problem_contests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contest_id" uuid NOT NULL,
	"problem_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discussion_id" uuid NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discussions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problem_ratings" (
	"problem_id" uuid NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"rating" smallint NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL,
	CONSTRAINT "ProblemRating_ProblemId_UserId_pk" PRIMARY KEY("problem_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" text NOT NULL,
	"table_name" text NOT NULL,
	"record_id" text NOT NULL,
	"user_id" varchar(100),
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"details" jsonb
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_idx" ON "profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "Action_Name_idx" ON "actions" USING btree ("action_name");--> statement-breakpoint
CREATE INDEX "Resource_Name_idx" ON "resources" USING btree ("resource_name");--> statement-breakpoint
CREATE INDEX "Role_Name_idx" ON "roles" USING btree ("role_name");--> statement-breakpoint
CREATE INDEX "Language_Name_idx" ON "languages" USING btree ("name");--> statement-breakpoint
CREATE INDEX "Tag_Name_idx" ON "tags" USING btree ("tag_name");--> statement-breakpoint
CREATE INDEX "ProblemLanguage_ProblemId_idx" ON "problem_languages" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "ProblemLanguage_LanguageId_idx" ON "problem_languages" USING btree ("language_id");--> statement-breakpoint
CREATE INDEX "ProblemTag_ProblemId_idx" ON "problem_tags" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "ProblemTag_TagId_idx" ON "problem_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "Problem_Title_idx" ON "problems" USING btree ("title");--> statement-breakpoint
CREATE INDEX "Problem_DifficultyLevel_idx" ON "problems" USING btree ("difficulty_level");--> statement-breakpoint
CREATE INDEX "Problem_IsPublic_idx" ON "problems" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "Testcase_ProblemId_idx" ON "testcases" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "Testcase_IsSample_idx" ON "testcases" USING btree ("is_sample");--> statement-breakpoint
CREATE INDEX "Testcase_IsHidden_idx" ON "testcases" USING btree ("is_hidden");--> statement-breakpoint
CREATE INDEX "SubmissionTestcase_SubmissionId_idx" ON "submission_testcases" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "SubmissionTestcase_TestcaseId_idx" ON "submission_testcases" USING btree ("testcase_id");--> statement-breakpoint
CREATE INDEX "SubmissionTestcase_ProblemId_idx" ON "submission_testcases" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "Submission_UserId_idx" ON "submissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "Submission_ProblemId_idx" ON "submissions" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "Submission_LanguageId_idx" ON "submissions" USING btree ("language_id");--> statement-breakpoint
CREATE INDEX "Submission_Status_idx" ON "submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "Submission_SubmittedAt_idx" ON "submissions" USING btree ("submitted_at");--> statement-breakpoint
CREATE INDEX "ContestParticipant_ContestId_idx" ON "contest_participants" USING btree ("contest_id");--> statement-breakpoint
CREATE INDEX "ContestParticipant_UserId_idx" ON "contest_participants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "Contest_Title_idx" ON "contests" USING btree ("title");--> statement-breakpoint
CREATE INDEX "Contest_Status_idx" ON "contests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "Contest_StartTime_idx" ON "contests" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "Leaderboard_ContestId_idx" ON "leaderboards" USING btree ("contest_id");--> statement-breakpoint
CREATE INDEX "Leaderboard_UserId_idx" ON "leaderboards" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "Leaderboard_Rank_idx" ON "leaderboards" USING btree ("rank");--> statement-breakpoint
CREATE INDEX "ProblemContest_ContestId_idx" ON "problem_contests" USING btree ("contest_id");--> statement-breakpoint
CREATE INDEX "ProblemContest_ProblemId_idx" ON "problem_contests" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "Comment_DiscussionId_idx" ON "comments" USING btree ("discussion_id");--> statement-breakpoint
CREATE INDEX "Comment_UserId_idx" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "Discussion_ProblemId_idx" ON "discussions" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "Discussion_UserId_idx" ON "discussions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ProblemRating_ProblemId_idx" ON "problem_ratings" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "ProblemRating_UserId_idx" ON "problem_ratings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "Notification_UserId_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "Notification_Type_idx" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "Notification_IsRead_idx" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "AuditLog_TableName_idx" ON "audit_logs" USING btree ("table_name");--> statement-breakpoint
CREATE INDEX "AuditLog_RecordId_idx" ON "audit_logs" USING btree ("record_id");--> statement-breakpoint
CREATE INDEX "AuditLog_UserId_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "AuditLog_Timestamp_idx" ON "audit_logs" USING btree ("timestamp");