import { pgTable, text, doublePrecision, timestamp, foreignKey, boolean, unique, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const places = pgTable("places", {
	placeId: text("place_id").primaryKey().notNull(),
	displayName: text("display_name"),
	formattedAddress: text("formatted_address"),
	lat: doublePrecision().notNull(),
	lng: doublePrecision().notNull(),
	type: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const reelMetadata = pgTable("reel_metadata", {
	shortCode: text().primaryKey().notNull(),
	url: text(),
	validation: boolean().default(false),
	caption: text(),
	comments: text().array(),
	transcript: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	placeId: text("place_id"),
	hashtags: text().array(),
	thumbnail: text(),
}, (table) => [
	foreignKey({
			columns: [table.placeId],
			foreignColumns: [places.placeId],
			name: "reel_metadata_place_id_places_place_id_fk"
		}).onDelete("cascade"),
]);

export const userReels = pgTable("user_reels", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	shortCode: text("short_code").notNull(),
	savedAt: timestamp("saved_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.userId],
			name: "user_reels_user_id_user_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.shortCode],
			foreignColumns: [reelMetadata.shortCode],
			name: "user_reels_short_code_reel_metadata_shortCode_fk"
		}).onDelete("cascade"),
	unique("user_reels_user_id_short_code_unique").on(table.userId, table.shortCode),
]);

export const user = pgTable("user", {
	userId: text("user_id").primaryKey().notNull(),
	email: text(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	profileImageUrl: text("profile_image_url"),
});

export const userPlaces = pgTable("user_places", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id"),
	placeId: text("place_id").notNull(),
	savedAt: timestamp("saved_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.userId],
			name: "user_places_user_id_user_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.placeId],
			foreignColumns: [places.placeId],
			name: "user_places_place_id_places_place_id_fk"
		}).onDelete("cascade"),
	unique("user_places_user_id_place_id_unique").on(table.userId, table.placeId),
]);
