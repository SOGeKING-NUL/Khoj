ALTER TABLE "user_places" DROP CONSTRAINT "user_places_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_places" DROP CONSTRAINT "user_places_place_id_places_place_id_fk";
--> statement-breakpoint
ALTER TABLE "user_places" ADD COLUMN "saved_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_places" ADD CONSTRAINT "user_places_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_places" ADD CONSTRAINT "user_places_place_id_places_place_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("place_id") ON DELETE cascade ON UPDATE no action;