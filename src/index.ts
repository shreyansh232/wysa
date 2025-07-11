import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./config/db";
import authRoutes from "./routes/auth.routes";
import sleepRoutes from "./routes/sleep.routes";

const app = express();
const port = Number(process.env.PORT) || 8088;

app.use(express.json());
app.use(cors());

db.connect()
  .then((client) => {
    console.log("Successfully connected to PostgreSQL database");
    client.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database", err.message);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api/assessment", sleepRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started at ${port}`);
});
