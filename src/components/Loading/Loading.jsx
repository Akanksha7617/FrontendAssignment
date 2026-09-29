import { memo } from 'react';
import './Loading.css';

function Loading({ label = 'Loading Phoenix Malls…' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading__spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export default memo(Loading);