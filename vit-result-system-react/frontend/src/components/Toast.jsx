import { useEffect } from 'react';

export default function Toast({ toasts, onRemove }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className={`toast ${toast.type}`}>
      <div className="toast-icon-circle">
        {toast.type === 'success' ? '✓' : '✕'}
      </div>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}
