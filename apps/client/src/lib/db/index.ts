import { serverOnly } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "~/env/server";

import * as schema from "~/lib/db/schema";

const driver = mysql.createPool({
  uri: env.DATABASE_URL, // e.g. mysql://user:pass@host:port/dbname
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: true,
  }
});

const getDatabase = serverOnly(() =>
  drizzle(driver, { schema, mode: "default" }),
);

export const db = getDatabase();
