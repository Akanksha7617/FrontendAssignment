import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mallService } from '../../services/mallService';
import MallMarker from '../MallMarker';
import './WorldMap.css';

const MARKER_MIN_ZOOM = 5; // show all markers when zoomed in this far

/* Country borders: highlight countries with malls, click to select */
function CountryLayer({ countries, selectedCountryId, onSelectCountry, onNotify, onEmptyCountry }) {
  const map = useMap();
  const [shapes, setShapes] = useState(null);
  const layerRef = useRef(null);
  const latest = useRef({});
  latest.current = { countries, selectedCountryId, onSelectCountry, onNotify, onEmptyCountry };

  useEffect(() => {
    let cancelled = false;
    mallService
      .getCountryShapes()
      .then((d) => !cancelled && setShapes(d))
      .catch(() => latest.current.onNotify('Could not load country borders'));
    return () => { cancelled = true; };
  }, []);

  const styleFor = (feature) => {
    const { countries, selectedCountryId } = latest.current;
    const has = countries.some((c) => c.id === feature.id);
    const selected = feature.id === selectedCountryId;
    return {
      color: has ? '#f97316' : '#94a3b8',
      weight: has ? (selected ? 2.5 : 1.5) : 0.4,
      fillColor: '#f97316',
      fillOpacity: has ? (selected ? 0.12 : 0.1) : 0,
    };
  };

  // re-style when selection / data changes
  useEffect(() => {
    layerRef.current?.setStyle(styleFor);
  }, [shapes, countries, selectedCountryId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onEachFeature = (feature, layer) => {
    layer.bindTooltip(feature.properties.name, { sticky: true });

    layer.on('mouseover', () => {
      const has = latest.current.countries.some((c) => c.id === feature.id);
      layer.setStyle(has ? { fillOpacity: 0.4 } : { fillColor: '#64748b', fillOpacity: 0.15 });
    });
    layer.on('mouseout', () => layerRef.current?.resetStyle(layer));

    layer.on('click', () => {
      const { countries, onSelectCountry, onEmptyCountry } = latest.current;
      const country = countries.find((c) => c.id === feature.id);
      if (country) {
        onSelectCountry(country.id); // also clears any empty message
        map.flyToBounds(layer.getBounds(), { padding: [40, 40], maxZoom: 6, duration: 1.2 });
      } else {
        onEmptyCountry(feature.properties.name);
      }
    });
  };

  if (!shapes) return null;
  return <GeoJSON ref={layerRef} data={shapes} style={styleFor} onEachFeature={onEachFeature} />;
}

/* Markers: only render when country selected or zoomed in enough */
function MarkersLayer({ items, selectedCountryId, selectedMallId, onSelectMall, onCloseMall }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });

  return items
    .filter(
      ({ mall }) =>
        zoom >= MARKER_MIN_ZOOM || mall.countryId === selectedCountryId || mall.id === selectedMallId
    )
    .map(({ mall, status }) => (
      <MallMarker
        key={mall.id}
        mall={mall}
        status={status}
        selected={mall.id === selectedMallId}
        onSelect={onSelectMall}
        onClose={onCloseMall}
      />
    ));
}

function ResetView({ onReset }) {
  const map = useMap();
  return (
    <button
      className="world-map__reset"
      onClick={(e) => {
        e.stopPropagation();
        map.closePopup();
        onReset();
        map.flyTo([20, 30], 2, { duration: 1 });
      }}
    >
      🌍 World view
    </button>
  );
}

/* Fly to the mall chosen from the sidebar / marker */
function FlyToSelected({ mall }) {
  const map = useMap();
  useEffect(() => {
    if (!mall) return;
    const zoom = Math.max(map.getZoom(), 12);
    const offset = Math.min(150, map.getSize().y * 0.25);
    const target = map
      .project([mall.latitude, mall.longitude], zoom)
      .subtract([0, offset]);
    map.flyTo(map.unproject(target, zoom), zoom, { duration: 1.2 });
  }, [mall?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
/* Keeps Leaflet in sync when the layout changes (rotate phone, resize, sidebar moves) */
function ResizeWatcher() {
  const map = useMap();
  useEffect(() => {
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(map.getContainer());
    return () => ro.disconnect();
  }, [map]);
  return null;
}

export default function WorldMap({
  items, countries, selectedCountryId, selectedMallId,
  onSelectCountry, onSelectMall, onCloseMall, onNotify, onEmptyCountry,
}) {
  const selectedMall = items.find(({ mall }) => mall.id === selectedMallId)?.mall;

  return (
    <MapContainer
      className="world-map"
      center={[20, 30]}
      zoom={2}
      minZoom={2}
      maxBounds={[[-85, -180], [85, 180]]}
      maxBoundsViscosity={1}
      worldCopyJump={false}
      zoomControl
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Esri, HERE, Garmin, OpenStreetMap contributors"
        maxZoom={18}
        noWrap
      />
      <CountryLayer
        countries={countries}
        selectedCountryId={selectedCountryId}
        onSelectCountry={onSelectCountry}
        onNotify={onNotify}
        onEmptyCountry={onEmptyCountry}
      />
      <MarkersLayer
        items={items}
        selectedCountryId={selectedCountryId}
        selectedMallId={selectedMallId}
        onSelectMall={onSelectMall}
        onCloseMall={onCloseMall}
      />
      <FlyToSelected mall={selectedMall} />
      <ResizeWatcher />
      <ResetView onReset={() => onSelectCountry(null)} />
    </MapContainer>
  );
}