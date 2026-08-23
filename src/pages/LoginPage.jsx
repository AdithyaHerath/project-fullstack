import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { mockCredentials } from "../data/mockData";
import AuthAside from "../components/AuthAside";
import "../styles/AuthPages.css";

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "Email is required."; //email
    if (!password) nextErrors.password = "Password is required.";//password
    return nextErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <AuthAside />
      <div className="auth-page__form-side">
        <div className="auth-card">
          <p className="auth-card__eyebrow">Welcome back</p>
          <h1 className="auth-card__title">Log in to your workspace</h1>
          <p className="auth-card__subtitle">Enter your details to access your boards.</p>

          <p className="auth-card__mock-note">
            🔒 Temporary mock authentication for Stage 1. Use{" "}
            <strong>{mockCredentials.email}</strong> / <strong>{mockCredentials.password}</strong>.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "login-email-error" : undefined}
              />
              {errors.email && (
                <span id="login-email-error" className="form-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "login-password-error" : undefined}
              />
              {errors.password && (
                <span id="login-password-error" className="form-error" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            {formError && (
              <p className="form-error form-error--global" role="alert">
                {formError}
              </p>
            )}

            <button type="submit" className="btn btn--primary btn--full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login" /*logging button*/}
            </button>
          </form>

          <p className="auth-card__footer">
            Don't have an account? <Link to="/register">Go to Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
