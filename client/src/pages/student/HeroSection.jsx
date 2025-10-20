import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react"; // 1. Import useState
import { useNavigate, useSearchParams } from "react-router-dom"; // 2. Import navigation hooks

const HeroSection = () => {
  // 3. Initialize hooks
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 4. Initialize search term state from URL or empty string
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // 5. Handler to update the URL on submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // Construct the base URL (where your blog listing is, typically the root '/')
    let path = "/";

    // Add the search query parameter if searchTerm is not empty
    if (searchTerm.trim()) {
      path += `?search=${encodeURIComponent(searchTerm.trim())}`;
    }

    // Navigate to the new URL.
    // This updates the URL, and the main page (Blogs.jsx) will read this param and re-fetch data.
    navigate(path);
  };

  return (
    <div className="relative bg-gradient-to-r from-red-400 to bg-red-500 dark:from-gray-800 dark:to-gray-900 py-25 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-5">
          Explore the Best Articles and Insights
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-5">
          Dive deep into Coding, Travel, Technology, and more with our latest
          blog posts.
        </p>
        {/* 6. Attach onSubmit handler to the form */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6"
        >
          <Input
            type="text"
            placeholder="Search Courses"
            // 7. Bind value and onChange to the component state
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Button
            type="submit"
            className="from-red-500 to bg-red-600 text-white px-3 py-3 rounded-r-full hover:bg-red-700 dark:hover:bg-red-800"
          >
            Search
          </Button>
        </form>{" "}
      </div>
    </div>
  );
};

export default HeroSection;
