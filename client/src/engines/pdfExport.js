/**
 * Resume PDF Export Engine
 * Generates a professionally formatted PDF from builder JSON using jsPDF.
 * Returns a Blob that can be downloaded or uploaded to the server.
 */

/**
 * Build a formatted resume PDF entirely in-browser.
 * Uses simple canvas-to-text approach for zero-dependency PDF generation.
 * @param {object} resume - structured resume JSON from the builder
 * @param {object} analysis - optional analysis result for score watermark
 * @returns {Blob} PDF blob
 */
export function generateResumePDF(resume, analysis = null) {
  // Build printable HTML and use browser's print-to-pdf via hidden iframe
  const html = buildResumeHTML(resume, analysis);
  return html;
}

/**
 * Build ATS-friendly HTML for the resume.
 */
function buildResumeHTML(r, analysis) {
  const skills = (r.skills || []).filter(s => s.trim());
  const experience = (r.experience || []).filter(e => e.role || e.company);
  const projects = (r.projects || []).filter(p => p.name);
  const education = (r.education || []).filter(e => e.degree || e.institution);

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>${r.name || "Resume"}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { margin: 0; size: A4; }
  body {
    font-family: 'Inter', sans-serif;
    color: #1f2937; font-size: 10pt; line-height: 1.6;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    background: #fff;
  }
  .page {
    padding: 0.6in 0.8in;
    max-width: 800px;
    margin: 0 auto;
  }
  .header { 
    text-align: center; margin-bottom: 24px; padding-bottom: 16px; 
    border-bottom: 2px solid #e5e7eb; 
  }
  .header h1 { 
    font-size: 26pt; font-weight: 700; color: #111827; 
    letter-spacing: -0.5px; margin-bottom: 4px; text-transform: uppercase;
  }
  .header .title { 
    font-size: 12pt; color: #4f46e5; font-weight: 500; 
    margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;
  }
  .header .contact { 
    font-size: 9.5pt; color: #4b5563; 
    display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;
  }
  .header .contact a { color: #4f46e5; text-decoration: none; }
  .header .contact span.dot { color: #d1d5db; }
  
  .section { margin-bottom: 20px; }
  .section-title {
    font-size: 12pt; font-weight: 600; text-transform: uppercase;
    color: #111827; letter-spacing: 0.5px;
    border-bottom: 1px solid #d1d5db; padding-bottom: 4px;
    margin-bottom: 12px;
  }
  .summary { font-size: 10pt; color: #374151; }
  
  .item { margin-bottom: 14px; page-break-inside: avoid; }
  .item-header { 
    display: flex; justify-content: space-between; align-items: baseline; 
    margin-bottom: 4px;
  }
  .item-title { font-weight: 600; font-size: 11pt; color: #111827; }
  .item-subtitle { font-weight: 500; color: #4f46e5; font-size: 10pt; }
  .item-date { font-size: 9.5pt; color: #6b7280; font-weight: 500; }
  
  .bullets { padding-left: 18px; margin-top: 4px; }
  .bullets li { margin-bottom: 4px; font-size: 9.5pt; color: #374151; pl-1; }
  .bullets li::marker { color: #9ca3af; }
  
  .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-tag {
    padding: 3px 10px; background: #f3f4f6; color: #374151;
    border-radius: 4px; font-size: 9pt; font-weight: 500;
    border: 1px solid #e5e7eb;
  }
  
  .proj-desc { font-size: 9.5pt; color: #374151; margin-top: 4px; }
  .proj-stack { 
    font-size: 9pt; color: #4f46e5; font-weight: 500; 
    margin-top: 4px; display: inline-block;
  }
  .proj-link { font-size: 9pt; color: #6b7280; margin-left: 8px; text-decoration: none; }
  
  .score-badge {
    position: fixed; top: 20px; right: 20px;
    background: #111827; color: white;
    padding: 6px 14px; border-radius: 6px;
    font-size: 9pt; font-weight: 600;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  @media print { .score-badge { display: none; } }
</style></head><body>
<div class="page">
  <div class="header">
    <h1>${esc(r.name || "Your Name")}</h1>
    ${r.title ? `<div class="title">${esc(r.title)}</div>` : ""}
    <div class="contact">
      ${r.email ? `<a href="mailto:${esc(r.email)}">${esc(r.email)}</a>` : ""}
      ${r.email && r.phone ? '<span class="dot">•</span>' : ""}
      ${r.phone ? `<span>${esc(r.phone)}</span>` : ""}
      ${(r.email || r.phone) && r.linkedin ? '<span class="dot">•</span>' : ""}
      ${r.linkedin ? `<a href="${esc(r.linkedin)}" target="_blank">${esc(r.linkedin).replace('https://', '').replace('www.', '')}</a>` : ""}
    </div>
  </div>

  ${r.summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="summary">${esc(r.summary)}</div>
  </div>` : ""}

  ${experience.length > 0 ? `
  <div class="section">
    <div class="section-title">Experience</div>
    ${experience.map(e => `
    <div class="item">
      <div class="item-header">
        <div><span class="item-title">${esc(e.role)}</span>${e.company ? ` <span class="item-subtitle">| ${esc(e.company)}</span>` : ""}</div>
        ${e.duration ? `<div class="item-date">${esc(e.duration)}</div>` : ""}
      </div>
      ${(e.bullets || []).filter(b => b.trim()).length > 0 ? `
      <ul class="bullets">
        ${e.bullets.filter(b => b.trim()).map(b => `<li>${esc(b)}</li>`).join("")}
      </ul>` : ""}
    </div>`).join("")}
  </div>` : ""}

  ${skills.length > 0 ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills-list">
      ${skills.map(s => `<span class="skill-tag">${esc(s)}</span>`).join("")}
    </div>
  </div>` : ""}

  ${projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projects.map(p => `
    <div class="item">
      <div class="item-header">
        <div><span class="item-title">${esc(p.name)}</span>${p.link ? `<a class="proj-link" href="${esc(p.link)}" target="_blank">${esc(p.link).replace('https://', '').replace('www.', '')}</a>` : ""}</div>
      </div>
      ${p.description ? `<div class="proj-desc">${esc(p.description)}</div>` : ""}
      ${(p.stack || []).filter(s => s.trim()).length > 0 ? `<div class="proj-stack">Tech: ${p.stack.filter(s => s.trim()).join(", ")}</div>` : ""}
    </div>`).join("")}
  </div>` : ""}

  ${education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${education.map(e => `
    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">${esc(e.degree)}</span>
          ${e.institution ? ` <span class="item-subtitle">| ${esc(e.institution)}</span>` : ""}
        </div>
        ${e.year ? `<div class="item-date">${esc(e.year)}</div>` : ""}
      </div>
    </div>`).join("")}
  </div>` : ""}

  ${analysis?.overallScore != null ? `<div class="score-badge">ElevateCV Score: ${analysis.overallScore}/100</div>` : ""}
</div>
</body></html>`;
}

function esc(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Trigger PDF download from HTML string.
 * Opens a new window, renders HTML, and triggers browser print dialog.
 * @param {string} html - full HTML document string
 * @param {string} filename - suggested filename
 */
export function downloadResumePDF(resume, analysis = null) {
  const html = generateResumePDF(resume, analysis);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const printWindow = window.open(url, "_blank");
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        URL.revokeObjectURL(url);
      }, 500);
    };
  }
}

/**
 * Get resume HTML as Blob for uploading to server analysis endpoint.
 * This converts the builder data to a text file the server can parse.
 * @param {object} resume
 * @returns {File} a .txt File object containing resume text
 */
export function resumeToTextFile(resume) {
  const parts = [];
  if (resume.name) parts.push(resume.name);
  if (resume.title) parts.push(resume.title);
  if (resume.email) parts.push(`Email: ${resume.email}`);
  if (resume.phone) parts.push(`Phone: ${resume.phone}`);
  if (resume.linkedin) parts.push(`LinkedIn: ${resume.linkedin}`);

  if (resume.summary) {
    parts.push("\nPROFESSIONAL SUMMARY");
    parts.push(resume.summary);
  }

  if (resume.experience?.length) {
    parts.push("\nEXPERIENCE");
    for (const exp of resume.experience) {
      if (!exp.role && !exp.company) continue;
      parts.push(`${exp.role || ""} — ${exp.company || ""} (${exp.duration || ""})`);
      for (const b of (exp.bullets || [])) {
        if (b.trim()) parts.push(`• ${b}`);
      }
    }
  }

  if (resume.skills?.length) {
    parts.push("\nSKILLS");
    parts.push(resume.skills.filter(s => s.trim()).join(", "));
  }

  if (resume.projects?.length) {
    parts.push("\nPROJECTS");
    for (const p of resume.projects) {
      if (!p.name) continue;
      parts.push(`${p.name}${p.link ? ` (${p.link})` : ""}`);
      if (p.description) parts.push(p.description);
      if (p.stack?.length) parts.push(`Tech: ${p.stack.filter(s => s.trim()).join(", ")}`);
    }
  }

  if (resume.education?.length) {
    parts.push("\nEDUCATION");
    for (const e of resume.education) {
      if (!e.degree && !e.institution) continue;
      parts.push(`${e.degree || ""} — ${e.institution || ""} (${e.year || ""})`);
    }
  }

  const text = parts.join("\n");
  return new File([text], "resume.txt", { type: "text/plain" });
}
