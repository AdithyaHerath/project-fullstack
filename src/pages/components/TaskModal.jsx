import React from 'react';
import TaskForm from './TaskForm';

const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="btn-close-icon" aria-label="Close">
            &times;
          </button>
        </div>
        
        <div className="modal-content">
          <TaskForm
            initialData={task}
            onSubmit={(data) => {
              onSave(data);
              onClose(); // Automatically close modal after saving
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskModal;