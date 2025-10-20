import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { Button } from "./components/ui/button";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";
import { RouterProvider } from "react-router";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Blogs from "./pages/student/Blogs";
import SingleBlogPage from "./pages/student/SingleBlogPage";
import CreateBlogPage from "./pages/student/CreateBlogPage";
import EditBlogPage from "./pages/student/EditBlogPage";
import AuthorProtectedRoute from "./components/AuthorProtectedRoute";

const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <>
              <HeroSection />
              <Blogs />
            </>
          ),
        },
        {
          path: "blog/:slug",
          element: <SingleBlogPage />
        },
        {
          path: "login",
          element: <Login/>
        },
        {
          path: "my-learning",
          element: <MyLearning/>
        },
        {
          path: "profile",
          element: <Profile/>
        },
        {
          path: "blog/create",
          element: <CreateBlogPage />,
        },
        {
            path: "blog/edit/:slug",
            element: <EditBlogPage />,
        },
      ],
    },
  ]);

function App() {
  return (
    <main>
      <RouterProvider router={appRouter}/>
    </main>
  );
}

export default App;
