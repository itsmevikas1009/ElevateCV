/**
 * Layer 2: Keyword Intelligence Engine
 * Matches resume keywords against role-specific keyword banks.
 * Outputs: keyword coverage %, missing keywords.
 */

import { keywordBanks, inferRole } from "./config/keywordBanks.js";
import { _extractFullText } from "./structureEngine.js";

/**
 * @param {object|string} resume - structured resume JSON or text
 * @param {string} jobTitle - target job title
 * @param {string} jobDescription - optional JD text
 * @returns {{ score: number, details: object, tips: Array }}
 */
export function keywordEngine(resume, jobTitle = "", jobDescription = "") {
  const text = (typeof resume === "string" ? resume : _extractFullText(resume)).toLowerCase();
  const role = inferRole(jobTitle);
  const bank = keywordBanks[role] || keywordBanks.general;

  // Combine bank keywords with JD-extracted keywords
  const jdKeywords = _extractJDKeywords(jobDescription);
  const allKeywords = [...new Set([...bank.keywords, ...jdKeywords])];

  const matched = [];
  const missing = [];

  for (const keyword of allKeywords) {
    if (text.includes(keyword.toLowerCase())) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  const coverage = allKeywords.length > 0
    ? Math.round((matched.length / allKeywords.length) * 100)
    : 50;

  const tips = [];
  
  if (coverage >= 75) {
    tips.push({ type: "good", tip: `Strong keyword coverage (${coverage}%) for ${bank.label} role.` });
  } else if (coverage >= 50) {
    tips.push({ type: "improve", tip: `Keyword coverage is ${coverage}%. Add more relevant keywords from the job description.` });
  } else {
    tips.push({ type: "improve", tip: `Low keyword coverage (${coverage}%). Your resume is missing critical keywords for ${bank.label}.` });
  }

  if (missing.length > 0 && missing.length <= 10) {
    tips.push({ type: "improve", tip: `Missing keywords: ${missing.slice(0, 8).join(", ")}` });
  } else if (missing.length > 10) {
    tips.push({ type: "improve", tip: `Missing ${missing.length} keywords. Top missing: ${missing.slice(0, 6).join(", ")}` });
  }

  if (matched.length > 5) {
    tips.push({ type: "good", tip: `Found ${matched.length} matching keywords including: ${matched.slice(0, 5).join(", ")}` });
  }

  return {
    score: Math.min(100, Math.max(0, coverage)),
    details: { matched, missing, coverage, role, totalKeywords: allKeywords.length },
    tips,
  };
}

/**
 * Extract meaningful keywords from a job description.
 */
function _extractJDKeywords(jd = "") {
  if (!jd || jd.length < 20) return [];
  
  const text = jd.toLowerCase();
  // Extract technical-looking words (2+ chars, not common English)
  const commonWords = new Set([
    "the", "and", "for", "are", "with", "you", "will", "our", "have",
    "this", "that", "from", "your", "about", "what", "they", "been",
    "has", "its", "not", "but", "was", "can", "had", "all", "their",
    "who", "more", "other", "some", "time", "very", "just", "like",
    "new", "way", "use", "work", "team", "role", "must", "also",
    "need", "able", "etc", "including", "such", "within", "across",
    "through", "strong", "experience", "skills", "knowledge",
    "requirements", "responsibilities", "qualifications", "preferred",
    "required", "years", "minimum", "ability", "excellent",
  ]);
  
  const words = text.match(/\b[a-z][a-z.+#/]{2,}\b/g) || [];
  return [...new Set(words.filter((w) => !commonWords.has(w)))].slice(0, 20);
}
