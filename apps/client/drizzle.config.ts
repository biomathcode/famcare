import type { Config } from "drizzle-kit";
import { env } from "~/env/server";

export default {
  out: "./drizzle",
  schema: "./src/lib/db/schema/index.ts",
  breakpoints: false,
  verbose: true,
  strict: true,
  dialect: "mysql",
  casing: "snake_case",
  dbCredentials: {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    ssl: { rejectUnauthorized: true },
  },
} satisfies Config;
