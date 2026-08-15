import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createResume,
  improveResume,
} from "../services/api";

import ResumePreview from "../components/resume/ResumePreview";
import "../styles/resume-form.css";

function CreateResume() {
  const navigate = useNavigate();

  const createEmptyProject = () => ({
    name: "",
    technologies: "",
    description: "",
  });

  const [resume, setResume] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
    },

    summary: "",

    education: [
      {
        degree: "",
        university: "",
        startYear: "",
        endYear: "",
      },
    ],

    skills: [],

    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],

    projects: [createEmptyProject()],
  });

  const [skillInput, setSkillInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [aiLoading, setAiLoading] = useState("");

  const [error, setError] = useState("");

  const buildResumePayload = (data) => ({
    ...data,
    personalInfo: {
      ...data.personalInfo,
      address: data.personalInfo?.location || data.personalInfo?.address || "",
    },
    education: (data.education || []).map((item) => ({
      ...item,
      institution: item.institution || item.university || "",
      university: item.university || item.institution || "",
    })),
    projects: (data.projects || []).map((project) => ({
      ...project,
      title: project.title || project.name || "",
      name: project.name || project.title || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies
        : (project.technologies || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
    })),
  });

  // ==========================================
  // PERSONAL INFORMATION
  // ==========================================

  const handlePersonalChange = (e) => {
    setResume({
      ...resume,

      personalInfo: {
        ...resume.personalInfo,

        [e.target.name]: e.target.value,
      },
    });
  };

  // ==========================================
  // SUMMARY
  // ==========================================

  const handleSummaryChange = (e) => {
    setResume({
      ...resume,

      summary: e.target.value,
    });
  };

  // ==========================================
  // EDUCATION
  // ==========================================

  const handleEducationChange = (e) => {
    const updatedEducation = [...resume.education];

    updatedEducation[0] = {
      ...updatedEducation[0],

      [e.target.name]: e.target.value,
    };

    setResume({
      ...resume,

      education: updatedEducation,
    });
  };

  // ==========================================
  // SKILLS
  // ==========================================

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) {
      return;
    }

    if (resume.skills.includes(skill)) {
      setSkillInput("");
      return;
    }

    setResume({
      ...resume,

      skills: [
        ...resume.skills,
        skill,
      ],
    });

    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      addSkill();
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = resume.skills.filter(
      (_, i) => i !== index
    );

    setResume({
      ...resume,

      skills: updatedSkills,
    });
  };

  // ==========================================
  // EXPERIENCE
  // ==========================================

  const handleExperienceChange = (e) => {
    const updatedExperience = [...resume.experience];

    updatedExperience[0] = {
      ...updatedExperience[0],

      [e.target.name]: e.target.value,
    };

    setResume({
      ...resume,

      experience: updatedExperience,
    });
  };

  // ==========================================
  // PROJECT
  // ==========================================

  const addProject = () => {
    setResume({
      ...resume,
      projects: [...resume.projects, createEmptyProject()],
    });
  };

  const removeProject = (index) => {
    if (resume.projects.length === 1) {
      setResume({
        ...resume,
        projects: [createEmptyProject()],
      });
      return;
    }

    setResume({
      ...resume,
      projects: resume.projects.filter((_, i) => i !== index),
    });
  };

  const handleProjectChange = (index, e) => {
    const updatedProjects = [...resume.projects];

    updatedProjects[index] = {
      ...updatedProjects[index],
      [e.target.name]: e.target.value,
    };

    setResume({
      ...resume,
      projects: updatedProjects,
    });
  };

  // ==========================================
  // AI IMPROVE SUMMARY
  // ==========================================

  const handleImproveSummary = async () => {
    if (!resume.summary.trim()) {
      alert("Please write your summary first.");
      return;
    }

    try {
      setAiLoading("summary");

      const result = await improveResume(
        "Professional Summary",
        resume.summary,
        ""
      );

      if (!result.success) {
        alert(result.message || "AI improvement failed.");
        return;
      }

      setResume({
        ...resume,

        summary:
          result.data.improvedContent,
      });
    } catch (error) {
      console.error(error);

      alert("AI improvement failed.");
    } finally {
      setAiLoading("");
    }
  };

  // ==========================================
  // AI IMPROVE EXPERIENCE
  // ==========================================

  const handleImproveExperience = async () => {
    const experience =
      resume.experience[0];

    if (!experience.description.trim()) {
      alert(
        "Please write your experience description first."
      );

      return;
    }

    try {
      setAiLoading("experience");

      const result = await improveResume(
        "Work Experience",
        experience.description,
        experience.position
      );

      if (!result.success) {
        alert(
          result.message ||
            "AI improvement failed."
        );

        return;
      }

      const updatedExperience = [
        ...resume.experience,
      ];

      updatedExperience[0] = {
        ...updatedExperience[0],

        description:
          result.data.improvedContent,
      };

      setResume({
        ...resume,

        experience:
          updatedExperience,
      });
    } catch (error) {
      console.error(error);

      alert("AI improvement failed.");
    } finally {
      setAiLoading("");
    }
  };

  // ==========================================
  // AI IMPROVE PROJECT
  // ==========================================

  const handleImproveProject = async (projectIndex = 0) => {
    const project = resume.projects[projectIndex];

    if (!project || !project.description.trim()) {
      alert(
        "Please write your project description first."
      );

      return;
    }

    try {
      setAiLoading(`project-${projectIndex}`);

      const result = await improveResume(
        "Project",
        project.description,
        project.name
      );

      if (!result.success) {
        alert(
          result.message ||
            "AI improvement failed."
        );

        return;
      }

      const updatedProjects = [
        ...resume.projects,
      ];

      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],

        description:
          result.data.improvedContent,
      };

      setResume({
        ...resume,

        projects:
          updatedProjects,
      });
    } catch (error) {
      console.error(error);

      alert("AI improvement failed.");
    } finally {
      setAiLoading("");
    }
  };

  // ==========================================
  // SAVE RESUME
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const payload = buildResumePayload(resume);
      const result =
        await createResume(payload);

      if (!result.success) {
        setError(
          result.message ||
            "Unable to create resume."
        );

        return;
      }

      alert(
        "Resume created successfully!"
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-resume-page">

      <div className="resume-builder">

        {/* =================================
            FORM
        ================================= */}

        <div className="form-container">

          <h1>
            Create Your Resume
          </h1>

          <p className="subtitle">
            Build your professional resume
            with AI assistance.
          </p>

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
          >

            {/* =================================
                PERSONAL INFORMATION
            ================================= */}

            <section className="form-section">

              <h2>
                Personal Information
              </h2>

              <div className="form-grid">

                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={
                    resume.personalInfo
                      .fullName
                  }
                  onChange={
                    handlePersonalChange
                  }
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={
                    resume.personalInfo
                      .email
                  }
                  onChange={
                    handlePersonalChange
                  }
                  required
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={
                    resume.personalInfo
                      .phone
                  }
                  onChange={
                    handlePersonalChange
                  }
                />

                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={
                    resume.personalInfo
                      .location
                  }
                  onChange={
                    handlePersonalChange
                  }
                />

                <input
                  type="text"
                  name="linkedin"
                  placeholder="LinkedIn URL"
                  value={
                    resume.personalInfo
                      .linkedin
                  }
                  onChange={
                    handlePersonalChange
                  }
                />

                <input
                  type="text"
                  name="github"
                  placeholder="GitHub URL"
                  value={
                    resume.personalInfo
                      .github
                  }
                  onChange={
                    handlePersonalChange
                  }
                />

              </div>

            </section>

            {/* =================================
                SUMMARY
            ================================= */}

            <section className="form-section">

              <div className="section-title-row">

                <h2>
                  Professional Summary
                </h2>

                <button
                  type="button"
                  className="ai-button"
                  onClick={
                    handleImproveSummary
                  }
                  disabled={
                    aiLoading === "summary"
                  }
                >
                  {aiLoading ===
                  "summary"
                    ? "✨ Improving..."
                    : "✨ Improve with AI"}
                </button>

              </div>

              <textarea
                rows="6"
                placeholder="Write your professional summary..."
                value={
                  resume.summary
                }
                onChange={
                  handleSummaryChange
                }
              />

              <p className="ai-hint">
                💡 Write your summary and
                let AI make it more
                professional and ATS friendly.
              </p>

            </section>

            {/* =================================
                EDUCATION
            ================================= */}

            <section className="form-section">

              <h2>
                Education
              </h2>

              <input
                type="text"
                name="degree"
                placeholder="Degree"
                value={
                  resume.education[0]
                    .degree
                }
                onChange={
                  handleEducationChange
                }
              />

              <input
                type="text"
                name="university"
                placeholder="University / College"
                value={
                  resume.education[0]
                    .university
                }
                onChange={
                  handleEducationChange
                }
              />

              <div className="form-grid">

                <input
                  type="text"
                  name="startYear"
                  placeholder="Start Year"
                  value={
                    resume.education[0]
                      .startYear
                  }
                  onChange={
                    handleEducationChange
                  }
                />

                <input
                  type="text"
                  name="endYear"
                  placeholder="End Year"
                  value={
                    resume.education[0]
                      .endYear
                  }
                  onChange={
                    handleEducationChange
                  }
                />

              </div>

            </section>

            {/* =================================
                SKILLS
            ================================= */}

            <section className="form-section">

              <h2>
                Skills
              </h2>

              <div className="skill-input">

                <input
                  type="text"
                  placeholder="Enter skill e.g. React"
                  value={
                    skillInput
                  }
                  onChange={(e) =>
                    setSkillInput(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleSkillKeyDown
                  }
                />

                <button
                  type="button"
                  onClick={addSkill}
                >
                  Add
                </button>

              </div>

              <div className="skills-list">

                {resume.skills.map(
                  (skill, index) => (
                    <span
                      key={index}
                    >
                      {skill}

                      <button
                        type="button"
                        onClick={() =>
                          removeSkill(
                            index
                          )
                        }
                      >
                        ×
                      </button>
                    </span>
                  )
                )}

              </div>

            </section>

            {/* =================================
                EXPERIENCE
            ================================= */}

            <section className="form-section">

              <div className="section-title-row">

                <h2>
                  Experience
                </h2>

                <button
                  type="button"
                  className="ai-button"
                  onClick={
                    handleImproveExperience
                  }
                  disabled={
                    aiLoading ===
                    "experience"
                  }
                >
                  {aiLoading ===
                  "experience"
                    ? "✨ Improving..."
                    : "✨ Improve with AI"}
                </button>

              </div>

              <input
                type="text"
                name="company"
                placeholder="Company"
                value={
                  resume.experience[0]
                    .company
                }
                onChange={
                  handleExperienceChange
                }
              />

              <input
                type="text"
                name="position"
                placeholder="Job Position"
                value={
                  resume.experience[0]
                    .position
                }
                onChange={
                  handleExperienceChange
                }
              />

              <div className="form-grid">

                <input
                  type="text"
                  name="startDate"
                  placeholder="Start Date"
                  value={
                    resume.experience[0]
                      .startDate
                  }
                  onChange={
                    handleExperienceChange
                  }
                />

                <input
                  type="text"
                  name="endDate"
                  placeholder="End Date"
                  value={
                    resume.experience[0]
                      .endDate
                  }
                  onChange={
                    handleExperienceChange
                  }
                />

              </div>

              <textarea
                rows="6"
                name="description"
                placeholder="Describe your work experience..."
                value={
                  resume.experience[0]
                    .description
                }
                onChange={
                  handleExperienceChange
                }
              />

            </section>

            {/* =================================
                PROJECTS
            ================================= */}

            <section className="form-section">

              <div className="section-title-row">

                <h2>
                  Projects
                </h2>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={addProject}
                >
                  + Add Project
                </button>

              </div>

              {resume.projects.map((project, index) => (
                <div className="project-card" key={index}>
                  <div className="project-card-header">
                    <span>Project {index + 1}</span>

                    <div className="project-card-actions">
                      <button
                        type="button"
                        className="ai-button"
                        onClick={() => handleImproveProject(index)}
                        disabled={aiLoading === `project-${index}`}
                      >
                        {aiLoading === `project-${index}`
                          ? "✨ Improving..."
                          : "✨ Improve with AI"}
                      </button>

                      {resume.projects.length > 1 && (
                        <button
                          type="button"
                          className="remove-button"
                          onClick={() => removeProject(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    name="name"
                    placeholder="Project Name"
                    value={project.name || ""}
                    onChange={(e) => handleProjectChange(index, e)}
                  />

                  <input
                    type="text"
                    name="technologies"
                    placeholder="Technologies Used e.g. React, Node.js, MongoDB"
                    value={project.technologies || ""}
                    onChange={(e) => handleProjectChange(index, e)}
                  />

                  <textarea
                    rows="6"
                    name="description"
                    placeholder="Describe your project..."
                    value={project.description || ""}
                    onChange={(e) => handleProjectChange(index, e)}
                  />
                </div>
              ))}

            </section>

            {/* =================================
                SAVE
            ================================= */}

            <button
              className="save-resume-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving Resume..."
                : "💾 Save Resume"}
            </button>

          </form>

        </div>

        {/* =================================
            LIVE PREVIEW
        ================================= */}

        <div className="preview-container">

          <h2>
            Live Preview
          </h2>

          <ResumePreview
            resume={resume}
          />

        </div>

      </div>

    </div>
  );
}

export default CreateResume;