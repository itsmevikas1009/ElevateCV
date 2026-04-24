// src/components/ResumeReview.jsx
import React, { useMemo } from "react";
import { downloadReportFrontend } from "../engines/reportExport.js";
import toast from "react-hot-toast";
import { normalizeResumeFeedback } from "../lib/resumeFeedback.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const SECTION_TITLES = {
  ATS: "ATS",
  Content: "Content",
  MetricsAndImpact: "Metrics & Impact",
  FormattingAndStructure: "Formatting & Structure",
  Skills: "Skills",
  ToneAndStyle: "Tone & Style",
};

const sectionOrder = [
  "ATS",
  "Content",
  "MetricsAndImpact",
  "FormattingAndStructure",
  "Skills",
  "ToneAndStyle",
];

const getScoreStatus = (score) => {
  if (score >= 80) return { label: "Strong", color: "text-green-600" };
  if (score >= 60) return { label: "Good Start", color: "text-yellow-600" };
  return { label: "Needs work", color: "text-red-600" };
};

const ResumeReview = ({ feedback, resumeDoc }) => {
  const normalizedFeedback = useMemo(
    () => normalizeResumeFeedback(feedback),
    [feedback]
  );

  if (!normalizedFeedback)
    return (
      <div className="w-full py-12 text-center text-gray-500 font-medium">
        No feedback available.
      </div>
    );

  const chartData = useMemo(() => {
    const sections = normalizedFeedback.sections || {};
    return sectionOrder
      .map((key) => {
        const sec = sections[key];
        if (!sec || typeof sec.score !== "number") return null;
        return {
          name: SECTION_TITLES[key] || key,
          score: sec.score,
        };
      })
      .filter(Boolean);
  }, [normalizedFeedback]);

  const handleDownloadPdf = () => {
    if (!resumeDoc?._id || !normalizedFeedback) {
      toast.error("Resume information not available for report download.");
      return;
    }
    try {
      downloadReportFrontend(resumeDoc, normalizedFeedback);
      toast.success("Report PDF opened — use Ctrl+P to save!");
    } catch (err) {
      toast.error("Failed to generate report.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 py-6 px-6 w-full">
      {/* Left: metadata + download button */}
      <div className="flex-1 max-w-sm mb-6 md:mb-0 md:mr-4">
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <div className="text-lg font-semibold mb-2">Resume Overview</div>

          {resumeDoc ? (
            <>
              {resumeDoc.jobTitle && (
                <div className="text-sm text-gray-700">
                  <strong>Job Title:</strong> {resumeDoc.jobTitle}
                </div>
              )}
              {resumeDoc.companyName && (
                <div className="text-sm text-gray-700">
                  <strong>Company:</strong> {resumeDoc.companyName}
                </div>
              )}
              {resumeDoc.createdAt && (
                <div className="text-sm text-gray-700">
                  <strong>Uploaded:</strong>{" "}
                  {new Date(resumeDoc.createdAt).toLocaleString()}
                </div>
              )}
              {resumeDoc.resumePath && (
                <a
                  href={`http://localhost:5000${resumeDoc.resumePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-blue-600 underline text-sm"
                >
                  View Original Resume
                </a>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Basic resume details not available, but analysis is shown on the
              right.
            </p>
          )}

          <button
            onClick={handleDownloadPdf}
            className="mt-4 w-full py-2 rounded-lg bg-linear-to-r from-[#6B63FF] to-[#7A7CFF] text-white text-sm font-medium shadow hover:shadow-lg transition"
          >
            Download Analysis Report (PDF)
          </button>
        </div>
      </div>

      {/* Right: Review Details */}
      <div className="flex-2 rounded-xl bg-white/70 shadow-lg px-8 py-6">
        <h2 className="text-2xl font-bold mb-4">Resume Review</h2>

        {normalizedFeedback.meta?.extractionWarning ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {normalizedFeedback.meta.extractionWarning} A general analysis was
            generated from the available resume data.
          </div>
        ) : null}

        {/* Overall score + chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Overall score box */}
          <div className="flex flex-col justify-center">
            <div className="text-sm text-gray-500 mb-1">
              Overall Resume Score
            </div>
            <div className="text-4xl font-extrabold text-blue-700">
              {normalizedFeedback.overallScore ?? "--"}/100
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Higher scores indicate stronger alignment with ATS criteria,
              structure, content, and skills relevance.
            </p>
          </div>

          {/* Radar Chart */}
          <div className="lg:col-span-2">
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 h-full min-h-[260px]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-indigo-900 uppercase tracking-wide">
                  Section-wise score breakdown
                </p>
                <p className="text-[10px] text-indigo-500">
                  Color-coded performance scale
                </p>
              </div>

              <div className="h-60 min-w-0">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(value) => `${value}/100`}
                        labelFormatter={(label) => `${label} Score`}
                      />

                      <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => {
                          const s = entry.score;

                          let barColor = "#4F46E5"; // default
                          if (s < 40) barColor = "#DC2626"; // 🔴 red
                          else if (s < 60) barColor = "#EA580C"; // 🟠 orange
                          else if (s < 70) barColor = "#FACC15"; // 🟡 yellow
                          else if (s < 80)
                            barColor = "#4ADE80"; // 💚 light green
                          else if (s < 90) barColor = "#22C55E"; // 🟢 green
                          else barColor = "#1D4ED8"; // 🔵 blue

                          return <Cell key={`cell-${index}`} fill={barColor} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-500">
                    Not enough section scores to render chart.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section-wise details list */}
        <div className="space-y-4">
          {sectionOrder.map((sectionKey) => {
            const section = normalizedFeedback.sections?.[sectionKey];
            if (!section) return null;
            const status = getScoreStatus(section.score);
            return (
              <div key={sectionKey} className="border-b pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">
                    {SECTION_TITLES[sectionKey] || sectionKey}
                  </span>
                  <span className={`font-bold ${status.color}`}>
                    {section.score ?? "--"}/100{" "}
                    <span className="ml-2 text-xs">{status.label}</span>
                  </span>
                </div>
                <ul className="pl-4 mt-2 space-y-1 text-sm">
                  {(section.tips || []).map((tip, idx) => (
                    <li
                      key={idx}
                      className={
                        tip.type === "good"
                          ? "text-green-700"
                          : "text-orange-600"
                      }
                    >
                      {tip.type === "good" ? "✅" : "➕"} {tip.tip}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResumeReview;
