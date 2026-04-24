/**
 * Suggestion rule templates for the Suggestion Engine.
 * Config-driven IF/THEN rules as described in PLAN.md.
 */
export const ruleTemplates = [
  // Impact rules
  {
    id: "no_metrics",
    condition: (scores) => scores.impact < 30,
    severity: "critical",
    suggestion: "Add measurable results to your bullet points (e.g., 'Increased conversion by 18%', 'Reduced load time by 40%').",
    category: "impact",
  },
  {
    id: "low_metrics",
    condition: (scores) => scores.impact >= 30 && scores.impact < 60,
    severity: "warning",
    suggestion: "Your resume has some metrics but needs more. Try to quantify at least 60% of your achievements with numbers, percentages, or time-based results.",
    category: "impact",
  },

  // Verb rules
  {
    id: "weak_verbs_high",
    condition: (scores) => scores.content < 50,
    severity: "critical",
    suggestion: "Replace weak verbs like 'worked', 'helped', 'did' with strong action verbs like 'Built', 'Optimized', 'Led', 'Shipped'.",
    category: "content",
  },

  // Keyword rules
  {
    id: "keyword_low",
    condition: (scores) => scores.keywords < 50,
    severity: "critical",
    suggestion: "Keyword coverage is below industry threshold. Add relevant technical skills and tools from the job description to your resume.",
    category: "keywords",
  },
  {
    id: "keyword_medium",
    condition: (scores) => scores.keywords >= 50 && scores.keywords < 75,
    severity: "warning",
    suggestion: "Good keyword coverage, but some important terms from the job description are missing. Review and incorporate them naturally.",
    category: "keywords",
  },

  // ATS rules
  {
    id: "ats_poor",
    condition: (scores) => scores.ats < 50,
    severity: "critical",
    suggestion: "Your resume may not pass ATS filters. Use standard section headings, avoid tables/images, and ensure clean formatting.",
    category: "ats",
  },
  {
    id: "ats_moderate",
    condition: (scores) => scores.ats >= 50 && scores.ats < 75,
    severity: "warning",
    suggestion: "ATS compatibility is acceptable but can be improved. Check section headings, formatting consistency, and keyword placement.",
    category: "ats",
  },

  // Structure rules
  {
    id: "structure_poor",
    condition: (scores) => scores.structure < 40,
    severity: "critical",
    suggestion: "Missing critical sections. Ensure your resume has: Contact Info, Summary, Experience, Skills, Education, and Projects.",
    category: "structure",
  },

  // Readability rules
  {
    id: "readability_low",
    condition: (scores) => scores.readability < 50,
    severity: "warning",
    suggestion: "Your bullet points are too long or unclear. Keep each bullet to 1-2 lines and use the formula: Action + How + Result.",
    category: "readability",
  },
];

/**
 * Run all rules against a score set, return matching suggestions.
 */
export function evaluateRules(scores) {
  return ruleTemplates
    .filter((rule) => rule.condition(scores))
    .map((rule) => ({
      id: rule.id,
      severity: rule.severity,
      suggestion: rule.suggestion,
      category: rule.category,
    }));
}
