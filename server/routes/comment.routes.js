/**
 * Comment Routes
 * Handles blog comments and replies
 * Base path: /
 */

import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addComment,
  getBlogComments,
  getReplies,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

/**
 * POST /add-comment
 * Add a comment or reply to a blog
 * Protected Route - Requires JWT
 * Body: { _id (blog_id), comment, replying_to?, blog_author, notification_id? }
 * Returns: { comment, commentedAt, _id, user_id, children }
 */
router.post("/add-comment", verifyJWT, addComment);

/**
 * POST /get-blog-comments
 * Get paginated comments for a blog (parent comments only)
 * Body: { blog_id, skip }
 * Returns: [ array of comment objects ]
 */
router.post("/get-blog-comments", getBlogComments);

/**
 * POST /get-replies
 * Get paginated replies for a specific comment
 * Body: { _id (comment_id), skip }
 * Returns: { replies: [...] }
 */
router.post("/get-replies", getReplies);

/**
 * POST /delete-comment
 * Delete a comment and all its replies recursively
 * Protected Route - Requires JWT
 * User must be comment author or blog author
 * Body: { _id (comment_id) }
 * Returns: { status: "Done" }
 */
router.post("/delete-comment", verifyJWT, deleteComment);

export default router;
