export function downloadReportFrontend(resumeDoc, feedback) {
  const html = buildReportHTML(resumeDoc, feedback);
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

function esc(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildReportHTML(r, f) {
  const sections = f.sections || {};
  const SECTION_TITLES = {
    ATS: "ATS",
    Content: "Content",
    MetricsAndImpact: "Metrics & Impact",
    FormattingAndStructure: "Formatting & Structure",
    Skills: "Skills",
    ToneAndStyle: "Tone & Style",
  };

  const sectionOrder = [
    "ATS",
    "Content",
    "MetricsAndImpact",
    "FormattingAndStructure",
    "Skills",
    "ToneAndStyle",
  ];

  const parts = sectionOrder.map(key => {
    const sec = sections[key];
    if (!sec) return "";
    
    let tipsHtml = `<p style="color: #64748b; font-style: italic;">No specific tips for this section.</p>`;
    if (sec.tips && sec.tips.length > 0) {
      const listItems = sec.tips.map(tip => {
        const isGood = tip.type === "good";
        const typeClass = isGood ? "good" : "improvement";
        const typeLabel = isGood ? "✅ Strength" : "⚠️ Improvement Area";
        const explHtml = tip.explanation ? ` — ${esc(tip.explanation)}` : "";
        return `
          <li class="tip-item ${typeClass}">
            <div class="tip-header ${typeClass}">${typeLabel}</div>
            <div class="tip-explanation">
              <strong>${esc(tip.tip)}</strong>${explHtml}
            </div>
          </li>`;
      }).join('');
      tipsHtml = `<ul class="tip-list">${listItems}</ul>`;
    }

    const scoreHtml = sec.score != null ? `<div class="section-score">${sec.score}/100</div>` : "";
    const title = SECTION_TITLES[key] || key;

    return `
    <div class="section">
      <div class="section-header">
        <div class="section-title">${title}</div>
        ${scoreHtml}
      </div>
      ${tipsHtml}
    </div>`;
  });

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>ElevateCV Report - ${esc(r.jobTitle || "Resume")}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { margin: 0; size: A4; }
  body {
    font-family: 'Inter', sans-serif;
    color: #1f2937; font-size: 11pt; line-height: 1.6;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    background: #f8fafc;
  }
  .page {
    padding: 0.8in;
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
  }
  .header { 
    text-align: center; margin-bottom: 30px; padding-bottom: 20px; 
    border-bottom: 2px solid #e2e8f0; 
  }
  .header h1 { 
    font-size: 28pt; font-weight: 800; color: #0f172a; 
    letter-spacing: -0.5px; margin-bottom: 8px;
  }
  .header .meta { 
    font-size: 11pt; color: #64748b; font-weight: 500; 
  }
  
  .score-card {
    background: #f1f5f9;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    margin-bottom: 32px;
    border: 1px solid #e2e8f0;
  }
  .score-card h2 {
    font-size: 14pt; color: #475569; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;
  }
  .score-card .score {
    font-size: 36pt; font-weight: 800; color: #4f46e5;
  }
  
  .section { margin-bottom: 24px; page-break-inside: avoid; }
  .section-header { 
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #cbd5e1;
  }
  .section-title { 
    font-size: 16pt; font-weight: 700; color: #1e293b; 
  }
  .section-score {
    font-size: 14pt; font-weight: 700; color: #3b82f6;
  }
  
  .tip-list { list-style: none; padding-left: 0; margin-top: 8px; }
  .tip-item { 
    background: #f8fafc; border-left: 4px solid #cbd5e1; 
    padding: 12px 16px; margin-bottom: 10px; border-radius: 0 8px 8px 0;
  }
  .tip-item.good { border-left-color: #10b981; background: #ecfdf5; }
  .tip-item.improvement { border-left-color: #f59e0b; background: #fffbeb; }
  
  .tip-header { font-weight: 600; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
  .tip-header.good { color: #065f46; }
  .tip-header.improvement { color: #92400e; }
  
  .tip-explanation { color: #475569; font-size: 10.5pt; }

</style>
</head><body>
<div class="page">
  <div class="header">
    <h1>ElevateCV Analysis</h1>
    <div class="meta">
      Role: <strong>${esc(r.jobTitle || "General")}</strong> 
      ${r.companyName ? `| Company: <strong>${esc(r.companyName)}</strong>` : ""}
    </div>
    <div class="meta" style="margin-top: 4px; font-size: 9pt;">
      Analyzed on: ${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
    </div>
  </div>

  <div class="score-card">
    <h2>Overall ATS Fitness Score</h2>
    <div class="score">${f.overallScore != null ? f.overallScore : "—"} / 100</div>
  </div>

  ${parts.join("")}

</div>
</body></html>`;
}
