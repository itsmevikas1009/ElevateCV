import React from "react";

const BlogPage = () => {
  const posts = ["ATS Optimization", "Portfolio & Projects", "Interview Prep"];

  return (
    <div className="min-h-screen pt-40 md:pt-48 pb-20 px-4 bg-linear-to-br from-[#f5f3ff] via-[#e0f2fe] to-[#fdf2ff] relative overflow-hidden">
      {/* Soft background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-10 h-48 w-48 rounded-full bg-[#e9d5ff] opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-48 w-48 rounded-full bg-[#bae6fd] opacity-60 blur-3xl" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <header className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-xs font-semibold text-slate-600 mb-4 shadow-sm">
            ElevateCV Blog
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-linear-to-r from-blue-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
            Tips to Elevate Your Resume
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
            Read practical guides, checklists, and case studies on building
            resumes that actually pass ATS and impress hiring managers.
          </p>
        </header>

        {/* Featured card */}
        <section className="mb-10">
          <div className="rounded-3xl bg-white/90 border border-slate-100 shadow-[0_18px_45px_rgba(148,163,184,0.35)] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-2">
                Featured • Resume Strategy
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                7 small tweaks that instantly make your CV more ATS-friendly
              </h2>
              <p className="text-sm text-slate-600 mb-4 max-w-xl">
                Learn how spacing, section order, and keyword placement can
                dramatically improve your chances of getting past automated
                filters without rewriting your entire resume.
              </p>
              <button className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-indigo-600">
                Read featured article →
              </button>
            </div>
            <div className="w-full md:w-64">
              <div className="rounded-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-pink-500 p-px">
                <div className="h-full rounded-2xl bg-white/95 px-4 py-4 text-xs text-slate-700 flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span>Avg. ATS score</span>
                    <span className="font-semibold text-blue-600">72%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Improvement ideas</span>
                    <span className="font-semibold text-indigo-600">10+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Read time</span>
                    <span className="font-semibold text-pink-600">5 min</span>
                  </div>
                  <div className="mt-3 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-3/4 bg-linear-to-r from-blue-500 via-indigo-500 to-pink-500" />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Updated weekly based on real recruiter feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article cards */}
        <section>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((title, idx) => (
              <article
                key={title}
                className="group rounded-2xl bg-white/90 border border-slate-100 shadow-[0_12px_30px_rgba(148,163,184,0.25)] p-5 flex flex-col hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(148,163,184,0.3)] transition-transform duration-200"
              >
                <p className="text-xs uppercase tracking-wide text-blue-500 mb-2 flex items-center gap-1">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-blue-200 text-[10px] text-blue-600 bg-blue-50">
                    {idx + 1}
                  </span>
                  Guide #{idx + 1}
                </p>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  {title}
                </h2>
                <p className="text-sm text-slate-600 mb-4 flex-1">
                  Learn how to fine-tune your CV with real recruiter-backed
                  strategies and AI-powered suggestions tailored to modern job
                  descriptions.
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span>4–6 min read</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Practical tips
                  </span>
                </div>
                <button className="mt-auto text-sm font-semibold text-blue-600 group-hover:text-indigo-600">
                  Read article →
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
