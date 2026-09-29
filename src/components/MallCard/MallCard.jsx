import { memo } from 'react';
import StatusBadge from '../StatusBadge';
import { FALLBACK_IMG, handleImgError } from '../../utils/imageFallback';
import './MallCard.css';

function MallCard({ mall, status, selected, onSelect }) {
  return (
    <button
      className={selected ? 'mall-card mall-card--selected' : 'mall-card'}
      onClick={() => onSelect(mall.id)}
    >
      <img src={mall.image || FALLBACK_IMG} alt="" loading="lazy" onError={handleImgError} />
      <span className="mall-card__body">
        <strong>{mall.name}</strong>
        <small>{mall.city}, {mall.country}</small>
        <small>{status.hoursLabel}</small>
        <StatusBadge status={status.status} />
      </span>
    </button>
  );
}

export default memo(MallCard);