// client/src/pages/student/EditBlogPage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const EditBlogPage = () => {
    const { slug } = useParams(); // Get the slug from the URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
    });
    const [blogImage, setBlogImage] = useState(null);
    const [initialImageUrl, setInitialImageUrl] = useState(''); // To show current image
    const [loading, setLoading] = useState(true);
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- 1. FETCH EXISTING BLOG DATA ---
    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/blogs/${slug}`);
                const blog = response.data.blog;

                setFormData({
                    title: blog.title,
                    content: blog.content,
                    category: blog.category,
                });
                setInitialImageUrl(blog.image); // Save the existing image URL for display
            } catch (err) {
                console.error("Error fetching blog for edit:", err);
                setError("Failed to load blog details. You might not have permission.");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchBlogData();
        }
    }, [slug]);

    // --- HANDLERS ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setBlogImage(e.target.files[0]); 
    };

    // --- 2. SUBMIT UPDATE (PUT REQUEST) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionLoading(true);
        setError(null);

        const postData = new FormData();
        postData.append('title', formData.title);
        postData.append('content', formData.content);
        postData.append('category', formData.category);
        
        // CRITICAL: Append the new image only if the user selected one
        if (blogImage) {
            postData.append('blogImage', blogImage);
        }

        try {
            // Use PUT request to the /:slug endpoint
            await axios.put(`http://localhost:8080/api/v1/blogs/${slug}`, postData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true, // For authorization check on backend
            });

            toast.success("Blog post updated successfully!");
            navigate('/profile'); // Navigate back to the management dashboard
        } catch (err) {
            console.error("Update error:", err.response?.data || err);
            setError(err.response?.data?.message || "Failed to update blog post.");
            toast.error("Update failed.");
        } finally {
            setSubmissionLoading(false);
        }
    };

    if (loading) {
        return <div className="max-w-3xl mx-auto p-6 mt-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /> Loading Editor...</div>;
    }
    
    if (error && !submissionLoading) { // Display error if fetching failed
        return <div className="max-w-3xl mx-auto p-6 mt-8 text-red-600 font-semibold">{error}</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 mt-15">
            <h1 className="text-3xl font-bold mb-6 text-center">Edit Blog Post</h1>
            <h2 className="text-2xl font-semibold mb-4 text-center">{formData.title}</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-xl">
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

                <div className="flex flex-col space-y-3">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="blogImage">Current Cover Image</label>
                    {initialImageUrl && (
                        <img 
                            src={initialImageUrl} 
                            alt="Current Cover" 
                            className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                    )}

                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="newBlogImage">Replace Image (Optional)</label>
                    <input
                        type="file"
                        name="newBlogImage"
                        id="newBlogImage"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full border-gray-300 rounded-lg shadow-sm p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                </div>

                <Button type="submit" disabled={submissionLoading} className="w-full py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg">
                    {submissionLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>) : 'Save Changes'}
                </Button>
            </form>
        </div>
    );
};

export default EditBlogPage;