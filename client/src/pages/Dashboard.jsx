// src/pages/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, logout, deleteResumeById } from "../lib/api";
import toast from "react-hot-toast";
import Loader from "../components/Loader.jsx";

const StatCard = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
    <div className="text-xs font-medium text-gray-500">{title}</div>
    <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
    {subtitle && <div className="text-sm text-gray-400 mt-1">{subtitle}</div>}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDeleteResume = async (resumeId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this resume? This action cannot be undone."
      )
    )
      return;
    try {
      await deleteResumeById(resumeId);
      toast.success("Resume deleted!");
      const res = await getProfile();
      setUser(res.user || null);
    } catch (err) {
      toast.error(err.message || "Failed to delete resume.");
    }
  };

  // fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await getProfile(); // { success: true, user }
        setUser(res.user || null);
        if (res.user) localStorage.setItem("user", JSON.stringify(res.user));
      } catch (err) {
        setError(err.message || "Failed to load profile");
        if (
          err.message.toLowerCase().includes("token") ||
          err.message.toLowerCase().includes("unauthorized") ||
          err.message.toLowerCase().includes("not authorized")
        ) {
          logout();
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const handleEdit = () => navigate("/profile/edit");

  // 🧠 Compute stats from DB data
  const {
    totalResumes,
    bestScore,
    averageScore,
    lastAnalysisDate,
    lastResumeTitle,
  } = useMemo(() => {
    const resumes = user?.resumes || [];
    const scores = resumes
      .map((r) => r?.feedback?.overallScore)
      .filter((s) => typeof s === "number");

    const totalResumes = resumes.length;
    const bestScore = scores.length > 0 ? Math.max.apply(null, scores) : "—";
    const averageScore =
      scores.length > 0
        ? Math.round(scores.reduce((acc, s) => acc + s, 0) / scores.length)
        : "—";

    let lastAnalysisDate = "—";
    let lastResumeTitle = "—";

    if (resumes.length > 0) {
      const sorted = [...resumes].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const last = sorted[0];
      lastAnalysisDate = last.createdAt
        ? new Date(last.createdAt).toLocaleString()
        : "—";
      lastResumeTitle = last.jobTitle || "Untitled role";
    }

    return {
      totalResumes,
      bestScore,
      averageScore,
      lastAnalysisDate,
      lastResumeTitle,
    };
  }, [user]);

  if (loading) return <Loader text="Loading your dashboard..." />;
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600 text-lg">
        {error}
      </div>
    );

  // 🔥 avatarUrl supports both http(s) and local /uploads/avatars/...
  const avatarUrl =
    user?.profileImage && typeof user.profileImage === "string"
      ? user.profileImage.startsWith("http")
        ? user.profileImage
        : `http://localhost:5000${user.profileImage}`
      : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8 mt-10">
          <div>
            <h2 className="text-lg text-gray-500">Welcome back,</h2>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {user ? `Hi, ${user.name}` : "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm shadow-sm hover:shadow-md transition"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-linear-to-r from-[#ff6b6b] to-[#ff8a8a] text-white text-sm font-medium shadow-md hover:opacity-95 transition"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left column - profile card */}
          <section className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-linear-to-tr from-indigo-400 to-pink-300 flex items-center justify-center text-white text-2xl font-bold">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || "User avatar"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // fallback to initial if image fails
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement.textContent = user?.name
                          ? user.name.charAt(0).toUpperCase()
                          : "U";
                      }}
                    />
                  ) : user?.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    "U"
                  )}
                </div>

                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {user?.name || "—"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user?.email || "—"}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {user?.role || "Member"}
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Company:</strong> {user?.company || "Not provided"}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Member since:</strong>{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Resumes Uploaded:</strong>{" "}
                  {user?.resumes?.length || 0}
                </div>
              </div>
            </div>
          </section>

          {/* Right column - stats + feed */}
          <section className="lg:col-span-3 space-y-6">
            {/* Stats from real DB data */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <StatCard
                title="Total resumes analyzed"
                value={totalResumes}
                subtitle="All time"
              />
              <StatCard
                title="Best resume score"
                value={
                  typeof bestScore === "number" ? `${bestScore}/100` : "—"
                }
                subtitle="Your top performance"
              />
              <StatCard
                title="Average resume score"
                value={
                  typeof averageScore === "number"
                    ? `${averageScore}/100`
                    : "—"
                }
                subtitle="Across all analyses"
              />
              <StatCard
                title="Last analysis"
                value={lastResumeTitle}
                subtitle={lastAnalysisDate}
              />
            </div>

            {/* Recent Resume Uploads */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Resumes
              </h3>
              {!user?.resumes || user.resumes.length === 0 ? (
                <div className="text-sm text-gray-600">
                  No resumes uploaded yet. Upload your first one to see insights
                  here.
                </div>
              ) : (
                <div className="space-y-5 max-h-[420px] overflow-y-auto pr-1">
                  {user.resumes
                    .slice()
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((resume) => (
                      <div
                        key={resume._id}
                        className="p-4 border border-gray-100 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-gray-800">
                            {resume.jobTitle || "Untitled Role"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                            {resume.jobDescription}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Uploaded on{" "}
                            {resume.createdAt
                              ? new Date(
                                  resume.createdAt
                                ).toLocaleDateString()
                              : "—"}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3 sm:mt-0">
                          {resume.feedback?.overallScore !== undefined && (
                            <div className="font-bold text-blue-700 text-xl">
                              {resume.feedback.overallScore}/100
                            </div>
                          )}
                          {resume.resumePath && (
                            <a
                              href={`http://localhost:5000${resume.resumePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-xs"
                            >
                              View
                            </a>
                          )}
                          <button
                            onClick={() =>
                              navigate(`/resume-review/${resume._id}`)
                            }
                            className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded shadow hover:bg-indigo-100"
                          >
                            Report
                          </button>
                          <button
                            onClick={() => handleDeleteResume(resume._id)}
                            className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded shadow hover:bg-red-100"
                            title="Delete Resume"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Account details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Full name</div>
                  <div className="mt-1 text-sm text-gray-800">
                    {user?.name || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="mt-1 text-sm text-gray-800">
                    {user?.email || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Role</div>
                  <div className="mt-1 text-sm text-gray-800">
                    {user?.role || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Company</div>
                  <div className="mt-1 text-sm text-gray-800">
                    {user?.company || "-"}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
