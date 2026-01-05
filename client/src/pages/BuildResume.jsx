import React, { useState } from "react";

const BuildResume = () => {
  const [step, setStep] = useState(0);

  const sections = [
    {
      id: 0,
      label: "Page 1",
      title: "Craft a strong foundation",
      subtitle: "Start with a clean, focused structure before anything else.",
      chips: ["One page only (mostly)", "Clear sections", "Easy to skim"],
      tips: [
        "Use a clean layout: Header (Name + Title + Contact), Summary, Experience, Skills, Education, Projects.",
        "Avoid fancy fonts. Stick to professional ones like Inter, Roboto, or system fonts.",
        "Keep margins and spacing consistent. Every section should breathe and be easy to scan.",
        "Use bullet points instead of paragraphs. Recruiters skim in seconds, not minutes.",
      ],
      highlight:
        "Your resume should pass the 5-second skim test: role, skills, and value should be obvious at a glance.",
    },
    {
      id: 1,
      label: "Page 2",
      title: "Write impact-driven bullet points",
      subtitle: "Show what you achieved, not just what you did.",
      chips: ["Action verbs", "Numbers", "Outcomes"],
      tips: [
        "Start each bullet with a strong verb: Built, Led, Improved, Optimized, Automated, Designed, Shipped.",
        "Use numbers wherever possible: “Increased conversion by 18%”, “Reduced response time by 40%”, “Handled 25+ tickets/week”.",
        "Follow the formula: Action + How + Result. Example: “Improved API response time by 35% by optimizing MongoDB queries and caching hot endpoints.”",
        "Tailor bullets to the job description. Mirror the keywords and skills you see in the JD.",
      ],
      highlight:
        "If a bullet point could appear on anyone’s resume, it’s too generic. Make it uniquely yours.",
    },
    {
      id: 2,
      label: "Page 3",
      title: "Optimize for ATS & clarity",
      subtitle:
        "Make sure both machines and humans can understand your profile.",
      chips: ["ATS friendly", "Keywords", "Readability"],
      tips: [
        "Avoid tables, text boxes, and overly complex columns. Many ATS tools can’t parse them well.",
        "Include relevant keywords from the job description in Skills, Summary, and Experience sections naturally.",
        "Use standard section titles: “Experience”, “Skills”, “Education”, “Projects”. ATS systems love these.",
        "Export as PDF with a simple file name: `Firstname_Lastname_Resume.pdf`.",
      ],
      highlight:
        "Think of your resume as a landing page: clear headline, strong value props, and proof through projects & experience.",
    },
    {
      id: 3,
      label: "Page 4",
      title: "Showcase Projects That Prove Your Skills",
      subtitle:
        "Projects are your proof of work — they demonstrate your capabilities better than any sentence.",
      chips: ["Real Results", "Tech Stack", "Your Role"],
      tips: [
        "Pick only impactful projects that align with the role you want — quality over quantity.",
        "Clearly list your stack: React, Node.js, MongoDB, Tailwind, Firebase, etc.",
        "Explain your direct responsibilities: “I built”, “I integrated”, “I designed”, not the team.",
        "Highlight real user outcomes or numbers: traffic, signups, conversions.",
        "Include GitHub and live demo links — make evidence easy for recruiters to click.",
      ],
      highlight:
        "A project without a link or result is just a story. Show that you can ship real things.",
    },
    {
      id: 4,
      label: "Page 5",
      title: "Use a Professional Summary That Sells You",
      subtitle:
        "A strong summary sets the tone and tells recruiters exactly why you fit the job.",
      chips: ["2–3 lines", "Focused", "Value-driven"],
      tips: [
        "Avoid generic fluff like “Hard-working and self-motivated…” Focus on role + skills + outcomes.",
        "Call out your strongest tools & achievements directly: “Frontend dev specializing in React + UX performance improvements”.",
        "Tailor your summary to the job each time — show alignment from the first second.",
        "Use industry keywords recruiters search for: React, API integration, UI performance, full-stack, etc.",
        "Think of this as your personal headline — concise and powerful.",
      ],
      highlight:
        "Your summary should make recruiters think: ‘This person looks like exactly who we need.’",
    },
    {
      id: 5,
      label: "Page 6",
      title: "Polish Your Resume for Clarity & Perfection",
      subtitle:
        "Small improvements make a big difference in how your resume is perceived.",
      chips: ["Consistency", "Formatting", "No Errors"],
      tips: [
        "Keep font sizes and bullet indentation consistent — attention to detail matters.",
        "Avoid fancy icons & graphics — they confuse ATS scanners.",
        "Check English grammar and take help from tools like Grammarly or Hemingway.",
        "Use enough spacing so each section feels readable — don’t suffocate the layout.",
        "Proofread twice. Typos kill credibility instantly in professional roles.",
      ],
      highlight:
        "Professional polish = professional impression. Recruiters judge quality in seconds — make every pixel count.",
    },
  ];

  const current = sections[step];

  const handleNext = () => {
    setStep((prev) => (prev < sections.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="min-h-screen pt-40 md:pt-48 pb-16 px-4 bg-linear-to-br from-[#f5f3ff] via-[#e0f2fe] to-[#fde1ff] relative overflow-hidden">
      {/* background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-10 h-52 w-52 rounded-full bg-[#e9d5ff] opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-52 w-52 rounded-full bg-[#bae6fd] opacity-60 blur-3xl" />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <header className="text-center mb-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-xs font-semibold text-slate-600 mb-4 shadow-sm">
            BuildResume • Guided tips
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-linear-to-r from-[#4f46e5] via-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
            Design a resume that actually gets noticed
          </h1>
          <p className="mt-3 text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
            No backend yet—just pure guidance. Move through each page to learn
            how to build a clean, impactful, and ATS-friendly resume.
          </p>
        </header>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {sections.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(idx)}
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer
                ${
                  idx === step
                    ? "bg-linear-to-r from-[#4f46e5] via-[#6366f1] to-[#ec4899] text-white shadow-[0_8px_20px_rgba(99,102,241,0.45)]"
                    : "bg-white/80 text-slate-600 border border-slate-200 hover:bg-white"
                }`}
            >
              {/* <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
                {idx + 1}
              </span> */}
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Main card */}
        <div className="rounded-4xl p-0.5 bg-linear-to-r from-[#4f46e5]/50 via-[#6366f1]/50 to-[#ec4899]/50 shadow-[0_18px_50px_rgba(129,140,248,0.45)]">
          <div className="rounded-[30px] bg-white/95 backdrop-blur-xl p-6 md:p-8 grid gap-8 md:grid-cols-[1.3fr,1fr]">
            {/* Left content */}
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                {current.label}
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
                {current.title}
              </h2>
              <p className="text-sm text-slate-600 mb-4">{current.subtitle}</p>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                {current.chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* Tips list */}
              <ul className="space-y-3 text-sm text-slate-700">
                {current.tips.map((tip) => (
                  <li key={tip} className="flex gap-2 items-start">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-linear-to-r from-blue-500 to-pink-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right highlight / sticky note style */}
            <div className="flex flex-col justify-between gap-4">
              <div className="rounded-2xl bg-linear-to-br from-[#eef2ff] via-[#fef3c7] to-[#fee2e2] p-4 border border-white shadow-[0_12px_30px_rgba(148,163,184,0.3)]">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  Pro insight
                </p>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {current.highlight}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-800 mb-1">
                  What you can do next (client-side only)
                </p>
                <p>
                  Use these tips to update your resume in your editor (Word,
                  Google Docs, Figma, etc.). Later, you’ll upload it to
                  ElevateCV for AI analysis and scoring.
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 0}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all
                    ${
                      step === 0
                        ? "border-slate-200 text-slate-300 cursor-not-allowed"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={step === sections.length - 1}
                  className={`px-5 py-2 rounded-full text-xs font-semibold text-white bg-linear-to-r from-[#4f46e5] via-[#6366f1] to-[#ec4899] shadow-[0_8px_22px_rgba(99,102,241,0.4)] transition-all
                    ${
                      step === sections.length - 1
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:brightness-110"
                    }`}
                >
                  {step === sections.length - 1 ? "End of tips" : "Next tips →"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          This is a client-only page — no data is sent anywhere yet. Later, this
          can connect to your resume analyzer backend.
        </p>
      </div>
    </div>
  );
};

export default BuildResume;
