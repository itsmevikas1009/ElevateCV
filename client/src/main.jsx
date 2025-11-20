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
import { Toaster } from "react-hot-toast";

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
      // Default route — redirect to /signin
      {
        path: "/",
        element: <Navigate to="/signin" replace />,
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
