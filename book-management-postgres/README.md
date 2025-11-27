# Book Management API (PostgreSQL + Drizzle + Node.js)

A Node.js REST API for managing books, authors, and users backed by PostgreSQL. It uses Drizzle ORM for schema and migrations, JWT authentication, and includes structured routing and middlewares.

## Features

- PostgreSQL database with Drizzle ORM
- Entities: Users, Authors, Books
- Auth: JWT-based authentication and role-based access (admin endpoints)
- Modular architecture (controllers, models, routes, middlewares)
- Request logging middleware
- Docker Compose for local Postgres

## Tech Stack

- Runtime: Node.js
- Framework: Express
- DB: PostgreSQL
- ORM/Migrations: Drizzle
- Auth: JWT
- Containerization: Docker Compose (for Postgres)

## Project Structure

```
book-management-postgres/
  controllers/               # Controller methods
  db/
    index.js                 # DB connection / Drizzle client
  middlewares/
    auth.middleware.js       # JWT auth / role checks
    logger.js                # Request logger
  models/
    author.model.js
    book.model.js
    user.model.js            # Drizzle schema definitions
  routes/
    admin.routes.js
    author.routes.js
    books.routes.js
    user.routes.js
  drizzle.config.js          # Drizzle CLI config
  docker-compose.yml         # Local Postgres
  index.js                   # App entrypoint
  package.json
```

## Prerequisites

- Node.js (LTS)
- pnpm
- Docker (optional but recommended for Postgres)

## Environment Variables

Create a .env file in book-management-postgres with the following variables:

```
# Server
PORT=3000
NODE_ENV=development
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=books
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
```

Notes:
- JWT_SECRET should be a strong random string in production.
- DATABASE_URL must match your docker-compose.yml or your local DB settings.

## Getting Started

1) Start PostgreSQL via Docker (recommended):

```
docker-compose up -d
```

2) Install dependencies:

```
pnpm install
```

3) Generate and run migrations (if using Drizzle CLI):

```
# generate SQL from schema
npx drizzle-kit generate

# push/apply migrations
npx drizzle-kit push
```

4) Start the server:

```
# development
pnpm run dev

# production
pnpm run start
```

The API should be running at http://localhost:4000


## Authentication

- Use Authorization: Bearer <jwt-token> header for protected routes.
- After login, store the token client-side and include it in subsequent requests.
- Role checks are handled in middlewares/auth.middleware.js.

## Logger

middlewares/logger.js logs method, path, and timing for requests. Useful during development and debugging.

## Database and Drizzle

- models/*.model.js define Drizzle schema objects for users, authors, and books.
- db/index.js initializes the database client using DATABASE_URL.
- drizzle.config.js configures Drizzle CLI (dialect, out directory, schema paths).
- Use the CLI to generate and push migrations when schema changes.

Common Drizzle CLI examples:
```
# generate SQL migrations from schema
npx drizzle-kit generate

# apply migrations to database
npx drizzle-kit push

# visualize schema (if configured)
npx drizzle-kit studio
```

## License

MIT