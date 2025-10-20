import mongoose from "mongoose";
import slugify from "slugify";

// Define the Blog Post Schema
const blogPostSchema = new mongoose.Schema({
    // 1. Title of the blog post
    title: {
        type: String,
        required: [true, 'A blog post must have a title'],
        trim: true,
        maxlength: [100, 'A blog title cannot exceed 100 characters']
    },

    // 2. Main content of the blog post (e.g., HTML from a rich text editor)
    content: {
        type: String,
        required: [true, 'A blog post must have content']
    },

    // 3. SLUG FIELD ADDED HERE (CRITICAL FIX)
    slug: {
        type: String,
        required: [true, 'A blog post must have a slug'],
        unique: true, // Ensure no two blogs have the same slug
        lowercase: true,
        trim: true
    },
    
    // 4. Author: Reference to the existing User model
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A blog post must belong to an author']
    },
    // ... (rest of your category, image fields)
    category: {
        type: String,
        required: [true, 'A blog post must have a category'],
        enum: ['Technology', 'Lifestyle', 'Travel', 'Coding', 'Other'],
        default: 'Other'
    },
    image: {
        type: String,
        default: 'default_blog_image.jpg'
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
});

// Set up indexes and pre-find middleware (if you added them)
blogPostSchema.index({ slug: 1 }); // Keeping the schema.index()

blogPostSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'author',
        select: 'name email'
    });
    next();
});

// NOTE: This hook is now redundant if you moved slug generation to the controller,
// but keep it here if you revert the controller change.
// blogPostSchema.pre('save', function(next) {
//     if (this.isNew || this.isModified('title')) {
//         this.slug = slugify(this.title, { lower: true, strict: true });
//     }
//     next();
// });

// Create and export the model
export const BlogPost = mongoose.model('BlogPost', blogPostSchema);