// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import ResumeUpload from "./pages/ResumeUpload.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import ResumeReviewPage from "./pages/ResumeReviewPage.jsx";
import Landing from "./pages/Landing.jsx";
import { Toaster } from "react-hot-toast";
import BlogPage from "./pages/BlogPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import BuildResume from "./pages/BuildResume.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

// Public route wrapper
const PublicRoute = ({ children }) => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;
  return children;
};

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  if (!isLoggedIn) return <Navigate to="/signin" replace />;
  return children;
};

// Optional NotFound page
const NotFound = () => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold mb-3">404 — Page not found</h1>
    <a href="/" className="text-blue-600">
      Go Home
    </a>
  </div>
);

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Default route — Landing page
      {
        path: "/",
        element: <Landing />,
      },

      // Public routes
      {
        path: "/signin",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        ),
      },
      {
        path: "/build-resume",
        element: (
          <ProtectedRoute>
            <BuildResume />
          </ProtectedRoute>
        ),
      },
      // 🔓 Public marketing/info pages
      {
        path: "/blog",
        element: <BlogPage />,
      },
      {
        path: "/support",
        element: <SupportPage />,
      },
      {
        path: "/how-it-works",
        element: <HowItWorksPage />,
      },
      // 🔐 Protected routes
      {
        path: "/resume-upload",
        element: (
          <ProtectedRoute>
            <ResumeUpload />
          </ProtectedRoute>
        ),
      },
      {
        path: "/resume-review/:id",
        element: (
          <ProtectedRoute>
            <ResumeReviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      {
        path: "/profile/edit",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },

      {
        path: "/admin-login",
        element: (
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        ),
      },

      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        ),
      },

      // Catch-all for unmatched routes
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
    <Toaster position="top-center" />
  </StrictMode>
);
