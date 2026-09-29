import data from '../../data/malls.json';

const FORCE_ERROR = import.meta.env.VITE_FORCE_ERROR === 'true';
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Copy the data, like a real network response, so the UI can't change the JSON
const clone = (v) => structuredClone(v);

async function simulate(ms) {
  await delay(ms);
  if (FORCE_ERROR) throw new Error('Simulated server error (503)');
}

export const mockAdapter = {
  // GET /countries
  async getCountries() {
    await simulate(300);
    return clone(data.countries);
  },

  // GET /malls
  async getMalls() {
    await simulate(300);
    return clone(data.malls);
  },

  // GET /countries/{countryId}/malls
  async getMallsByCountry(countryId) {
    await simulate(200);
    return clone(data.malls.filter((m) => m.countryId === countryId));
  },

  // GET /malls/{mallId}
  async getMallById(id) {
    await simulate(150);
    const mall = data.malls.find((m) => m.id === id);
    if (!mall) throw new Error('Mall not found');
    return clone(mall);
  },
};