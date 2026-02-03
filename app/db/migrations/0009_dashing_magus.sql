ALTER TABLE "reel_metadata" DROP CONSTRAINT "reel_metadata_place_id_places_place_id_fk";
--> statement-breakpoint
ALTER TABLE "reel_metadata" ADD CONSTRAINT "reel_metadata_place_id_places_place_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("place_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_places" ADD CONSTRAINT "user_places_user_id_place_id_unique" UNIQUE("user_id","place_id");