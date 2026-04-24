/**
 * Layer 7 & 8: Section Scoring + Final Score Engine
 * Aggregates all layer scores with configurable weights.
 */
import { scoringWeights, getHealthLevel } from "./config/scoringWeights.js";

export function sectionScorer(layerResults) {
  return {
    ats: { raw: layerResults.ats?.score || 0, weighted: (layerResults.ats?.score || 0) * scoringWeights.ats },
    content: { raw: layerResults.content?.score || 0, weighted: (layerResults.content?.score || 0) * scoringWeights.content },
    impact: { raw: layerResults.impact?.score || 0, weighted: (layerResults.impact?.score || 0) * scoringWeights.impact },
    keywords: { raw: layerResults.keywords?.score || 0, weighted: (layerResults.keywords?.score || 0) * scoringWeights.keywords },
    structure: { raw: layerResults.structure?.score || 0, weighted: (layerResults.structure?.score || 0) * scoringWeights.structure },
    readability: { raw: layerResults.readability?.score || 0, weighted: (layerResults.readability?.score || 0) * scoringWeights.readability },
  };
}

export function finalScorer(layerResults) {
  const sections = sectionScorer(layerResults);
  const totalWeighted = Object.values(sections).reduce((sum, s) => sum + s.weighted, 0);
  const finalScore = Math.round(Math.min(100, Math.max(0, totalWeighted)));
  const healthLevel = getHealthLevel(finalScore);

  return {
    overallScore: finalScore,
    healthLevel,
    sections,
    weights: { ...scoringWeights },
  };
}
