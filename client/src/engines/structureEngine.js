/**
 * Layer 1: Structure Engine
 * Detects section presence, order correctness.
 * Missing sections = penalty.
 */

const REQUIRED_SECTIONS = [
  { key: "contact", patterns: ["email", "phone", "linkedin", "github", "contact", "address", "@"] },
  { key: "summary", patterns: ["summary", "objective", "profile", "about me", "professional summary"] },
  { key: "experience", patterns: ["experience", "work history", "employment", "professional experience", "work experience"] },
  { key: "education", patterns: ["education", "academic", "degree", "university", "college", "bachelor", "master"] },
  { key: "skills", patterns: ["skills", "technologies", "technical skills", "competencies", "tools", "tech stack"] },
  { key: "projects", patterns: ["projects", "portfolio", "personal projects", "key projects"] },
];

const IDEAL_ORDER = ["contact", "summary", "experience", "skills", "education", "projects"];

/**
 * @param {object} resume - structured resume JSON
 * @returns {{ score: number, details: object }}
 */
export function structureEngine(resume) {
  const text = _extractFullText(resume).toLowerCase();
  
  // Detect which sections exist
  const detected = {};
  for (const section of REQUIRED_SECTIONS) {
    detected[section.key] = section.patterns.some((p) => text.includes(p));
  }

  // Calculate section presence score
  const totalSections = REQUIRED_SECTIONS.length;
  const foundSections = Object.values(detected).filter(Boolean).length;
  const presenceScore = Math.round((foundSections / totalSections) * 100);

  // Check order correctness
  const foundOrder = IDEAL_ORDER.filter((key) => detected[key]);
  let orderScore = 100;
  for (let i = 1; i < foundOrder.length; i++) {
    const idealIdx = IDEAL_ORDER.indexOf(foundOrder[i]);
    const prevIdealIdx = IDEAL_ORDER.indexOf(foundOrder[i - 1]);
    if (idealIdx < prevIdealIdx) {
      orderScore -= 15; // penalty for out-of-order sections
    }
  }
  orderScore = Math.max(0, orderScore);

  // Missing section penalties
  const missingSections = REQUIRED_SECTIONS
    .filter((s) => !detected[s.key])
    .map((s) => s.key);

  const tips = [];
  if (!detected.contact) tips.push({ type: "improve", tip: "Add contact information (email, phone, LinkedIn)." });
  if (!detected.summary) tips.push({ type: "improve", tip: "Add a professional summary or objective section." });
  if (!detected.experience) tips.push({ type: "improve", tip: "Add a work experience section with roles and achievements." });
  if (!detected.education) tips.push({ type: "improve", tip: "Include your educational background." });
  if (!detected.skills) tips.push({ type: "improve", tip: "Add a skills/technologies section." });
  if (!detected.projects) tips.push({ type: "improve", tip: "Include relevant projects to demonstrate your abilities." });
  
  if (detected.experience) tips.push({ type: "good", tip: "Experience section detected." });
  if (detected.skills) tips.push({ type: "good", tip: "Skills section present." });
  if (orderScore >= 80) tips.push({ type: "good", tip: "Section order follows best practices." });

  const score = Math.round(presenceScore * 0.7 + orderScore * 0.3);

  return {
    score: Math.min(100, Math.max(0, score)),
    details: { detected, missingSections, presenceScore, orderScore },
    tips,
  };
}

function _extractFullText(resume) {
  if (typeof resume === "string") return resume;
  
  const parts = [];
  if (resume.name) parts.push(resume.name);
  if (resume.title) parts.push(resume.title);
  if (resume.email) parts.push(resume.email);
  if (resume.phone) parts.push(resume.phone);
  if (resume.linkedin) parts.push(resume.linkedin);
  if (resume.summary) parts.push(resume.summary);
  
  if (resume.experience) {
    for (const exp of resume.experience) {
      parts.push(exp.role || "");
      parts.push(exp.company || "");
      parts.push((exp.bullets || []).join(" "));
    }
  }
  
  if (resume.skills) parts.push(resume.skills.join(" "));
  
  if (resume.projects) {
    for (const proj of resume.projects) {
      parts.push(proj.name || "");
      parts.push(proj.description || "");
      parts.push((proj.stack || []).join(" "));
    }
  }
  
  if (resume.education) {
    for (const edu of resume.education) {
      parts.push(edu.degree || "");
      parts.push(edu.institution || "");
    }
  }
  
  return parts.join(" ");
}

export { _extractFullText };
