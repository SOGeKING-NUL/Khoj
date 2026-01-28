ALTER TABLE reel_metadata DROP COLUMN hashtags;

ALTER TABLE reel_metadata ADD COLUMN hashtags TEXT[];
