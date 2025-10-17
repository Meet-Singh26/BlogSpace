/**
 * Main Routes Index
 * Combines and exports all application routes
 * All routes are prefixed with /api in server.js
 */

import express from "express";
import authRoutes from "./auth.routes.js";
import blogRoutes from "./blog.routes.js";
import userRoutes from "./user.routes.js";
import commentRoutes from "./comment.routes.js";
import notificationRoutes from "./notification.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = express.Router();

// Authentication routes - /api/auth/*
router.use("/", authRoutes);

// Blog routes - /api/blogs/*
router.use("/", blogRoutes);

// User routes - /api/users/*
router.use("/", userRoutes);

// Comment routes - /api/comments/*
router.use("/", commentRoutes);

// Notification routes - /api/notifications/*
router.use("/", notificationRoutes);

// Upload/ImageKit routes - /api/upload/*
router.use("/", uploadRoutes);

export default router;