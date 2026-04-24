/**
 * Keyword banks mapped by role.
 * Config-driven — admin can extend these without code changes.
 */
export const keywordBanks = {
  frontend: {
    label: "Frontend Developer",
    keywords: [
      "react", "javascript", "typescript", "html", "css", "tailwind",
      "next.js", "redux", "vue", "angular", "webpack", "vite",
      "responsive", "accessibility", "ui/ux", "figma", "sass",
      "jest", "testing", "performance", "seo", "api", "rest",
      "graphql", "git", "ci/cd", "agile", "node.js",
    ],
  },
  backend: {
    label: "Backend Developer",
    keywords: [
      "node.js", "express", "python", "django", "flask", "java",
      "spring", "sql", "postgresql", "mongodb", "redis", "docker",
      "kubernetes", "aws", "azure", "gcp", "rest", "graphql",
      "microservices", "api", "authentication", "authorization",
      "ci/cd", "git", "linux", "nginx", "testing", "agile",
    ],
  },
  fullstack: {
    label: "Full Stack Developer",
    keywords: [
      "react", "node.js", "javascript", "typescript", "html", "css",
      "express", "mongodb", "postgresql", "sql", "redux", "next.js",
      "docker", "aws", "git", "rest", "graphql", "api",
      "testing", "ci/cd", "agile", "responsive", "performance",
      "authentication", "deployment", "linux",
    ],
  },
  data_science: {
    label: "Data Scientist",
    keywords: [
      "python", "r", "sql", "machine learning", "deep learning",
      "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn",
      "data visualization", "tableau", "power bi", "statistics",
      "nlp", "computer vision", "feature engineering", "a/b testing",
      "big data", "spark", "hadoop", "aws", "jupyter", "git",
    ],
  },
  devops: {
    label: "DevOps Engineer",
    keywords: [
      "docker", "kubernetes", "terraform", "ansible", "jenkins",
      "ci/cd", "aws", "azure", "gcp", "linux", "bash", "python",
      "monitoring", "prometheus", "grafana", "nginx", "git",
      "infrastructure", "automation", "security", "networking",
      "microservices", "logging", "elk", "cloud",
    ],
  },
  product_manager: {
    label: "Product Manager",
    keywords: [
      "product strategy", "roadmap", "user research", "agile",
      "scrum", "jira", "analytics", "a/b testing", "stakeholder",
      "prioritization", "metrics", "kpi", "mvp", "user stories",
      "wireframe", "figma", "data-driven", "cross-functional",
      "market analysis", "competitive analysis", "launch",
    ],
  },
  general: {
    label: "General / Unknown Role",
    keywords: [
      "leadership", "communication", "teamwork", "problem-solving",
      "project management", "analytical", "strategic", "organized",
      "detail-oriented", "results-driven", "collaboration",
      "innovation", "mentoring", "presentation", "stakeholder",
    ],
  },
};

/**
 * Infer role from job title string.
 */
export function inferRole(jobTitle = "") {
  const t = jobTitle.toLowerCase();
  if (t.includes("front")) return "frontend";
  if (t.includes("back")) return "backend";
  if (t.includes("full") && t.includes("stack")) return "fullstack";
  if (t.includes("data") || t.includes("ml") || t.includes("machine")) return "data_science";
  if (t.includes("devops") || t.includes("sre") || t.includes("infra")) return "devops";
  if (t.includes("product") && t.includes("manag")) return "product_manager";
  return "general";
}
