import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { init, process as runEngine } from "../engines/index.js";
import { scoreBullet } from "../engines/bulletScorer.js";
import { keywordBanks } from "../engines/config/keywordBanks.js";
import { downloadResumePDF, resumeToTextFile } from "../engines/pdfExport.js";
import { uploadResume } from "../lib/api.js";
import HealthMeter from "../components/health/HealthMeter.jsx";
import HealthBreakdown from "../components/health/HealthBreakdown.jsx";
import SuggestionPanel from "../components/suggestions/SuggestionPanel.jsx";

/* ─────────── Job Mode roles ─────────── */
const JOB_ROLES = Object.entries(keywordBanks).map(([key, val]) => ({ value: key, label: val.label }));

/* ─────────── Default empty resume (JSON) ─────────── */
const emptyResume = () => ({
  name: "",
  title: "",
  email: "",
  phone: "",
  linkedin: "",
  summary: "",
  experience: [{ id: Date.now(), role: "", company: "", duration: "", bullets: [""] }],
  skills: [""],
  projects: [{ id: Date.now() + 1, name: "", description: "", stack: [""], link: "" }],
  education: [{ id: Date.now() + 2, degree: "", institution: "", year: "" }],
});

/* ─────────── Pill chips for skill tags ─────────── */
const SkillTag = ({ value, onChange, onRemove }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs">
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Skill"
      className="bg-transparent outline-none w-20 text-slate-800 placeholder-slate-400 text-xs"
    />
    <button type="button" onClick={onRemove} className="text-slate-400 hover:text-red-500 cursor-pointer">×</button>
  </span>
);

/* ─────────── Main Builder ─────────── */
const BuildResume = () => {
  const [resume, setResume] = useState(emptyResume);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedRole, setSelectedRole] = useState("general");
  const [analysis, setAnalysis] = useState(null);
  const [versions, setVersions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  // Initialize engine
  useEffect(() => { init(); }, []);

  // Live intelligence loop: re-evaluate on every change
  const runAnalysis = useCallback(() => {
    const result = runEngine(resume, jobTitle, jobDescription);
    setAnalysis(result);
  }, [resume, jobTitle, jobDescription]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(runAnalysis, 400);
    return () => clearTimeout(debounceRef.current);
  }, [runAnalysis]);

  // Field updater
  const set = (field, value) => setResume((r) => ({ ...r, [field]: value }));

  // Experience helpers
  const updateExp = (idx, key, val) => {
    const exp = [...resume.experience];
    exp[idx] = { ...exp[idx], [key]: val };
    set("experience", exp);
  };
  const addExp = () => set("experience", [...resume.experience, { id: Date.now(), role: "", company: "", duration: "", bullets: [""] }]);
  const removeExp = (idx) => { const e = resume.experience.filter((_, i) => i !== idx); set("experience", e.length ? e : [{ id: Date.now(), role: "", company: "", duration: "", bullets: [""] }]); };
  const updateBullet = (eIdx, bIdx, val) => { const exp = [...resume.experience]; const b = [...exp[eIdx].bullets]; b[bIdx] = val; exp[eIdx] = { ...exp[eIdx], bullets: b }; set("experience", exp); };
  const addBullet = (eIdx) => { const exp = [...resume.experience]; exp[eIdx] = { ...exp[eIdx], bullets: [...exp[eIdx].bullets, ""] }; set("experience", exp); };
  const removeBullet = (eIdx, bIdx) => { const exp = [...resume.experience]; const b = exp[eIdx].bullets.filter((_, i) => i !== bIdx); exp[eIdx] = { ...exp[eIdx], bullets: b.length ? b : [""] }; set("experience", exp); };

  // Skills helpers
  const updateSkill = (idx, val) => { const s = [...resume.skills]; s[idx] = val; set("skills", s); };
  const addSkill = () => set("skills", [...resume.skills, ""]);
  const removeSkill = (idx) => { const s = resume.skills.filter((_, i) => i !== idx); set("skills", s.length ? s : [""]); };

  // Project helpers
  const updateProj = (idx, key, val) => { const p = [...resume.projects]; p[idx] = { ...p[idx], [key]: val }; set("projects", p); };
  const addProj = () => set("projects", [...resume.projects, { id: Date.now(), name: "", description: "", stack: [""], link: "" }]);
  const removeProj = (idx) => { const p = resume.projects.filter((_, i) => i !== idx); set("projects", p.length ? p : [{ id: Date.now(), name: "", description: "", stack: [""], link: "" }]); };

  // Education helpers
  const updateEdu = (idx, key, val) => { const e = [...resume.education]; e[idx] = { ...e[idx], [key]: val }; set("education", e); };
  const addEdu = () => set("education", [...resume.education, { id: Date.now(), degree: "", institution: "", year: "" }]);
  const removeEdu = (idx) => { const e = resume.education.filter((_, i) => i !== idx); set("education", e.length ? e : [{ id: Date.now(), degree: "", institution: "", year: "" }]); };

  // Version snapshot
  const saveVersion = () => {
    setVersions((prev) => [...prev, { timestamp: Date.now(), score: analysis?.overallScore || 0, snapshot: JSON.parse(JSON.stringify(resume)) }]);
  };

  const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition placeholder-slate-400";
  const labelCls = "block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5";
  const blockCls = "rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-sm p-5 shadow-[0_4px_16px_rgba(148,163,184,0.12)]";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-linear-to-br from-[#f5f3ff] via-[#e0f2fe] to-[#fde1ff]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-xs font-semibold text-slate-600 mb-3 shadow-sm">
            Resume Intelligence Operating System
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-linear-to-r from-[#4f46e5] via-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
            Build & Optimize Your Resume
          </h1>
          <p className="mt-2 text-slate-600 text-sm max-w-2xl mx-auto">
            Every edit is instantly evaluated. Build block-by-block, see your score rise in real time.
          </p>
        </header>

        {/* Job Mode context bar */}
        <div className={`${blockCls} mb-6`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 text-xs">🎯</span>
            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Job Mode</h2>
            <span className="text-[10px] text-slate-400 ml-auto">System adapts scoring + keywords to your target role</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Target Role</label>
              <select value={selectedRole} onChange={(e) => { setSelectedRole(e.target.value); setJobTitle(keywordBanks[e.target.value]?.label || ""); }} className={`${inputCls} cursor-pointer`}>
                {JOB_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Job Title</label>
              <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Frontend Developer" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Job Description (optional)</label>
              <input value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste key requirements..." className={inputCls} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,340px] gap-6">
          {/* LEFT: Builder blocks */}
          <div className="space-y-5">
            {/* ─── Identity Block ─── */}
            <div className={blockCls}>
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs">👤</span>
                Identity
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                <div><label className={labelCls}>Full Name</label><input value={resume.name} onChange={(e) => set("name", e.target.value)} placeholder="John Doe" className={inputCls} /></div>
                <div><label className={labelCls}>Job Title</label><input value={resume.title} onChange={(e) => set("title", e.target.value)} placeholder="Frontend Developer" className={inputCls} /></div>
                <div><label className={labelCls}>Email</label><input value={resume.email} onChange={(e) => set("email", e.target.value)} placeholder="john@example.com" type="email" className={inputCls} /></div>
                <div><label className={labelCls}>Phone</label><input value={resume.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 9876543210" className={inputCls} /></div>
                <div className="md:col-span-2"><label className={labelCls}>LinkedIn</label><input value={resume.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="linkedin.com/in/johndoe" className={inputCls} /></div>
              </div>
            </div>

            {/* ─── Summary Block ─── */}
            <div className={blockCls}>
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs">📝</span>
                Professional Summary
              </h2>
              <textarea value={resume.summary} onChange={(e) => set("summary", e.target.value)} rows={3} placeholder="Experienced frontend developer specializing in React, performance optimization, and accessible UI design..." className={`${inputCls} resize-none`} />
            </div>

            {/* ─── Experience Block (SMART) ─── */}
            <div className={blockCls}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs">💼</span>
                  Experience
                </h2>
                <button type="button" onClick={addExp} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">+ Add Role</button>
              </div>
              {resume.experience.map((exp, eIdx) => (
                <div key={exp.id || eIdx} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 mb-3 relative">
                  {resume.experience.length > 1 && (
                    <button type="button" onClick={() => removeExp(eIdx)} className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600 cursor-pointer">Remove</button>
                  )}
                  <div className="grid md:grid-cols-3 gap-3 mb-3">
                    <div><label className={labelCls}>Role</label><input value={exp.role} onChange={(e) => updateExp(eIdx, "role", e.target.value)} placeholder="Frontend Developer" className={inputCls} /></div>
                    <div><label className={labelCls}>Company</label><input value={exp.company} onChange={(e) => updateExp(eIdx, "company", e.target.value)} placeholder="Google" className={inputCls} /></div>
                    <div><label className={labelCls}>Duration</label><input value={exp.duration} onChange={(e) => updateExp(eIdx, "duration", e.target.value)} placeholder="Jan 2023 - Present" className={inputCls} /></div>
                  </div>
                  <label className={labelCls}>Bullet Points</label>
                  {exp.bullets.map((bullet, bIdx) => {
                    const bs = bullet.length > 4 ? scoreBullet(bullet) : null;
                    return (
                      <div key={bIdx} className="mb-2">
                        <div className="flex gap-2">
                          <span className="mt-2.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: bs?.color || '#818cf8' }} />
                          <input value={bullet} onChange={(e) => updateBullet(eIdx, bIdx, e.target.value)} placeholder="Built responsive dashboard that improved user engagement by 25%..." className={`${inputCls} flex-1`} />
                          {bs && (
                            <span className="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ color: bs.color, backgroundColor: bs.color + '15' }}>
                              {bs.score} · {bs.label}
                            </span>
                          )}
                          {exp.bullets.length > 1 && <button type="button" onClick={() => removeBullet(eIdx, bIdx)} className="text-red-400 hover:text-red-600 text-xs cursor-pointer">×</button>}
                        </div>
                        {bs && bs.tips.length > 0 && bs.score < 70 && (
                          <div className="ml-4 mt-1 text-[10px] text-amber-600">
                            💡 {bs.tips[0]}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button type="button" onClick={() => addBullet(eIdx)} className="text-xs text-indigo-500 hover:text-indigo-700 mt-1 cursor-pointer">+ Add bullet</button>
                </div>
              ))}
            </div>

            {/* ─── Skills Block (Dynamic Tags) ─── */}
            <div className={blockCls}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs">⚡</span>
                  Skills
                </h2>
                <button type="button" onClick={addSkill} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">+ Add Skill</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, idx) => (
                  <SkillTag key={idx} value={skill} onChange={(val) => updateSkill(idx, val)} onRemove={() => removeSkill(idx)} />
                ))}
              </div>
            </div>

            {/* ─── Projects Block ─── */}
            <div className={blockCls}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs">🚀</span>
                  Projects
                </h2>
                <button type="button" onClick={addProj} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">+ Add Project</button>
              </div>
              {resume.projects.map((proj, pIdx) => (
                <div key={proj.id || pIdx} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 mb-3 relative">
                  {resume.projects.length > 1 && (
                    <button type="button" onClick={() => removeProj(pIdx)} className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600 cursor-pointer">Remove</button>
                  )}
                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <div><label className={labelCls}>Project Name</label><input value={proj.name} onChange={(e) => updateProj(pIdx, "name", e.target.value)} placeholder="ElevateCV" className={inputCls} /></div>
                    <div><label className={labelCls}>Live Link</label><input value={proj.link} onChange={(e) => updateProj(pIdx, "link", e.target.value)} placeholder="https://..." className={inputCls} /></div>
                  </div>
                  <div className="mb-3"><label className={labelCls}>Description</label><textarea value={proj.description} onChange={(e) => updateProj(pIdx, "description", e.target.value)} rows={2} placeholder="Built a resume intelligence platform with real-time scoring..." className={`${inputCls} resize-none`} /></div>
                  <label className={labelCls}>Tech Stack</label>
                  <input value={(proj.stack || []).join(", ")} onChange={(e) => updateProj(pIdx, "stack", e.target.value.split(",").map(s => s.trim()))} placeholder="React, Node.js, MongoDB" className={inputCls} />
                </div>
              ))}
            </div>

            {/* ─── Education Block ─── */}
            <div className={blockCls}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs">🎓</span>
                  Education
                </h2>
                <button type="button" onClick={addEdu} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">+ Add</button>
              </div>
              {resume.education.map((edu, eIdx) => (
                <div key={edu.id || eIdx} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 mb-3 relative">
                  {resume.education.length > 1 && (
                    <button type="button" onClick={() => removeEdu(eIdx)} className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600 cursor-pointer">Remove</button>
                  )}
                  <div className="grid md:grid-cols-3 gap-3">
                    <div><label className={labelCls}>Degree</label><input value={edu.degree} onChange={(e) => updateEdu(eIdx, "degree", e.target.value)} placeholder="B.Tech Computer Science" className={inputCls} /></div>
                    <div><label className={labelCls}>Institution</label><input value={edu.institution} onChange={(e) => updateEdu(eIdx, "institution", e.target.value)} placeholder="IIT Delhi" className={inputCls} /></div>
                    <div><label className={labelCls}>Year</label><input value={edu.year} onChange={(e) => updateEdu(eIdx, "year", e.target.value)} placeholder="2020-2024" className={inputCls} /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action bar: Save / Export / Upload */}
            <div className={`${blockCls} mt-2`}>
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs">🚀</span>
                Actions
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={saveVersion} className="group relative px-6 py-2.5 rounded-full text-sm font-semibold text-white shadow-lg overflow-hidden cursor-pointer hover:shadow-indigo-500/25 transition-all duration-300">
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 transition-transform duration-300 group-hover:scale-105" />
                  <span className="relative flex items-center gap-2">💾 Save Snapshot</span>
                </button>
                <button type="button" onClick={() => { downloadResumePDF(resume, analysis); toast.success('PDF opened — use Ctrl+P to save!'); }} className="px-6 py-2.5 rounded-full text-sm font-semibold text-indigo-700 bg-indigo-50/80 border border-indigo-200/50 hover:bg-indigo-100 hover:border-indigo-300 shadow-sm transition-all duration-300 cursor-pointer flex items-center gap-2">
                  📄 Export as PDF
                </button>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={async () => {
                    if (!resume.name && !resume.summary) { toast.error('Add some content before uploading.'); return; }
                    setUploading(true);
                    try {
                      const file = resumeToTextFile(resume);
                      const res = await uploadResume({ file, companyName: '', jobTitle: jobTitle || resume.title || 'General', jobDescription });
                      toast.success('Resume uploaded & scored!');
                      if (res?.resumeId) navigate(`/resume-review/${res.resumeId}`);
                    } catch (err) { toast.error(err.message || 'Upload failed'); }
                    finally { setUploading(false); }
                  }}
                  className="group relative px-6 py-2.5 rounded-full text-sm font-semibold text-white shadow-xl overflow-hidden cursor-pointer hover:shadow-teal-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-600 transition-transform duration-500 group-hover:scale-110" />
                  <span className="relative flex items-center gap-2">
                    {uploading ? (
                      <><span className="animate-spin inline-block">⏳</span> Uploading...</>
                    ) : (
                      <>✨ Analyze & Score</>
                    )}
                  </span>
                </button>
              </div>
              {versions.length > 0 && (
                <p className="text-xs text-slate-500 mt-2">{versions.length} version(s) saved</p>
              )}
            </div>
          </div>

          {/* RIGHT: Intelligence sidebar */}
          <aside className="space-y-5">
            <div className="sticky top-24">
              {/* Health Meter */}
              <div className={`${blockCls} mb-5`}>
                <HealthMeter
                  score={analysis?.overallScore || 0}
                  previousScore={versions.length > 0 ? versions[versions.length - 1].score : null}
                />
              </div>

              {/* Score Breakdown */}
              {analysis?.layers && (
                <div className={`${blockCls} mb-5`}>
                  <HealthBreakdown layers={analysis.layers} />
                </div>
              )}

              {/* Suggestions */}
              {analysis?.suggestions && (
                <div className={`${blockCls} mb-5`}>
                  <SuggestionPanel suggestions={analysis.suggestions} />
                </div>
              )}

              {/* Version History */}
              {versions.length > 0 && (
                <div className={`${blockCls}`}>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Version History</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {versions.map((v, i) => (
                      <div key={v.timestamp} className="flex items-center justify-between text-xs text-slate-600 py-1 border-b border-slate-100 last:border-0">
                        <span>v{i + 1} — {new Date(v.timestamp).toLocaleTimeString()}</span>
                        <span className="font-bold">{v.score}/100</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BuildResume;
