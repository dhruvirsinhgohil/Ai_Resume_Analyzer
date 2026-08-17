const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    personalInfo: {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
      address: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      github: {
        type: String,
      },
      portfolio: {
        type: String,
      },
      photo: {
        type: String,
      },
    },

    summary: {
      type: String,
      default: "",
    },

    education: [
      {
        degree: {
          type: String,
        },
        institution: {
          type: String,
        },
        startYear: {
          type: String,
        },
        endYear: {
          type: String,
        },
        grade: {
          type: String,
        },
      },
    ],

    skills: [
      {
        type: String,
      },
    ],

    experience: [
      {
        company: {
          type: String,
        },
        position: {
          type: String,
        },
        startDate: {
          type: String,
        },
        endDate: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],

    projects: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        technologies: [
          {
            type: String,
          },
        ],
        githubLink: {
          type: String,
        },
        liveLink: {
          type: String,
        },
      },
    ],

    certifications: [
      {
        name: {
          type: String,
        },
        organization: {
          type: String,
        },
        year: {
          type: String,
        },
      },
    ],

    achievements: [
      {
        type: String,
      },
    ],

    languages: [
      {
        type: String,
      },
    ],

    // AI Analysis
    aiScore: {
      overallScore: {
        type: Number,
        default: 0,
      },

      atsScore: {
        type: Number,
        default: 0,
      },

      skillsScore: {
        type: Number,
        default: 0,
      },

      experienceScore: {
        type: Number,
        default: 0,
      },

      projectScore: {
        type: Number,
        default: 0,
      },

      educationScore: {
        type: Number,
        default: 0,
      },

      summaryScore: {
        type: Number,
        default: 0,
      },
    },

    aiSuggestions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);