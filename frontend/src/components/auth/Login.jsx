import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api_new";
import "../../styles/auth.css";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await loginUser(login);

      if (!result.success) {
        setError(result.message);
        return;
      }

      // Persist login using context (which also writes to localStorage)
      if (authLogin) {
        authLogin(result.user, result.token);
      } else {
        try {
          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(result.user));
        } catch (e) {}
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={login.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={login.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;