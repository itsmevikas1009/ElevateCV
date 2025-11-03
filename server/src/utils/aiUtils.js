// server/src/utils/aiUtils.js

export const AIResponseFormat = `
interface Feedback {
  overallScore: number;            // 0-100 scale
  sections: {
    ATS: {
      score: number;              // how well it matches ATS criteria
      tips: { type: "good" | "improve"; tip: string; }[];
    };
    Content: {
      score: number;              // clarity, relevance
      tips: { type: "good" | "improve"; tip: string; explanation?: string; }[];
    };
    MetricsAndImpact: {
      score: number;              // use of measurable results, quantification
      tips: { type: "good" | "improve"; tip: string; explanation?: string; }[];
    };
    FormattingAndStructure: {
      score: number;              // readability, section order, headings, layout
      tips: { type: "good" | "improve"; tip: string; explanation?: string; }[];
    };
    Skills: {
      score: number;              // hard & soft skills relevance and keyword matching
      tips: { type: "good" | "improve"; tip: string; explanation?: string; }[];
    };
    ToneAndStyle: {
      score: number;              // professional voice, consistency, avoiding cliches
      tips: { type: "good" | "improve"; tip: string; explanation?: string; }[];
    };
  };
}
`;

export const prepareInstructions = ({ jobTitle, jobDescription }) => `
You are an expert resume evaluator used by HR professionals and recruiters.
Assess this resume strictly for how well it meets current industry best practices, especially for passing both ____ (fill role) ATS systems and human reviewers.

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Provide feedback in JSON only, following this format:

${AIResponseFormat}

Focus on:
- ATS criteria: keyword matching, clear headings, simple formatting (avoid tables/graphics), correct file type
- Content relevance: experience matched to the job, quantified achievements, clarity over verbosity
- Use of measurable metrics and results (e.g., “increased sales 20%”, “reduced costs by $X”)
- Skills section: both hard and soft skills; relevance and inclusion of terms from job posting
- Formatting & structure: headings in order (Summary / Professional Experience / Education / Skills etc.), consistent styling, readability
- Tone & Style: active language, concise, avoid cliches or filler phrases.

Return ONLY the JSON object. No extra text.
`;

// export const AIResponseFormat = `
//   interface Feedback {
//     overallScore: number;
//     ATS: {
//       score: number;
//       tips: { type: "good" | "improve"; tip: string; }[];
//     };
//     toneAndStyle: {
//       score: number;
//       tips: { type: "good" | "improve"; tip: string; explanation: string; }[];
//     };
//     content: {
//       score: number;
//       tips: { type: "good" | "improve"; tip: string; explanation: string; }[];
//     };
//     structure: {
//       score: number;
//       tips: { type: "good" | "improve"; tip: string; explanation: string; }[];
//     };
//     skills: {
//       score: number;
//       tips: { type: "good" | "improve"; tip: string; explanation: string; }[];
//     };
//   }`;

// export const prepareInstructions = ({ jobTitle, jobDescription }) => `
//   You are an expert in ATS (Applicant Tracking System) and resume analysis.
//   Please analyze and rate this resume and suggest how to improve it.
//   Be detailed and strict. Low scores are okay if the resume is weak.
//   The job title is: ${jobTitle}
//   The job description is: ${jobDescription}
//   Provide feedback strictly in this JSON format:
//   ${AIResponseFormat}
//   Return ONLY the JSON object, no extra text.
// `;
