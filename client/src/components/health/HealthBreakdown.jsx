import React, { useState } from "react";

const HealthBreakdown = ({ layers = {} }) => {
  const [expanded, setExpanded] = useState(null);

  const sectionMap = [
    { key: "ats", label: "ATS Compliance", icon: "🤖" },
    { key: "content", label: "Content & Verbs", icon: "✍️" },
    { key: "impact", label: "Metrics & Impact", icon: "📊" },
    { key: "keywords", label: "Keyword Match", icon: "🔑" },
    { key: "structure", label: "Structure", icon: "🏗️" },
    { key: "readability", label: "Readability", icon: "📖" },
  ];

  const getBarColor = (score) => {
    if (score >= 80) return "#16A34A";
    if (score >= 60) return "#2563EB";
    if (score >= 40) return "#D97706";
    return "#DC2626";
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Score Breakdown</h3>
      {sectionMap.map(({ key, label, icon }) => {
        const layer = layers[key];
        if (!layer) return null;
        const isOpen = expanded === key;

        return (
          <div key={key} className="rounded-xl border border-slate-200 bg-white/90 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : key)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="text-lg">{icon}</span>
              <span className="flex-1 text-sm font-medium text-slate-800">{label}</span>
              <span className="text-sm font-bold" style={{ color: getBarColor(layer.score) }}>{layer.score}</span>
              <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${layer.score}%`, backgroundColor: getBarColor(layer.score) }}
                />
              </div>
              <span className="text-slate-400 text-xs">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && layer.tips && layer.tips.length > 0 && (
              <div className="px-4 pb-3 space-y-1.5 border-t border-slate-100">
                {layer.tips.map((tip, i) => (
                  <div key={i} className={`text-xs flex gap-2 py-1 ${tip.type === "good" ? "text-emerald-700" : "text-amber-700"}`}>
                    <span>{tip.type === "good" ? "✅" : "⚠️"}</span>
                    <span>{tip.tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HealthBreakdown;
