import { Popup } from 'react-leaflet';
import StatusBadge from '../StatusBadge';
import { FALLBACK_IMG, handleImgError } from '../../utils/imageFallback';
import './MallPopup.css';

const PATHS = {
  directions: 'M3 11l19-9-9 19-2-8-8-2z',
  website:
    'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000-20',
  phone:
    'M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z',
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
const POPUP_WIDTH =
  typeof window !== 'undefined' ? Math.min(340, window.innerWidth - 48) : 340;

export default function MallPopup({ mall, status }) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${mall.latitude},${mall.longitude}`;

  return (
    <Popup className="mall-popup" minWidth={POPUP_WIDTH} maxWidth={POPUP_WIDTH} autoPanPadding={[24, 24]}>
      <article className="popup">
        <header className="popup__header">
          <h3>{mall.name}</h3>
        </header>

        <div className="popup__content">
          <div className="popup__info">
            <p className="popup__city">{mall.city}, {mall.country}</p>
            {mall.address && <p className="popup__address">{mall.address}</p>}
            <p className="popup__hours">
              Today's hours
              <strong>{status.hoursLabel}</strong>
            </p>
            {status.localTime && <p className="popup__muted">Local time: {status.localTime}</p>}
            <StatusBadge status={status.status} className="popup__badge" />
          </div>

          <img
            className="popup__img"
            src={mall.image || FALLBACK_IMG}
            alt={mall.name}
            loading="lazy"
            onError={handleImgError}
          />
        </div>

        <footer className="popup__bar">
          <a href={directions} target="_blank" rel="noreferrer">
            <Icon name="directions" /> Directions
          </a>
          {mall.website && (
            <a href={mall.website} target="_blank" rel="noreferrer">
              <Icon name="website" /> Website
            </a>
          )}
          {mall.phone && (
            <a href={`tel:${mall.phone}`}>
              <Icon name="phone" /> Call
            </a>
          )}
        </footer>
      </article>
    </Popup>
  );
}