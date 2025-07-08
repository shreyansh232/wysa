import { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import db from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw Error("JWT is invalid");
}

export const signup: RequestHandler = async (req: Request, res: Response) => {
  const { nickname, password } = req.body;

  if (!nickname || !password) {
    res.status(400).json({ message: "Nickname and password are required" });
    return;
  }

  if (password.length < 6) {
    res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
    return;
  }

  try {
    // Check if user already exists
    const existingUser = await db.query(
      "SELECT * FROM users WHERE nickname = $1",
      [nickname],
    );

    if (existingUser.rows.length > 0) {
      res
        .status(409)
        .json({ message: "User with this nickname already exists" });
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await db.query(
      `INSERT INTO users (nickname, password, "createdAt", "updatedAt")
   VALUES ($1, $2, NOW(), NOW())
   RETURNING id, nickname, "createdAt", "updatedAt"`,
      [nickname, hashedPassword],
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, nickname: user.nickname },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login: RequestHandler = async (req: Request, res: Response) => {
  const { nickname, password } = req.body;

  if (!nickname || !password) {
    res.status(400).json({ message: "Nickname and password are required" });
    return;
  }

  try {
    // Find user
    const result = await db.query("SELECT * FROM users WHERE nickname = $1", [
      nickname,
    ]);

    if (result.rows.length === 0) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, nickname: user.nickname },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
