const API_URL = "https://ai-resume-analyzer-8s36.onrender.com/api";

const defaultJsonHeaders = () => ({
  "Content-Type": "application/json",
});

const authHeaders = (token) => {
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: defaultJsonHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Network error" };
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: defaultJsonHeaders(),
      body: JSON.stringify(loginData),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      return {
        success: false,
        message:
          (data && (data.message || data.error)) ||
          `Request failed with status ${response.status}`,
      };
    }

    return data;
  } catch (err) {
    return {
      success: false,
      message: err.message || "Network error",
    };
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getResumes = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/resume`, {
    headers: {
      ...authHeaders(token),
    },
  });

  return response.json();
};

export const createResume = async (resumeData) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/resume`, {
    method: "POST",
    headers: {
      ...defaultJsonHeaders(),
      ...authHeaders(token),
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
        ...authHeaders(token),
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
        ...authHeaders(token),
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
      ...defaultJsonHeaders(),
      ...authHeaders(token),
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
        ...authHeaders(token),
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
        ...defaultJsonHeaders(),

        ...authHeaders(token),
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
        ...authHeaders(token),
      },
    }
  );

  return response.json();
};
