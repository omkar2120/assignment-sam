import express from "express";
import { createNotification, getNotifications } from "../controller/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
// import { verifyManager } from "../middleware/roleMiddleware.js";
import { verifyManager } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.post("/", verifyToken, verifyManager, createNotification);

export default router;
