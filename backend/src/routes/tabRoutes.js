import express from "express";
import { logTabActivity, getTabStats } from "../controllers/tabController.js";

const router = express.Router();

// POST /api/tabs
router.post("/", logTabActivity);    

// GET /api/tabs/:userId
router.get("/:userId", getTabStats);   

export default router;
