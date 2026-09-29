import { memo } from 'react';
import './ErrorState.css';

function ErrorState({
  title = 'Unable to load Phoenix Malls.',
  hint = 'Please try again.',
  message,
  onRetry,
}) {
  return (
    <div className="error-state" role="alert">
      <span className="error-state__icon" aria-hidden="true">⚠️</span>
      <h2>{title}</h2>
      <p>{hint}</p>
      {message && <small className="error-state__detail">{message}</small>}
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}

export default memo(ErrorState);