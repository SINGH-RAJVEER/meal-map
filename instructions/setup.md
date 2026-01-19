# Setup & Running Instructions

## Prerequisites

- [Bun](https://bun.sh/) installed
- PostgreSQL installed and running

## Installation

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
