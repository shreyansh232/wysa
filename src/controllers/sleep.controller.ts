import { Request, Response } from "express";
import db from "../config/db";
import { v4 as uuidv4 } from "uuid";
import { generateRandomScore } from "../utils/helpers";

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
  const { id, updateType } = req.body;

  // Validate ID once at the top
  if (!id) {
    res.status(400).json({ message: "Id is required" });
    return;
  }

  let field: string | null = null;
  let value: any = null;

  switch (updateType) {
    case "Sleep Struggle":
      field = "sleepStruggleDuration";
      value = req.body.sleepStruggleDuration;
      break;

    case "Bed Time":
      field = "bedTime";
      value = req.body.bedTime;
      break;

    case "Wake Time":
      field = "wakeTime";
      value = req.body.wakeTime;
      break;

    case "Sleep Hours":
      field = "sleepHours";
      value = req.body.sleepHours;
      break;

    default:
      res.status(400).json({ message: "Invalid updateType" });
      return;
  }

  if (value === undefined || value === null) {
    res.status(400).json({ message: `Missing value for ${field}` });
    return;
  }

  try {
    const result = await db.query(
      `UPDATE "sleepAssessments" SET "${field}" = $1, "updatedAt" = NOW() WHERE "id" = $2 RETURNING *`,
      [value, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "SleepAssessment not found" });
      return;
    }

    res.json({
      success: true,
      message: "Sleep assessment updated",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating sleep assessment", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const completeAssessment = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "Id is required" });
    return;
  }

  // Generate a random score
  const score = generateRandomScore();

  try {
    const result = await db.query(
      `UPDATE "sleepAssessments"
       SET "score" = $1, "status" = 'COMPLETED', "updatedAt" = NOW()
       WHERE "id" = $2
       RETURNING *`,
      [score, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "SleepAssessment not found" });
      return;
    }

    res.json({
      success: true,
      message: "Assessment completed",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error completing assessment", error);
    res.status(500).json({ message: "Server error" });
  }
};
