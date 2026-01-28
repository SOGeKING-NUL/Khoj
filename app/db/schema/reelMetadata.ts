import {pgTable, text, boolean, timestamp} from "drizzle-orm/pg-core";

export const reelMetadata= pgTable('reel_metadata',{
    shortcode: text('schortcode').primaryKey(),
    url: text('url'),
    validation: boolean('validation'),
    caption: text('caption'), 
    comments: text('comments').array(),
    transcript: text('transcipt'),
    hastags: text('hastags'),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow()
});