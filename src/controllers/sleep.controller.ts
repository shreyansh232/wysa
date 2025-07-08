import { Request, Response } from "express";
import db from "../config/db";
import { v4 as uuidv4 } from "uuid";

export const createFlow = async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(401).json({ message: "UserId is required" });
    return;
  }

  const id = uuidv4();

  try {
    const result = await db.query(
      `INSERT INTO "sleepAssessments" ("id", "userId", "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      res.status(500).json({ message: "Failed to start sleep assessment" });
      return;
    }

    const start = result.rows[0];

    res.json({
      success: true,
      message: "Sleep assessment started",
      data: start,
    });
  } catch (error) {
    console.error("Error starting the session", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    res.status(401).json({ message: "Id is required" });
  }
  try {
    const result = await db.query(`UPDATE "sleepAssessments" SET `);
  } catch (error) {}
};
