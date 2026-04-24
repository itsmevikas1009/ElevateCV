import React from "react";
import { Link } from "react-router-dom";

const BlogPage = () => {
  const posts = [
    {
      title: "How to Beat Modern ATS",
      desc: "Discover the keyword algorithms recruiters use, and how ElevateCV’s scoring weights map exactly to what hiring managers want.",
      read: "5 min read",
      type: "Strategy"
    },
    {
      title: "The Power of Fallback AI",
      desc: "Learn how our resilient, multi-model backend ensures your resume is always analyzed perfectly, even during API outages.",
      read: "4 min read",
      type: "Tech Inside"
    },
    {
      title: "Building High-Fidelity PDFs",
      desc: "Why design consistency matters. See how our new robust PDF generation preserves formatting and makes a premium first impression.",
      read: "6 min read",
      type: "Design"
    }
  ];

  return (
    <div className="min-h-screen pt-40 md:pt-48 pb-20 px-4 bg-slate-950 relative overflow-hidden">
      {/* Dark background glows */}
      <div className="pointer-events-none absolute -top-24 -left-10 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-pink-600/20 blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span> ElevateCV Intelligence Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-blue-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Master Your Career Narrative
          </h1>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            Deep-dive into AI resume optimization, ATS bypass strategies, and the cutting-edge technology powering ElevateCV.
          </p>
        </header>

        {/* Featured card */}
        <section className="mb-16">
          <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-10 hover:border-slate-700 transition-colors group">
            <div className="flex-1 text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-2">
                <span className="text-pink-500">🔥</span> Featured Release
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                Introducing ElevateCV v2.0: Multi-Model AI & Dynamic Engine
              </h2>
              <p className="text-base text-slate-400 mb-6 max-w-xl leading-relaxed">
                We've completely overhauled our analysis pipeline. Discover how the new dual-API architecture seamlessly falls back between models, ensuring your feedback is always accurate, structured, and instantly actionable.
              </p>
              <Link to="/resume-upload" className="inline-flex items-center text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-full transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                Try the New Engine &rarr;
              </Link>
            </div>
            <div className="w-full md:w-80">
              <div className="rounded-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-pink-500 p-px shadow-[0_0_30px_rgba(79,70,229,0.2)]">
                <div className="h-full rounded-2xl bg-slate-950 px-6 py-6 text-sm text-slate-300 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Resilience</span>
                    <span className="font-bold text-blue-400">100% Uptime</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Analysis Vectors</span>
                    <span className="font-bold text-indigo-400">6 Dimensions</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-slate-400">Role Specificity</span>
                    <span className="font-bold text-pink-400">Dynamic Banks</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-full bg-linear-to-r from-blue-500 via-indigo-500 to-pink-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article cards */}
        <section>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post, idx) => (
              <article
                key={post.title}
                className="group relative rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 flex flex-col hover:-translate-y-2 hover:bg-slate-800/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-slate-700 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <p className="text-xs uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-indigo-500/30 text-[10px] text-indigo-300 bg-indigo-500/10">
                    {idx + 1}
                  </span>
                  {post.type}
                </p>
                <h2 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-indigo-300 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-400 mb-6 flex-1 leading-relaxed">
                  {post.desc}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-4 mt-auto">
                  <span>{post.read}</span>
                  <button className="font-bold text-indigo-400 group-hover:text-pink-400 transition-colors flex items-center gap-1">
                    Read article &rarr;
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
