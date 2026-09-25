import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <button
          type="button"
          className="navbar__brand"
          onClick={() => navigate("/dashboard")}
        >
          <span className="navbar__mark" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="4"
                width="6"
                height="16"
                rx="1.5"
                fill="currentColor"
              />
              <rect
                x="10.5"
                y="4"
                width="6"
                height="10"
                rx="1.5"
                fill="currentColor"
                opacity="0.7"
              />
              <rect
                x="18"
                y="4"
                width="3"
                height="13"
                rx="1.5"
                fill="currentColor"
                opacity="0.5"
              />
            </svg>
          </span>

          CollabBoard
        </button>

        <div className="navbar__right">
          {currentUser && (
            <span className="navbar__user">
              {currentUser.name}
            </span>
          )}

          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}