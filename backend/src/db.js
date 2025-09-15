// src/db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// ✅ Using DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Optional: Test connection immediately
pool.connect()
  .then(() => console.log("🚀 PostgreSQL connected"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

export default pool;
