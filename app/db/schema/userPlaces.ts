import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "./user";
import { places } from "./places";

export const userPlaces = pgTable('user_places',{
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(()=>user.userId, { onDelete: 'cascade' }),
    placeId: text('place_id').notNull().references(()=>places.placeId, { onDelete: 'cascade' }),
    savedAt: timestamp('saved_at', { withTimezone: true }).defaultNow()
}, (userPlaces)=> ({
    placesUnique: unique().on(userPlaces.userId, userPlaces.placeId)
}));