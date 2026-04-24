const SECTION_KEYS = [
  "ATS",
  "Content",
  "MetricsAndImpact",
  "FormattingAndStructure",
  "Skills",
  "ToneAndStyle",
];

function normalizeTipType(type) {
  return type === "good" ? "good" : "improvement";
}

export function normalizeResumeFeedback(input) {
  if (!input) return null;

  let feedback = input;

  if (typeof feedback === "string") {
    try {
      feedback = JSON.parse(feedback);
    } catch {
      return null;
    }
  }

  if (feedback?.feedback && typeof feedback.feedback === "object") {
    feedback = feedback.feedback;
  }

  const sectionsSource = feedback?.sections && typeof feedback.sections === "object"
    ? feedback.sections
    : null;

  if (!sectionsSource) return feedback;

  const sections = {};

  for (const key of SECTION_KEYS) {
    const section = sectionsSource[key];
    if (!section || typeof section !== "object") continue;

    sections[key] = {
      score: typeof section.score === "number" ? section.score : undefined,
      tips: Array.isArray(section.tips)
        ? section.tips.map((tip) => ({
            ...tip,
            type: normalizeTipType(tip?.type),
          }))
        : [],
    };
  }

  return {
    ...feedback,
    sections,
  };
}
