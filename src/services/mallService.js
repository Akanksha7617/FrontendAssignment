import { mockAdapter } from './adapters/mockAdapter';
import { httpAdapter } from './adapters/httpAdapter';
import { getCountryShapes } from './countryShapes';

// Set VITE_USE_MOCK=false in .env to use the real REST API
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const adapter = USE_MOCK ? mockAdapter : httpAdapter;

/**
 * The only data entry point for the UI.
 * Components and hooks call this. They never import malls.json or call fetch.
 */
export const mallService = {
  getCountries: () => adapter.getCountries(),                         // GET /countries
  getMalls: () => adapter.getMalls(),                                 // GET /malls
  getMallsByCountry: (countryId) => adapter.getMallsByCountry(countryId), // GET /countries/{countryId}/malls
  getMallById: (id) => adapter.getMallById(id),                       // GET /malls/{mallId}
  getCountryShapes,                                                   // map borders
};