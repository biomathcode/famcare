import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Database connection configuration
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

// Default configuration (can be overridden by environment variables)
export const defaultDatabaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "health_management",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  ssl: process.env.DB_SSL === "true",
};

// Build connection URL
export function buildConnectionUrl(
  config: DatabaseConfig = defaultDatabaseConfig
): string {
  const { host, port, database, username, password, ssl } = config;

  // Handle SSL configuration
  const sslParam = ssl ? "?sslmode=require" : "";

  // Build the connection string
  return `postgresql://${username}:${password}@${host}:${port}/${database}${sslParam}`;
}

// Create database instance
export function createDatabase(config: DatabaseConfig = defaultDatabaseConfig) {
  const connectionString = buildConnectionUrl(config);

  // Create postgres client
  const client = postgres(connectionString, {
    max: 10, // Connection pool size
    idle_timeout: 20,
    connect_timeout: 10,
  });

  // Create drizzle instance
  return drizzle(client);
}

// Export default database instance
export const db = createDatabase();

// Export types for use in other packages
export type Database = typeof db;
