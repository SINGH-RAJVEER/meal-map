# Setup & Running Instructions

## Docker Development (Recommended)

The easiest way to get started is using Docker Compose, which handles the app and PostgreSQL automatically with hot reload.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed

### Quick Start

1. Copy the example env file:

```bash
cp docker/dev/.env.example docker/dev/.env
```

Edit `docker/dev/.env` and set a strong `BETTER_AUTH_SECRET` (generate one with `openssl rand -base64 32`).

2. Start all services:

```bash
docker compose -f docker/dev/docker-compose.yml up --build
```

The app will be available at `http://localhost:3000` with hot reload enabled.

3. Push the database schema (first time only, in a separate terminal):

```bash
docker compose -f docker/dev/docker-compose.yml exec app bun run db:push
```

4. Stop all services:

```bash
docker compose -f docker/dev/docker-compose.yml down
```

To also remove the database volume:

```bash
docker compose -f docker/dev/docker-compose.yml down -v
```

---

## Manual Setup (without Docker)

### Prerequisites

- [Bun](https://bun.sh/) installed
- PostgreSQL installed and running

### Installation

1. Clone the repository and install dependencies:

```bash
bun install
```

2. Set up your environment variables:

```bash
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL` if needed:

```env
DATABASE_URL=postgresql://localhost:5432/calorie_tracker
```

3. Create the PostgreSQL database:

```bash
createdb calorie_tracker
```

4. Push the database schema:

```bash
bun run db:push
```

5. Start the development server:

```bash
bun run dev
```

The app will be available at `http://localhost:3000`

## Database Commands

- `bun run db:generate` - Generate migration files
- `bun run db:push` - Push schema changes directly to the database
- `bun run db:migrate` - Run pending migrations
- `bun run db:studio` - Open Drizzle Studio to view/edit data

# Building For Production

To build this application for production:

```bash
bun run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
bun run test
```

## Linting & Formatting

Use Biome to lint and format the codebase:

```bash
bun run lint
bun run lint:fix
bun run format
bun run check
```
