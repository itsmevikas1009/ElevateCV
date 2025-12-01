import React from "react";

const HowItWorksPage = () => {
  const steps = [
    {
      title: "Upload your resume",
      desc: "Drag and drop your PDF or image, and ElevateCV reads it instantly with smart parsing.",
      badge: "Step 1",
      badgeColor: "from-blue-500 to-sky-400",
    },
    {
      title: "AI + ATS analysis",
      desc: "We evaluate formatting, keywords, and structure just like modern ATS tools and recruiters.",
      badge: "Step 2",
      badgeColor: "from-indigo-500 to-violet-500",
    },
    {
      title: "Get an actionable report",
      desc: "Receive a clear score, insights, and bullet-point suggestions you can apply in minutes.",
      badge: "Step 3",
      badgeColor: "from-pink-500 to-rose-400",
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-linear-to-br from-[#f5f3ff] via-[#e0f2fe] to-[#fef9c3]">
      <div className="max-w-6xl mx-auto relative">
        {/* Soft background blobs */}
        <div className="pointer-events-none absolute -top-16 -left-10 h-40 w-40 rounded-full bg-[#e9d5ff] opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-[#bae6fd] opacity-60 blur-3xl" />

        {/* Hero Section */}
        <header className="relative text-center mt-50 md:text-left mb-12 md:mb-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-xl mx-auto md:mx-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-3">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Guided in 3 simple steps
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-snug">
              How{" "}
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
                ElevateCV
              </span>{" "}
              works for you
            </h1>
            <p className="mt-3 text-slate-600 text-sm md:text-base">
              From upload to insight in under a minute. Here’s what happens
              behind the scenes every time you submit your resume to ElevateCV.
            </p>
          </div>

          {/* Right side mini card */}
          <div className="max-w-sm mx-auto md:mx-0">
            <div className="relative rounded-3xl bg-white/80 border border-slate-100 shadow-[0_16px_40px_rgba(148,163,184,0.35)] p-5">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Why it’s different
              </h2>
              <p className="text-xs text-slate-600 mb-4">
                ElevateCV doesn’t just score your resume — it explains{" "}
                <span className="font-semibold text-slate-800">
                  exactly what to fix and why.
                </span>
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-blue-50 py-3">
                  <p className="text-xs font-semibold text-blue-700">60s</p>
                  <p className="text-[10px] text-blue-500">
                    Avg. analysis time
                  </p>
                </div>
                <div className="rounded-2xl bg-indigo-50 py-3">
                  <p className="text-xs font-semibold text-indigo-700">ATS</p>
                  <p className="text-[10px] text-indigo-500">Style checks</p>
                </div>
                <div className="rounded-2xl bg-pink-50 py-3">
                  <p className="text-xs font-semibold text-pink-700">Tips</p>
                  <p className="text-[10px] text-pink-500">
                    Actionable bullets
                  </p>
                </div>
              </div>
              <div className="mt-4 h-0.5 w-full rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-pink-500" />
            </div>
          </div>
        </header>

        {/* Steps Section */}
        <section className="relative">
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-2xl bg-white/90 border border-slate-100 shadow-[0_12px_30px_rgba(148,163,184,0.25)] p-6 flex flex-col group hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(148,163,184,0.3)] transition-transform duration-200"
              >
                {/* Step badge with gradient */}
                <span
                  className={`inline-flex w-max items-center rounded-full bg-linear-to-r ${step.badgeColor} px-3 py-1 text-[11px] font-semibold text-white mb-4 shadow-sm`}
                >
                  {step.badge}
                </span>

                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h2>
                <p className="text-sm text-slate-600 flex-1">{step.desc}</p>

                {/* Progress bar */}
                <div className="mt-4 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-full bg-linear-to-r from-blue-500 via-indigo-500 to-pink-500 origin-left scale-x-75 group-hover:scale-x-100 transition-transform duration-300" />
                </div>

                {/* Step number bubble */}
                <span className="absolute -top-4 right-5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 text-xs font-semibold text-slate-700">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Little footnote text */}
          <p className="mt-8 text-center text-xs md:text-sm text-slate-500 max-w-2xl mx-auto">
            We don’t store your resume content permanently. Each analysis is
            processed securely so that you can confidently refine your CV as
            many times as you like.
          </p>
        </section>
      </div>
    </div>
  );
};

export default HowItWorksPage;
