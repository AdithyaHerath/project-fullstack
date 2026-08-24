import React from 'react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  // Defensive check in case task data isn't loaded yet
  if (!task) return null;

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-badge priority-${task.priority?.toLowerCase()}`}>
          {task.priority}
        </span>
      </div>
      
      <p className="task-description">{task.description}</p>

      <div className="task-card-footer">
        {/* Status control for moving tasks between columns */}
        <select
          className="task-status-select"
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>

        <div className="task-actions">
          <button onClick={() => onEdit(task)} className="btn-edit">
            Edit
          </button>
          <button onClick={() => onDelete(task.id)} className="btn-delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;