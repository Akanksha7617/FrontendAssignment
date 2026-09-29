import { useEffect, useMemo, useState } from 'react';
import { getMallStatus } from '../utils/statusUtils';

// Re-renders every `intervalMs` so OPEN/CLOSED stays live
export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// -> [{ mall, status }]
export function useMallStatuses(malls, intervalMs = 30000) {
  const now = useNow(intervalMs);
  return useMemo(() => malls.map((mall) => ({ mall, status: getMallStatus(mall, now) })), [malls, now]);
}