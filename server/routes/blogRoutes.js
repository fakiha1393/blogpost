// server/routes/blogRoutes.js - UPDATED TO ES MODULE SYNTAX

import express from "express"; // Change: require('express') -> import express from 'express'
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} from "../controllers/blogController.js"; // Change: require(...) -> import {...} from '...'

// If you have middleware, import it like this:
import isAunthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

// Route to fetch all blogs for the logged-in user (Protected Route)
router.route('/my-posts').get(isAunthenticated, getMyBlogs); 

// Route for getting all blogs and creating a new blog
router
  .route("/")
  // GET /api/v1/blogs
  .get(getAllBlogs)
  // POST /api/v1/blogs
  // You will need isAuthenticated middleware here eventually:
  // .post(isAuthenticated, createBlog);
  .post(isAunthenticated, upload.single("blogImage"), createBlog);  // For now, keep it simple

// Route for getting a single blog
router
  .route('/:slug') 
  .get(getBlogBySlug) // 
  .put(isAunthenticated, upload.single('blogImage'), updateBlog) // UPDATE (requires auth & optional new image upload)
  .delete(isAunthenticated, deleteBlog); // DELETE (requires auth)

export default router; // Change: module.exports = router -> export default router
