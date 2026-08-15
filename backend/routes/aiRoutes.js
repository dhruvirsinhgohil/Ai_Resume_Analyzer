const express = require("express");

const {
  analyzeResume,
  improveSection,
  getAIAnalysis,
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Analyze resume
router.post(
  "/analyze/:resumeId",
  authMiddleware,
  analyzeResume
);

// Improve resume section
router.post(
  "/improve",
  authMiddleware,
  improveSection
);

// Get saved AI analysis
router.get(
  "/analysis/:resumeId",
  authMiddleware,
  getAIAnalysis
);

module.exports = router;