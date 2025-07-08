import { Router } from "express";
import { createFlow } from "../controllers/sleep.controller";

const router = Router();

router.post("/start", createFlow);

export default router;
