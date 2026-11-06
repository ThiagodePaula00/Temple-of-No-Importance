# Temple of No Importance

## Run with Docker Compose

Prerequisites: Docker and the Docker Compose plugin.

1. From the project root, create `backend/.env` from the example file:

   ```sh
   cp backend/.env.example backend/.env
   ```

2. Open `backend/.env` and replace `POSTGRES_PASSWORD` with your chosen password. Set `JWT_SECRET_KEY` to a random secret of at least 32 characters (for example, generate one with `openssl rand -base64 48`). Configure the database and JWT environment variables in this file, not in the Dockerfile or Compose file. Compose reads it to configure PostgreSQL and makes the same values available to the backend. `backend/.env` is a local file and must not be shared or committed; only `backend/.env.example`, without real secrets, belongs in the repository.
3. From the project root, start PostgreSQL, the backend, and the frontend with one command:

   ```sh
   docker compose up --build
   ```

   Compose automatically loads `compose.override.yaml` for development. It mounts the backend and frontend source directories into their containers and runs Nest with a polling file watcher and Next.js dev mode, so code changes are picked up automatically, including when Docker cannot forward native filesystem events. Node dependencies and the Next.js build cache stay in container-managed volumes.

   To run the services in the background, use `docker compose up --build -d`.

   If you change the backend dependencies, rebuild the backend image:

   ```sh
   docker compose up -d --build backend
   ```

   Frontend dependencies are stored in the named `frontend_node_modules` volume. To refresh that volume after changing the frontend lockfile, stop the frontend, install from its lockfile in a one-off container, and start it again:

   ```sh
   docker compose stop frontend
   docker compose run --rm --no-deps frontend npm ci
   docker compose up -d --build frontend
   ```

   Do not use `docker compose down -v` for routine dependency refreshes: it also deletes the PostgreSQL data volume.

- Frontend: <http://localhost:3001>
- Backend: <http://localhost:3000>
- PostgreSQL: `localhost:5432` (default port)

Compose waits for PostgreSQL to become healthy before starting the backend. Database data is persisted in the `postgres_data` volume. The images use Node.js 26 and PostgreSQL 18. PostgreSQL uses the database and username defined in `backend/.env`; those values are also available to the backend, with `DB_HOST=postgres` and `DB_PORT=5432` for container-to-container connections.

## Accounts and administration

- Create an account at <http://localhost:3001/sign-up> and sign in at <http://localhost:3001/sign-in>.
- The first account registered in an empty database receives administrator access. Later registrations are regular accounts and cannot access the admin area or modify posts.
- The protected admin area is <http://localhost:3001/admin>. Create posts at `/admin/post/new`; manage posts and your account from the admin navigation.
- Automatic sample-data seeding has been removed. Posts already stored in the PostgreSQL volume are preserved and are not deleted by this change.
- The sign-in page links to `/forgot-password`, but email-based recovery is not configured. Contact the site administrator if access must be recovered.
- Cover images currently use a publicly reachable URL. File upload needs a durable storage service and is not enabled.

To stop the services, run `docker compose down`. To also remove the persisted database data, run `docker compose down -v`.

### Production containers

The base `compose.yaml` and Dockerfiles retain the optimized production images. To run those without the development override, explicitly select the base file:

```sh
docker compose -f compose.yaml up --build -d
```

In this mode, source changes require rebuilding and recreating the application containers.

## Run locally

To develop without Docker, install dependencies in `backend/` and `frontend/` with `npm ci`, then start each application from its directory with `npm run start:dev` (backend) and `npm run dev -- --port 3001` (frontend). PostgreSQL must be available separately if the application uses it.

## Math in post content

Post content is written in Markdown. Use single dollar signs for inline math:

```md
Einstein's equation is $E = mc^2$.
```

Use double dollar signs on separate lines for a displayed equation:

```md
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

The public post page renders these expressions with KaTeX. Administrators can enter Markdown in the post creation and editing forms.
