import { Pool } from "pg";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

db.on("error", (error) => {
  console.error("Error occured", error);
  process.exit(-1);
});

export default db;
