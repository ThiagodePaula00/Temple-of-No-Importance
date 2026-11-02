# Temple of No Importance

## Run with Docker Compose

Prerequisites: Docker and the Docker Compose plugin.

1. From the project root, create `backend/.env` from the example file:

   ```sh
   cp backend/.env.example backend/.env
   ```

2. Open `backend/.env` and replace `POSTGRES_PASSWORD` with your chosen password. Configure the database environment variables in this file, not in the Dockerfile or Compose file. Compose reads it to configure PostgreSQL and makes the same values available to the backend. `backend/.env` is a local file and must not be shared or committed; only `backend/.env.example`, without a real password, belongs in the repository.
3. From the project root, start PostgreSQL, the backend, and the frontend with one command:

   ```sh
   docker compose up --build
   ```

   Compose automatically loads `compose.override.yaml` for development. It mounts the backend and frontend source directories into their containers and runs Nest with a polling file watcher and Next.js dev mode, so code changes are picked up automatically, including when Docker cannot forward native filesystem events. Node dependencies and the Next.js build cache stay in container-managed volumes.

   To run the services in the background, use `docker compose up --build -d`.

   If you change a `package.json` or lockfile and add/remove dependencies, rebuild and refresh the container dependency volumes:

   ```sh
   docker compose up --build --renew-anon-volumes
   ```

- Frontend: <http://localhost:3001>
- Backend: <http://localhost:3000>
- PostgreSQL: `localhost:5432` (default port)

Compose waits for PostgreSQL to become healthy before starting the backend. Database data is persisted in the `postgres_data` volume. The images use Node.js 26 and PostgreSQL 18. PostgreSQL uses the database and username defined in `backend/.env`; those values are also available to the backend, with `DB_HOST=postgres` and `DB_PORT=5432` for container-to-container connections.

To stop the services, run `docker compose down`. To also remove the persisted database data, run `docker compose down -v`.

### Production containers

The base `compose.yaml` and Dockerfiles retain the optimized production images. To run those without the development override, explicitly select the base file:

```sh
docker compose -f compose.yaml up --build -d
```

In this mode, source changes require rebuilding and recreating the application containers.

## Run locally

To develop without Docker, install dependencies in `backend/` and `frontend/` with `npm ci`, then start each application from its directory with `npm run start:dev` (backend) and `npm run dev -- --port 3001` (frontend). PostgreSQL must be available separately if the application uses it.
