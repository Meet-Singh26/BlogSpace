/**
 * Notification Routes
 * Handles user notifications (likes, comments, replies)
 * Base path: /
 */

import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  checkNewNotification,
  getNotifications,
  getAllNotificationsCount,
} from "../controllers/notification.controller.js";

const router = express.Router();

/**
 * GET /new-notification
 * Check if user has new unseen notifications
 * Protected Route - Requires JWT
 * Returns: { new_notification_available: boolean }
 */
router.get("/new-notification", verifyJWT, checkNewNotification);

/**
 * POST /notifications
 * Get paginated notifications for authenticated user
 * Protected Route - Requires JWT
 * Marks retrieved notifications as seen
 * Body: { page, filter ("all" | "like" | "comment" | "reply"), deletedDocCount? }
 * Returns: { notifications: [...] }
 */
router.post("/notifications", verifyJWT, getNotifications);

/**
 * POST /all-notifications-count
 * Get total count of user notifications
 * Protected Route - Requires JWT
 * Body: { filter ("all" | "like" | "comment" | "reply") }
 * Returns: { totalDocs: count }
 */
router.post("/all-notifications-count", verifyJWT, getAllNotificationsCount);

export default router;
