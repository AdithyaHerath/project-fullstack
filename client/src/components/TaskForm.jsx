import { useState } from "react";
import { STATUS_LABELS, TASK_STATUSES } from "../data/mockData";
import "../styles/TaskForm.css";

export default function TaskForm({ initialTask, onSubmit, onCancel, submitLabel = "Save Task" }) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [status, setStatus] = useState(initialTask?.status || TASK_STATUSES.TODO);
  const [assignedTo, setAssignedTo] = useState(initialTask?.assignedTo || "");
  const [errors, setErrors] = useState({});

  function validate() {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (!status) nextErrors.status = "Status is required.";
    return nextErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      assignedTo: assignedTo.trim(),
    });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "task-title-error" : undefined}
        />
        {errors.title && (
          <span id="task-title-error" className="form-error" role="alert">
            {errors.title}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-field">
        <label htmlFor="task-status">Status</label>
        <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value)}>
          {Object.values(TASK_STATUSES).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        {errors.status && (
          <span className="form-error" role="alert">
            {errors.status}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="task-assignee">Assignee</label>
        <input
          id="task-assignee"
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Optional"
        />
      </div>

      <div className="modal__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
