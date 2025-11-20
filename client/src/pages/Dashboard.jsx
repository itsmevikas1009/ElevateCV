import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, logout } from "../lib/api"; // Use api.js, not auth.js
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
        const res = await getProfile(); // expects { success: true, user }
        setUser(res.user || null);
        if (res.user) localStorage.setItem("user", JSON.stringify(res.user));
      } catch (err) {
        setError(err.message || "Failed to load profile");
        // On auth error, clear and redirect
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

  if (loading) return <Loader text="Loading your dashboard..." />;
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600 text-lg">
        {error}
      </div>
    );

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
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#ff8a8a] text-white text-sm font-medium shadow-md hover:opacity-95 transition"
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
                <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-indigo-400 to-pink-300 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
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
                  {user?._id
                    ? new Date(
                        parseInt(user._id.substring(0, 8), 16) * 1000
                      ).toLocaleDateString()
                    : "—"}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Resumes Uploaded:</strong>{" "}
                  {user?.resumes?.length || 0}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <a
                className="block px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                View Activity
              </a>
              <a
                className="block px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Settings
              </a>
            </div>
          </section>

          {/* Right column - stats + feed */}
          <section className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Profile completeness"
                value="82%"
                subtitle="Keep your profile updated"
              />
              <StatCard
                title="Connections"
                value="24"
                subtitle="Mentors & recruiters"
              />
              <StatCard title="Applied jobs" value="8" subtitle="This month" />
              <StatCard
                title="Resumes Uploaded"
                value={user?.resumes?.length || 0}
                subtitle="Total analyzed resumes"
              />
            </div>

            {/* Recent Resume Uploads */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Resumes
              </h3>
              {!user?.resumes || user.resumes.length === 0 ? (
                <div className="text-sm text-gray-600">
                  No resumes uploaded yet.
                </div>
              ) : (
                <div className="space-y-5">
                  {user.resumes.slice(0, 5).map((resume) => (
                    <div
                      key={resume._id}
                      className="p-4 border border-gray-100 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {resume.jobTitle || "Untitled Role"}
                        </div>
                        <div
                          className="text-xs text-gray-500 mt-1 truncate"
                          style={{ maxWidth: 200 }}
                        >
                          {resume.jobDescription}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Uploaded on{" "}
                          {resume.createdAt
                            ? new Date(resume.createdAt).toLocaleDateString()
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
                          Review
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
