/**
 * Upload Routes
 * Handles image upload authentication for ImageKit
 * Base path: /
 */

import express from "express";
import { getUploadUrl } from "../controllers/upload.controller.js";

const router = express.Router();

/**
 * GET /get-upload-url
 * Generate authentication parameters for ImageKit client-side uploads
 * Returns: {
 *   token,
 *   expire,
 *   signature,
 *   publicKey
 * }
 */
router.get("/get-upload-url", getUploadUrl);

export default router;
