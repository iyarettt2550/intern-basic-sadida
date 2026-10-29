import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

// ระบุ path ให้ตรงกับไฟล์ .env.local ที่ดึงมาจาก Vercel
dotenv.config({ path: ".env.local" });

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:1234@localhost:5432/sadida";

const client = postgres(connectionString);

export const db = drizzle(client, { schema });
export { schema };