/**
 * Bullet Strength Indicator
 * Scores individual bullet points for impact, verb strength, and metrics.
 * From PLAN.md Advanced Features: "each bullet gets score"
 */
import { strongVerbs, weakVerbs } from "./config/verbDictionary.js";

/**
 * Score a single bullet point (0-100).
 * @param {string} bullet
 * @returns {{ score: number, label: string, color: string, tips: string[] }}
 */
export function scoreBullet(bullet = "") {
  const text = bullet.trim();
  if (text.length < 5) return { score: 0, label: "Empty", color: "#94a3b8", tips: ["Write a meaningful bullet point."] };

  let score = 40; // base
  const tips = [];
  const words = text.toLowerCase().split(/\s+/);
  const firstWord = words[0]?.replace(/[^a-z]/g, "");

  // 1. Starts with strong verb (+20)
  if (strongVerbs.includes(firstWord)) {
    score += 20;
  } else if (weakVerbs.includes(firstWord)) {
    score -= 10;
    tips.push(`Start with a stronger verb instead of "${firstWord}".`);
  } else {
    tips.push("Start with a strong action verb (Built, Led, Optimized).");
  }

  // 2. Contains metrics/numbers (+20)
  const hasMetrics = /\d+%|\$[\d,]+|\d+x\b|\d{2,}/.test(text);
  if (hasMetrics) {
    score += 20;
  } else {
    tips.push("Add measurable results (e.g., 'by 25%', '$50K').");
  }

  // 3. Good length (8-25 words) (+10)
  const wordCount = words.length;
  if (wordCount >= 8 && wordCount <= 25) {
    score += 10;
  } else if (wordCount < 6) {
    score -= 5;
    tips.push("Bullet is too short — add more context about your impact.");
  } else if (wordCount > 30) {
    score -= 5;
    tips.push("Bullet is too long — keep to 1-2 lines max.");
  }

  // 4. Contains impact indicators (+10)
  const impactWords = /improv|increas|reduc|optim|automat|built|launch|ship|creat|design|develop|led|manag|scale/i;
  if (impactWords.test(text)) {
    score += 10;
  }

  // 5. Contains tech/tool mentions (+5)
  const techPattern = /react|node|python|java|sql|api|aws|docker|git|mongodb|typescript|css|html|figma|firebase/i;
  if (techPattern.test(text)) {
    score += 5;
  }

  score = Math.min(100, Math.max(0, score));

  let label, color;
  if (score >= 80) { label = "Strong"; color = "#16A34A"; }
  else if (score >= 60) { label = "Good"; color = "#2563EB"; }
  else if (score >= 40) { label = "Fair"; color = "#D97706"; }
  else { label = "Weak"; color = "#DC2626"; }

  return { score, label, color, tips };
}
