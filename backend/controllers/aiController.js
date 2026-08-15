const Resume = require("../models/Resume");

const {
  analyzeResumeWithAI,
  improveResumeSection,
  isAIConfigured,
} = require("../services/openaiService");

// Analyze Resume
const analyzeResume = async (req, res) => {
  try {
  if (!isAIConfigured()) {
    return res.status(503).json({
      success: false,
      message: "AI service is not configured. Add GEMINI_API_KEY to your .env file.",
    });
  }

  const resume = await Resume.findOne({
    _id: req.params.resumeId,
    user: req.user.id,
  });

  if (!resume) {
    return res.status(404).json({
      success: false,
      message: "Resume not found",
    });
  }

  const analysis = await analyzeResumeWithAI(resume);

    resume.aiScore = {
      overallScore: analysis.overallScore,
      atsScore: analysis.atsScore,
      skillsScore: analysis.skillsScore,
      experienceScore: analysis.experienceScore,
      projectScore: analysis.projectScore,
      educationScore: analysis.educationScore,
      summaryScore: analysis.summaryScore,
    };

    resume.aiSuggestions = analysis.suggestions;

    await resume.save();

    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: {
        score: analysis,
      },
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Improve Resume Section
const improveSection = async (req, res) => {
  try {
  if (!isAIConfigured()) {
    return res.status(503).json({
      success: false,
      message: "AI service is not configured. Add GEMINI_API_KEY to your .env file.",
    });
  }

  const { section, content, jobRole } = req.body;

  if (!section || !content) {
    return res.status(400).json({
      success: false,
      message: "Section and content are required",
    });
  }

  const improvedContent = await improveResumeSection(
    section,
    content,
    jobRole
  );

    res.status(200).json({
      success: true,
      message: "Resume section improved successfully",
      data: {
        section,
        originalContent: content,
        improvedContent,
      },
    });
  } catch (error) {
    console.error("AI Improvement Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get AI Analysis
const getAIAnalysis = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      user: req.user.id,
    }).select(
      "aiScore aiSuggestions personalInfo.fullName"
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        resumeName: resume.personalInfo?.fullName || "",
        aiScore: resume.aiScore,
        suggestions: resume.aiSuggestions,
      },
    });
  } catch (error) {
    console.error("Get AI Analysis Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// IMPORTANT
module.exports = {
  analyzeResume,
  improveSection,
  getAIAnalysis
};