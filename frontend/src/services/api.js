const API_URL = "https://ai-resume-analyzer-8s36.onrender.com/api";

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return response.json();
};

export const loginUser = async (loginData) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  return response.json();
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getResumes = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/resume`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const createResume = async (resumeData) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(resumeData),
  });

  return response.json();
};

export const analyzeResume = async (resumeId) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/ai/analyze/${resumeId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const getAIAnalysis = async (resumeId) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/ai/analysis/${resumeId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const improveResume = async (
  section,
  content,
  jobRole
) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/ai/improve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      section,
      content,
      jobRole,
    }),
  });

  return response.json();
};
export const getResumeById = async (resumeId) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/resume/${resumeId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};


export const updateResume = async (
  resumeId,
  resumeData
) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/resume/${resumeId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(resumeData),
    }
  );

  return response.json();
};


export const deleteResume = async (
  resumeId
) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/resume/${resumeId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};