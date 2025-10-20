// client/src/pages/student/BlogManagementCard.jsx

import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogManagementCard = ({ blog, handleEdit, handleDelete }) => {
    const navigate = useNavigate();

    return (
        <div 
            key={blog._id} 
            className="p-4 border rounded-lg shadow-md flex justify-between items-center transition-shadow hover:shadow-lg"
        >
            <div className="cursor-pointer" onClick={() => navigate(`/blog/${blog.slug}`)}> 
                {/* 3. Viewing Blogs: Click title to navigate to the detail page */}
                <h2 className="text-xl font-semibold hover:text-red-600">
                    {blog.title}
                </h2>
                <p className="text-sm text-gray-500">
                    Category: {blog.category} | Created: {new Date(blog.createdAt).toLocaleDateString()}
                </p>
            </div>
            <div className="space-x-2 flex items-center">
                {/* Edit Button */}
                <Button 
                    onClick={() => handleEdit(blog.slug)} 
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white flex items-center"
                >
                    <Pencil className="mr-1 h-4 w-4" /> Edit
                </Button>
                {/* Delete Button */}
                <Button 
                    onClick={() => handleDelete(blog.slug)} 
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white flex items-center"
                >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
            </div>
        </div>
    );
};

export default BlogManagementCard;