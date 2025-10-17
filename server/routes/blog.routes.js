/**
 * Blog Routes
 * Handles all blog-related operations
 * Base path: /
 */

import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createBlog,
  getLatestBlogs,
  getTrendingBlogs,
  searchBlogs,
  getAllLatestBlogsCount,
  getSearchBlogsCount,
  getBlog,
  likeBlog,
  isLikedByUser,
  getUserWrittenBlogs,
  getUserWrittenBlogsCount,
  deleteBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

/**
 * POST /create-blog
 * Create or update a blog post
 * Protected Route - Requires JWT
 * Body: { title, banner, des, tags, content, draft, id? }
 * Returns: { id: blog_id }
 */
router.post("/create-blog", verifyJWT, createBlog);

/**
 * POST /latest-blogs
 * Get paginated list of latest published blogs
 * Body: { page }
 * Returns: { blogs: [...] }
 */
router.post("/latest-blogs", getLatestBlogs);

/**
 * GET /trending-blogs
 * Get top 5 trending blogs based on reads and likes
 * Returns: { blogs: [...] }
 */
router.get("/trending-blogs", getTrendingBlogs);

/**
 * POST /search-blogs
 * Search blogs by tag, title query, or author
 * Body: { tag?, query?, author?, page, limit?, eliminate_blog? }
 * Returns: { blogs: [...] }
 */
router.post("/search-blogs", searchBlogs);

/**
 * POST /all-latest-blogs-count
 * Get total count of all published blogs
 * Body: {}
 * Returns: { totalDocs: count }
 */
router.post("/all-latest-blogs-count", getAllLatestBlogsCount);

/**
 * POST /search-blogs-count
 * Get count of blogs matching search criteria
 * Body: { tag?, query?, author? }
 * Returns: { totalDocs: count }
 */
router.post("/search-blogs-count", getSearchBlogsCount);

/**
 * POST /get-blog
 * Get a single blog by blog_id
 * Increments read count unless in edit mode
 * Body: { blog_id, draft?, mode? }
 * Returns: { blog: {...} }
 */
router.post("/get-blog", getBlog);

/**
 * POST /like-blog
 * Like or unlike a blog post
 * Protected Route - Requires JWT
 * Body: { _id, isLikedByUser }
 * Returns: { liked_by_user: boolean }
 */
router.post("/like-blog", verifyJWT, likeBlog);

/**
 * POST /isliked-by-user
 * Check if current user has liked a blog
 * Protected Route - Requires JWT
 * Body: { _id }
 * Returns: { result: boolean }
 */
router.post("/isliked-by-user", verifyJWT, isLikedByUser);

/**
 * POST /user-written-blogs
 * Get blogs written by authenticated user
 * Protected Route - Requires JWT
 * Body: { page, draft, query, deletedDocCount? }
 * Returns: { blogs: [...] }
 */
router.post("/user-written-blogs", verifyJWT, getUserWrittenBlogs);

/**
 * POST /user-written-blogs-count
 * Get count of blogs written by authenticated user
 * Protected Route - Requires JWT
 * Body: { draft, query }
 * Returns: { totalDocs: count }
 */
router.post("/user-written-blogs-count", verifyJWT, getUserWrittenBlogsCount);

/**
 * POST /delete-blog
 * Delete a blog and all related data (comments, notifications)
 * Protected Route - Requires JWT
 * Body: { blog_id }
 * Returns: { status: "done" }
 */
router.post("/delete-blog", verifyJWT, deleteBlog);

export default router;
