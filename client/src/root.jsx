// src/root.jsx
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuthStore from "./lib/auth"; // ✅ fixed line

export default function RootLayout() {
  const { init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-semibold text-gray-800">ElevateCV</h1>
      </header>

      {/* Main Outlet (page content) */}
      <main className="flex-1 container mx-auto p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-3 text-sm text-gray-500">
        © {new Date().getFullYear()} ElevateCV. All rights reserved.
      </footer>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (error && error.status === 404) {
    message = "404";
    details = "The requested page could not be found.";
  } else if (error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-2xl font-bold mb-2">{message}</h1>
      <p className="mb-4 text-gray-700">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-gray-100 text-sm rounded">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
