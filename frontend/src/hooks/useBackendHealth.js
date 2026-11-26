import { useEffect, useState } from 'react';
import { systemApi } from '../api/systemApi';

/**
 * Polls the backend health endpoint. Returns an honest online/offline state
 * instead of the previous hardcoded "Engine Active" badge.
 */
export function useBackendHealth(intervalMs = 60000) {
  const [state, setState] = useState({
    online: null,
    score: null,
    status: null,
    checkedAt: null,
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await systemApi.getHealth();
        if (!active) return;
        setState({
          online: true,
          score: res?.data?.overallScore ?? null,
          status: res?.data?.status ?? null,
          checkedAt: new Date(),
        });
      } catch {
        if (!active) return;
        setState({ online: false, score: null, status: null, checkedAt: new Date() });
      }
    };

    load();
    const timer = setInterval(load, intervalMs);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [intervalMs]);

  return state;
}
