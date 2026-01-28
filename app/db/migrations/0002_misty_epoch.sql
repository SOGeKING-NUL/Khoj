CREATE TABLE "places" (
	"place_id" text PRIMARY KEY NOT NULL,
	"display_name" text,
	"formatted_address" text,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
