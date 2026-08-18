function ResumePreview({ resume }) {
  const downloadPdf = async () => {
    try {
      const element = document.getElementById("resume-preview");
      if (!element) return;

      // Open a new window and write the resume HTML into it with styles preserved
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Popup blocked. Please allow popups for this site to download the PDF.");
        return;
      }

      // Clone the element and remove UI controls that shouldn't appear in the printed PDF
      const clone = element.cloneNode(true);
      clone.querySelectorAll('.download-btn').forEach((el) => el.remove());

      // Collect existing stylesheet links and inline styles to preserve styles in the print window
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map((n) => n.outerHTML)
        .join('\n');

      // Add a small print-specific style to force A4 sizing and margins and hide any leftover UI
      const printStyle = `
        <style>
          @page { size: A4; margin: 18mm; }
          body { margin: 0; font-family: Arial, Helvetica, sans-serif; }
          .resume-preview, .resume-pdf { width: 210mm; min-height: 297mm; box-sizing: border-box; }
          .download-btn { display: none !important; }
        </style>
      `;

      printWindow.document.write(`
        <html>
          <head>
            <title>Resume</title>
            ${styles}
            ${printStyle}
          </head>
          <body>
            ${clone.outerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      // Give the new window some time to load styles, then trigger print dialog
      setTimeout(() => {
        printWindow.print();
        // Optionally close the window after printing (commented out to let user save manually)
        // printWindow.close();
      }, 500);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Unable to generate PDF");
    }
  };

  return (
    <div className="resume-preview" id="resume-preview">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button className="download-btn" onClick={downloadPdf}>
          ⤓ Download PDF
        </button>
      </div>

      {/* Header */}
      <div className="preview-header">

        {resume.personalInfo?.photo && (
          <img
            src={resume.personalInfo.photo}
            alt="Profile"
            className="avatar"
          />
        )}

        <h1>
          {resume.personalInfo.fullName ||
            "Your Name"}
        </h1>

        <p>
          {resume.personalInfo.email ||
            "email@example.com"}
        </p>

        <p>
          {resume.personalInfo.phone &&
            `${resume.personalInfo.phone} | `}

          {resume.personalInfo.location}
        </p>

        <div className="preview-links">

          {resume.personalInfo.linkedin && (
            <a
              href={resume.personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          )}

          {resume.personalInfo.github && (
            <a
              href={resume.personalInfo.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}

        </div>

      </div>


      {/* Summary */}

      {resume.summary && (
        <section className="preview-section">

          <h2>Professional Summary</h2>

          <p>
            {resume.summary}
          </p>

        </section>
      )}


      {/* Skills */}

      {resume.skills.length > 0 && (
        <section className="preview-section">

          <h2>Skills</h2>

          <div className="preview-skills">

            {resume.skills.map(
              (skill, index) => (
                <span key={index}>
                  {skill}
                </span>
              )
            )}

          </div>

        </section>
      )}


      {/* Experience */}

      {resume.experience.some(
        (item) =>
          item.company ||
          item.position ||
          item.description
      ) && (
        <section className="preview-section">

          <h2>Experience</h2>

          {resume.experience.map(
            (experience, index) => {

              if (
                !experience.company &&
                !experience.position &&
                !experience.description
              ) {
                return null;
              }

              return (
                <div
                  className="preview-item"
                  key={index}
                >

                  <div className="item-header">

                    <div>
                      <h3>
                        {experience.position}
                      </h3>

                      <strong>
                        {experience.company}
                      </strong>
                    </div>

                    <span>
                      {experience.startDate}
                      {experience.startDate &&
                        experience.endDate &&
                        " - "}
                      {experience.endDate}
                    </span>

                  </div>

                  <p>
                    {experience.description}
                  </p>

                </div>
              );
            }
          )}

        </section>
      )}


      {/* Projects */}

      {resume.projects.some(
        (project) =>
          project.name ||
          project.title ||
          project.description
      ) && (
        <section className="preview-section">

          <h2>Projects</h2>

          {resume.projects.map(
            (project, index) => {
              const projectName = project.name || project.title || `Project ${index + 1}`;

              if (
                !project.name &&
                !project.title &&
                !project.description
              ) {
                return null;
              }

              return (
                <div
                  className="preview-item"
                  key={index}
                >

                  <h3>
                    {projectName}
                  </h3>

                  {project.technologies && (
                    <p className="technologies">
                      <strong>
                        Technologies:
                      </strong>{" "}
                      {Array.isArray(project.technologies)
                        ? project.technologies.join(", ")
                        : project.technologies}
                    </p>
                  )}

                  <p>
                    {project.description}
                  </p>

                </div>
              );
            }
          )}

        </section>
      )}


      {/* Education */}

      {resume.education.some(
        (education) =>
          education.degree ||
          education.university
      ) && (
        <section className="preview-section">

          <h2>Education</h2>

          {resume.education.map(
            (education, index) => {

              if (
                !education.degree &&
                !education.university
              ) {
                return null;
              }

              return (
                <div
                  className="preview-item"
                  key={index}
                >

                  <div className="item-header">

                    <div>

                      <h3>
                        {education.degree}
                      </h3>

                      <strong>
                        {education.university}
                      </strong>

                    </div>

                    <span>
                      {education.startYear}
                      {education.startYear &&
                        education.endYear &&
                        " - "}
                      {education.endYear}
                    </span>

                  </div>

                </div>
              );
            }
          )}

        </section>
      )}

    </div>
  );
}

export default ResumePreview;