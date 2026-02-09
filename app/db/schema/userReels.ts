import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "./user";
import { reelMetadata } from "./reelMetadata";

export const userReels = pgTable('user_reels', {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => user.userId, { onDelete: 'cascade' }),
    shortCode: text('short_code').notNull().references(() => reelMetadata.shortCode, { onDelete: 'cascade' }),
    savedAt: timestamp('saved_at', { withTimezone: true }).defaultNow()
}, (userReels) => ({
    userReelUnique: unique().on(userReels.userId, userReels.shortCode)
}));
