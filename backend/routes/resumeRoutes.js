const express = require("express");

const {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All resume routes require login
router.use(authMiddleware);

router.post("/", createResume);

router.get("/", getResumes);

router.get("/:id", getResume);

router.put("/:id", updateResume);

router.delete("/:id", deleteResume);

module.exports = router;