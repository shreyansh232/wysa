import { Router } from "express";
import { createFlow, update } from "../controllers/sleep.controller";
import { authenticateToken } from "../middleware/middleware";

const router = Router();

router.post("/start", authenticateToken, createFlow);
router.patch("/update", authenticateToken, update);

export default router;
