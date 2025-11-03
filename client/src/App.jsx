// // src/App.jsx
// import React from "react";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import RootLayout, { ErrorBoundary } from "./root";

// // Pages
// import Home from "./pages/Home";
// import Resume from "./pages/Resume";
// import Login from "./pages/Login";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     errorElement: <ErrorBoundary />,
//     children: [
//       { path: "/", element: <Home /> },
//       { path: "/resume", element: <Resume /> },
//       { path: "/login", element: <Login /> },
//     ],
//   },
// ]);

// export default function App() {
//   return <RouterProvider router={router} />;
// }


import React from "react";
import Resume from "./pages/Resume";

function App() {
  return (
    <div className="App">
      <Resume />
    </div>
  );
}

export default App;
