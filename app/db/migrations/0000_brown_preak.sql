CREATE TABLE "reel_metadata" (
	"schortcode" text PRIMARY KEY NOT NULL,
	"url" text,
	"validation" boolean,
	"caption" text,
	"comments" text[],
	"transcipt" text,
	"hastags" text,
	"created_at" timestamp with time zone DEFAULT now()
);
