import fetch from "node-fetch";
import { prepareInstructions } from "../utils/aiUtils.js";

const DEFAULT_OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_OPENROUTER_MODEL = "openai/gpt-4o-mini";

export function generateFallbackReport(text, jobTitle) {
  const safeText = typeof text === "string" ? text : "";
  const textLower = safeText.toLowerCase();

  const hasEmail = /[\w.-]+@[\w.-]+\.[\w]+/.test(textLower);
  const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(textLower);
  const hasLinkedIn = /linkedin\.com/i.test(textLower);
  const wordCount = safeText.trim() ? safeText.trim().split(/\s+/).length : 0;

  let overall = 60;
  if (hasEmail && hasPhone) overall += 10;
  if (hasLinkedIn) overall += 5;
  if (wordCount > 300 && wordCount < 1000) overall += 15;
  else overall -= 10;
  
  const atsScore = hasEmail && hasPhone && wordCount > 200 ? 80 : 50;
  const contentScore = wordCount > 300 ? 75 : 40;
  
  return {
    overallScore: Math.max(0, Math.min(Math.round(overall), 100)),
    sections: {
      ATS: {
        score: atsScore,
        tips: [
          { tip: "Contact Info", type: hasEmail && hasPhone ? "good" : "improvement", explanation: "ATS parsers look for email and phone numbers." },
          { tip: "File length", type: wordCount > 200 ? "good" : "improvement", explanation: "Ensure the resume has enough text to be parsed." }
        ]
      },
      Content: {
        score: contentScore,
        tips: [
          { tip: "Adequate length", type: wordCount > 300 ? "good" : "improvement", explanation: `Resume has ${wordCount} words.` }
        ]
      },
      MetricsAndImpact: {
        score: textLower.includes("%") || /\$\d+/.test(textLower) ? 80 : 40,
        tips: [{ tip: "Include numbers", type: textLower.includes("%") || /\$\d+/.test(textLower) ? "good" : "improvement", explanation: "Quantify achievements using metrics like %, $, or raw numbers." }]
      },
      FormattingAndStructure: { score: 70, tips: [{ tip: "Use standard headings", type: "good" }] },
      Skills: { score: 60, tips: [{ tip: "Match keywords to Job Description", type: "improvement" }] },
      ToneAndStyle: { score: 70, tips: [{ tip: "Keep tone professional and concise", type: "good" }] }
    },
    meta: {
      source: "fallback",
      roleTarget: jobTitle || "General",
    },
  };
}

function normalizeTipType(type) {
  return type === "good" ? "good" : "improvement";
}

function normalizeSections(sections) {
  if (!sections || typeof sections !== "object") return null;

  const normalized = {};

  for (const [key, section] of Object.entries(sections)) {
    if (!section || typeof section !== "object") continue;

    const parsedScore = Number(section.score);
    normalized[key] = {
      score:
        !isNaN(parsedScore)
          ? Math.max(0, Math.min(100, Math.round(parsedScore)))
          : undefined,
      tips: Array.isArray(section.tips)
        ? section.tips
            .filter((tip) => tip && typeof tip === "object")
            .map((tip) => ({
              type: normalizeTipType(tip.type),
              tip: typeof tip.tip === "string" ? tip.tip : "Review this area",
              explanation:
                typeof tip.explanation === "string" ? tip.explanation : undefined,
            }))
        : [],
    };
  }

  return Object.keys(normalized).length > 0 ? normalized : null;
}

export function normalizeAIResponse(payload, fallbackText = "", jobTitle = "") {
  if (!payload) return generateFallbackReport(fallbackText, jobTitle);

  let parsed = payload;

  if (typeof parsed === "string") {
    const jsonMatch = parsed.match(/({[\s\S]*})/);
    const jsonText = jsonMatch ? jsonMatch[1] : parsed;

    try {
      parsed = JSON.parse(jsonText);
    } catch {
      try {
        parsed = JSON.parse(JSON.parse(jsonText));
      } catch {
        return generateFallbackReport(fallbackText, jobTitle);
      }
    }
  }

  if (parsed?.feedback?.raw) {
    try {
      parsed.feedback = JSON.parse(parsed.feedback.raw);
    } catch (err) {
      console.warn("Nested feedback.raw parsing failed:", err);
    }
  }

  if (parsed?.feedback && typeof parsed.feedback === "object") {
    parsed = parsed.feedback;
  }

  const normalizedSections = normalizeSections(parsed?.sections);
  const parsedScore = Number(parsed?.overallScore);
  const overallScore =
    !isNaN(parsedScore)
      ? Math.max(0, Math.min(100, Math.round(parsedScore)))
      : null;

  if (overallScore === null || !normalizedSections) {
    return generateFallbackReport(fallbackText, jobTitle);
  }

  return {
    overallScore,
    sections: normalizedSections,
    meta: {
      ...(parsed?.meta && typeof parsed.meta === "object" ? parsed.meta : {}),
      source: parsed?.meta?.source === "fallback" ? "fallback" : "ai",
      roleTarget: jobTitle || parsed?.meta?.roleTarget || "General",
    },
  };
}

/**
 * Analyze a resume using AI with OpenRouter.
 * @param {string} resumeText - Extracted resume text.
 * @param {string} jobTitle - Target job title.
 * @param {string} jobDescription - Job description (optional).
 * @param {string} roleLevel - Role seniority level (default: "mid").
 * @returns {Promise<Object>} - Parsed AI feedback object or error.
 */
export async function analyzeWithAI(
  resumeText = "",
  jobTitle = "",
  jobDescription = "",
  roleLevel = "mid"
) {
  const API_KEY = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  const isOpenAI = !!process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY;

  const endpoint =
    process.env.OPENAI_URL ||
    process.env.ROUTER_ACCESS ||
    process.env.OPENROUTER_URL ||
    (isOpenAI ? "https://api.openai.com/v1/chat/completions" : DEFAULT_OPENROUTER_URL);
  const model =
    process.env.ROUTER_MODEL ||
    process.env.OPENROUTER_MODEL ||
    (isOpenAI ? "gpt-4o-mini" : DEFAULT_OPENROUTER_MODEL);

  if (!API_KEY) {
    console.warn("API_KEY not set. Using fallback resume analysis.");
    return generateFallbackReport(resumeText, jobTitle);
  }

  const jd =
    jobDescription?.trim()?.length > 0
      ? jobDescription
      : "No detailed job description provided; evaluate based on common industry expectations for this role.";

  const prompt = `
${prepareInstructions({ jobTitle, jobDescription: jd })}

Role Level: ${roleLevel}

Resume:
${resumeText}

Return ONLY the JSON object as described.
`.trim();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an ATS resume analyzer with industry best practices in mind.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OpenRouter API error (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content?.trim();

    if (!rawContent) return generateFallbackReport(resumeText, jobTitle);

    return normalizeAIResponse(rawContent, resumeText, jobTitle);
  } catch (err) {
    console.error("AI analyze error, using fallback logic:", err);
    return generateFallbackReport(resumeText, jobTitle);
  }
}

