import React from "react";
import { Link } from "react-router-dom";

const HowItWorksPage = () => {
  const steps = [
    {
      title: "Upload or Build",
      desc: "Drag and drop your existing resume, or craft a new one from scratch using our premium builder. We parse the data instantly.",
      badge: "Step 1",
      badgeColor: "from-blue-500 to-sky-400",
      icon: "📄"
    },
    {
      title: "Multi-Model AI Engine",
      desc: "Our dual-API pipeline analyzes formatting, role-specific keywords, and structure. If the primary AI is busy, our fallback engine seamlessly takes over.",
      badge: "Step 2",
      badgeColor: "from-indigo-500 to-violet-500",
      icon: "🧠"
    },
    {
      title: "Actionable Feedback & PDF",
      desc: "Receive a categorized score and precise improvement bullets. Once perfected, export your resume as a high-fidelity, ATS-compliant PDF.",
      badge: "Step 3",
      badgeColor: "from-pink-500 to-rose-400",
      icon: "🎯"
    },
  ];

  return (
    <div className="min-h-screen pt-40 pb-20 px-4 bg-slate-950 relative overflow-hidden">
      {/* Dark background glows */}
      <div className="pointer-events-none absolute -top-16 -left-10 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Section */}
        <header className="relative text-center md:text-left mb-20 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
          <div className="max-w-2xl mx-auto md:mx-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-slate-800 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6 shadow-sm">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Guided in 3 simple steps
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              How{" "}
              <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                ElevateCV
              </span>{" "}
              transforms your career
            </h1>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              From upload to insight in under a minute. Here’s what happens behind the scenes every time you submit your resume to our resilient intelligence engine.
            </p>
          </div>

          {/* Right side mini card */}
          <div className="w-full max-w-sm mx-auto md:mx-0 flex-shrink-0">
            <div className="relative rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8">
              <h2 className="text-lg font-bold text-white mb-3">
                Why it’s different
              </h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                ElevateCV doesn’t just score your resume — it explains{" "}
                <strong className="text-slate-200">exactly what to fix and why</strong>, using dynamic keyword banks.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 py-4">
                  <p className="text-sm font-bold text-blue-400 mb-1">60s</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Analysis</p>
                </div>
                <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 py-4">
                  <p className="text-sm font-bold text-indigo-400 mb-1">ATS</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Checks</p>
                </div>
                <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 py-4">
                  <p className="text-sm font-bold text-pink-400 mb-1">PDF</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Export</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Steps Section */}
        <section className="relative">
          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 flex flex-col group hover:-translate-y-2 hover:bg-slate-800/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-slate-700 transition-all duration-300"
              >
                {/* Step number bubble */}
                <span className="absolute -top-5 right-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-slate-700 text-sm font-bold text-slate-300">
                  {index + 1}
                </span>

                {/* Step badge with gradient */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{step.icon}</span>
                  <span
                    className={`inline-flex items-center rounded-full bg-linear-to-r ${step.badgeColor} px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm`}
                  >
                    {step.badge}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  {step.title}
                </h2>
                <p className="text-sm text-slate-400 flex-1 leading-relaxed">{step.desc}</p>

                {/* Progress bar */}
                <div className="mt-6 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full w-full bg-linear-to-r ${step.badgeColor} origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </div>
              </div>
            ))}
          </div>

          {/* CTA / Footnote */}
          <div className="mt-20 text-center">
            <Link to="/resume-upload" className="inline-flex items-center justify-center text-base font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-8 py-4 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-6">
              Start Analyzing Now &rarr;
            </Link>
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl mx-auto">
              We process your documents securely and generate actionable intelligence so you can confidently refine your CV as many times as you like.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorksPage;
