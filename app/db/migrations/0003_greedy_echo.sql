ALTER TABLE "reel_metadata" ALTER COLUMN "validation" SET DEFAULT false;

CREATE FUNCTION auto_validate_reel()
RETURNS trigger AS $$
BEGIN
    IF NEW.place_id IS NOT NULL THEN
    NEW.validation:= true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reel_metadata_validation
BEFORE UPDATE reel_metadata
FOR EACH ROW
EXECUTE FUNCTION auto_validate_reel();