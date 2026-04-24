/**
 * Layer 4: Action Verb Engine
 * Detects strong vs weak verbs in bullet points.
 * Suggests replacements for weak verbs.
 */

import { strongVerbs, weakVerbs, verbReplacements } from "./config/verbDictionary.js";
import { _extractFullText } from "./structureEngine.js";

/**
 * @param {object|string} resume
 * @returns {{ score: number, details: object, tips: Array }}
 */
export function verbEngine(resume) {
  const text = typeof resume === "string" ? resume : _extractFullText(resume);
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];

  const foundStrong = [];
  const foundWeak = [];

  for (const word of words) {
    if (strongVerbs.includes(word) && !foundStrong.includes(word)) {
      foundStrong.push(word);
    }
    if (weakVerbs.includes(word) && !foundWeak.includes(word)) {
      foundWeak.push(word);
    }
  }

  const totalVerbs = foundStrong.length + foundWeak.length;
  const strongRatio = totalVerbs > 0 ? foundStrong.length / totalVerbs : 0;

  // Score calculation
  let score;
  if (totalVerbs === 0) {
    score = 40; // can't evaluate
  } else if (strongRatio >= 0.8) {
    score = 95;
  } else if (strongRatio >= 0.6) {
    score = 78;
  } else if (strongRatio >= 0.4) {
    score = 60;
  } else if (strongRatio >= 0.2) {
    score = 40;
  } else {
    score = 20;
  }

  const tips = [];

  if (foundStrong.length > 3) {
    tips.push({
      type: "good",
      tip: `Strong action verbs detected: ${foundStrong.slice(0, 5).join(", ")}`,
    });
  }

  if (foundWeak.length > 0) {
    const replacementTips = foundWeak.slice(0, 3).map((w) => {
      const replacements = verbReplacements[w];
      if (replacements) {
        return `"${w}" → try "${replacements[0]}" or "${replacements[1]}"`;
      }
      return `"${w}" is a weak verb — use stronger alternatives`;
    });
    
    tips.push({
      type: "improve",
      tip: `Weak verbs found. ${replacementTips.join("; ")}`,
    });
  }

  if (foundWeak.length === 0 && foundStrong.length > 2) {
    tips.push({
      type: "good",
      tip: "No weak verbs detected. Your language is professional and impactful.",
    });
  }

  if (totalVerbs === 0) {
    tips.push({
      type: "improve",
      tip: "Start each bullet point with a strong action verb (Built, Led, Optimized, Shipped).",
    });
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    details: { foundStrong, foundWeak, strongRatio: Math.round(strongRatio * 100), totalVerbs },
    tips,
  };
}
