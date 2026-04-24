import React from "react";
import { getHealthLevel } from "../../engines/config/scoringWeights.js";

const HealthMeter = ({ score = 0, previousScore = null, showDelta = true }) => {
  const level = getHealthLevel(score);
  const delta = previousScore !== null ? score - previousScore : null;
  const circumference = 2 * Math.PI * 54;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circular gauge */}
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Background track */}
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          {/* Score arc */}
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke={level.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold" style={{ color: level.color }}>{score}</span>
          <span className="text-xs text-slate-500">/100</span>
        </div>
      </div>

      {/* Label */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{level.emoji}</span>
        <span className="text-sm font-semibold" style={{ color: level.color }}>{level.label}</span>
      </div>

      {/* Delta tracking */}
      {showDelta && delta !== null && (
        <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${delta >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
          {delta >= 0 ? `+${delta}` : delta} from last version
        </div>
      )}
    </div>
  );
};

export default HealthMeter;
