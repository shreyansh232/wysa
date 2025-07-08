import { Router } from "express";
import {
  completeAssessment,
  createFlow,
  update,
} from "../controllers/sleep.controller";
import { authenticateToken } from "../middleware/middleware";

const router = Router();

router.post("/start", authenticateToken, createFlow);
router.patch("/update", authenticateToken, update);
router.post("/complete", authenticateToken, completeAssessment);

export default router;
