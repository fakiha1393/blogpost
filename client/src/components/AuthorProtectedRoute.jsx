import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useLoadUserQuery } from '@/features/api/authApi';
import { Loader2 } from 'lucide-react';

const AuthorProtectedRoute = () => {
    // 1. Fetch user data (role)
    const { data, isLoading, isError } = useLoadUserQuery();

    if (isLoading) {
        // Display loading spinner while checking auth status
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>;
    }

    // 2. Error case (e.g., user is not logged in)
    if (isError || !data || !data.user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    const user = data.user;
    
    // 3. Authorization check
    // Only allow access if role is 'admin' OR 'instructor'
    if (user.role === 'admin' || user.role === 'instructor') {
        // Allow access to the nested route
        return <Outlet />;
    } else {
        // Redirect unauthorized users to a safe page (e.g., home)
        return <Navigate to="/" replace />;
    }
};

export default AuthorProtectedRoute;