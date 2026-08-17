import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function ResumePreview({ resume }) {
  const downloadPdf = async () => {
    try {
      const element = document.getElementById("resume-preview");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // If content is longer than one page, split into pages
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);

      // If content height exceeds a single page, add more pages
      const pageHeight = pdf.internal.pageSize.getHeight();
      if (pdfHeight > pageHeight) {
        let remainingHeight = pdfHeight - pageHeight;
        while (remainingHeight > 0) {
          position = -(pageHeight * (Math.ceil((pdfHeight - remainingHeight) / pageHeight)));
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
          remainingHeight -= pageHeight;
        }
      }

      const fileName = `${(resume?.personalInfo?.fullName || "resume").replace(/\s+/g, "_")}.pdf`;
      pdf.save(fileName);
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