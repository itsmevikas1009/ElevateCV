import React from "react";

const SupportPage = () => {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-linear-to-br from-[#eff6ff] via-white to-[#fef2f2]">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Need help with <span className="text-blue-600">ElevateCV</span>?
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            We’re here to help you with account issues, billing, and anything
            related to resume analysis.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[2fr,1.2fr]">
          {/* Contact card */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_12px_30px_rgba(148,163,184,0.18)] p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Contact Support
            </h2>
            <form className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">
                  What do you need help with?
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  placeholder="Describe your issue in a few sentences..."
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(59,130,246,0.45)] hover:shadow-[0_12px_36px_rgba(59,130,246,0.55)] transition"
              >
                Submit ticket
              </button>
            </form>
          </div>

          {/* FAQ quick links */}
          <div className="rounded-2xl bg-white/90 border border-slate-200 shadow-[0_10px_26px_rgba(148,163,184,0.18)] p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Quick help
            </h3>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>• How does ATS scoring work?</li>
              <li>• I can’t see my previous reports</li>
              <li>• My file type is not supported</li>
              <li>• Billing & subscription questions</li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Our average response time is{" "}
              <span className="font-semibold text-blue-600">under 24 hours</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
