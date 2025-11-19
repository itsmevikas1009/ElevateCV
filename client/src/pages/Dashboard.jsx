// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, logout } from "../lib/auth";

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
        console.error("Profile fetch error:", err);
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

  const handleEdit = () => {
    navigate("/profile/edit");
  };

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
                  {user ? (user.name ? user.name.charAt(0).toUpperCase() : "U") : "U"}
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{user?.name || "—"}</div>
                  <div className="text-sm text-gray-500">{user?.email || "—"}</div>
                  <div className="mt-2 text-xs text-gray-400">{user?.role || "Member"}</div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Company:</strong> {user?.company || "Not provided"}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Member since:</strong>{" "}
                  {user?._id
                    ? new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toLocaleDateString()
                    : "—"}
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
              <StatCard title="Profile completeness" value="82%" subtitle="Keep your profile updated" />
              <StatCard title="Connections" value="24" subtitle="Mentors & recruiters" />
              <StatCard title="Applied jobs" value="8" subtitle="This month" />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <div className="text-sm text-gray-500">Latest updates</div>
              </div>

              <div className="mt-4 space-y-4">
                {loading && <div className="text-sm text-gray-500">Loading activity...</div>}

                {!loading && error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

                {!loading && !error && (
                  <>
                    <div className="p-3 border border-gray-100 rounded-md">
                      <div className="text-sm text-gray-700">You updated your profile headline.</div>
                      <div className="text-xs text-gray-400 mt-1">2 days ago</div>
                    </div>

                    <div className="p-3 border border-gray-100 rounded-md">
                      <div className="text-sm text-gray-700">Applied to Job: Frontend Developer at Acme.</div>
                      <div className="text-xs text-gray-400 mt-1">5 days ago</div>
                    </div>

                    <div className="p-3 border border-gray-100 rounded-md">
                      <div className="text-sm text-gray-700">Connected with mentor Shreya K.</div>
                      <div className="text-xs text-gray-400 mt-1">1 week ago</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Full name</div>
                  <div className="mt-1 text-sm text-gray-800">{user?.name || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="mt-1 text-sm text-gray-800">{user?.email || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Role</div>
                  <div className="mt-1 text-sm text-gray-800">{user?.role || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Company</div>
                  <div className="mt-1 text-sm text-gray-800">{user?.company || "-"}</div>
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
