import { memo } from 'react';
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

const Icon = memo(function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
});
const POPUP_WIDTH =
  typeof window !== 'undefined' ? Math.min(340, window.innerWidth - 48) : 340;

const MallPopup = memo(function MallPopup({ mall, status }) {
  // Defensive handling for missing mall data
  const mallName = mall?.name || 'Unknown Mall';
  const city = mall?.city || '';
  const country = mall?.country || '';
  const address = mall?.address;
  const website = mall?.website;
  const phone = mall?.phone;
  const latitude = mall?.latitude;
  const longitude = mall?.longitude;

  // Skip directions link if coordinates are invalid
  const hasValidCoords = Number.isFinite(latitude) && Number.isFinite(longitude);
  const directions = hasValidCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : null;

  return (
    <Popup className="mall-popup" minWidth={POPUP_WIDTH} maxWidth={POPUP_WIDTH} autoPanPadding={[24, 24]}>
      <article className="popup">
        <header className="popup__header">
          <h3>{mallName}</h3>
        </header>

        <div className="popup__content">
          <div className="popup__info">
            <p className="popup__city">{city}{city && country ? ', ' : ''}{country}</p>
            {address && <p className="popup__address">{address}</p>}
            <p className="popup__hours">
              Today's hours
              <strong>{status?.hoursLabel || 'Hours unavailable'}</strong>
            </p>
            {status?.localTime && <p className="popup__muted">Local time: {status.localTime}</p>}
            <StatusBadge status={status?.status || 'UNKNOWN'} className="popup__badge" />
          </div>

          <img
            className="popup__img"
            src={mall?.image || FALLBACK_IMG}
            alt={mallName}
            loading="lazy"
            width="110"
            height="110"
            onError={handleImgError}
          />
        </div>

        <footer className="popup__bar">
          {directions && (
            <a href={directions} target="_blank" rel="noreferrer">
              <Icon name="directions" /> Directions
            </a>
          )}
          {website && (
            <a href={website} target="_blank" rel="noreferrer">
              <Icon name="website" /> Website
            </a>
          )}
          {phone && (
            <a href={`tel:${phone}`}>
              <Icon name="phone" /> Call
            </a>
          )}
          {!directions && !website && !phone && (
            <span className="popup__no-actions">No contact info available</span>
          )}
        </footer>
      </article>
    </Popup>
  );
});

export default MallPopup;