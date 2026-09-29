const SHAPES_URL =
  'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';

let shapesPromise = null; // cached so borders download only once

export function getCountryShapes() {
  if (!shapesPromise) {
    shapesPromise = fetch(SHAPES_URL).then((r) => {
      if (!r.ok) throw new Error('Could not load borders');
      return r.json();
    });
    shapesPromise.catch(() => (shapesPromise = null)); // allow retry after failure
  }
  return shapesPromise;
}