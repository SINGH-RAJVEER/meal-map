# Development & Clean Code Guide: MealMap

## 1. Project Overview

MealMap is a modern web application built for speed, type safety, and maintainability.

### Tech Stack

- **Framework**: TanStack Start (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom "Liquid Glass" system based on shadcn/ui patterns
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Runtime**: Bun

## 2. Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`)
- PostgreSQL database running (local or cloud)

### Installation

```bash
# Install dependencies
bun install
```

### Environment Setup

1.  Copy `.env.example` to `.env`.
2.  Update `DATABASE_URL` and other secrets.

### Database Setup

```bash
# Generate SQL migrations/schema
bun run db:generate

# Push schema changes to the database
bun run db:push

# (Optional) Open Drizzle Studio to view data
bun run db:studio
```

### Running the App

```bash
# Start the development server
bun run dev

# The app will be available at http://localhost:3000
```

### Building for Production

```bash
# Build the application
bun run build

# Start the production server
bun run start
```

## 3. Clean Code Practices

### TypeScript

- **Strict Mode**: Always on. No `any`.
- **Interfaces**: Define clear interfaces/types for props, database models, and API responses.
- **Inference**: Let TypeScript infer types where obvious; don't over-annotate.

### Component Structure

- **File Naming**: PascalCase for components (`AuthForms.tsx`), kebab-case for utilities/pages (`auth-client.ts`).
- **Composition**: Prefer smaller, composable components over large monolithic ones.
- **Client vs Server**: Mark client components explicitly with `"use client";` at the top.
- **Colocation**: Keep related logic (hooks, types) close to the component if it's not reused.

### Styling (Tailwind v4)

- **Utility-First**: Use utility classes for layout, spacing, and sizing.
- **Custom Utilities**: Use the defined `@layer utilities` classes (`.glass`, `.glass-card`, `.text-gradient`) for standardizing the app's look. Do not manually re-invent the glass effect inline.
- **Colors**: Use CSS variables (`bg-background`, `text-foreground`, `bg-primary`) instead of raw colors (`bg-black`) to ensure Dark Mode compatibility.

### State Management

- **URL State**: Use TanStack Router for navigation state.
- **Server State**: Use loaders/actions for server data.
- **Local State**: `useState`/`useReducer` for UI interaction.

### Database (Drizzle)

- **Schema**: Define tables in `src/db/schema.ts`.
- **Queries**: Use the query builder. Avoid raw SQL strings unless necessary for performance.
- **Migrations**: Always generate and test migrations before pushing to production.

## 4. Contributing

1.  Create a branch for your feature.
2.  Follow the **Design Philosophy** (see `instructions/design_philosophy.md`).
3.  Ensure no console errors or type errors.
4.  Submit a PR.
