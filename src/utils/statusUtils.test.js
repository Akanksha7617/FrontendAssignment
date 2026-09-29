import { describe, it, expect } from 'vitest';
import { getMallStatus } from './statusUtils';

const mall = { openingTime: '10:00', closingTime: '22:00', timezone: 'Asia/Kolkata' };
const at = (iso) => new Date(iso);

describe('getMallStatus: basics', () => {
  it('opens exactly at opening time (10:00 IST = 04:30Z)', () => {
    expect(getMallStatus(mall, at('2026-01-15T04:30:00Z')).status).toBe('OPEN');
    expect(getMallStatus(mall, at('2026-01-15T04:29:00Z')).status).toBe('CLOSED');
  });

  it('closes exactly at closing time (22:00 IST = 16:30Z)', () => {
    expect(getMallStatus(mall, at('2026-01-15T16:29:00Z')).status).toBe('OPEN');
    expect(getMallStatus(mall, at('2026-01-15T16:30:00Z')).status).toBe('CLOSED');
  });

  it('handles midnight-crossing hours', () => {
    const night = { ...mall, openingTime: '18:00', closingTime: '02:00' };
    expect(getMallStatus(night, at('2026-01-15T14:30:00Z')).status).toBe('OPEN');   // 20:00 IST
    expect(getMallStatus(night, at('2026-01-15T19:30:00Z')).status).toBe('OPEN');   // 01:00 IST
    expect(getMallStatus(night, at('2026-01-15T21:30:00Z')).status).toBe('CLOSED'); // 03:00 IST
  });

  it('uses the mall time zone, not the browser one', () => {
    const ny = { openingTime: '10:00', closingTime: '22:00', timezone: 'America/New_York' };
    expect(getMallStatus(ny, at('2026-01-15T15:00:00Z')).status).toBe('OPEN');
    expect(getMallStatus(ny, at('2026-01-15T14:59:00Z')).status).toBe('CLOSED');
  });

  it('returns UNKNOWN for invalid data', () => {
    expect(getMallStatus({ ...mall, timezone: 'Nope/Zone' }).status).toBe('UNKNOWN');
    expect(getMallStatus({ ...mall, openingTime: '25:99' }).status).toBe('UNKNOWN');
    expect(getMallStatus(undefined).status).toBe('UNKNOWN');
  });
});

describe('getMallStatus: weekday hours', () => {
  const withSunday = { ...mall, hours: { sun: ['11:00', '20:00'] } };

  it('uses Sunday hours on Sunday (2026-01-18 is a Sunday)', () => {
    // 10:30 IST: normally open, but Sunday opens at 11:00
    expect(getMallStatus(withSunday, at('2026-01-18T05:00:00Z')).status).toBe('CLOSED');
    // 11:00 IST
    expect(getMallStatus(withSunday, at('2026-01-18T05:30:00Z')).status).toBe('OPEN');
    // 21:00 IST: normally open, but Sunday closes at 20:00
    expect(getMallStatus(withSunday, at('2026-01-18T15:30:00Z')).status).toBe('CLOSED');
  });

  it('uses default hours on other days (Monday)', () => {
    expect(getMallStatus(withSunday, at('2026-01-19T04:30:00Z')).status).toBe('OPEN'); // 10:00 IST
  });

  it('shows the hours of the local day in the label', () => {
    expect(getMallStatus(withSunday, at('2026-01-18T06:00:00Z')).hoursLabel).toBe('11:00 AM – 8:00 PM');
  });

  it('supports a day that is closed all day', () => {
    const mondayOff = { ...mall, hours: { mon: null } };
    const res = getMallStatus(mondayOff, at('2026-01-19T06:30:00Z')); // Mon 12:00 IST
    expect(res.status).toBe('CLOSED');
    expect(res.hoursLabel).toBe('Closed today');
  });

  it('uses the mall weekday, not the browser weekday', () => {
    // 2026-01-18T20:00Z = Sunday 20:00 UTC, but already Monday 01:30 IST
    const mondayOff = { ...mall, hours: { mon: null } };
    expect(getMallStatus(mondayOff, at('2026-01-18T20:00:00Z')).hoursLabel).toBe('Closed today');
  });
});

describe('getMallStatus: holidays and overnight spill', () => {
  it('is closed on a holiday', () => {
    const m = { ...mall, holidays: ['2026-01-26'] };
    const res = getMallStatus(m, at('2026-01-26T06:30:00Z')); // 12:00 IST
    expect(res.status).toBe('CLOSED');
    expect(res.hoursLabel).toBe('Closed today (holiday)');
  });

  it('is open on the day after a holiday', () => {
    const m = { ...mall, holidays: ['2026-01-26'] };
    expect(getMallStatus(m, at('2026-01-27T06:30:00Z')).status).toBe('OPEN');
  });

  it('stays open after midnight from the previous day (Fri 18:00 -> Sat 02:00)', () => {
    const m = { ...mall, hours: { fri: ['18:00', '02:00'] } };
    // Saturday 2026-01-17, 01:00 IST = Friday 19:30Z
    expect(getMallStatus(m, at('2026-01-16T19:30:00Z')).status).toBe('OPEN');
    // Saturday 03:00 IST
    expect(getMallStatus(m, at('2026-01-16T21:30:00Z')).status).toBe('CLOSED');
  });
});
describe('getMallStatus: DST and boundaries', () => {
  const ny = { openingTime: '10:00', closingTime: '22:00', timezone: 'America/New_York' };

  it('handles daylight saving time (July = EDT, UTC-4)', () => {
    expect(getMallStatus(ny, at('2026-07-15T14:00:00Z')).status).toBe('OPEN');   // 10:00 EDT
    expect(getMallStatus(ny, at('2026-07-15T13:59:00Z')).status).toBe('CLOSED'); // 09:59 EDT
  });

  it('overnight hours end exactly at closing time', () => {
    const night = { ...mall, openingTime: '18:00', closingTime: '02:00' };
    expect(getMallStatus(night, at('2026-01-15T20:29:00Z')).status).toBe('OPEN');   // 01:59 IST
    expect(getMallStatus(night, at('2026-01-15T20:30:00Z')).status).toBe('CLOSED'); // 02:00 IST
  });

  it('returns UNKNOWN when opening equals closing', () => {
    expect(getMallStatus({ ...mall, openingTime: '10:00', closingTime: '10:00' }).status).toBe('UNKNOWN');
  });
});