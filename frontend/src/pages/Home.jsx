import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <div className="home-page">
      <header className="topbar">
        <div className="brand">AI Resume Builder</div>

        <nav className="topbar-actions">
          <Link className="nav-link" to="/login">
            Login
          </Link>
          <Link className="primary-btn" to="/register">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Career growth, powered by AI</span>
          <h1>Build a resume that opens doors.</h1>
          <p>
            Create polished resumes, track improvements, and get AI-driven
            feedback that helps you stand out in competitive job searches.
          </p>

          <div className="hero-actions">
            <Link className="primary-btn" to="/register">
              Start building
            </Link>
            <Link className="secondary-btn" to="/login">
              Sign in
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="feature-badge">ATS Friendly</div>
          <div className="mini-card">
            <h3>Resume score</h3>
            <div className="score-pill">92 / 100</div>
            <p>Strong structure, keywords, and impact statements.</p>
          </div>

          <div className="feature-list">
            <div>
              <strong>AI summary</strong>
              <span>Polished for recruiters</span>
            </div>
            <div>
              <strong>Smart suggestions</strong>
              <span>Actionable improvement tips</span>
            </div>
            <div>
              <strong>PDF-ready</strong>
              <span>Professional final output</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;