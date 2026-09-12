import { STATUS_LABELS, TASK_STATUSES } from "../data/mockData";
import { useApp } from "../context/AppContext";
import Avatar from "./Avatar";
import "../styles/TaskCard.css";

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const { currentUser } = useApp();

  // assignedTo is just a free-text name (Stage 2 has no user directory yet),
  // so we can only show a real uploaded photo when it happens to match the
  // logged-in user. Everyone else still gets a consistent initials avatar.
  const isCurrentUser =
    task.assignedTo && currentUser?.name && task.assignedTo.trim().toLowerCase() === currentUser.name.trim().toLowerCase();

  return (
    <div className="task-card" data-status={task.status}>
      <h4 className="task-card__title">{task.title}</h4>
      {task.description && <p className="task-card__description">{task.description}</p>}

      <div className="task-card__assignee">
        {task.assignedTo ? (
          <>
            <Avatar name={task.assignedTo} avatarUrl={isCurrentUser ? currentUser.avatarUrl : ""} size="sm" />
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
        <button type="button" className="btn btn--small btn--ghost" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="btn btn--small btn--danger-outline" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </div>
  );
}
