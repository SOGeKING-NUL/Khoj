import {pgTable, text, boolean, timestamp} from "drizzle-orm/pg-core";
import {places} from "./places";

export const reelMetadata= pgTable('reel_metadata',{
    shortCode: text('schortcode').primaryKey(),
    url: text('url'),
    validation: boolean('validation'),
    caption: text('caption'), 
    comments: text('comments').array(),
    transcript: text('transcipt'),
    hashtags: text('hastags'),
    place_id: text('place_id').references(()=>places.placeId),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow()
});