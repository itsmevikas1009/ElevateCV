import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../lib/api";
import toast from "react-hot-toast";

const ResumeUpload = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please upload a resume file (PDF, PNG, JPG).");
      toast.error("Please upload a resume file (PDF, PNG, JPG).");
      return;
    }

    setLoading(true);

    try {
      const data = await uploadResume({
        file,
        companyName: company,
        jobTitle,
        jobDescription: description,
      });

      toast.success("Resume uploaded & analyzed!");

      // 👉 Redirect to separate report page
      if (data?.resumeId) {
        navigate(`/resume-review/${data.resumeId}`);
      }
    } catch (err) {
      setError(err.message || "An error occurred while uploading.");
      toast.error(err.message || "An error occurred while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-10 px-4 bg-linear-to-br from-[#f5f3ff] via-[#e0f2fe] to-[#fdf2ff] relative overflow-hidden">
      {/* Soft pastel blobs */}
      <div className="pointer-events-none absolute -top-28 -left-10 h-60 w-60 rounded-full bg-[#e9d5ff] opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-12 h-64 w-64 rounded-full bg-[#bae6fd] opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-[#fecaca] opacity-60 blur-3xl" />

      <div className="w-full max-w-2xl relative">
        {/* Subtle gradient border around card */}
        <div className="absolute inset-0 rounded-[38px] bg-linear-to-r from-[#e9d5ff] via-[#bae6fd] to-[#fecaca] opacity-70 blur-[1px]" />
        <div className="relative w-full bg-white/80 backdrop-blur-xl rounded-[34px] shadow-[0_18px_60px_rgba(148,163,184,0.45)] ring-1 ring-white/70 p-8 md:p-10 overflow-hidden">
          {/* Top shimmer when loading */}
          {loading && (
            <div className="pointer-events-none absolute -inset-x-10 -top-8 h-16 bg-linear-to-r from-transparent via-white/60 to-transparent animate-pulse" />
          )}

          {/* Header */}
          <header className="text-center mb-10 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#e2e8f0] text-xs font-medium text-[#4b5563] mb-4 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span>
                {loading
                  ? "Analyzing your resume..."
                  : "Ready for your next big role"}
              </span>
            </div>

            <h1 className="text-[34px] md:text-5xl font-extrabold leading-tight tracking-tight">
              <span className="bg-linear-to-r from-[#a855f7] via-[#ec4899] to-[#0ea5e9] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(244,114,182,0.35)]">
                Smart feedback
              </span>
              <br />
              <span className="text-[#0f172a]">for your dream job</span>
            </h1>
            <p className="text-[#475569] mt-3 text-sm md:text-base max-w-xl mx-auto">
              Drop your resume for an ATS score and improvement tips. You’ll be
              redirected to a detailed report page after analysis.
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold tracking-wide text-[#64748b] mb-2 uppercase">
                Company Name
              </label>
              <input
                type="text"
                value={company}
                placeholder="Enter your company name"
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-[#0f172a] placeholder-[#9ca3af] bg-white border border-[#e2e8f0] shadow-[0_1px_3px_rgba(148,163,184,0.25)] focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 focus:border-transparent transition text-sm"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-semibold tracking-wide text-[#64748b] mb-2 uppercase">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                placeholder="Enter specific job role"
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-[#0f172a] placeholder-[#9ca3af] bg-white border border-[#e2e8f0] shadow-[0_1px_3px_rgba(148,163,184,0.25)] focus:outline-none focus:ring-2 focus:ring-[#ec4899]/50 focus:border-transparent transition text-sm"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-xs font-semibold tracking-wide text-[#64748b] mb-2 uppercase">
                Job Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a clear & concise job description with responsibilities & expectations..."
                className="w-full rounded-2xl px-4 py-3 text-[#0f172a] placeholder-[#9ca3af] bg-white border border-[#e2e8f0] shadow-[0_1px_3px_rgba(148,163,184,0.25)] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/50 focus:border-transparent resize-none h-28 transition text-sm"
              />
            </div>

            {/* Upload Resume */}
            <div>
              <label className="block text-xs font-semibold tracking-wide text-[#64748b] mb-3 uppercase">
                Upload Resume
              </label>
              <div
                onClick={() => fileInputRef.current.click()}
                className={`cursor-pointer flex flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-[#f9fafb] py-10 relative overflow-hidden transition 
                ${
                  loading
                    ? "border-emerald-400/70 bg-emerald-50/60"
                    : "border-[#e5e7eb] hover:border-[#a855f7]/70 hover:bg-white"
                }`}
              >
                {/* Shimmer overlay when loading */}
                {loading && (
                  <div className="pointer-events-none absolute -inset-x-24 -top-6 h-16 bg-linear-to-r from-transparent via-white/80 to-transparent animate-pulse" />
                )}

                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#e9d5ff] via-[#bae6fd] to-[#fecaca] border border-white shadow-[0_8px_25px_rgba(148,163,184,0.4)] flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="w-7 h-7 text-[#6366f1]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <p className="text-[#0f172a] font-medium">
                  Click to upload{" "}
                  <span className="text-[#6b7280] font-normal">
                    or drag and drop
                  </span>
                </p>
                <p className="text-xs text-[#9ca3af] mt-1">
                  PDF, PNG or JPG (max. 10MB)
                </p>

                {file && (
                  <p className="mt-4 text-xs md:text-sm text-[#16a34a]">
                    Uploaded:{" "}
                    <span className="font-semibold text-[#166534]">
                      {file.name}
                    </span>
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
                <div className="absolute right-3 bottom-3 bg-white/90 border border-[#e5e7eb] rounded-full shadow-[0_10px_30px_rgba(148,163,184,0.6)] px-2.5 py-0.5 flex items-center gap-1 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                  <span className="text-[10px] text-[#0f172a] font-medium">
                    You
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback / Error */}
            {error && (
              <div className="text-xs md:text-sm text-[#b91c1c] bg-[#fee2e2] border border-[#fecaca] p-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 mt-2 rounded-full text-sm md:text-base font-semibold text-white relative overflow-hidden
                  bg-linear-to-r from-[#a855f7] via-[#ec4899] to-[#0ea5e9] shadow-[0_10px_30px_rgba(244,114,182,0.55)]
                  hover:shadow-[0_12px_36px_rgba(244,114,182,0.65)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span
                  className={`relative inline-flex items-center justify-center gap-2 ${
                    loading ? "animate-pulse" : ""
                  }`}
                >
                  {loading && (
                    <span className="inline-flex h-3 w-3 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                  )}
                  <span>
                    {loading ? "Analyzing..." : "Save & Analyze Resume"}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="py-3 mt-2 rounded-full text-xs md:text-sm px-5 bg-white border border-[#e2e8f0] text-[#0f172a] hover:bg-[#f9fafb] hover:border-[#cbd5f5] transition shadow-sm"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
