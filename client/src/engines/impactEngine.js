/**
 * Layer 3: Impact Detection Engine
 * Detects: numbers, percentages, time-based results.
 * High density → high score. No metrics → heavy penalty.
 */

import { _extractFullText } from "./structureEngine.js";

// Patterns that indicate quantified impact
const METRIC_PATTERNS = [
  /\d+%/g,                                    // percentages: 20%, 150%
  /\$[\d,]+\.?\d*/g,                          // dollar amounts: $50K, $1,200
  /[\d,]+\+?\s*(users|customers|clients)/gi,  // user counts
  /\d+x\b/g,                                  // multipliers: 3x, 10x
  /increased?\s+by\s+\d+/gi,                  // "increased by 20"
  /reduced?\s+by\s+\d+/gi,                    // "reduced by 30"
  /improved?\s+by\s+\d+/gi,                   // "improved by 15"
  /\d+\s*(hrs?|hours?|mins?|minutes?|days?|weeks?|months?)/gi, // time-based
  /saved?\s+\$?[\d,]+/gi,                     // "saved $5000"
  /\d+\s*(projects?|features?|tickets?|endpoints?|modules?)/gi, // quantity
  /\b\d{2,}\b/g,                              // any 2+ digit numbers (general metrics)
];

/**
 * @param {object|string} resume
 * @returns {{ score: number, details: object, tips: Array }}
 */
export function impactEngine(resume) {
  const text = typeof resume === "string" ? resume : _extractFullText(resume);
  
  // Count metrics found
  const metricsFound = [];
  for (const pattern of METRIC_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      metricsFound.push(...matches);
    }
  }

  // Unique metrics
  const uniqueMetrics = [...new Set(metricsFound.map((m) => m.trim()))];
  const metricCount = uniqueMetrics.length;

  // Count total bullet points (approximation)
  const bullets = text.split(/\n|•|◦|▪|–|—|-(?=\s)/).filter((b) => b.trim().length > 10);
  const bulletCount = Math.max(bullets.length, 1);

  // Metric density = ratio of bullets with metrics
  const bulletsWithMetrics = bullets.filter((b) => {
    return METRIC_PATTERNS.some((p) => {
      p.lastIndex = 0;
      return p.test(b);
    });
  }).length;
  
  const density = bulletsWithMetrics / bulletCount;

  // Score calculation
  let score;
  if (metricCount === 0) {
    score = 10; // heavy penalty for no metrics
  } else if (metricCount <= 2) {
    score = 30;
  } else if (density < 0.3) {
    score = 45;
  } else if (density < 0.5) {
    score = 65;
  } else if (density < 0.7) {
    score = 80;
  } else {
    score = 92;
  }

  const tips = [];

  if (metricCount === 0) {
    tips.push({
      type: "improve",
      tip: "No measurable impact found. Add numbers, percentages, or dollar amounts to your bullet points.",
    });
  } else if (metricCount <= 2) {
    tips.push({
      type: "improve",
      tip: `Only ${metricCount} metric(s) found. Aim for at least 5-6 quantified achievements.`,
    });
  } else {
    tips.push({
      type: "good",
      tip: `Found ${metricCount} metrics/numbers. Quantified achievements strengthen your resume.`,
    });
  }

  if (density < 0.3 && bulletCount > 3) {
    tips.push({
      type: "improve",
      tip: `Only ${Math.round(density * 100)}% of your bullet points contain metrics. Aim for 50%+.`,
    });
  }

  if (density >= 0.5) {
    tips.push({
      type: "good",
      tip: "Strong metric density across your bullet points.",
    });
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    details: { uniqueMetrics, metricCount, density: Math.round(density * 100), bulletCount },
    tips,
  };
}
