import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Import Loader2 for consistent loading animation

const CreateBlogPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Other', // Default category
    });
    const [blogImage, setBlogImage] = useState(null);
    const [loading, setLoading] = useState(false);
    // Removed local 'error' state as we're using sonner for immediate feedback

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        // Multer/Express expects the file object from the input
        setBlogImage(e.target.files[0]); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic client-side validation
        if (!formData.title || !formData.content || !blogImage) {
            toast.error("Please fill in the title, content, and select an image.");
            return;
        }

        setLoading(true);

        // 1. Create FormData object for mixed data (text + file)
        const postData = new FormData();
        postData.append('title', formData.title);
        postData.append('content', formData.content);
        postData.append('category', formData.category);
        postData.append('blogImage', blogImage); // Ensure key matches server expectation

        try {
            // 2. POST request to your protected endpoint
            const response = await axios.post('http://localhost:8080/api/v1/blogs', postData, {
                // IMPORTANT: Tell Axios that you are sending multipart/form-data
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true, // IMPORTANT for sending the cookie/auth token
            });

            // SUCCESS ALERT (Styled like Login.jsx success)
            toast.success(response.data.message || "Blog post created successfully!");
            navigate('/'); // Navigate back to the homepage list

        } catch (err) {
            console.error("Submission error:", err.response?.data || err);
            
            // ERROR ALERT (Styled like Login.jsx error)
            const errorMessage = err.response?.data?.message || "Failed to create blog post. Please try again.";
            toast.error(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 mt-15">
            <h1 className="text-3xl font-bold mb-6 text-center">Create a New Blog Post</h1>
            
            {/* Removed the manual error display div */}
            
            <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-lg shadow-xl">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full border-gray-300 rounded-lg shadow-sm p-2"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="content">Content</label>
                    <textarea
                        name="content"
                        id="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows="8"
                        required
                        className="w-full border-gray-300 rounded-lg shadow-sm p-2"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">Category</label>
                    <select
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm p-2"
                    >
                        {['Technology', 'Lifestyle', 'Travel', 'Coding', 'Other'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="blogImage">Cover Image</label>
                    <input
                        type="file"
                        name="blogImage"
                        id="blogImage"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                        className="w-full border-gray-300 rounded-lg shadow-sm p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                </div>

                <Button type="submit" disabled={loading} className="w-full py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </>
                    ) : (
                        "Create Post"
                    )}
                </Button>
            </form>
        </div>
    );
};

export default CreateBlogPage;