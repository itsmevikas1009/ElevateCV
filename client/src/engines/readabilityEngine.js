/**
 * Layer 6: Readability Engine
 * Checks: sentence length, bullet clarity, redundancy.
 */
import { _extractFullText } from "./structureEngine.js";

export function readabilityEngine(resume) {
  const text = typeof resume === "string" ? resume : _extractFullText(resume);
  const sentences = text.split(/[.!?\n•◦▪–—]/).map(s => s.trim()).filter(s => s.length > 5);
  const total = sentences.length;

  if (total === 0) {
    return { score: 20, details: { avgWordCount: 0 }, tips: [{ type: "improve", tip: "Resume appears empty. Add clear bullet points." }] };
  }

  const wordCounts = sentences.map(s => s.split(/\s+/).length);
  const avg = Math.round(wordCounts.reduce((a, b) => a + b, 0) / total);
  const longCount = wordCounts.filter(c => c > 25).length;
  const idealCount = wordCounts.filter(c => c >= 6 && c <= 20).length;
  const fillers = ["basically","actually","honestly","just","really","very","quite","simply"].filter(f => text.toLowerCase().includes(f));

  let score = 70;
  if (longCount / total > 0.4) score -= 20;
  else if (longCount / total > 0.2) score -= 10;
  if (idealCount / total > 0.6) score += 15;
  else if (idealCount / total > 0.4) score += 8;
  if (fillers.length > 2) score -= 10;
  else if (fillers.length > 0) score -= 5;
  if (avg < 5) score -= 15;

  const tips = [];
  if (longCount > 0) tips.push({ type: "improve", tip: `${longCount} bullet(s) are too long (25+ words). Keep bullets to 1-2 lines.` });
  if (idealCount / total > 0.5) tips.push({ type: "good", tip: "Most bullet points are well-sized — easy to scan." });
  if (fillers.length > 0) tips.push({ type: "improve", tip: `Filler words found: "${fillers.join('", "')}". Remove them for concise writing.` });
  if (avg >= 8 && avg <= 18 && longCount === 0) tips.push({ type: "good", tip: "Bullet points are clear and concise." });

  return { score: Math.min(100, Math.max(0, score)), details: { avgWordCount: avg, longCount, idealCount, fillers }, tips };
}
