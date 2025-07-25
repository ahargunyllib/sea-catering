# SEA Catering

SEA Catering is a modern web application for managing catering services, built with a focus on type safety and developer experience. It leverages the latest technologies including TypeScript, TanStack Router, TailwindCSS, shadcn/ui, Hono, tRPC, Bun, Drizzle ORM, and PostgreSQL.
This project is designed to be a robust and scalable solution for catering management, providing a seamless experience for both developers and end-users.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **tRPC** - End-to-end type-safe APIs
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Email & password authentication with Better Auth
- **Biome** - Linting and formatting
- **Husky** - Git hooks for code quality
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
pnpm install
```
## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:
```bash
pnpm db:push
```


Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.

The API is running at [http://localhost:3000](http://localhost:3000).

## Run in Docker (Production)
To run the application in Docker, you can use the provided `prod.docker-compose.yml` file.
1. Make sure you have Docker installed.
2. Build and start the containers:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env

docker compose up -d --build
```

3. Apply the database schema:

Change the database host in `apps/server/.env` to `localhost` (the service name in Docker Compose).

Then run the following command to push the schema:

```bash
pnpm db:push
```
4. Access the web application at [http://localhost:3001](http://localhost:3001) and the API at [http://localhost:3000](http://localhost:3000).

## Credentials

For checking the admin dashboard, you can register a new user with domain `@compfest.id`

## Project Structure

```
sea-catering/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   └── server/      # Backend API (Hono, TRPC)
```

## Available Scripts

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications
- `pnpm dev:web`: Start only the web application
- `pnpm dev:server`: Start only the server
- `pnpm check-types`: Check TypeScript types across all apps
- `pnpm db:push`: Push schema changes to database
- `pnpm db:studio`: Open database studio UI
- `pnpm check`: Run Biome formatting and linting
