// components/Loader.jsx
import React from "react";

const Loader = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center w-full h-[50vh]">
    <svg
      className="animate-spin h-10 w-10 text-indigo-500 mb-2"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-70"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
    <span className="text-indigo-500 font-medium text-lg">{text}</span>
  </div>
);

export default Loader;
