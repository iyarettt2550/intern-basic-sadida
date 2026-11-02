import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config({ path: ".env.local" });
dotenv.config();

const NEON_DEFAULT_URL =
  "postgresql://neondb_owner:npg_f5y8DkpOTmCn@ep-fancy-bread-b3zupoaq-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const connectionString =
  process.env.DATABASE_URL ||
  (process.env.VERCEL ? NEON_DEFAULT_URL : "postgresql://postgres:1234@localhost:5432/sadida");

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const useNeonHttp =
  Boolean(process.env.VERCEL) || /neon\.(tech|build)/i.test(connectionString);

export const db = useNeonHttp
  ? drizzleNeonHttp(neon(connectionString), { schema })
  : drizzlePostgres(postgres(connectionString), { schema });

export { schema };
