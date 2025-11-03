// src/pages/Upload.jsx
import React, { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("resume", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setResult(data);
    } catch (err) {
      alert("Upload/analysis failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upload a resume (PDF)</h2>
      <input type="file" accept="application/pdf" onChange={handleFile} />
      <button
        onClick={handleUpload}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={!file || loading}
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {result && (
        <div className="mt-6">
          <h3 className="font-semibold">AI Feedback (summary):</h3>
          <pre className="whitespace-pre-wrap p-3 bg-gray-100 rounded mt-2">
            {JSON.stringify(result.feedback || result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
