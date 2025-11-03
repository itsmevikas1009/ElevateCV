// src/components/Resume.jsx
import React, { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

export default function Resume() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload a PDF first!");
    setLoading(true);

    try {
      // 1️⃣ Read PDF file
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const txt = await page.getTextContent();
        text += txt.items.map((t) => t.str).join(" ");
      }

      // 2️⃣ Load Puter.js (keep as is)
      await import("https://js.puter.com/v2/");

      const prompt = `
        You are a professional Resume Analyst. 
        Provide a JSON-only analysis of this resume.

        Resume:
        ${text}
      `;

      // 3️⃣ Run AI analysis
      const response = await puter.ai.chat({
        model: "gpt-5-nano",
        prompt,
        temperature: 0.2,
        max_tokens: 2000,
      });

      // 4️⃣ Parse response JSON
      const jsonMatch = response.text.match(/({[\s\S]*})/);
      const parsedFeedback = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : { error: "Unable to parse AI response", raw: response.text };

      setFeedback(parsedFeedback);

      // 5️⃣ Send to backend for saving (optional)
      await fetch("/api/resume/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: "Software Engineer",
          feedback: parsedFeedback,
          resumeText: text,
        }),
      });
    } catch (err) {
      console.error(err);
      alert("Error analyzing resume: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <h1 className="text-2xl font-bold">Resume Analyzer</h1>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="border p-2 rounded"
      />
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {feedback && (
        <div className="mt-6 w-3/4 text-left bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">AI Feedback</h2>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(feedback, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
