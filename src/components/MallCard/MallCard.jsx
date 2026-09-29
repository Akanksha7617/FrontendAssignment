import { memo } from 'react';
import StatusBadge from '../StatusBadge';
import { FALLBACK_IMG, handleImgError } from '../../utils/imageFallback';
import './MallCard.css';

function MallCard({ mall, status, selected, onSelect }) {
  // Defensive handling for missing mall data
  const mallName = mall?.name || 'Unknown Mall';
  const city = mall?.city || '';
  const country = mall?.country || '';
  const mallId = mall?.id;

  return (
    <button
      className={selected ? 'mall-card mall-card--selected' : 'mall-card'}
      onClick={() => onSelect(mallId)}
      aria-pressed={selected}
      aria-label={`${mallName}, ${city}${city && country ? ', ' : ''}${country}, ${status?.status || 'UNKNOWN'} status`}
    >
      <img
        src={mall?.image || FALLBACK_IMG}
        alt={`${mallName} exterior`}
        loading="lazy"
        width="84"
        height="84"
        onError={handleImgError}
      />
      <span className="mall-card__body">
        <strong>{mallName}</strong>
        <small>{city}{city && country ? ', ' : ''}{country}</small>
        <small>{status?.hoursLabel || 'Hours unavailable'}</small>
        <StatusBadge status={status?.status || 'UNKNOWN'} />
      </span>
    </button>
  );
}

export default memo(MallCard);