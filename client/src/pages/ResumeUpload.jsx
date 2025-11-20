import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("JavaScript Mastery");
  const [jobTitle, setJobTitle] = useState("Frontend Developer");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const resetForm = () => {
    setCompany("JavaScript Mastery");
    setJobTitle("Frontend Developer");
    setDescription("");
    setFile(null);
    setFeedback(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFeedback(null);

    if (!file) {
      setError("Please upload a resume file (PDF, PNG, JPG).");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token") || "";

      const formData = new FormData();
      // IMPORTANT: send the file under the "resume" key to match your Multer config
      formData.append("resume", file);
      formData.append("companyName", company);
      formData.append("jobTitle", jobTitle);
      formData.append("jobDescription", description);

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json();
      console.log("Response status:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Upload failed");
      }

      // On success show AI feedback or navigate to a result page
      setFeedback(data?.feedback || data);
      // Optionally redirect to a resume details page:
      // navigate(`/resume/${data.resumeId}`);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "An error occurred while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-6 px-6">
      <div className="w-full max-w-2xl bg-white/60 backdrop-blur-md rounded-[34px] shadow-[0_12px_50px_rgba(134,118,255,0.15)] ring-1 ring-white/40 p-10">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-[48px] md:text-5xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-[#7a5cff] via-[#8b84ff] to-[#d88aa6] bg-clip-text text-transparent">
              Smart feedback
            </span>
            <br />
            <span className="text-gray-800">for your dream job</span>
          </h1>
          <p className="text-gray-600 mt-3 text-base">
            Drop your resume for an ATS score and improvement tips.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Company Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 bg-white border border-transparent shadow-[inset_0_2px_6px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-0 focus:shadow-[inset_0_0_0_3px_rgba(123,123,255,0.2)] transition"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 bg-white border border-transparent shadow-[inset_0_2px_6px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-0 focus:focus:shadow-[inset_0_0_0_3px_rgba(123,123,255,0.2)] transition"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Job Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a clear & concise job description with responsibilities & expectations..."
              className="w-full rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 bg-white border border-transparent shadow-[inset_0_2px_6px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-0 focus:shadow-[inset_0_0_0_3px_rgba(123,123,255,0.2)] resize-none h-28 transition"
            />
          </div>

          {/* Upload Resume */}
          <div>
            <label className="block text-sm text-gray-600 mb-3">
              Upload Resume
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="cursor-pointer flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E0E3FF] bg-white/80 py-10 hover:border-[#b8b3ff] transition relative"
            >
              <div className="w-12 h-12 rounded-full bg-[#f1efff] flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.6}
                  stroke="#6B63FF"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">
                Click to upload{" "}
                <span className="text-gray-500 font-normal">
                  or drag and drop
                </span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                PDF, PNG or JPG (max. 10MB)
              </p>

              {file && (
                <p className="mt-4 text-sm text-gray-700">
                  Uploaded: <span className="font-medium">{file.name}</span>
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Floating “You” bubble */}
              <div className="absolute right-3 bottom-3 bg-white rounded-full shadow-md px-2.5 py-0.5 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#7A7CFF]" />
                <span className="text-xs text-[#27425E] font-medium">You</span>
              </div>
            </div>
          </div>

          {/* Feedback / Error */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {feedback && (
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-semibold mb-2">AI Feedback</h3>
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(feedback, null, 2)}
              </pre>
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 mt-2 rounded-full text-white font-medium bg-gradient-to-r from-[#6B63FF] to-[#7A7CFF] shadow-[0_8px_20px_rgba(123,123,255,0.25)] hover:shadow-[0_10px_24px_rgba(123,123,255,0.35)] transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "Analyzing..." : "Save & Analyze Resume"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="py-3 mt-2 rounded-full text-sm px-4 bg-white border border-gray-200"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
