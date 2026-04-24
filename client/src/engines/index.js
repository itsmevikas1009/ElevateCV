/**
 * Resume Intelligence Engine — Orchestrator
 * Exposes: init(), process(), output() as per AGENT.md.
 * NO external AI dependency. PURE logic-based system.
 */
import { structureEngine } from "./structureEngine.js";
import { keywordEngine } from "./keywordEngine.js";
import { impactEngine } from "./impactEngine.js";
import { verbEngine } from "./verbEngine.js";
import { atsEngine } from "./atsEngine.js";
import { readabilityEngine } from "./readabilityEngine.js";
import { finalScorer } from "./scorerEngine.js";
import { evaluateRules } from "./config/ruleTemplates.js";

let _lastResult = null;

/** Initialize the engine (reset state). */
export function init() {
  _lastResult = null;
}

/**
 * Process a resume through all 8 layers.
 * @param {object|string} resume - structured JSON or raw text
 * @param {string} jobTitle
 * @param {string} jobDescription
 * @returns {object} full analysis result
 */
export function process(resume, jobTitle = "", jobDescription = "") {
  const structure = structureEngine(resume);
  const keywords = keywordEngine(resume, jobTitle, jobDescription);
  const impact = impactEngine(resume);
  const content = verbEngine(resume);     // verb quality = content quality
  const ats = atsEngine(resume);
  const readability = readabilityEngine(resume);

  const layerResults = { ats, content, impact, keywords, structure, readability };
  const finalResult = finalScorer(layerResults);
  const suggestions = evaluateRules({
    ats: ats.score, content: content.score, impact: impact.score,
    keywords: keywords.score, structure: structure.score, readability: readability.score,
  });

  // Merge all tips
  const allTips = [
    ...ats.tips, ...content.tips, ...impact.tips,
    ...keywords.tips, ...structure.tips, ...readability.tips,
  ];

  _lastResult = {
    ...finalResult,
    layers: { ats, content, impact, keywords, structure, readability },
    suggestions,
    allTips,
  };
  return _lastResult;
}

/** Return the last computed result. */
export function output() {
  return _lastResult;
}

export { structureEngine, keywordEngine, impactEngine, verbEngine, atsEngine, readabilityEngine, finalScorer };
