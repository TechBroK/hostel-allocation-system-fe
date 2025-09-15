import React, { useEffect } from 'react';
import '../styles/alert.css';

const icons = {
  success: 'bx bx-check-circle',
  error: 'bx bx-error-circle',
  info: 'bx bx-info-circle',
  warning: 'bx bx-error',
};

const Alert = ({ type = 'info', message, open, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className={`alert alert-${type}`}>
      <i className={icons[type] || icons.info}></i>
      <span className="alert-message">{message}</span>
      <button className="alert-close" onClick={onClose} aria-label="Close alert">&times;</button>
    </div>
  );
};

export default Alert;
