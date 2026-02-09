-- Drop the old broken trigger and function
DROP TRIGGER IF EXISTS update_reel_metadata_validation ON reel_metadata;
DROP FUNCTION IF EXISTS auto_validate_reel();

-- Create a new trigger that works on both INSERT and UPDATE
CREATE OR REPLACE FUNCTION auto_validate_reel()
RETURNS trigger AS $$
BEGIN
    IF NEW.place_id IS NOT NULL THEN
        NEW.validation := true;
    ELSE
        NEW.validation := false;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reel_metadata_validation
BEFORE INSERT OR UPDATE ON reel_metadata
FOR EACH ROW
EXECUTE FUNCTION auto_validate_reel();

-- Update existing rows to fix validation column
UPDATE reel_metadata 
SET validation = true 
WHERE place_id IS NOT NULL;

UPDATE reel_metadata 
SET validation = false 
WHERE place_id IS NULL;
