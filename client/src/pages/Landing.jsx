import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AnimatedScore = ({ target }) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 1200;
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCurrent(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <span>{current}</span>;
};

const Landing = () => {
  const features = [
    { icon: "🤖", title: "8-Layer Intelligence Engine", desc: "Pure logic scoring — ATS, keywords, impact, verbs, readability, structure — all evaluated in real-time without external AI." },
    { icon: "📊", title: "Health Meter & Delta Tracking", desc: "See your score update live as you edit. Track improvement across versions with +/- delta indicators." },
    { icon: "🧩", title: "Block-Based Resume Builder", desc: "Canva-style blocks for Identity, Experience, Skills, Projects — each evaluated independently with smart suggestions." },
    { icon: "⚡", title: "Instant Suggestions Engine", desc: "Rule-based, actionable improvements — not generic advice. Every suggestion explains what to fix and why." },
    { icon: "🔑", title: "Keyword Intelligence", desc: "Role-specific keyword banks match your resume against industry expectations. See coverage % and missing keywords." },
    { icon: "📄", title: "PDF Report & Analysis", desc: "Upload any resume for detailed ATS analysis with downloadable PDF reports and section-wise feedback." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pt-20">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
            </span>
            Resume Intelligence Operating System
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Continuously{" "}
            <span className="bg-linear-to-r from-[#7a5cff] via-[#8b84ff] to-[#d88aa6] bg-clip-text text-transparent">
              improve
            </span>{" "}
            your hiring probability.
          </h1>
          <p className="text-slate-300 text-base md:text-lg mb-6">
            Not a resume builder. Not a resume analyzer. A{" "}
            <span className="font-semibold text-indigo-300">Career Optimization Engine</span>{" "}
            — pure logic, no external AI dependency, real-time intelligence.
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <Link to="/build-resume" className="px-6 py-3 rounded-full text-sm font-semibold bg-linear-to-r from-[#6B63FF] to-[#7A7CFF] shadow-[0_10px_30px_rgba(80,72,255,0.5)] hover:scale-[1.02] transition">
              Start Building — Free
            </Link>
            <Link to="/resume-upload" className="px-6 py-3 rounded-full text-sm font-semibold border border-indigo-400/60 text-indigo-200 hover:bg-indigo-500/10 transition">
              Upload & Analyze Resume
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-indigo-400 font-bold text-lg mb-1">8</div>
              Intelligence layers
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-emerald-400 font-bold text-lg mb-1">0</div>
              External API calls
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-pink-400 font-bold text-lg mb-1">&lt;1s</div>
              Analysis time
            </div>
          </div>
        </div>

        {/* Right hero card */}
        <div className="bg-slate-900/60 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl shadow-indigo-900/40">
          <p className="text-sm text-slate-300 mb-4">Live Preview — Resume Health Meter</p>
          <div className="bg-slate-950/70 rounded-2xl border border-slate-700 p-5 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-slate-400">Overall Score</span>
              <span className="text-xs text-emerald-300">🟢 Strong</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-indigo-300"><AnimatedScore target={87} /></span>
              <span className="text-slate-500 mb-1 text-sm">/ 100</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-2 bg-linear-to-r from-emerald-400 via-indigo-400 to-fuchsia-400 w-[87%] transition-all duration-1000" />
            </div>
            <div className="mt-2 text-xs text-emerald-400 font-semibold">+5 from last version</div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { label: "ATS", score: 92, color: "text-emerald-400" },
              { label: "Impact", score: 78, color: "text-indigo-400" },
              { label: "Keywords", score: 85, color: "text-pink-400" },
              { label: "Structure", score: 95, color: "text-emerald-400" },
              { label: "Verbs", score: 82, color: "text-indigo-400" },
              { label: "Readability", score: 88, color: "text-pink-400" },
            ].map((item) => (
              <div key={item.label} className="bg-slate-900 rounded-xl p-3 border border-slate-700/70">
                <div className="text-slate-400 mb-1">{item.label}</div>
                <div className={`font-semibold ${item.color}`}>{item.score}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          The <span className="text-indigo-300">Intelligence Stack</span>
        </h2>
        <p className="text-slate-400 text-sm mb-8 max-w-xl">
          Every feature is a pure, deterministic module — no black-box AI, fully config-driven, instantly fast.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80 hover:border-indigo-500/40 transition group">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2 text-slate-100">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          How <span className="text-indigo-300">RIOS</span> works
        </h2>
        <div className="grid md:grid-cols-4 gap-5 text-sm">
          {[
            { step: "1", title: "Enter builder", desc: "Create your resume using intelligent blocks — Identity, Experience, Skills, Projects." },
            { step: "2", title: "System evaluates", desc: "8 engines run instantly — ATS, keywords, impact, verbs, structure, readability." },
            { step: "3", title: "See health meter", desc: "Score updates live with delta tracking. Click to drill down into each section." },
            { step: "4", title: "Improve & iterate", desc: "Apply suggestions, save versions, compare scores. Export when ready." },
          ].map((s) => (
            <div key={s.step} className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold mb-3">{s.step}</div>
              <h3 className="font-semibold mb-2 text-slate-100">{s.title}</h3>
              <p className="text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Built for <span className="text-indigo-300">students</span>,{" "}
          <span className="text-indigo-300">job seekers</span> &{" "}
          <span className="text-indigo-300">professionals</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
            <h3 className="font-semibold mb-2 text-slate-100">Students</h3>
            <p className="text-slate-400">Preparing for internships or your first job? ElevateCV helps you translate projects and skills into a professional resume.</p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
            <h3 className="font-semibold mb-2 text-slate-100">Job Seekers</h3>
            <p className="text-slate-400">Apply to multiple roles with confidence by tailoring your resume to each job description and tracking your scores.</p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
            <h3 className="font-semibold mb-2 text-slate-100">Working Professionals</h3>
            <p className="text-slate-400">Planning a role switch or promotion? Optimize your CV with quantified impact and strong positioning.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-linear-to-r from-indigo-600 to-fuchsia-600 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to elevate your resume?</h2>
            <p className="text-sm md:text-base text-indigo-100 max-w-xl">
              Start building with real-time intelligence — every edit makes your resume stronger.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/build-resume" className="px-6 py-3 rounded-full text-sm font-semibold bg-white text-indigo-700 shadow hover:shadow-lg transition">
              Start Building
            </Link>
            <Link to="/signup" className="px-6 py-3 rounded-full text-sm font-semibold border border-white/70 text-white hover:bg-white/10 transition text-center">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
