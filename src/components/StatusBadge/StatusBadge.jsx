import './StatusBadge.css';

const LABELS = { OPEN: 'OPEN · LIVE', CLOSED: 'CLOSED', UNKNOWN: 'UNKNOWN' };

export default function StatusBadge({ status, className = '' }) {
  return (
    <span role="status" className={`badge badge--${status.toLowerCase()} ${className}`}>
      <span className="badge__dot" aria-hidden="true" />
      {LABELS[status] ?? LABELS.UNKNOWN}
    </span>
  );
}