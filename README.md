# MealMap

A modern meal tracking application built with TanStack Start, Tailwind CSS v4, shadcn/ui, and PostgreSQL.

## Features

- **Secure Authentication** - Built with Better Auth
- **Modern UI** - Styled with Tailwind CSS v4 and shadcn/ui components
- **Calorie Tracking** - Log meals and track your daily calorie intake
- **PostgreSQL Database** - Powered by Drizzle ORM
- **Fast & Modern** - Built with Bun, React 19, and TanStack Start

## Tech Stack

- **Framework**: TanStack Start (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Runtime**: Bun
- **Router**: TanStack Router

## Linting & Formatting

Run Biome linting and formatting:

```bash
bun run lint
bun run lint:fix
bun run format
bun run check
```

## Docker (Development)

Use the development container setup in `docker/dev`:

```bash
docker compose -f docker/dev/compose.yml up --build
```
