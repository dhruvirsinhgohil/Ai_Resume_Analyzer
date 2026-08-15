import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResumePDF from "./ResumePDF";
import {
  getAIAnalysis,
  analyzeResume,
} from "../../services/api";
import "../../styles/score.css";

function ResumeScore() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalysis();
  }, [resumeId]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);

      const result = await getAIAnalysis(resumeId);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setAnalysis(result.data);
    } catch (error) {
      console.error(error);

      setError("Unable to load AI analysis");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);

      const result = await analyzeResume(resumeId);

      if (!result.success) {
        alert(
          result.message ||
            "AI analysis failed"
        );

        return;
      }

      await loadAnalysis();

      alert(
        "Resume analyzed successfully!"
      );
    } catch (error) {
      console.error(error);

      alert("AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="score-loading">
        <h2>
          Loading AI analysis...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="score-error">

        <h2>
          {error}
        </h2>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Dashboard
        </button>

      </div>
    );
  }

  const score =
    analysis?.aiScore;

  const suggestions =
    analysis?.suggestions || [];

  return (
    <div className="score-page">

      {/* Header */}

      <div className="score-header">

        <button
          className="back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>

        <h1>
          AI Resume Analysis
        </h1>

        <p>
          {analysis?.resumeName ||
            "Your Resume"}
        </p>

      </div>


      {/* Overall Score */}

      <div className="overall-score-card">

        <div className="score-circle">

          <span>
            {score?.overallScore || 0}
          </span>

          <small>
            /100
          </small>

        </div>

        <div>

          <h2>
            Overall Resume Score
          </h2>

          <p>
            Your resume has been analyzed
            using AI.
          </p>

        </div>

      </div>


      {/* Category Scores */}

      <h2 className="section-heading">
        Resume Performance
      </h2>

      <div className="score-grid">

        <ScoreCard
          title="ATS Score"
          score={score?.atsScore}
        />

        <ScoreCard
          title="Skills"
          score={score?.skillsScore}
        />

        <ScoreCard
          title="Experience"
          score={score?.experienceScore}
        />

        <ScoreCard
          title="Projects"
          score={score?.projectScore}
        />

        <ScoreCard
          title="Education"
          score={score?.educationScore}
        />

        <ScoreCard
          title="Summary"
          score={score?.summaryScore}
        />

      </div>


      {/* Suggestions */}

      <div className="suggestions-card">

        <h2>
          ✨ AI Suggestions
        </h2>

        {suggestions.length === 0 ? (

          <p>
            No suggestions available.
          </p>

        ) : (

          <div className="suggestions-list">

            {suggestions.map(
              (suggestion, index) => (

                <div
                  className="suggestion"
                  key={index}
                >

                  <span>
                    {index + 1}
                  </span>

                  <p>
                    {suggestion}
                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* Analyze Again */}

      <div className="analyze-again">

        <button
          onClick={handleAnalyze}
          disabled={analyzing}
        >
          {analyzing
            ? "✨ Analyzing..."
            : "✨ Analyze Resume Again"}
        </button>

      </div>

    </div>
  );
}


// Score Card

function ScoreCard({
  title,
  score = 0,
}) {
  return (
    <div className="score-card">

      <div className="score-card-header">

        <h3>
          {title}
        </h3>

        <strong>
          {score || 0}%
        </strong>

      </div>

      <div className="progress-bar">

        <div
          className="progress"
          style={{
            width: `${score || 0}%`,
          }}
        />

      </div>

    </div>
  );
}

export default ResumeScore;