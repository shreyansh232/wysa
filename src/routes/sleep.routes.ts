import { Router } from "express";
import { createFlow, update } from "../controllers/sleep.controller";

const router = Router();

router.post("/start", createFlow);
router.patch("/update", update);

export default router;
