// src/constants/resumes.js
export const resumes = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: { score: 90, tips: [] },
      toneAndStyle: { score: 90, tips: [] },
      content: { score: 90, tips: [] },
      structure: { score: 90, tips: [] },
      skills: { score: 90, tips: [] },
    },
  },
  // ... keep the rest (2..6) if desired
];

export const AIResponseFormat = `
  {
    "overallScore": number,
    "ATS": {
      "score": number,
      "tips": [
        { "type": "good" | "improve", "tip": string }
      ]
    },
    "toneAndStyle": {
      "score": number,
      "tips": [
        { "type": "good" | "improve", "tip": string, "explanation": string }
      ]
    },
    "content": { "score": number, "tips": [ { "type": "good"|"improve", "tip": string, "explanation": string } ] },
    "structure": { "score": number, "tips": [ { "type": "good"|"improve", "tip": string, "explanation": string } ] },
    "skills": { "score": number, "tips": [ { "type": "good"|"improve", "tip": string, "explanation": string } ] }
  }
`;

export const prepareInstructions = ({ jobTitle = "", jobDescription = "" } = {}) =>
  `You are an expert in ATS (Applicant Tracking System) and resume analysis.
Please analyze and rate this resume and suggest how to improve it.
Be thorough and detailed. If provided, use the job description for more detailed feedback.
The job title is: ${jobTitle}
The job description is: ${jobDescription}
Provide the feedback using the following format:
${AIResponseFormat}
Return the analysis as a JSON object, without any other text.`;
