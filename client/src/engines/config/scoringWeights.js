/**
 * Scoring weights for the final score engine.
 * Config-driven — admin-tunable without code changes.
 *
 * From PLAN.md:
 *   ATS: 20%, Content: 20%, Impact: 20%,
 *   Keywords: 15%, Structure: 15%, Readability: 10%
 */
export const scoringWeights = {
  ats: 0.20,
  content: 0.20,
  impact: 0.20,
  keywords: 0.15,
  structure: 0.15,
  readability: 0.10,
};

/**
 * Health level thresholds.
 * From PLAN.md:
 *   0–40  → 🔴 Critical (Unhirable)
 *   41–60 → 🟡 Weak
 *   61–80 → 🔵 Good
 *   81–100→ 🟢 Strong
 */
export const healthLevels = [
  { min: 0, max: 40, label: "Critical", emoji: "🔴", color: "#DC2626", bgColor: "#FEE2E2" },
  { min: 41, max: 60, label: "Weak", emoji: "🟡", color: "#D97706", bgColor: "#FEF3C7" },
  { min: 61, max: 80, label: "Good", emoji: "🔵", color: "#2563EB", bgColor: "#DBEAFE" },
  { min: 81, max: 100, label: "Strong", emoji: "🟢", color: "#16A34A", bgColor: "#DCFCE7" },
];

export function getHealthLevel(score) {
  for (const level of healthLevels) {
    if (score >= level.min && score <= level.max) return level;
  }
  return healthLevels[0];
}
