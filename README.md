# Temple of No Importance

Temple of No Importance is a personal blog about philosophy and related subjects, including mathematics, psychology, and science. Visitors can read and search published posts. Administrators can write Markdown posts, upload images, manage drafts, and administer their account.

## Site screenshot

![Captura de tela do site](docs/app.png)

## Features

- Public homepage with a featured post and a list of recent published posts.
- Individual post pages with cover images, author and publication details, and Markdown content.
- Search across published post content.
- Light and dark themes, responsive navigation, and a mobile menu.
- Account registration and sign-in. The first registered account becomes the administrator; later accounts are regular users.
- Protected administration pages for creating, editing, publishing, unpublishing, filtering, and deleting posts.
- Markdown preview, GitHub-flavored Markdown, and mathematical notation rendered with KaTeX.
- Separate cover-image and in-content image upload controls. Uploads accept JPG, PNG, and WEBP files up to 5 MB, resize images to at most 1920 pixels wide, convert them to WEBP, and store them in persistent backend storage.
- Profile updates, password changes, account deletion, refreshable sign-in sessions, and sign-out.
- About and Privacy Policy pages.

## Technology and architecture

- **Frontend:** Next.js 16, React 19, TypeScript, and Tailwind CSS.
- **Backend:** NestJS 12 REST API, TypeORM, and Sharp image processing.
- **Database:** PostgreSQL 18.
- **Local orchestration:** Docker Compose.

The frontend runs at `http://localhost:3001` and calls the API at `http://localhost:3000`. Inside Compose, it reaches the backend using `http://backend:3000`. The API stores posts, accounts, and refresh-token hashes in PostgreSQL. Uploaded image files live in the `uploads_data` Docker volume and are served by the API under `/uploads/`. The frontend's authenticated upload route returns a same-origin `/api/uploads/...` path for use in post Markdown and cover fields.

The public API returns only published posts. Administrative API routes require a valid access token and administrator role. The frontend keeps access and refresh tokens in HttpOnly cookies. Access tokens last 15 minutes; refresh tokens last 7 days, rotate when refreshed, and are stored in the database as SHA-256 hashes. Passwords are hashed with bcrypt.

TypeORM schema synchronization defaults to enabled outside production and disabled in production. This project does not yet include database migrations, so provision the production schema before starting the production backend. Do not enable `TYPEORM_SYNCHRONIZE` in a production environment.

The backend rejects the example JWT secret, and production startup also rejects the example database password. Replace both placeholders in `backend/.env` before deployment.

## Run with Docker Compose

Prerequisites: Docker and the Docker Compose plugin.

1. Create the backend environment file:

   ```sh
   cp backend/.env.example backend/.env
   ```

2. Edit `backend/.env`. Set a strong `POSTGRES_PASSWORD` and a random `JWT_SECRET_KEY` with at least 32 characters. For example:

   ```sh
   openssl rand -base64 48
   ```

   Keep real secrets in `backend/.env`; do not commit or share that file. The checked-in `.env.example` contains placeholders only.

3. Build and start PostgreSQL, the backend, and the frontend:

   ```sh
   docker compose up --build
   ```

   Compose builds the backend and frontend development stages. The frontend source is mounted into its container; rebuild the backend image after backend source changes. Run in the background with `docker compose up --build -d`.

   - Blog: <http://localhost:3001>
   - API: <http://localhost:3000>
   - API health: <http://localhost:3000/health>
   - PostgreSQL: `localhost:5432`

Compose waits for PostgreSQL's health check before starting the backend. Database data persists in the `postgres_data` volume; uploaded images persist in `uploads_data`.

To rebuild a service after dependency or source changes:

```sh
docker compose up -d --build backend frontend
```

To stop the services while retaining data, run `docker compose down`. To also delete database and uploaded image volumes, run `docker compose down -v`.

The development Compose file publishes PostgreSQL on `127.0.0.1:5432`, so DBeaver can connect locally. Production uses the separate `compose.production.yaml`; PostgreSQL has no published port and is reachable only on the internal database network.

### Production deployment configuration

Create untracked deployment files from the examples, then replace every placeholder with secrets from a secret manager or deployment environment:

```sh
cp .env.production.example .env.production
cp backend/.env.production.example backend/.env.production
```

Set `POSTGRES_ADMIN_PASSWORD`, `POSTGRES_APP_PASSWORD`, and `NEXT_PUBLIC_API_URL` in `.env.production`. Set `JWT_SECRET_KEY`, the actual HTTPS `CORS_ORIGINS`, and the trusted proxy's exact IP/CIDR in `backend/.env.production`. `CORS_ORIGINS` accepts a comma-separated allowlist and production rejects missing, non-HTTPS, wildcard, or URL-path values. API CORS does not enable credentials because browser authentication is mediated by the same-origin Next.js app.

Start production with:

```sh
docker compose --env-file .env.production -f compose.production.yaml up --build -d
```

The production API and frontend bind to loopback so a host reverse proxy can serve them over HTTPS. Configure it to route the public API origin to the backend and the site to the frontend. The backend database role `posts_app` is non-superuser and only receives schema and application data permissions; keep the separate PostgreSQL administrator secret private. Production TypeORM synchronization is disabled. The current project has no migration workflow, so provision the schema before deployment.

The role-creation script runs only when PostgreSQL initializes an empty data volume. If you attach an existing volume, create `posts_app` and grant its schema/table/sequence permissions manually before starting the backend.

### Rate limits and HTTP security

The API uses `@nestjs/throttler`: default 120 requests per 60 seconds per client IP, sign-up/sign-in 5 per minute, refresh/logout 10 per minute, public post search 30 per minute, and uploads 10 per minute. Set `RATE_LIMIT_MAX` and `RATE_LIMIT_TTL_MS` in the backend environment to tune the global limit. Authentication uses a short IP-based request cap and deliberately has no account lockout, avoiding attacker-triggered account denial of service. There is no password recovery endpoint yet.

Rate-limit storage is in memory because the supplied Compose deployment runs one backend replica. Do not scale the API horizontally until a shared `@nestjs/throttler` storage backend such as Redis is configured; separate replicas otherwise enforce separate counters. Configure `TRUSTED_PROXIES` with only the reverse proxy IP addresses/CIDRs. It is empty by default, so client-supplied `X-Forwarded-For` is not trusted.

Next.js adds a per-request nonce-based CSP, denies framing, and sets content-type, referrer, frame, permissions, and production HSTS headers. Inline frontend styles were moved to stylesheets; production script policy does not allow `unsafe-inline`. Development permits `unsafe-eval` for the Next.js dev runtime only. The Nest API also sets its own restrictive CSP and common security headers.

## Accounts and administration

- Register at `/sign-up` and sign in at `/sign-in`.
- The first account created in an empty database becomes the administrator. Later accounts are regular users and cannot access administrator features.
- Administrators can open `/admin`, create posts at `/admin/post/new`, edit posts, filter posts by published or draft status, and manage their profile and password.
- Posts are drafts by default unless **Publish now** is selected. Only published posts appear on the public site.
- Passwords must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character. They are limited to 72 bytes.
- Password recovery by email is not configured. Contact the site operator if administrator access needs to be recovered.
- No sample posts are seeded automatically. Existing records in the PostgreSQL volume are retained across normal restarts and rebuilds.

## Writing posts and adding images

Post content uses Markdown. The admin editor supports headings, lists, links, tables, fenced code blocks, GitHub-flavored Markdown, and math notation. Markdown is sanitized before rendering.

Use the **Insert image in content** button below the content editor to upload an image. It inserts Markdown at the current cursor position, for example:

```md
![A description of the image](/api/uploads/1712345678901-123456789.webp)
```

The cover uploader is separate and sets the post's cover image. Uploaded images are normalized to WEBP and kept in the `uploads_data` volume. Back up this volume along with the database if you need to preserve the site's content and media.

Inline and display math are supported with single and double dollar signs:

```md
Einstein's equation is $E = mc^2$.

$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

## REST API

The API provides:

| Method and path | Access | Purpose |
| --- | --- | --- |
| `GET /health` | Public | Health check |
| `GET /posts?q=...` | Public | List published posts; optional search over post content |
| `GET /posts/:slug` | Public | Read one published post |
| `POST /auth/sign-up` | Public | Register an account; the first account becomes administrator |
| `POST /auth/sign-in` | Public | Sign in and issue tokens |
| `POST /auth/refresh` | Public, refresh token required | Rotate a session token pair |
| `POST /auth/logout` | Public, refresh token required | Revoke a refresh token |
| `GET /auth/me` | Authenticated | Read the current account |
| `PATCH /auth/me` | Authenticated | Update account name and email |
| `PATCH /auth/me/password` | Authenticated | Change password and revoke active sessions |
| `DELETE /auth/me` | Authenticated | Delete the current account |
| `GET /posts/admin` | Administrator | List posts including drafts |
| `GET /posts/admin/:id` | Administrator | Read a post by ID, including drafts |
| `POST /posts` | Administrator | Create a post |
| `PATCH /posts/:id` | Administrator | Update a post |
| `DELETE /posts/:id` | Administrator | Delete a post |
| `POST /upload` | Administrator | Upload and convert an image |
| `GET /uploads/:filename` | Public | Retrieve an uploaded image |

Request examples for the REST Client extension are in [`backend/client.rest`](backend/client.rest). Replace its sample credentials and upload-file path before using it. The image endpoint returns a backend URL; the frontend upload route returns the same-origin path used by the admin editor.

## Run without Docker

Install dependencies in both applications and configure `backend/.env` as described above. Start PostgreSQL separately, then start the API and frontend in separate terminals:

```sh
cd backend
npm ci
npm run start:dev
```

```sh
cd frontend
npm ci
npm run dev -- --port 3001
```

The frontend defaults to an API at `http://localhost:3000`; set `POSTS_API_URL` if your API uses a different address. The backend defaults to PostgreSQL on `localhost:5432` and API port `3000`.

## Project structure

```text
backend/       NestJS API, authentication, posts, uploads, and REST Client examples
frontend/      Next.js blog, admin interface, Markdown renderer, and API routes
compose.yaml   Production-oriented Docker Compose services and persistent volumes
README.md      Project setup and feature documentation
```
