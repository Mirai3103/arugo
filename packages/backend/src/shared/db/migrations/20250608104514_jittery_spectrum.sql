CREATE TABLE "gen_ai_prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"prompt" text NOT NULL,
	"key" varchar(100) NOT NULL,
	"description" text,
	CONSTRAINT "gen_ai_prompts_key_unique" UNIQUE("key")
);
