import fetch from "node-fetch";
import { prepareInstructions } from "../utils/aiUtils.js";

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
  const API_KEY = process.env.OPENROUTER_API_KEY;
  if (!API_KEY) throw new Error("OPENROUTER_API_KEY not set in environment");

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
    const response = await fetch(process.env.ROUTER_ACCESS, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ROUTER_MODEL,
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

    if (!rawContent) return { error: "Empty AI response." };

    // extracting JSON from extra text
    const jsonMatch = rawContent.match(/({[\s\S]*})/);
    const jsonText = jsonMatch ? jsonMatch[1] : rawContent;

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      // handle double-escaped or malformed JSON
      try {
        parsed = JSON.parse(JSON.parse(jsonText));
      } catch {
        parsed = { raw: rawContent };
      }
    }

    // 🧠 Parse nested feedback.raw if present
    if (parsed.feedback?.raw) {
      try {
        parsed.feedback = JSON.parse(parsed.feedback.raw);
      } catch (e) {
        console.warn("Nested feedback parsing failed:", e);
      }
    }

    return parsed;
  } catch (err) {
    console.error("AI analyze error:", err);
    return { error: `AI service error: ${err.message}` };
  }
}

// import fetch from "node-fetch";
// import { prepareInstructions } from "../utils/aiUtils.js";

// export async function analyzeWithAI(
//   resumeText = "",
//   jobTitle = "",
//   jobDescription = "",
//   roleLevel = "mid"
// ) {
//   if (!process.env.OPENROUTER_API_KEY) {
//     throw new Error("OPENROUTER_API_KEY not set in environment");
//   }

//   const jd =
//     jobDescription && jobDescription.trim().length > 0
//       ? jobDescription
//       : "No detailed job description provided; evaluate based on common industry expectations for this role.";

//   const prompt = `${prepareInstructions({ jobTitle, jobDescription: jd })}

// Role Level: ${roleLevel}

// Resume:
// ${resumeText}

// Return ONLY the JSON object as described.`;

//   try {
//     const response = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "openai/gpt-oss-20b:free",
//           messages: [
//             {
//               role: "system",
//               content:
//                 "You are an ATS resume analyzer with industry best practices in mind.",
//             },
//             { role: "user", content: prompt },
//           ],
//           max_tokens: 2000,
//           temperature: 0.2,
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(
//         `OpenRouter API error (${response.status}): ${errorText}`
//       );
//     }

//     const data = await response.json();
//     const raw = data?.choices?.[0]?.message?.content?.trim();

//     if (!raw) {
//       return { error: "Empty AI response." };
//     }

//     // 🧠 Try to extract JSON cleanly (removes wrapping text if any)
//     const jsonMatch = raw.match(/({[\s\S]*})/);
//     const jsonText = jsonMatch ? jsonMatch[1] : raw;

//     // 🧩 Attempt to parse JSON safely
//     let parsed;
//     try {
//       parsed = JSON.parse(jsonText);
//     } catch {
//       // Sometimes model returns escaped JSON (like your example)
//       try {
//         parsed = JSON.parse(JSON.parse(jsonText));
//       } catch {
//         parsed = { raw: raw };
//       }
//     }

//     return parsed;
//   } catch (err) {
//     console.error("AI analyze error:", err);
//     return { error: "AI service error: " + err.message };
//   }
// }

// export async function analyzeWithAI(resumeText = "", jobTitle = "", jobDescription = "") {
//   if (!process.env.OPENROUTER_API_KEY) {
//     throw new Error("OPENROUTER_API_KEY not set in environment");
//   }

//   const prompt = `${prepareInstructions({ jobTitle, jobDescription })}

// Resume:
// ${resumeText}

// Return ONLY the JSON object as described.`;

//   try {
//     // Call OpenRouter API
//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "openai/gpt-oss-20b:free",
//         messages: [
//           { role: "system", content: "You are an ATS resume analyzer." },
//           { role: "user", content: prompt },
//         ],
//         max_tokens: 2000,
//         temperature: 0.2,
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
//     }

//     const data = await response.json();
//     const raw = data?.choices?.[0]?.message?.content;

//     // Extract JSON part safely
//     const jsonTextMatch = raw && raw.match(/({[\s\S]*})/);
//     const jsonText = jsonTextMatch ? jsonTextMatch[0] : raw;

//     try {
//       return JSON.parse(jsonText);
//     } catch {
//       return { raw: raw || "No valid JSON response" };
//     }
//   } catch (err) {
//     console.error("AI analyze error:", err);
//     return { raw: "AI service error: " + String(err.message) };
//   }
// }
