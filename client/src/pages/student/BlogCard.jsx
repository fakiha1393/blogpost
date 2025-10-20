// client/pages/student/BlogCard.jsx

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import React from "react";

// Accept the blog object as a prop
const BlogCard = ({ blog }) => { 
    // Use the optional chaining operator (?) just in case author is null/undefined
    const authorName = blog?.author?.name || 'Unknown Author';
    
    // Calculate fallback text (e.g., 'U A')
    const fallbackText = authorName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2); 
    
    return (
        <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            {/* ... link and image for the blog post ... */}
            <a href={`/blog/${blog.slug}`}> 
                <div className="relative">
                    <img
                        src={blog.image} 
                        alt={blog.title}
                        className="w-full h-36 object-cover rounded-t-lg"
                    />
                </div>
            </a>
            <CardContent className="mb-2 px-5 space-y-1.5">
                <h1 className="hover:underline font-bold text-lg truncate">
                    {blog.title}
                </h1>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage 
                                className="rounded-full" 
                                // 👇 CRITICAL CHANGE: Use the author's photoUrl 👇
                                src={blog.author?.photoUrl || "https://github.com/shadcn.png"} 
                                alt={`@${authorName}`} 
                            />
                            {/* Use a better fallback if the photo URL is missing */}
                            <AvatarFallback>{fallbackText}</AvatarFallback>
                        </Avatar>
                        <h1 className="font-medium text-sm">
                            {authorName}
                        </h1>
                    </div>
                    {/* ... Badge and Date ... */}
                    <Badge className="bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                        {blog.category}
                    </Badge>
                </div>
                <div className="text-sm font-medium text-gray-500">
                    Posted on {new Date(blog.createdAt).toLocaleDateString()}
                </div>
            </CardContent>
        </Card>
    );
};

export default BlogCard;