import React from "react";

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
  if (!feedback)
    return (
      <div className="w-full py-12 text-center text-gray-500 font-medium">
        No feedback available.
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row gap-8 py-6 px-6">
      {/* Left: Optionally show metadata */}
      <div className="flex-1 max-w-sm mb-6 md:mb-0 md:mr-4">
        {resumeDoc && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <div className="text-lg font-semibold mb-2">Resume Overview</div>
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
                Download/View Resume
              </a>
            )}
          </div>
        )}
      </div>

      {/* Right: Review Details */}
      <div className="flex-[2] rounded-xl bg-white/70 shadow-lg px-8 py-6">
        <h2 className="text-2xl font-bold mb-6">Resume Review</h2>
        <div className="flex flex-col gap-2 mb-6">
          <div className="text-4xl font-bold text-blue-700">
            {feedback.overallScore ?? "--"}/100
          </div>
          <div className="text-sm text-gray-600">
            Your Resume Score (based on the sections below)
          </div>
        </div>
        <div className="space-y-4">
          {sectionOrder.map((sectionKey) => {
            const section = feedback.sections?.[sectionKey];
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
