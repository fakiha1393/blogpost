import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import BlogCard from '@/pages/student/BlogCard'; 
import { Loader2 } from 'lucide-react';

// Define available categories
const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Coding', 'Other']; 

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Get the current search parameters from the URL
    const [searchParams, setSearchParams] = useSearchParams();

    // --- Data Fetching Logic (Responsive to URL Changes) ---
    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            setError(null);
            
            // 1. Get the full query string (e.g., "search=react&category=Coding")
            const queryString = searchParams.toString(); 

            try {
                // 2. Fetch data, appending the full query string
                const response = await axios.get(`http://localhost:8080/api/v1/blogs?${queryString}`); 
                setBlogs(response.data.blogs);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setError("Failed to load blog posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [searchParams]); // Re-run fetch whenever searchParams (the URL query) changes

    // --- Category Filter Handler ---
    const handleCategoryFilter = (selectedCategory) => {
        setSearchParams(prev => {
            // Check if we are clearing the category filter
            if (selectedCategory === 'All') {
                prev.delete('category'); 
            } else {
                // Set or update the 'category' parameter in the URL
                prev.set('category', selectedCategory);
            }
            // IMPORTANT: Retain the 'search' parameter if it exists
            return prev;
        }, { replace: true }); // Use replace to avoid cluttering history
    };

    // Determine the currently active category for highlighting
    const activeCategory = searchParams.get('category') || 'All'; 

    return (
        <div className="max-w-7xl mx-auto p-4 pt-8">
            
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Recent Blog Posts</h2>

            {/* --- Category Filter UI --- */}
            <div className="flex space-x-3 mb-8 overflow-x-auto pb-3 border-b dark:border-gray-700">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryFilter(cat)}
                        className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors shadow-sm
                            ${activeCategory === cat 
                                ? 'bg-black text-white shadow-indigo-400/50' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* --- Loading, Error, and Results Display --- */}
            {loading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>
            ) : error ? (
                <p className="text-center text-red-600 font-semibold">{error}</p>
            ) : blogs.length === 0 ? (
                <p className="text-center text-gray-500">No blog posts found matching your criteria.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blogs;