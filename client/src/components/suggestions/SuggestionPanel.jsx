import React from "react";

const SuggestionPanel = ({ suggestions = [] }) => {
  if (suggestions.length === 0) {
    return (
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
        🎉 No critical suggestions — your resume looks great!
      </div>
    );
  }

  const severityIcon = { critical: "🔴", warning: "🟡", info: "🔵" };
  const severityBg = { critical: "bg-red-50 border-red-200", warning: "bg-amber-50 border-amber-200", info: "bg-blue-50 border-blue-200" };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Suggestions</h3>
      {suggestions.map((s, i) => (
        <div key={s.id || i} className={`rounded-xl border p-3 ${severityBg[s.severity] || severityBg.info}`}>
          <div className="flex gap-2 items-start text-sm">
            <span className="mt-0.5">{severityIcon[s.severity] || "🔵"}</span>
            <div>
              <span className="font-medium text-slate-800">{s.suggestion}</span>
              <span className="ml-2 text-[10px] uppercase tracking-wide text-slate-500">{s.category}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionPanel;
