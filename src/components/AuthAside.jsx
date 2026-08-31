export default function AuthAside() {
  return (
    <aside className="auth-page__aside">
      <div className="auth-page__aside-brand">
        <span className="auth-page__aside-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="6" height="16" rx="1.5" fill="white" fillOpacity="0.95" />
            <rect x="10.5" y="4" width="6" height="10" rx="1.5" fill="white" fillOpacity="0.7" />
            <rect x="18" y="4" width="3" height="13" rx="1.5" fill="white" fillOpacity="0.5" />
          </svg>
        </span>
        CollabBoard
      </div>

      <div className="auth-page__aside-copy">
        <h2>Plan, track, and ship work together.</h2>
        <p>
          Organize projects into boards, move tasks across To Do, Doing, and Done, and keep your
          whole team aligned in one shared workspace.
        </p>

        <div className="auth-page__board-preview" aria-hidden="true">
          <div className="auth-page__preview-col">
            <div className="auth-page__preview-chip" />
            <div className="auth-page__preview-chip" />
          </div>
          <div className="auth-page__preview-col">
            <div className="auth-page__preview-chip" />
          </div>
          <div className="auth-page__preview-col">
            <div className="auth-page__preview-chip" />
            <div className="auth-page__preview-chip" />
          </div>
        </div>
      </div>

      <span />
    </aside>
  );
}
