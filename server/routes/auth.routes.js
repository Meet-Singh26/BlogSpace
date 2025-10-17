/**
 * Authentication Routes
 * Handles user registration, login, and OAuth
 * Base path: /
 */

import express from "express";
import { signup, signin, googleAuth } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * POST /signup
 * Register a new user with email and password
 * Body: { fullname, email, password }
 * Returns: { access_token, profile_img, username, fullname }
 */
router.post("/signup", signup);

/**
 * POST /signin
 * Authenticate user with email and password
 * Body: { email, password }
 * Returns: { access_token, profile_img, username, fullname }
 */
router.post("/signin", signin);

/**
 * POST /google-auth
 * Authenticate user with Google OAuth
 * Body: { access_token } (Firebase ID token)
 * Returns: { access_token, profile_img, username, fullname }
 */
router.post("/google-auth", googleAuth);

export default router;
