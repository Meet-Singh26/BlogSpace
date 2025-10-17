/**
 * User Routes
 * Handles user profile operations
 * Base path: 
 */

import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  searchUsers,
  getProfile,
  changePassword,
  updateProfileImg,
  updateProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

/**
 * POST /search
 * Search users by username (case-insensitive)
 * Body: { query }
 * Returns: { users: [...] }
 */
router.post("/search-users", searchUsers);

/**
 * POST /get-profile
 * Get user profile by username
 * Body: { username }
 * Returns: { user object with personal_info, account_info, social_links }
 */
router.post("/get-profile", getProfile);

/**
 * POST /change-password
 * Change user password
 * Protected Route - Requires JWT
 * Body: { currentPassword, newPassword }
 * Returns: { status: "Password Changed" }
 */
router.post("/change-password", verifyJWT, changePassword);

/**
 * POST /update-profile-img
 * Update user profile image
 * Protected Route - Requires JWT
 * Body: { url }
 * Returns: { profile_img: url }
 */
router.post("/update-profile-img", verifyJWT, updateProfileImg);

/**
 * POST /update-profile
 * Update user profile information
 * Protected Route - Requires JWT
 * Body: { username, bio, social_links }
 * Returns: { username }
 */
router.post("/update-profile", verifyJWT, updateProfile);

export default router;
