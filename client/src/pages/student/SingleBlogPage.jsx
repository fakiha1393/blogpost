// client/src/pages/student/SingleBlogPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // 👈 Import useParams
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton";

const SingleBlogPage = () => {
    const { slug } = useParams(); // 👈 Extract the slug from the URL
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;

        const fetchBlog = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // CRITICAL: Call your single blog endpoint
                const response = await axios.get(`http://localhost:8080/api/v1/blogs/${slug}`);
                setBlog(response.data.blog);
            } catch (err) {
                console.error("Error fetching single blog:", err);
                setError("Failed to load blog post. It may not exist.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]); // Re-run effect if the slug changes

    if (loading) {
        // Simple loading state
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-4 mt-8">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        );
    }

    if (error) {
        return <div className="max-w-4xl mx-auto p-6 text-red-600 font-semibold">{error}</div>;
    }
    
    // Check if blog is null (e.g., if API returned 404)
    if (!blog) {
        return <div className="max-w-4xl mx-auto p-6 text-gray-500">Blog post not found.</div>;
    }

    // Main Display Structure
    return (
        <div className="max-w-4xl mx-auto p-6">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold mb-2 mt-12">{blog.title}</h1>
                <div className="text-gray-500 text-sm">
                    By <span className="font-medium">{blog.author.name}</span> in <span className="font-semibold text-blue-600">{blog.category}</span>
                    <span className="mx-2">|</span>
                    Posted on {new Date(blog.createdAt).toLocaleDateString()}
                </div>
            </header>

            <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-96 object-cover rounded-lg mb-8"
            />

            {/* Display the main content. NOTE: Use dangerouslySetInnerHTML if content contains HTML */}
            <div 
                className="text-lg leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: blog.content }} 
                style={{ whiteSpace: 'pre-wrap' }} 
            />
        </div>
    );
};

export default SingleBlogPage;