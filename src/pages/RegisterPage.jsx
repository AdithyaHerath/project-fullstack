import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { isValidEmail } from "../utils/taskHelpers";
import AuthAside from "../components/AuthAside";
import "../styles/AuthPages.css";

const MIN_PASSWORD_LENGTH = 8;

export default function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required.";//name
    if (!email.trim()) {
      nextErrors.email = "Email is required.";//email
    } else if (!isValidEmail(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";//password
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    return nextErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      setSuccessMessage("Account created. Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setFormError(err.message || "Unable to register right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <AuthAside />
      <div className="auth-page__form-side">
        <div className="auth-card">
          <p className="auth-card__eyebrow">Get started</p>
          <h1 className="auth-card__title">Create your account</h1>
          <p className="auth-card__subtitle">Set up your workspace in a few seconds.</p>

          <p className="auth-card__mock-note">
            🔒 Stage 1 mock registration. No account is actually created on a server yet.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="register-name">Name</label>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <span className="form-error" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <span className="form-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password && (
                <span className="form-error" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="register-confirm-password">Confirm Password</label>
              <input
                id="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={Boolean(errors.confirmPassword)}
              />
              {errors.confirmPassword && (
                <span className="form-error" role="alert">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {formError && (
              <p className="form-error form-error--global" role="alert">
                {formError}
              </p>
            )}
            {successMessage && (
              <p className="form-success" role="status">
                {successMessage}
              </p>
            )}

            <button type="submit" className="btn btn--primary btn--full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="auth-card__footer">
            Already have an account? <Link to="/login">Go to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
