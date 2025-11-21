// src/db.js
import 'dotenv/config';
// PostgreSQL client
import pg from "pg";

// Create a connection pool
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // Must be set in .env or Vercel env
  ssl: {
    rejectUnauthorized: false // Required for cloud-hosted databases
  }
});
