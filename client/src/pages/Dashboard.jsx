import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, logout, deleteResumeById } from "../lib/api";
import { process as runEngine } from "../engines/index.js";
import { getHealthLevel } from "../engines/config/scoringWeights.js";
import HealthMeter from "../components/health/HealthMeter.jsx";
import toast from "react-hot-toast";
import Loader from "../components/Loader.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm("Delete this resume? This cannot be undone.")) return;
    try {
      await deleteResumeById(resumeId);
      toast.success("Resume deleted!");
      const res = await getProfile();
      setUser(res.user || null);
    } catch (err) {
      toast.error(err.message || "Failed to delete resume.");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/signin"); return; }
      try {
        setLoading(true);
        const res = await getProfile();
        setUser(res.user || null);
        if (res.user) localStorage.setItem("user", JSON.stringify(res.user));
      } catch (err) {
        setError(err.message || "Failed to load profile");
        if (err.message?.toLowerCase().includes("token") || err.message?.toLowerCase().includes("unauthorized")) {
          logout(); navigate("/signin");
        }
      } finally { setLoading(false); }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => { logout(); navigate("/signin"); };

  // Compute all analytics from real DB data
  const stats = useMemo(() => {
    const resumes = user?.resumes || [];
    const scores = resumes.map(r => r?.feedback?.overallScore).filter(s => typeof s === "number");
    const totalResumes = resumes.length;
    const bestScore = scores.length > 0 ? Math.max(...scores) : null;
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    const sorted = [...resumes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Score trend data (for LineChart)
    const scoreTrend = sorted.slice().reverse()
      .filter(r => r?.feedback?.overallScore != null)
      .map((r, i) => ({
        name: `#${i + 1}`,
        score: r.feedback.overallScore,
        date: new Date(r.createdAt).toLocaleDateString(),
      }));

    // Category breakdown from latest resume
    const latest = sorted[0];
    const categories = latest?.feedback?.categories ? Object.entries(latest.feedback.categories).map(([key, val]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      score: typeof val === "number" ? val : val?.score || 0,
    })) : [];

    // Score distribution
    const distribution = [
      { range: "0-40", count: scores.filter(s => s <= 40).length, fill: "#DC2626" },
      { range: "41-60", count: scores.filter(s => s > 40 && s <= 60).length, fill: "#D97706" },
      { range: "61-80", count: scores.filter(s => s > 60 && s <= 80).length, fill: "#2563EB" },
      { range: "81-100", count: scores.filter(s => s > 80).length, fill: "#16A34A" },
    ];

    return { totalResumes, bestScore, avgScore, sorted, scoreTrend, categories, distribution };
  }, [user]);

  if (loading) return <Loader text="Loading your dashboard..." />;
  if (error) return <div className="flex min-h-screen items-center justify-center text-red-600 text-lg">{error}</div>;

  const avatarUrl = user?.profileImage && typeof user.profileImage === "string"
    ? user.profileImage.startsWith("http") ? user.profileImage : `http://localhost:5000${user.profileImage}`
    : null;

  const healthLevel = stats.avgScore != null ? getHealthLevel(stats.avgScore) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Left Sidebar: Profile Card ── */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col items-center text-center shadow-xl lg:sticky lg:top-28">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-linear-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-4 border-4 border-slate-950">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.textContent = (user?.name || "U").charAt(0).toUpperCase(); }} />
                ) : (user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2 w-full">
                {user?.name || "User"}
                {user?.role === "admin" && <span className="px-2 py-0.5 text-[10px] bg-red-500/20 text-red-400 rounded-full border border-red-500/30">Admin</span>}
              </h2>
              <div className="text-sm text-indigo-400 font-medium mb-1">{user?.jobTitle || user?.role || "Member"}</div>
              {user?.company && <div className="text-xs text-slate-400 mb-4">{user.company}</div>}

              {user?.bio && (
                <div className="text-xs text-slate-400 leading-relaxed mb-6 pb-6 border-b border-slate-800 w-full italic">"{user.bio}"</div>
              )}

              <div className="w-full space-y-3 text-left mb-6">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Student / Info</div>
                {user?.email && <div className="flex items-center gap-3 text-sm text-slate-300"><span className="text-slate-500">✉️</span> <span className="truncate">{user.email}</span></div>}
                {user?.contactNumber && <div className="flex items-center gap-3 text-sm text-slate-300"><span className="text-slate-500">📞</span> {user.contactNumber}</div>}
                {user?.location && <div className="flex items-center gap-3 text-sm text-slate-300"><span className="text-slate-500">📍</span> {user.location}</div>}
                {user?.university && <div className="flex items-center gap-3 text-sm text-slate-300"><span className="text-slate-500">🎓</span> <span className="truncate">{user.university}</span></div>}
                {user?.degree && <div className="flex items-center gap-3 text-sm text-slate-300"><span className="text-slate-500">📜</span> {user.degree} {user.graduationYear ? `'${user.graduationYear.slice(-2)}` : ''}</div>}
                {user?.experience && <div className="flex items-center gap-3 text-sm text-slate-300"><span className="text-slate-500">💼</span> {user.experience}</div>}
              </div>

              {((user?.linkedin || user?.github || user?.website)) && (
                <div className="w-full mb-6 pb-6 border-b border-slate-800 flex justify-center gap-4">
                  {user.linkedin && <a href={user.linkedin} target="_blank" className="text-slate-400 hover:text-indigo-400 transition text-lg">🔗</a>}
                  {user.github && <a href={user.github} target="_blank" className="text-slate-400 hover:text-slate-200 transition text-lg">💻</a>}
                  {user.website && <a href={user.website} target="_blank" className="text-slate-400 hover:text-cyan-400 transition text-lg">🌐</a>}
                </div>
              )}

              <div className="w-full flex flex-col gap-2 mt-auto">
                <button onClick={() => navigate("/profile/edit")} className="w-full py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-white hover:bg-slate-700 transition cursor-pointer">
                  Edit Profile
                </button>
                <button onClick={handleLogout} className="w-full py-2.5 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition cursor-pointer">
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* ── Right Main Area ── */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Quick Actions Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Welcome back!</h1>
                <p className="text-sm text-slate-400">Ready to boost your career today?</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => navigate("/build-resume")} className="px-5 py-2.5 rounded-full text-sm font-semibold bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer">
                  ✨ Build Resume
                </button>
                <button onClick={() => navigate("/resume-upload")} className="px-5 py-2.5 rounded-full text-sm font-semibold border border-slate-600 text-slate-300 hover:bg-slate-800 transition cursor-pointer">
                  📄 Upload Resume
                </button>
              </div>
            </div>

            {/* Skills Tags (If any) */}
            {user?.skills && user.skills.length > 0 && (
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
                <div className="text-xs text-slate-400 uppercase tracking-wide font-bold mb-4">My Top Skills</div>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, i) => (
                    <span key={i} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Analyzed</div>
                <div className="text-3xl font-bold text-indigo-400">{stats.totalResumes}</div>
              </div>
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Best Score</div>
                <div className="text-3xl font-bold text-emerald-400">{stats.bestScore != null ? stats.bestScore : "—"}<span className="text-lg text-slate-500">/100</span></div>
              </div>
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Avg Score</div>
                <div className="text-3xl font-bold text-blue-400">{stats.avgScore != null ? stats.avgScore : "—"}<span className="text-lg text-slate-500">/100</span></div>
              </div>
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Health</div>
                <div className="text-2xl font-bold" style={{ color: healthLevel?.color || "#94a3b8" }}>
                  {healthLevel ? `${healthLevel.emoji} ${healthLevel.label}` : "—"}
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">Score Trend</h3>
                {stats.scoreTrend.length > 1 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={stats.scoreTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, fontSize: 12 }} />
                      <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} dot={{ fill: "#818cf8", r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm bg-slate-950/50 rounded-xl border border-slate-800/50">
                    Upload 2+ resumes to see your score trend
                  </div>
                )}
              </div>
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">Score Distribution</h3>
                {stats.totalResumes > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.distribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="range" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, fontSize: 12 }} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {stats.distribution.map((d, i) => <Cell key={i} fill={d.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm bg-slate-950/50 rounded-xl border border-slate-800/50">
                    No resumes analyzed yet
                  </div>
                )}
              </div>
            </div>

            {/* Recent Resumes */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Recent Resumes</h3>
                <span className="text-xs px-2 py-1 bg-slate-800 rounded-lg text-slate-400">{stats.totalResumes} total</span>
              </div>
              {stats.sorted.length === 0 ? (
                <div className="text-center py-12 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                  <div className="text-4xl mb-4">📄</div>
                  <p className="text-slate-400 mb-6">No resumes yet. Start building or upload one!</p>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => navigate("/build-resume")} className="px-5 py-2.5 rounded-full text-sm font-semibold bg-indigo-600 text-white cursor-pointer hover:bg-indigo-500 transition">Build Resume</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                  {stats.sorted.map((resume) => {
                    const score = resume.feedback?.overallScore;
                    const level = score != null ? getHealthLevel(score) : null;
                    return (
                      <div key={resume._id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/50 transition group">
                        {/* Score badge */}
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 border border-slate-800 group-hover:border-indigo-500/30 transition-colors" style={{ backgroundColor: (level?.color || "#64748b") + "15", color: level?.color || "#94a3b8" }}>
                          {score != null ? score : "—"}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-100 truncate text-sm sm:text-base">{resume.jobTitle || "Untitled Role"}</div>
                          <div className="text-xs text-slate-400 truncate">{resume.jobDescription || "No description provided"}</div>
                          <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-2">
                            <span>{resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : "—"}</span>
                            {level && <span className="px-1.5 py-0.5 rounded-md text-[10px]" style={{ backgroundColor: level.color + "20", color: level.color }}>{level.label}</span>}
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                          {resume.resumePath && (
                            <a href={`http://localhost:5000${resume.resumePath}`} target="_blank" rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition text-center w-full sm:w-auto">
                              View
                            </a>
                          )}
                          <button onClick={() => navigate(`/resume-review/${resume._id}`)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 hover:text-indigo-200 transition cursor-pointer w-full sm:w-auto">
                            Report
                          </button>
                          <button onClick={() => handleDeleteResume(resume._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition cursor-pointer w-full sm:w-auto">
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
