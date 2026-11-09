BEGIN;

DO $$
DECLARE
  parent_foreign_key text;
BEGIN
  SELECT constraint_row.conname
  INTO parent_foreign_key
  FROM pg_constraint AS constraint_row
  JOIN pg_attribute AS column_row
    ON column_row.attrelid = constraint_row.conrelid
   AND column_row.attnum = ANY(constraint_row.conkey)
  WHERE constraint_row.conrelid = 'comments'::regclass
    AND constraint_row.contype = 'f'
    AND column_row.attname = 'parent_id';

  IF parent_foreign_key IS NOT NULL THEN
    EXECUTE format('ALTER TABLE comments DROP CONSTRAINT %I', parent_foreign_key);
  END IF;

  ALTER TABLE comments
    ADD CONSTRAINT comments_parent_reply_fk
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE;
END $$;

COMMIT;
