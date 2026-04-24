import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../lib/api.js";
import { scoringWeights, healthLevels } from "../engines/config/scoringWeights.js";
import { keywordBanks } from "../engines/config/keywordBanks.js";
import toast from "react-hot-toast";
import Loader from "../components/Loader.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend } from "recharts";

const TABS = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "users", label: "Users", icon: "👥" },
  { key: "resumes", label: "Resumes", icon: "📄" },
  { key: "config", label: "Config Engine", icon: "⚙️" },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request("/admin/users", { method: "GET" });
        setUsers(res.users || []);
      } catch (err) {
        toast.error(err.message || "Failed to load admin data");
        if (err.message?.includes("not authorized") || err.message?.includes("Admin")) {
          navigate("/dashboard");
        }
      } finally { setLoading(false); }
    };
    fetchData();
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user and all their resumes? This cannot be undone.")) return;
    try {
      await request(`/admin/users/${userId}`, { method: "DELETE" });
      setUsers(users.filter(u => u._id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const handleDeleteResume = async (resumeId, userId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await request(`/resume/${resumeId}`, { method: "DELETE" });
      setUsers(users.map(u => {
        if (u._id === userId) {
          return { ...u, resumes: (u.resumes || []).filter(r => r && r._id !== resumeId) };
        }
        return u;
      }));
      toast.success("Resume deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete resume");
    }
  };

  const analytics = useMemo(() => {
    const totalUsers = users.length;
    const allResumes = users.flatMap(u => (u.resumes || []).filter(Boolean));
    const totalResumes = allResumes.length;
    const scores = allResumes.map(r => r?.feedback?.overallScore).filter(s => typeof s === "number");
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const roleDistribution = {};
    users.forEach(u => { const r = u.role || "student"; roleDistribution[r] = (roleDistribution[r] || 0) + 1; });
    const rolePieData = Object.entries(roleDistribution).map(([name, value]) => ({ name, value }));
    const scoreDistribution = [
      { range: "0-40", count: scores.filter(s => s <= 40).length, fill: "#DC2626" },
      { range: "41-60", count: scores.filter(s => s > 40 && s <= 60).length, fill: "#D97706" },
      { range: "61-80", count: scores.filter(s => s > 60 && s <= 80).length, fill: "#2563EB" },
      { range: "81-100", count: scores.filter(s => s > 80).length, fill: "#16A34A" },
    ];
    return { totalUsers, totalResumes, avgScore, rolePieData, scoreDistribution };
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [users, search]);

  if (loading) return <Loader text="Loading admin panel..." />;

  const PIE_COLORS = ["#818cf8", "#f472b6", "#34d399", "#fbbf24", "#60a5fa"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Panel</h1>
            <p className="text-slate-400 text-sm">System Intelligence & Analytics</p>
          </div>
          <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/admin-login"); }} className="px-4 py-2 rounded-full text-sm font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition cursor-pointer">
            Logout
          </button>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition cursor-pointer whitespace-nowrap ${tab === t.key ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Users" value={analytics.totalUsers} color="#818cf8" />
              <StatCard label="Total Resumes" value={analytics.totalResumes} color="#34d399" />
              <StatCard label="Avg Score" value={`${analytics.avgScore}/100`} color="#60a5fa" />
              <StatCard label="Active Roles" value={Object.keys(analytics.rolePieData).length} color="#f472b6" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">Score Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analytics.scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="range" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12 }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {analytics.scoreDistribution.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">User Roles</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={analytics.rolePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {analytics.rolePieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <div className="space-y-4">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name or email..."
              className="w-full md:w-96 rounded-xl bg-slate-900 border border-slate-700 px-5 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm" />
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wide">
                    <th className="text-left px-5 py-3">User</th>
                    <th className="text-left px-5 py-3">Role</th>
                    <th className="text-left px-5 py-3">Resumes</th>
                    <th className="text-left px-5 py-3">Joined</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition">
                      <td className="px-5 py-3">
                        <div className="font-medium text-slate-100">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300">{u.role || "student"}</span>
                      </td>
                      <td className="px-5 py-3 text-slate-300">{(u.resumes || []).filter(Boolean).length}</td>
                      <td className="px-5 py-3 text-slate-400 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                      <td className="px-5 py-3 text-right">
                        {u.role !== "admin" && (
                          <button onClick={() => handleDeleteUser(u._id)} className="px-3 py-1.5 rounded-md text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer">
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <div className="text-center py-8 text-slate-500">No users found</div>}
            </div>
          </div>
        )}

        {/* ── RESUMES TAB ── */}
        {tab === "resumes" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-3">{analytics.totalResumes} total resume analyses across all users</p>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wide">
                    <th className="text-left px-5 py-3">User</th>
                    <th className="text-left px-5 py-3">Job Title</th>
                    <th className="text-left px-5 py-3">Score</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.flatMap(u => (u.resumes || []).filter(Boolean).map(r => ({ ...r, userId: u._id, userName: u.name, userEmail: u.email })))
                    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                    .slice(0, 50)
                    .map((r, i) => (
                      <tr key={r._id || i} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition">
                        <td className="px-5 py-3">
                          <div className="text-slate-200 text-xs">{r.userName}</div>
                          <div className="text-slate-500 text-[10px]">{r.userEmail}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-300">{r.jobTitle || "Untitled"}</td>
                        <td className="px-5 py-3">
                          {r.feedback?.overallScore != null ? (
                            <span className="font-bold" style={{ color: getHealthLevel(r.feedback.overallScore)?.color }}>{r.feedback.overallScore}</span>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-3 text-slate-400 text-xs">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
                        <td className="px-5 py-3 text-right flex items-center justify-end gap-2">
                          {r.resumePath && (
                            <a href={`http://localhost:5000${r.resumePath}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
                              View
                            </a>
                          )}
                          <button onClick={() => handleDeleteResume(r._id, r.userId)} className="px-3 py-1.5 rounded-md text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CONFIG ENGINE TAB ── */}
        {tab === "config" && (
          <div className="space-y-6">
            {/* Scoring Weights */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">Scoring Weights</h3>
              <p className="text-xs text-slate-500 mb-4">Current engine weights from PLAN.md. Edit <code className="text-indigo-400">engines/config/scoringWeights.js</code> to change.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(scoringWeights).map(([key, val]) => (
                  <div key={key} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">{key}</div>
                    <div className="text-2xl font-bold text-indigo-400">{Math.round(val * 100)}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Levels */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">Health Levels</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {healthLevels.map(l => (
                  <div key={l.label} className="rounded-xl p-4 border" style={{ borderColor: l.color + "40", background: l.color + "10" }}>
                    <div className="text-xl mb-1">{l.emoji}</div>
                    <div className="font-semibold" style={{ color: l.color }}>{l.label}</div>
                    <div className="text-xs text-slate-400">{l.min}–{l.max}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Banks */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">Keyword Banks</h3>
              <p className="text-xs text-slate-500 mb-4">Role-specific keyword banks. Edit <code className="text-indigo-400">engines/config/keywordBanks.js</code> to customize.</p>
              <div className="space-y-4">
                {Object.entries(keywordBanks).map(([role, data]) => (
                  <div key={role} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-indigo-300">{data.label}</span>
                      <span className="text-xs text-slate-500">{data.keywords.length} keywords</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {data.keywords.slice(0, 12).map(k => (
                        <span key={k} className="px-2 py-0.5 rounded-full text-[10px] bg-slate-700 text-slate-300">{k}</span>
                      ))}
                      {data.keywords.length > 12 && <span className="px-2 py-0.5 text-[10px] text-slate-500">+{data.keywords.length - 12} more</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
    <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">{label}</div>
    <div className="text-3xl font-bold" style={{ color }}>{value}</div>
  </div>
);

function getHealthLevel(score) {
  for (const l of healthLevels) {
    if (score >= l.min && score <= l.max) return l;
  }
  return healthLevels[0];
}

export default AdminPanel;
