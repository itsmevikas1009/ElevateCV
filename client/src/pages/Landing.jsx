import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pt-20">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest text-indigo-300 uppercase mb-3">
            ElevateCV · AI Powered
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Elevate your{" "}
            <span className="bg-linear-to-r from-[#7a5cff] via-[#8b84ff] to-[#d88aa6] bg-clip-text text-transparent">
              resume
            </span>{" "}
            before it reaches the recruiter.
          </h1>
          <p className="text-slate-300 text-base md:text-lg mb-6">
            Get instant ATS-friendly scoring, section-wise feedback, and a
            beautiful PDF report for every resume you upload.
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-full text-sm font-semibold bg-linear-to-r from-[#6B63FF] to-[#7A7CFF] shadow-[0_10px_30px_rgba(80,72,255,0.5)] hover:scale-[1.02] transition"
            >
              Get Started – It&apos;s Free
            </Link>
            <Link
              to="/signin"
              className="px-6 py-3 rounded-full text-sm font-semibold border border-indigo-400/60 text-indigo-200 hover:bg-indigo-500/10 transition"
            >
              I already have an account
            </Link>
          </div>

          <div className="flex gap-6 text-xs text-slate-400">
            <div>
              ✅ AI-powered scoring <br /> ✅ ATS readiness check
            </div>
            <div>
              ✅ Detailed improvement tips <br /> ✅ Downloadable PDF report
            </div>
          </div>
        </div>

        {/* Right hero card */}
        <div className="bg-slate-900/60 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl shadow-indigo-900/40">
          <p className="text-sm text-slate-300 mb-4">Live Preview</p>
          <div className="bg-slate-950/70 rounded-2xl border border-slate-700 p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-slate-400">Resume Score</span>
              <span className="text-xs text-emerald-300">Strong</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-indigo-300">87</span>
              <span className="text-slate-500 mb-1 text-sm">/ 100</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-2 bg-linear-to-r from-emerald-400 via-indigo-400 to-fuchsia-400 w-[87%]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-700/70">
              <div className="text-slate-400 mb-1">ATS</div>
              <div className="font-semibold text-slate-100">92 / 100</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Clean formatting & strong keyword match.
              </p>
            </div>
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-700/70">
              <div className="text-slate-400 mb-1">Content</div>
              <div className="font-semibold text-slate-100">84 / 100</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Good experience, needs more measurable impact.
              </p>
            </div>
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-700/70">
              <div className="text-slate-400 mb-1">Skills</div>
              <div className="font-semibold text-slate-100">89 / 100</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Relevant tech stack & tools highlighted.
              </p>
            </div>
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-700/70">
              <div className="text-slate-400 mb-1">Formatting</div>
              <div className="font-semibold text-slate-100">81 / 100</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Easy to scan. Try reducing font sizes slightly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features (existing idea, kept, just slightly structured) */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Why use <span className="text-indigo-300">ElevateCV</span>?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
            <h3 className="font-semibold mb-2 text-slate-100">
              ATS-Focused Feedback
            </h3>
            <p className="text-sm text-slate-400">
              Your resume is checked like a real Applicant Tracking System would:
              keywords, structure, and readability.
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
            <h3 className="font-semibold mb-2 text-slate-100">
              Section-wise Scoring
            </h3>
            <p className="text-sm text-slate-400">
              Get clarity on ATS, content, metrics, skills, formatting, and tone
              – each with its own score and tips.
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
            <h3 className="font-semibold mb-2 text-slate-100">
              Downloadable PDF Reports
            </h3>
            <p className="text-sm text-slate-400">
              Export a neat, shareable PDF report after each analysis and track
              your progress over time.
            </p>
          </div>
        </div>
      </section>

      {/* New section: How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          How <span className="text-indigo-300">ElevateCV</span> works
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
            <div className="text-indigo-300 text-xs font-semibold mb-2">
              STEP 1
            </div>
            <h3 className="font-semibold mb-2 text-slate-100">
              Upload your resume
            </h3>
            <p className="text-slate-400">
              Upload a PDF, DOCX, or image of your resume and optionally paste
              the target job description.
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
            <div className="text-indigo-300 text-xs font-semibold mb-2">
              STEP 2
            </div>
            <h3 className="font-semibold mb-2 text-slate-100">
              AI analyzes everything
            </h3>
            <p className="text-slate-400">
              Our AI compares your resume with ATS best practices and job
              expectations to generate section-wise feedback.
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
            <div className="text-indigo-300 text-xs font-semibold mb-2">
              STEP 3
            </div>
            <h3 className="font-semibold mb-2 text-slate-100">
              Improve & download report
            </h3>
            <p className="text-slate-400">
              Use the suggestions to improve your resume and download a PDF
              report to track your progress.
            </p>
          </div>
        </div>
      </section>

      {/* New section: Who it's for */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Built for <span className="text-indigo-300">students</span>,{" "}
          <span className="text-indigo-300">job seekers</span> &{" "}
          <span className="text-indigo-300">professionals</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
            <h3 className="font-semibold mb-2 text-slate-100">Students</h3>
            <p className="text-slate-400">
              Preparing for internships or your first job? ElevateCV helps you
              translate projects and skills into a professional resume.
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
            <h3 className="font-semibold mb-2 text-slate-100">Job Seekers</h3>
            <p className="text-slate-400">
              Apply to multiple roles with confidence by tailoring your resume
              to each job description and tracking your scores.
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/80">
            <h3 className="font-semibold mb-2 text-slate-100">
              Working Professionals
            </h3>
            <p className="text-slate-400">
              Planning a role switch or promotion? Optimize your CV with
              quantified impact and strong positioning.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-linear-to-r from-indigo-600 to-fuchsia-600 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Ready to elevate your resume?
            </h2>
            <p className="text-sm md:text-base text-indigo-100 max-w-xl">
              Create your free account in seconds, upload your resume, and get a
              detailed, ATS-friendly analysis – all in one place.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-full text-sm font-semibold bg-white text-indigo-700 shadow hover:shadow-lg transition"
            >
              Create Free Account
            </Link>
            <Link
              to="/signin"
              className="px-6 py-3 rounded-full text-sm font-semibold border border-white/70 text-white hover:bg-white/10 transition text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
