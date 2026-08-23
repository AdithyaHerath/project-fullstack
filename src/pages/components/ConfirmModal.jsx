import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container confirm-modal">
        <div className="modal-header">
          <h2>{title || 'Confirm Action'}</h2>
          <button onClick={onClose} className="btn-close-icon" aria-label="Close">
            &times;
          </button>
        </div>
        
        <div className="modal-content">
          <p>{message || 'Are you sure you want to proceed? This action cannot be undone.'}</p>
        </div>
        
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="btn-danger"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;