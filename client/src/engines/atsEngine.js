/**
 * Layer 5: ATS Compliance Engine
 * Checks: formatting simplicity, headings, no tables/images, readable structure.
 */

import { _extractFullText } from "./structureEngine.js";

// ATS red flags
const ATS_RED_FLAGS = [
  { pattern: /\btable\b/gi, penalty: 10, tip: "Tables detected — many ATS systems can't parse them." },
  { pattern: /<img|<svg|<canvas/gi, penalty: 10, tip: "Images/graphics detected — ATS tools often ignore or break on these." },
  { pattern: /\bcolumns?\b/gi, penalty: 5, tip: "Multi-column layouts can confuse ATS parsing." },
  { pattern: /\btextbox(es)?\b/gi, penalty: 8, tip: "Text boxes may not be parsed correctly by ATS." },
  { pattern: /[^\x00-\x7F]{3,}/g, penalty: 3, tip: "Special/non-ASCII characters detected — keep it simple for ATS." },
];

// Standard ATS-friendly section headings
const STANDARD_HEADINGS = [
  "experience", "education", "skills", "projects", "summary",
  "objective", "certifications", "achievements", "awards",
  "professional experience", "work experience", "technical skills",
];

/**
 * @param {object|string} resume
 * @returns {{ score: number, details: object, tips: Array }}
 */
export function atsEngine(resume) {
  const text = typeof resume === "string" ? resume : _extractFullText(resume);
  const textLower = text.toLowerCase();

  let score = 100;
  const tips = [];
  const issues = [];

  // Check for ATS red flags
  for (const flag of ATS_RED_FLAGS) {
    if (flag.pattern.test(text)) {
      score -= flag.penalty;
      issues.push(flag.tip);
      tips.push({ type: "improve", tip: flag.tip });
    }
  }

  // Check for standard headings
  const headingsFound = STANDARD_HEADINGS.filter((h) => textLower.includes(h));
  if (headingsFound.length >= 4) {
    tips.push({ type: "good", tip: "Standard section headings detected — ATS-friendly." });
  } else if (headingsFound.length >= 2) {
    score -= 10;
    tips.push({
      type: "improve",
      tip: "Use more standard section headings (Experience, Education, Skills, Projects).",
    });
  } else {
    score -= 20;
    tips.push({
      type: "improve",
      tip: "Missing standard section headings. ATS relies on common headings to parse your resume.",
    });
  }

  // Check text length (too short = not enough content for ATS)
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 100) {
    score -= 15;
    tips.push({ type: "improve", tip: "Resume seems too short. ATS needs sufficient content to evaluate." });
  } else if (wordCount > 200) {
    tips.push({ type: "good", tip: `Resume has ${wordCount} words — sufficient content for ATS evaluation.` });
  }

  // Check for email pattern (contact info)
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
    tips.push({ type: "good", tip: "Email address detected in contact information." });
  } else {
    score -= 5;
    tips.push({ type: "improve", tip: "No email address found. Include contact email for ATS parsing." });
  }

  // Check for phone pattern
  if (/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/.test(text)) {
    tips.push({ type: "good", tip: "Phone number detected." });
  }

  // Check for excessive formatting characters
  const specialCharRatio = (text.match(/[^a-zA-Z0-9\s.,;:!?'"()-]/g) || []).length / text.length;
  if (specialCharRatio > 0.05) {
    score -= 10;
    tips.push({ type: "improve", tip: "High ratio of special characters. Keep formatting simple for ATS." });
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    details: { headingsFound, wordCount, issues, specialCharRatio: Math.round(specialCharRatio * 100) },
    tips,
  };
}
