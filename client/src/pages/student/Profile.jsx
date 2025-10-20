import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Pencil } from "lucide-react"; // 👈 Add icons
import { useNavigate } from "react-router-dom"; // 👈 Add useNavigate
import axios from "axios"; // 👈 Add axios for blog fetching/deleting
import BlogManagementCard from "./BlogManagementCard";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

const Profile = () => {
  // Existing User State
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null); // Initialize as null

  // Blog Management State
  const [myBlogs, setMyBlogs] = useState([]); // 👈 NEW state for user's blogs
  const [blogsLoading, setBlogsLoading] = useState(false); // 👈 NEW loading state

  // Hooks
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  // --- BLOG MANAGEMENT FUNCTIONS ---

  // Function to fetch the user's blogs
  const fetchMyBlogs = async () => {
    setBlogsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/blogs/my-posts",
        {
          withCredentials: true, // Important for auth
        }
      );
      setMyBlogs(response.data.blogs);
    } catch (error) {
      console.error("Failed to fetch user blogs:", error);
      toast.error("Failed to load your posts.");
    } finally {
      setBlogsLoading(false);
    }
  };

  // Function to handle blog deletion
  const handleDelete = async (slug) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this blog post?"
      )
    )
      return;

    try {
      await axios.delete(`http://localhost:8080/api/v1/blogs/${slug}`, {
        withCredentials: true,
      });
      toast.success("Blog post deleted successfully!");
      // Refresh the blog list immediately
      fetchMyBlogs();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete post.");
    }
  };

  // Function to handle navigation to the edit page
  const handleEdit = (slug) => {
    navigate(`/blog/edit/${slug}`); // Navigate to the new Edit Blog Page route
  };

  // --- END BLOG MANAGEMENT FUNCTIONS ---

  // Existing Handlers
  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const upadteUserHandler = async () => {
    const formData = new FormData();
    // Only append name/photo if they have been modified to avoid sending empty data
    if (name) formData.append("name", name);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);

    // Check if any field was changed before attempting update
    if (name || profilePhoto) {
      await updateUser(formData);
    } else {
      toast.info("No changes to save.");
    }
  };

  // Combined useEffects: Load user on mount, then load blogs
  useEffect(() => {
    // Load user data first
    refetch();
  }, []);

  useEffect(() => {
    // Once user data is available, fetch the user's blogs
    if (data?.user) {
      setName(data.user.name); // Set initial name state for dialog
      fetchMyBlogs();
    }
  }, [data]); // Trigger when user data changes

  useEffect(() => {
    if (isSuccess) {
      toast.success(updateUserData.message || "Profile Updated.");
      refetch(); // Refetch user data after successful update
    }
    if (isError) {
      toast.error(error.data.message || "Profile not Updated."); // Correct error access
    }
  }, [error, updateUserData, isSuccess, isError]); // Added isError as dependency

  if (isLoading) return <h1>Profile Loading...</h1>;

  // Check if the query resulted in an error or if data is missing/undefined
  if (isError || !data || !data.user) {
    // If the query failed or no user data was returned, handle it gracefully
    console.error("User data fetch failed:", error);
    // You can display an error message here, or redirect
    return (
      <h1 className="text-red-600">
        Failed to load profile data. Please log in again.
      </h1>
    );
  }

  const { user } = data;

  return (
    <div className="max-w-4xl mx-auto my-24 px-4">
      {/* ... Existing Profile Header and Edit Dialog (UNTOUCHED) ... */}
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        {/* Avatar and User Info */}
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              className="rounded-full"
              src={user.photoUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.email}
              </span>
            </h1>
          </div>
          {/* Edit Profile Dialog Trigger */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mb-2 mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Edit Profile</DialogHeader>
              <DialogDescription>
                Make changes to your profile here. Click save when done.
              </DialogDescription>
              <div className="grip gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={upadteUserHandler}
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      Wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ---------------- NEW BLOG MANAGEMENT SECTION ---------------- */}
      <div>
        {/* 1. Loading State */}
        {blogsLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading content...
          </div>
        ) : // 2. Author/Instructor Blog Management Display
        user.role === "admin" || user.role === "student" ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-3">My Posted Blogs</h2>
            {myBlogs.length === 0 ? (
              <p className="text-gray-500">
                You haven't posted any blogs yet.
                <span
                  onClick={() => navigate("/blog/create")}
                  className="text-blue-600 hover:underline cursor-pointer ml-1"
                >
                  Create one now.
                </span>
              </p>
            ) : (
              myBlogs.map((blog) => (
                <BlogManagementCard
                  key={blog._id}
                  blog={blog}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))
            )}
          </div>
        ) : (
          // 3. Display for Students (Non-Authors) - FILL THE EMPTY SPACE
          <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-600">
              You are not an author currently as you don't have any blog posted
              yet.
            </p>
            <p className="mt-3 text-sm text-gray-500">
              You can view all available blogs on the{" "}
              <a href="/" className="text-blue-600 hover:underline">
                homepage
              </a>
              .
            </p>
          </div>
        )}
      </div>
      {/* ---------------- END NEW BLOG MANAGEMENT SECTION ---------------- */}
    </div>
  );
};

export default Profile;
