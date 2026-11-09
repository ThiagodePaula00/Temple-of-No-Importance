BEGIN;

CREATE TABLE IF NOT EXISTS password_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message text CHECK (message IS NULL OR char_length(message) <= 500),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'denied', 'completed')),
  reviewed_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at timestamp,
  completed_at timestamp
);

CREATE INDEX IF NOT EXISTS password_change_requests_status_created_idx
  ON password_change_requests(status, created_at);

CREATE INDEX IF NOT EXISTS password_change_requests_user_created_idx
  ON password_change_requests(user_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE password_change_requests TO posts_app;

COMMIT;
