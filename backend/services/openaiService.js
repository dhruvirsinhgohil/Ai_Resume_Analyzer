const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

const isAIConfigured = () => Boolean(apiKey);

const getAIClient = () => {
  if (!apiKey) {
    return null;
  }

  return new GoogleGenAI({ apiKey });
};

const analyzeResumeWithAI = async (resume) => {
  const ai = getAIClient();

  if (!ai) {
    throw new Error("GEMINI_API_KEY is missing from .env");
  }
  const prompt = `
You are an expert resume and ATS analyzer.

Analyze this resume:

${JSON.stringify(resume, null, 2)}

Give scores from 0 to 100 for:

- ATS compatibility
- Skills
- Experience
- Projects
- Education
- Professional Summary

Return ONLY valid JSON:

{
  "overallScore": 0,
  "atsScore": 0,
  "skillsScore": 0,
  "experienceScore": 0,
  "projectScore": 0,
  "educationScore": 0,
  "summaryScore": 0,
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3",
    "suggestion 4",
    "suggestion 5"
  ]
}

All scores must be numbers between 0 and 100.
Do not return markdown.
Return JSON only.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = response.text;

  console.log("Gemini Response:", text);
  console.log(response);
  
  const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanText);
};
const improveResumeSection = async (section, content, jobRole = "") => {
const ai = getAIClient();

if (!ai) {
  throw new Error("GEMINI_API_KEY is missing from .env");
}

const prompt = `
You are a professional resume writer and ATS optimization expert.
  
Improve the following resume section.
  
Section:
${section}
  
Current Content:
${content}
  
Target Job Role:
${jobRole || "Not specified"}
  
Requirements:
- Make it professional.
- Make it clear and concise.
- Make it ATS friendly.
- Use strong action verbs.
- Do not add fake information.
- Do not invent experience, skills, achievements, or numbers.
- Keep the information based only on the provided content.
- Return only the improved text.
`;

const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: prompt,
});

return response.text.trim();
};

module.exports = {
analyzeResumeWithAI,
improveResumeSection,
isAIConfigured,
};