import { STATUS_LABELS, TASK_STATUSES } from "../data/mockData";
import { useApp } from "../context/AppContext";
import Avatar from "./Avatar";
import "../styles/TaskCard.css";

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const { currentUser } = useApp();

  // Defensive check in case task data isn't loaded yet
  if (!task) return null;

  // assignedTo is currently a free-text name.
  // Show the logged-in user's uploaded avatar when the names match.
  const isCurrentUser =
    task.assignedTo &&
    currentUser?.name &&
    task.assignedTo.trim().toLowerCase() ===
      currentUser.name.trim().toLowerCase();

  return (
    <div className="task-card" data-status={task.status}>
      <div className="task-card-header">
        <h4 className="task-card__title">{task.title}</h4>

        {task.priority && (
          <span
            className={`task-badge priority-${task.priority.toLowerCase()}`}
          >
            {task.priority}
          </span>
        )}
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__assignee">
        {task.assignedTo ? (
          <>
            <Avatar
              name={task.assignedTo}
              avatarUrl={isCurrentUser ? currentUser.avatarUrl : ""}
              size="sm"
            />
            <span>
              Assigned: <strong>{task.assignedTo}</strong>
            </span>
          </>
        ) : (
          <span className="task-card__unassigned">Unassigned</span>
        )}
      </div>

      <label className="task-card__status-label">
        Status:
        <select
          className="task-card__status-select"
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value)}
          aria-label={`Change status for ${task.title}`}
        >
          {Object.values(TASK_STATUSES).map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>

      <div className="task-card__actions">
        <button
          type="button"
          className="btn btn--small btn--ghost"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          type="button"
          className="btn btn--small btn--danger-outline"
          onClick={() => onDelete(task)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}