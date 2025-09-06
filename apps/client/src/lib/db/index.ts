import { serverOnly } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/tidb-serverless";

import * as schema from "~/lib/db/schema";

// const driver = mysql.createPool({
//   uri: process.env.DATABASE_URL, // e.g. mysql://user:pass@host:port/dbname
//   connectionLimit: 10,
//   ssl: {
//     rejectUnauthorized: true,
//   }
// });


const getDatabase = serverOnly(() =>
  drizzle({
    connection: { url: process.env.DATABASE_URL },
    schema,
  }));

export const db = getDatabase();
