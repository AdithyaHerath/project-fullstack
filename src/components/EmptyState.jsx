export default function EmptyState({
  title,
  message,
  isError = false,
}) {
  return (
    <div className={`empty-state ${isError ? "empty-state--error" : ""}`}>
      <h2>{title}</h2>

      {message && <p>{message}</p>}
    </div>
  );
}