import {
  getLocalParts,
  isValidTimeZone,
  toMinutes,
  formatMinutes,
  WEEKDAY_KEYS,
} from './timezoneUtils';

export const STATUS = { OPEN: 'OPEN', CLOSED: 'CLOSED', UNKNOWN: 'UNKNOWN' };

const UNKNOWN_RESULT = {
  status: STATUS.UNKNOWN,
  isOpen: false,
  hoursLabel: 'Hours unavailable',
  localTime: '',
};

/**
 * Hours for one weekday. Returns one of:
 *   { closed: true, reason }   closed all day
 *   { range: { open, close } } open from open to close (minutes)
 *   { invalid: true }          bad data
 *
 * Data can look like:
 *   openingTime / closingTime            default hours for every day
 *   hours: { sun: ["11:00","20:00"] }    override for one weekday
 *   hours: { mon: null }                 closed on Monday
 *   holidays: ["2026-01-26"]             closed on these local dates
 */
function resolveHours(mall, dayIndex, isHoliday) {
  if (isHoliday) return { closed: true, reason: 'holiday' };

  const override = mall.hours?.[WEEKDAY_KEYS[dayIndex]];
  if (override === null) return { closed: true, reason: 'weekly' };

  const [openStr, closeStr] = Array.isArray(override)
    ? override
    : [mall.openingTime, mall.closingTime];

  const open = toMinutes(openStr);
  const close = toMinutes(closeStr);
  if (open === null || close === null || open === close) return { invalid: true };
  return { range: { open, close } };
}

export function getMallStatus(mall, now = new Date()) {
  if (!mall || !isValidTimeZone(mall.timezone)) return UNKNOWN_RESULT;

  const { dayIndex, dateKey, yesterdayKey, minutes } = getLocalParts(now, mall.timezone);
  const holidays = Array.isArray(mall.holidays) ? mall.holidays : [];

  const today = resolveHours(mall, dayIndex, holidays.includes(dateKey));
  if (today.invalid) return UNKNOWN_RESULT;

  const yesterday = resolveHours(mall, (dayIndex + 6) % 7, holidays.includes(yesterdayKey));

  let isOpen = false;

  // Today's own hours
  if (today.range) {
    const { open, close } = today.range;
    // For overnight hours (e.g. 18:00 -> 02:00), today's part is only open..midnight
    isOpen = open < close ? minutes >= open && minutes < close : minutes >= open;
  }

  // Yesterday's overnight hours spilling past midnight
  if (!isOpen && yesterday.range && yesterday.range.open > yesterday.range.close) {
    isOpen = minutes < yesterday.range.close;
  }

  const hoursLabel = today.closed
    ? today.reason === 'holiday' ? 'Closed today (holiday)' : 'Closed today'
    : `${formatMinutes(today.range.open)} – ${formatMinutes(today.range.close)}`;

  return {
    status: isOpen ? STATUS.OPEN : STATUS.CLOSED,
    isOpen,
    hoursLabel,
    localTime: formatMinutes(minutes),
  };
}