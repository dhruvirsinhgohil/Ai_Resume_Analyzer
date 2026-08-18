import "./ResumePDF.css";

function ResumePDF({ resume }) {
  const personal =
    resume?.personalInfo || {};

  return (
    <div className="resume-pdf">

      <header className="pdf-header">

        <h1>
          {personal.fullName ||
            "Your Name"}
        </h1>

        <div className="contact-info">

          {personal.email && (
            <span>
              {personal.email}
            </span>
          )}

          {personal.phone && (
            <span>
              {personal.phone}
            </span>
          )}

          {personal.location && (
            <span>
              {personal.location}
            </span>
          )}

        </div>

        <div className="links">

          {personal.linkedin && (
            <a href={personal.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}

          {personal.github && (
            <a href={personal.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}

        </div>

      </header>


      {/* SUMMARY */}

      {resume.summary && (
        <section>

          <h2>
            PROFESSIONAL SUMMARY
          </h2>

          <p>
            {resume.summary}
          </p>

        </section>
      )}


      {/* SKILLS */}

      {resume.skills?.length > 0 && (
        <section>

          <h2>
            SKILLS
          </h2>

          <p>
            {resume.skills.join(" • ")}
          </p>

        </section>
      )}


      {/* EXPERIENCE */}

      {resume.experience?.length > 0 && (
        <section>

          <h2>
            EXPERIENCE
          </h2>

          {resume.experience.map(
            (experience, index) => (

              <div
                className="resume-item"
                key={index}
              >

                <div className="item-header">

                  <strong>
                    {experience.position}
                  </strong>

                  <span>
                    {experience.startDate}
                    {" - "}
                    {experience.endDate}
                  </span>

                </div>

                <p className="company">
                  {experience.company}
                </p>

                <p>
                  {experience.description}
                </p>

              </div>
            )
          )}

        </section>
      )}


      {/* PROJECTS */}

      {resume.projects?.length > 0 && (
        <section>

          <h2>
            PROJECTS
          </h2>

          {resume.projects.map(
            (project, index) => (

              <div
                className="resume-item"
                key={index}
              >

                <strong>
                  {project.name}
                </strong>

                {project.technologies && (
                  <p className="technologies">
                    Technologies:{" "}
                    {project.technologies}
                  </p>
                )}

                <p>
                  {project.description}
                </p>

              </div>
            )
          )}

        </section>
      )}


      {/* EDUCATION */}

      {resume.education?.length > 0 && (
        <section>

          <h2>
            EDUCATION
          </h2>

          {resume.education.map(
            (education, index) => (

              <div
                className="resume-item"
                key={index}
              >

                <div className="item-header">

                  <strong>
                    {education.degree}
                  </strong>

                  <span>
                    {education.startYear}
                    {" - "}
                    {education.endYear}
                  </span>

                </div>

                <p>
                  {education.university}
                </p>

              </div>
            )
          )}

        </section>
      )}

    </div>
  );
}

export default ResumePDF;