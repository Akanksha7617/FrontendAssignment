import { memo, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Marker, Tooltip } from 'react-leaflet';
import MallPopup from '../MallPopup';
import './MallMarker.css';

const makeIcon = (cls) =>
  L.divIcon({
    className: 'mall-pin-wrap',
    html: `<span class="mall-pin mall-pin--${cls}"><span class="mall-pin__dot"></span></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });

// Created once, reused by every marker (performance)
const ICONS = {
  OPEN: makeIcon('open'),
  CLOSED: makeIcon('closed'),
  UNKNOWN: makeIcon('unknown'),
};

function MallMarker({ mall, status, selected, onSelect, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (selected) {
      ref.current?.openPopup();
    }
  }, [selected]);

  // Invalid coordinates: skip marker instead of crashing
  if (
    !Number.isFinite(mall.latitude) ||
    !Number.isFinite(mall.longitude)
  ) {
    return null;
  }

  // Fallback to UNKNOWN if status is missing/invalid
  const markerStatus = ICONS[status?.status] ? status.status : 'UNKNOWN';

  return (
    <Marker
      ref={ref}
      position={[mall.latitude, mall.longitude]}
      icon={ICONS[markerStatus]}
      eventHandlers={{
        click: () => onSelect(mall.id),
        popupclose: () => onClose(mall.id),
      }}
    >
      <Tooltip direction="top" offset={[0, -14]}>
        {mall.name} · {markerStatus}
      </Tooltip>

      <MallPopup
        mall={mall}
        status={status}
      />
    </Marker>
  );
}

export default memo(MallMarker);