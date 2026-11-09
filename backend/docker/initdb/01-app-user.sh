#!/bin/sh
set -eu

if [ "${#POSTGRES_PASSWORD}" -lt 24 ] || [ "${#POSTGRES_APP_PASSWORD}" -lt 24 ]; then
  echo "PostgreSQL production passwords must contain at least 24 characters." >&2
  exit 1
fi
case "$POSTGRES_PASSWORD $POSTGRES_APP_PASSWORD" in
  *placeholder*|*replace*|*change-me*|*example*)
    echo "Replace placeholder PostgreSQL production passwords." >&2
    exit 1
    ;;
esac

psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  --set=app_password="$POSTGRES_APP_PASSWORD" <<'SQL'
CREATE ROLE posts_app LOGIN PASSWORD :'app_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
GRANT CONNECT ON DATABASE "templeBlog" TO posts_app;
GRANT USAGE, CREATE ON SCHEMA public TO posts_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO posts_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO posts_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO posts_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO posts_app;
SQL
