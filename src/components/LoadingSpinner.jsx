export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="loading-spinner__circle" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}