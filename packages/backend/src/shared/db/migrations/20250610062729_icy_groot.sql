ALTER TABLE "contests" ALTER COLUMN "details" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contests" ADD COLUMN "total_problems" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "contests" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;