import { describe, it, expect } from 'vitest';
import { mockAdapter } from './adapters/mockAdapter';
import { httpAdapter } from './adapters/httpAdapter';

describe('service adapters', () => {
  it('mock and http adapters expose the same methods', () => {
    expect(Object.keys(mockAdapter).sort()).toEqual(Object.keys(httpAdapter).sort());
  });

  it('mock adapter filters malls by country', async () => {
    const malls = await mockAdapter.getMallsByCountry('IND');
    expect(malls.length).toBeGreaterThan(0);
    expect(malls.every((m) => m.countryId === 'IND')).toBe(true);
  });

  it('mock adapter rejects for an unknown mall', async () => {
    await expect(mockAdapter.getMallById('nope')).rejects.toThrow('Mall not found');
  });

  it('mock data can not be changed by callers', async () => {
    const first = await mockAdapter.getMalls();
    first[0].name = 'Hacked';
    const second = await mockAdapter.getMalls();
    expect(second[0].name).not.toBe('Hacked');
  });
});