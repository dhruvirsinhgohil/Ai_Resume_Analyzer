import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token");
    } catch (e) {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") {
        setToken(e.newValue);
      }
      if (e.key === "user") {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch (err) {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (newUser, newToken) => {
    try {
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (e) {
      // ignore
    }

    setToken(newToken);
    setUser(newUser);
  };

  const logout = (redirect = "/login") => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      // ignore
    }

    setToken(null);
    setUser(null);

    if (redirect) navigate(redirect);
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
