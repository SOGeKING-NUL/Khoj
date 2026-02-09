CREATE TABLE "user_reels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"short_code" text NOT NULL,
	"saved_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_reels_user_id_short_code_unique" UNIQUE("user_id","short_code")
);
--> statement-breakpoint
ALTER TABLE "reel_metadata" ADD COLUMN "thumbnail" text;--> statement-breakpoint
ALTER TABLE "user_reels" ADD CONSTRAINT "user_reels_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_reels" ADD CONSTRAINT "user_reels_short_code_reel_metadata_shortCode_fk" FOREIGN KEY ("short_code") REFERENCES "public"."reel_metadata"("shortCode") ON DELETE cascade ON UPDATE no action;