import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || "postgresql://localhost:5432/meal_map";

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
