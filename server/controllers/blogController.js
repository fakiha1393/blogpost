// server/controllers/blogController.js

import { BlogPost } from "../models/BlogPost.js"; // Import the new BlogPost model
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js"; // Reuse file handling utilities
import slugify from "slugify";
// 1. Get All Blog Posts (For Dashboard Display)
export const getAllBlogs = async (req, res) => {
    try {
        // Destructure query parameters
        const { search, category } = req.query;
        let query = {}; // Initialize the MongoDB query object

        // 1. Search Logic (Filtering by Title)
        if (search) {
            // MongoDB $regex operator provides pattern matching
            // $options: 'i' makes the search case-insensitive
            query.title = {
                $regex: search,
                $options: 'i',
            };
        }

        // 2. Category Logic (Filtering by specific category value)
        // We assume 'All' is passed from the frontend to clear the filter
        if (category && category !== 'All') {
            query.category = category; // Adds to the query, e.g., { title: /test/i, category: 'Coding' }
        }

        // Execute the Mongoose query with the dynamically built 'query' object
        const blogs = await BlogPost.find(query)
            .sort({ createdAt: -1 })
            // Populate the author data, including the necessary photoUrl field
            .populate({
                path: 'author',
                select: 'name photoUrl email', 
            }); 
        
        return res.status(200).json({
            success: true,
            results: blogs.length,
            blogs
        });

    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve blogs.' });
    }
};

// 2. Get a Single Blog Post by Slug (For Detail Page)
export const getBlogBySlug = async (req, res) => {
    try {
        // Use the slug from the URL parameters
        const blog = await BlogPost.findOne({ slug: req.params.slug });
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'No blog found with that slug.'
            });
        }
        
        // Optional: Implement a simple view count increment here if needed
        // blog.viewsCount = blog.viewsCount + 1;
        // await blog.save(); 

        return res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        console.log("Error in getBlogBySlug:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch the blog post."
        });
    }
};


// 3. Create a New Blog Post (For User Uploader)
// This function assumes 'isAuthenticated' middleware has been run
// and attached 'req.id' (userId) and 'multer' has attached 'req.file'
export const createBlog = async (req, res) => {
    try {
        const userId = req.id; 
        const { title, content, category } = req.body;
        const blogImage = req.file; 

        // 1. INPUT VALIDATION CHECK
        if (!title || !content || !category || !blogImage) {
            return res.status(400).json({
                success: false,
                message: "Title, content, category, and image are required."
            });
        }

        // 2. MANUALLY GENERATE SLUG (FIXES THE ISSUE)
        const generatedSlug = slugify(title, { lower: true, strict: true });

        // 3. Upload the image to Cloudinary
        const cloudResponse = await uploadMedia(blogImage.path);
        const imageUrl = cloudResponse.secure_url;

        // 4. Create the blog post with the EXPLICIT SLUG
        const newBlog = await BlogPost.create({
            title,
            content,
            slug: generatedSlug, // 👈 Passing the slug directly
            category,
            image: imageUrl,
            author: userId,
        });

        return res.status(201).json({
            success: true,
            message: "Blog post created successfully!", // Success message for the frontend alert
            blog: newBlog
        });

    } catch (error) {
        // ... (rest of the error handling)
        console.log("Error in createBlog:", error);
        return res.status(500).json({
            success: false,
            // DO NOT return the detailed Mongoose error in a production environment
            message: "Failed to create blog post." 
        });
    }
};

// 4. Update a Blog Post by Slug
export const updateBlog = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.id; // User ID from isAuthenticated middleware
        const { title, content, category } = req.body;
        const newBlogImage = req.file; // New file uploaded via Multer

        // 1. Find the existing blog post
        let blog = await BlogPost.findOne({ slug });

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog post not found.' });
        }

        // 2. Authorization Check (Is the logged-in user the author?)
        // Ensure the blog's author ID (Mongoose ObjectId) matches the logged-in userId (String)
        if (!blog.author.equals(userId)) {
            return res.status(403).json({ success: false, message: 'Forbidden: You are not the author of this post.' });
        }

        // 3. Prepare Update Data
        const updateFields = { title, content, category };
        
        // Handle Slug generation if the title has changed
        if (title && title !== blog.title) {
            updateFields.slug = slugify(title, { lower: true, strict: true });
        }

        // 4. Handle Image Update (If a new file was uploaded)
        if (newBlogImage) {
            // Delete old image from Cloudinary (using utility function)
            await deleteMediaFromCloudinary(blog.image); 
            
            // Upload new image
            const cloudResponse = await uploadMedia(newBlogImage.path);
            updateFields.image = cloudResponse.secure_url;
        }

        // 5. Perform the update
        // We use findByIdAndUpdate to ensure validation runs.
        const updatedBlog = await BlogPost.findByIdAndUpdate(
            blog._id, // Use the MongoDB ID
            { $set: updateFields },
            { new: true, runValidators: true } // Return the updated document and run Mongoose validators
        );

        return res.status(200).json({
            success: true,
            message: "Blog post updated successfully!",
            blog: updatedBlog
        });
    } catch (error) {
        console.error("Error in updateBlog:", error);
        
        // Handle duplicate slug error on update
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A blog post with this updated title already exists. Please choose a unique title." 
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Failed to update blog post."
        });
    }
};

// 5. Delete a Blog Post by Slug
export const deleteBlog = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.id; // User ID from isAuthenticated middleware

        // 1. Find the existing blog post
        const blog = await BlogPost.findOne({ slug });

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog post not found.' });
        }

        // 2. Authorization Check (Is the logged-in user the author?)
        if (!blog.author.equals(userId)) {
            return res.status(403).json({ success: false, message: 'Forbidden: You are not the author of this post.' });
        }

        // 3. Delete the image from Cloudinary
        // We delete first, so if this fails, the document remains in the DB.
        await deleteMediaFromCloudinary(blog.image);

        // 4. Delete the document from MongoDB
        await BlogPost.findByIdAndDelete(blog._id);

        return res.status(200).json({
            success: true,
            message: 'Blog post deleted successfully!'
        });
    } catch (error) {
        console.error("Error in deleteBlog:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete blog post."
        });
    }
};

// 6. Get Blogs for the Logged-in Author
export const getMyBlogs = async (req, res) => {
    try {
        const userId = req.id; // From isAuthenticated middleware

        // Find all blog posts where the author matches the logged-in user ID
        const myBlogs = await BlogPost.find({ author: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'name email'
            });

        return res.status(200).json({
            success: true,
            results: myBlogs.length,
            blogs: myBlogs
        });
    } catch (error) {
        console.error("Error in getMyBlogs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your blog list."
        });
    }
};