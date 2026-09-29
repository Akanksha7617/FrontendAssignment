const formatterCache = new Map();

function getFormatter(timeZone) {
  let f = formatterCache.get(timeZone);

  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });

    formatterCache.set(timeZone, f);
  }

  return f;
}

export function isValidTimeZone(tz) {
  if (!tz || typeof tz !== 'string') return false;

  try {
    getFormatter(tz); // throws RangeError for invalid zones
    return true;
  } catch {
    return false;
  }
}

// "HH:mm" -> minutes since midnight (null if invalid)
export function toMinutes(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || '');

  if (!m) return null;

  const h = Number(m[1]);
  const min = Number(m[2]);

  if (h > 23 || min > 59) return null;

  return h * 60 + min;
}

export function formatMinutes(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = String(mins % 60).padStart(2, '0');

  return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
}

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export const WEEKDAY_KEYS = WEEKDAYS;

// Weekday, date and time in the mall's own time zone
export function getLocalParts(date, timeZone) {
  const parts = getFormatter(timeZone).formatToParts(date);

  const get = (t) => parts.find((p) => p.type === t).value;

  const year = Number(get('year'));
  const month = Number(get('month'));
  const day = Number(get('day'));

  const pad = (n) => String(n).padStart(2, '0');
  const key = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

  // yesterday's calendar date (used for overnight hours and holidays)
  const prev = new Date(Date.UTC(year, month - 1, day - 1));

  return {
    dayIndex: WEEKDAYS.indexOf(
      get('weekday').toLowerCase().slice(0, 3)
    ),
    dateKey: key(year, month, day),
    yesterdayKey: key(
      prev.getUTCFullYear(),
      prev.getUTCMonth() + 1,
      prev.getUTCDate()
    ),
    minutes:
      (Number(get('hour')) % 24) * 60 +
      Number(get('minute')),
  };
}