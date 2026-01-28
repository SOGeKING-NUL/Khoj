import {pgTable, text, boolean, timestamp} from "drizzle-orm/pg-core";
import {places} from "./places";

export const reelMetadata= pgTable('reel_metadata',{
    shortCode: text('shortCode').primaryKey(),
    url: text('url'),
    validation: boolean('validation').default(false),
    caption: text('caption'), 
    comments: text('comments').array(),
    transcript: text('transcript'),
    hashtags: text('hashtags').array(),
    place_id: text('place_id').references(()=>places.placeId),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow()
});