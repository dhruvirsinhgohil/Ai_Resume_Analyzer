import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getResumeById,
  updateResume,
  improveResume,
} from "../services/api";

import ResumePreview from "../components/resume/ResumePreview";
import "../styles/resume-form.css";

function EditResume() {
  const { resumeId } = useParams();

  const navigate = useNavigate();

  const createEmptyProject = () => ({
    name: "",
    technologies: "",
    description: "",
  });

  const normalizeProject = (project = {}) => ({
    ...createEmptyProject(),
    ...project,
    name: project.name ?? project.title ?? "",
    technologies:
      Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies || "",
  });

  const normalizeResumeData = (data = {}) => ({
    ...data,
    personalInfo: {
      ...(data.personalInfo || {}),
      location: data.personalInfo?.location || data.personalInfo?.address || "",
      address: data.personalInfo?.address || data.personalInfo?.location || "",
    },
    skills: Array.isArray(data.skills) ? data.skills : [],
    education: Array.isArray(data.education) && data.education.length
      ? data.education.map((item) => ({
          ...item,
          university: item.university || item.institution || "",
          institution: item.institution || item.university || "",
        }))
      : [{ degree: "", university: "", startYear: "", endYear: "" }],
    experience: Array.isArray(data.experience) && data.experience.length
      ? data.experience
      : [{ company: "", position: "", startDate: "", endDate: "", description: "" }],
    projects: Array.isArray(data.projects) && data.projects.length
      ? data.projects.map(normalizeProject)
      : [createEmptyProject()],
  });

  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [skillInput, setSkillInput] = useState("");

  const [aiLoading, setAiLoading] = useState("");

  const [error, setError] = useState("");

  // =====================================
  // LOAD RESUME
  // =====================================

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  const loadResume = async () => {
    try {
      setLoading(true);

      const result =
        await getResumeById(resumeId);

      if (!result.success) {
        setError(
          result.message ||
            "Resume not found"
        );

        return;
      }

      setResume(normalizeResumeData(result.data));
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load resume"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // PERSONAL INFORMATION
  // =====================================

  const handlePersonalChange = (e) => {
    setResume({
      ...resume,

      personalInfo: {
        ...resume.personalInfo,

        [e.target.name]:
          e.target.value,
      },
    });
  };

  // =====================================
  // SUMMARY
  // =====================================

  const handleSummaryChange = (e) => {
    setResume({
      ...resume,

      summary: e.target.value,
    });
  };

  // =====================================
  // EDUCATION
  // =====================================

  const handleEducationChange = (e) => {
    const updatedEducation = [
      ...resume.education,
    ];

    updatedEducation[0] = {
      ...updatedEducation[0],

      [e.target.name]:
        e.target.value,
    };

    setResume({
      ...resume,

      education:
        updatedEducation,
    });
  };

  // =====================================
  // SKILLS
  // =====================================

  const addSkill = () => {
    const skill =
      skillInput.trim();

    if (!skill) return;

    if (
      resume.skills.includes(skill)
    ) {
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

  const removeSkill = (index) => {
    const updatedSkills =
      resume.skills.filter(
        (_, i) => i !== index
      );

    setResume({
      ...resume,

      skills: updatedSkills,
    });
  };

  // =====================================
  // EXPERIENCE
  // =====================================

  const handleExperienceChange = (
    e
  ) => {
    const updatedExperience = [
      ...resume.experience,
    ];

    updatedExperience[0] = {
      ...updatedExperience[0],

      [e.target.name]:
        e.target.value,
    };

    setResume({
      ...resume,

      experience:
        updatedExperience,
    });
  };

  // =====================================
  // PROJECT
  // =====================================

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

  // =====================================
  // AI SUMMARY
  // =====================================

  const handleImproveSummary =
    async () => {
      if (!resume.summary?.trim()) {
        alert(
          "Please write your summary first."
        );

        return;
      }

      try {
        setAiLoading("summary");

        const result =
          await improveResume(
            "Professional Summary",
            resume.summary,
            ""
          );

        if (!result.success) {
          alert(
            result.message ||
              "AI improvement failed"
          );

          return;
        }

        setResume({
          ...resume,

          summary:
            result.data
              .improvedContent,
        });
      } catch (error) {
        console.error(error);

        alert(
          "AI improvement failed"
        );
      } finally {
        setAiLoading("");
      }
    };

  // =====================================
  // AI EXPERIENCE
  // =====================================

  const handleImproveExperience =
    async () => {
      const experience =
        resume.experience[0];

      if (
        !experience.description?.trim()
      ) {
        alert(
          "Please write your experience first."
        );

        return;
      }

      try {
        setAiLoading(
          "experience"
        );

        const result =
          await improveResume(
            "Work Experience",
            experience.description,
            experience.position
          );

        if (!result.success) {
          alert(
            result.message ||
              "AI improvement failed"
          );

          return;
        }

        const updatedExperience = [
          ...resume.experience,
        ];

        updatedExperience[0] = {
          ...updatedExperience[0],

          description:
            result.data
              .improvedContent,
        };

        setResume({
          ...resume,

          experience:
            updatedExperience,
        });
      } catch (error) {
        console.error(error);

        alert(
          "AI improvement failed"
        );
      } finally {
        setAiLoading("");
      }
    };

  // =====================================
  // AI PROJECT
  // =====================================

  const handleImproveProject =
    async (projectIndex = 0) => {
      const project =
        resume.projects[projectIndex];

      if (
        !project ||
        !project.description?.trim()
      ) {
        alert(
          "Please write your project first."
        );

        return;
      }

      try {
        setAiLoading(`project-${projectIndex}`);

        const result =
          await improveResume(
            "Project",
            project.description,
            project.name
          );

        if (!result.success) {
          alert(
            result.message ||
              "AI improvement failed"
          );

          return;
        }

        const updatedProjects = [
          ...resume.projects,
        ];

        updatedProjects[projectIndex] = {
          ...updatedProjects[projectIndex],

          description:
            result.data
              .improvedContent,
        };

        setResume({
          ...resume,

          projects:
            updatedProjects,
        });
      } catch (error) {
        console.error(error);

        alert(
          "AI improvement failed"
        );
      } finally {
        setAiLoading("");
      }
    };

  // =====================================
  // UPDATE RESUME
  // =====================================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      setError("");

      const payload = {
        ...resume,
        personalInfo: {
          ...resume.personalInfo,
          address: resume.personalInfo?.location || resume.personalInfo?.address || "",
        },
        education: (resume.education || []).map((item) => ({
          ...item,
          institution: item.institution || item.university || "",
          university: item.university || item.institution || "",
        })),
        projects: (resume.projects || []).map((project) => ({
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
      };

      const result =
        await updateResume(
          resumeId,
          payload
        );

      if (!result.success) {
        setError(
          result.message ||
            "Unable to update resume"
        );

        return;
      }

      alert(
        "Resume updated successfully!"
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setError(
        "Unable to update resume"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="score-loading">
        <h2>
          Loading resume...
        </h2>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (!resume) {
    return (
      <div className="score-error">

        <h2>
          {error ||
            "Resume not found"}
        </h2>

        <button
          onClick={() =>
            navigate(
              "/dashboard"
            )
          }
        >
          Back to Dashboard
        </button>

      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="create-resume-page">

      <div className="resume-builder">

        {/* ================================
            FORM
        ================================= */}

        <div className="form-container">

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            ← Dashboard
          </button>

          <h1>
            Edit Resume
          </h1>

          <p className="subtitle">
            Update your resume and
            improve it with AI.
          </p>

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
          >

            {/* PERSONAL */}

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
                      ?.fullName || ""
                  }
                  onChange={
                    handlePersonalChange
                  }
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={
                    resume.personalInfo
                      ?.email || ""
                  }
                  onChange={
                    handlePersonalChange
                  }
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={
                    resume.personalInfo
                      ?.phone || ""
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
                      ?.location || ""
                  }
                  onChange={
                    handlePersonalChange
                  }
                />

                <input
                  type="text"
                  name="linkedin"
                  placeholder="LinkedIn"
                  value={
                    resume.personalInfo
                      ?.linkedin || ""
                  }
                  onChange={
                    handlePersonalChange
                  }
                />

                <input
                  type="text"
                  name="github"
                  placeholder="GitHub"
                  value={
                    resume.personalInfo
                      ?.github || ""
                  }
                  onChange={
                    handlePersonalChange
                  }
                />

              </div>

            </section>


            {/* SUMMARY */}

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
                    aiLoading ===
                    "summary"
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
                value={
                  resume.summary ||
                  ""
                }
                onChange={
                  handleSummaryChange
                }
              />

            </section>


            {/* EDUCATION */}

            <section className="form-section">

              <h2>
                Education
              </h2>

              <input
                type="text"
                name="degree"
                placeholder="Degree"
                value={
                  resume.education?.[0]
                    ?.degree || ""
                }
                onChange={
                  handleEducationChange
                }
              />

              <input
                type="text"
                name="university"
                placeholder="University"
                value={
                  resume.education?.[0]
                    ?.university || ""
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
                    resume.education?.[0]
                      ?.startYear || ""
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
                    resume.education?.[0]
                      ?.endYear || ""
                  }
                  onChange={
                    handleEducationChange
                  }
                />

              </div>

            </section>


            {/* SKILLS */}

            <section className="form-section">

              <h2>
                Skills
              </h2>

              <div className="skill-input">

                <input
                  type="text"
                  placeholder="Enter skill"
                  value={
                    skillInput
                  }
                  onChange={(e) =>
                    setSkillInput(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key ===
                      "Enter"
                    ) {
                      e.preventDefault();

                      addSkill();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={
                    addSkill
                  }
                >
                  Add
                </button>

              </div>

              <div className="skills-list">

                {resume.skills?.map(
                  (
                    skill,
                    index
                  ) => (
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


            {/* EXPERIENCE */}

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
                  resume.experience?.[0]
                    ?.company || ""
                }
                onChange={
                  handleExperienceChange
                }
              />

              <input
                type="text"
                name="position"
                placeholder="Position"
                value={
                  resume.experience?.[0]
                    ?.position || ""
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
                    resume.experience?.[0]
                      ?.startDate || ""
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
                    resume.experience?.[0]
                      ?.endDate || ""
                  }
                  onChange={
                    handleExperienceChange
                  }
                />

              </div>

              <textarea
                rows="6"
                name="description"
                placeholder="Describe your experience"
                value={
                  resume.experience?.[0]
                    ?.description || ""
                }
                onChange={
                  handleExperienceChange
                }
              />

            </section>


            {/* PROJECTS */}

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

              {resume.projects?.map((project, index) => (
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
                    value={project?.name || ""}
                    onChange={(e) => handleProjectChange(index, e)}
                  />

                  <input
                    type="text"
                    name="technologies"
                    placeholder="Technologies"
                    value={project?.technologies || ""}
                    onChange={(e) => handleProjectChange(index, e)}
                  />

                  <textarea
                    rows="6"
                    name="description"
                    placeholder="Describe your project"
                    value={project?.description || ""}
                    onChange={(e) => handleProjectChange(index, e)}
                  />
                </div>
              ))}

            </section>


            {/* UPDATE BUTTON */}

            <button
              className="save-resume-btn"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Updating Resume..."
                : "💾 Update Resume"}
            </button>

          </form>

        </div>


        {/* ================================
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

export default EditResume;