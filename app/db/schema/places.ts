import { pgTable, doublePrecision, text, timestamp } from "drizzle-orm/pg-core";

export const places= pgTable('places',{
    placeId: text('place_id').primaryKey(),
    displayName: text("display_name"),
    formattedAddress: text('formatted_address'),
    lat: doublePrecision('lat').notNull(),
    lng: doublePrecision('lng').notNull(),
    type: text('type').notNull(),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow()
});