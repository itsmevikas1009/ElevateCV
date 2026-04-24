import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResumeReview from "../components/ResumeReview.jsx";
import Loader from "../components/Loader.jsx";
import { getResumeById } from "../lib/api";
import { normalizeResumeFeedback } from "../lib/resumeFeedback.js";

const ResumeReviewPage = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resumeDoc, setResumeDoc] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    getResumeById(id)
      .then((data) => {
        if (data.success && data.resume) {
          setFeedback(normalizeResumeFeedback(data.resume.feedback));
          setResumeDoc(data.resume);
        } else {
          setError(data.message || "Failed to load feedback");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load feedback");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader text="Analyzing your resume..." />;
  if (error) return <div className="pt-24 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-6 px-6">
      <ResumeReview feedback={feedback} resumeDoc={resumeDoc} />
    </div>
  );
};

export default ResumeReviewPage;
