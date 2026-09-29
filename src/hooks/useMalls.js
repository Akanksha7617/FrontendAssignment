import { useCallback, useEffect, useRef, useState } from 'react';
import { mallService } from '../services/mallService';

export function useMalls() {
  const [state, setState] = useState({ countries: [], malls: [], loading: true, error: null });
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [countries, malls] = await Promise.all([
        mallService.getCountries(),
        mallService.getMalls(),
      ]);
      if (id !== requestId.current) return; // a newer request replaced this one
      setState({ countries, malls, loading: false, error: null });
    } catch (e) {
      if (id !== requestId.current) return;
      setState((s) => ({ ...s, loading: false, error: e.message || 'Something went wrong' }));
    }
  }, []);

  useEffect(() => {
    load();
    return () => { requestId.current++; }; // ignore results after unmount
  }, [load]);

  return { ...state, reload: load };
}