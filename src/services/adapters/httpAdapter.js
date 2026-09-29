const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const TIMEOUT_MS = 10000;

async function http(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return await res.json();
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('The request timed out.');
    if (e instanceof TypeError) throw new Error('Network error. Check your connection.');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export const httpAdapter = {
  getCountries: () => http('/countries'),
  getMalls: () => http('/malls'),
  getMallsByCountry: (countryId) => http(`/countries/${encodeURIComponent(countryId)}/malls`),
  getMallById: (id) => http(`/malls/${encodeURIComponent(id)}`),
};