import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "./schema";

if (!process.env.VERCEL) {
  dotenv.config({ path: ".env.local" });
  dotenv.config();
}

const connectionString =
  process.env.DATABASE_URL ||
  (!process.env.VERCEL ? "postgresql://postgres:1234@localhost:5432/sadida" : "");

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Please configure DATABASE_URL in environment variables.");
}

const useNeonHttp =
  Boolean(process.env.VERCEL) || /neon\.(tech|build)/i.test(connectionString);

export const db = useNeonHttp
  ? drizzleNeonHttp(neon(connectionString), { schema })
  : drizzlePostgres(postgres(connectionString), { schema });

export { schema };
