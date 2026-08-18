import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getResumes,
    analyzeResume,
    deleteResume,
} from "../../services/api_new";
import "../../styles/dashboard.css";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadResumes();
    }, []);

    const loadResumes = async () => {
        try {
            const result = await getResumes();

            if (!result.success) {
                setError(result.message);
                return;
            }

            setResumes(result.data || []);
        } catch (error) {
            setError("Unable to load resumes");
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async (resumeId) => {
        try {
            setAnalyzing(resumeId);

            const result = await analyzeResume(resumeId);

            if (!result.success) {
                alert(
                    result.message ||
                    "AI analysis failed"
                );

                return;
            }

            navigate(
                `/resume/score/${resumeId}`
            );

        } catch (error) {
            console.error(error);

            alert("AI analysis failed");

        } finally {
            setAnalyzing(null);
        }
    };

    const handleLogout = () => {
        if (logout) {
            logout();
        } else {
            try {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } catch (e) {}
            navigate("/login");
        }
    };

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }
    const handleDelete = async (resumeId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this resume?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const result =
                await deleteResume(resumeId);

            if (!result.success) {
                alert(
                    result.message ||
                    "Unable to delete resume"
                );

                return;
            }

            alert(
                "Resume deleted successfully"
            );

            // Remove deleted resume from screen
            setResumes((previousResumes) =>
                previousResumes.filter(
                    (resume) =>
                        resume._id !== resumeId
                )
            );
        } catch (error) {
            console.error(error);

            alert(
                "Unable to delete resume"
            );
        }
    };

    return (
        <div className="dashboard">

            {/* Navbar */}
            <nav className="dashboard-nav">
                <h2>AI Resume Builder</h2>

                <div>
                    <span>
                        {user?.username || "User"}
                    </span>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main */}
            <main className="dashboard-content">

                <div className="dashboard-header">
                    <div>
                        <h1>
                            Welcome, {user?.username || "User"} 👋
                        </h1>

                        <p>
                            Create and improve your professional resume.
                        </p>
                    </div>

                    <Link
                        to="/resume/create"
                        className="create-btn"
                    >
                        + Create Resume
                    </Link>
                </div>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <h2>My Resumes</h2>

                {resumes.length === 0 ? (
                    <div className="empty-state">
                        <h3>No resumes yet</h3>

                        <p>
                            Create your first AI-powered resume.
                        </p>

                        <Link to="/resume/create">
                            Create Resume
                        </Link>
                    </div>
                ) : (
                    <div className="resume-grid">

                        {resumes.map((resume) => (

                            <div
                                className="resume-card"
                                key={resume._id}
                            >

                                <h3>
                                    {resume.personalInfo?.fullName ||
                                        "Untitled Resume"}
                                </h3>

                                <p>
                                    {resume.personalInfo?.email ||
                                        "No email"}
                                </p>

                                <div className="score">

                                    <span>AI Score</span>

                                    <strong>
                                        {resume.aiScore?.overallScore || 0}%
                                    </strong>

                                </div>

                                <div className="card-buttons">

                                    <Link
                                        to={`/resume/edit/${resume._id}`}
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() =>
                                            handleAnalyze(resume._id)
                                        }
                                    >
                                        Analyze AI
                                    </button>

                                    <Link
                                        to={`/resume/score/${resume._id}`}
                                        className="score-btn"
                                    >
                                        View Score
                                    </Link>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(resume._id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>

                        ))}

                    </div>
                )}

            </main>
        </div>
    );
}

export default Dashboard;