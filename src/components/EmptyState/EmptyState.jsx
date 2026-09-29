import { memo } from 'react';
import './EmptyState.css';

function EmptyState({ title, message, icon = '🏬', onDismiss, floating = false }) {
  return (
    <div className={floating ? 'empty-state empty-state--floating' : 'empty-state'} role="status" aria-live="polite">
      <span className="empty-state__icon" aria-hidden="true">{icon}</span>
      <div className="empty-state__text">
        <strong>{title}</strong>
        {message && <p>{message}</p>}
      </div>
      {onDismiss && (
        <button
          className="empty-state__close"
          onClick={onDismiss}
          aria-label="Dismiss message"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default memo(EmptyState);