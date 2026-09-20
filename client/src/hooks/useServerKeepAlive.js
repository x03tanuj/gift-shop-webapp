import { useEffect, useRef } from 'react';
import api from '../services/api.js';

/**
 * Custom hook to periodically ping the backend to keep free-tier hostings (like Render) awake.
 * Render free tier spins down instances after 10-15 minutes of inactivity.
 * Pinging every 9 minutes ensures the server stays warm and responsive while visitors use the site.
 *
 * @param {number} [intervalMs=540000] - Ping interval in milliseconds (default: 9 minutes)
 */
export function useServerKeepAlive(intervalMs = 9 * 60 * 1000) {
  const lastPingRef = useRef(Date.now());

  useEffect(() => {
    let isMounted = true;

    const pingServer = async () => {
      try {
        await api.get('/health');
        if (isMounted) {
          lastPingRef.current = Date.now();
        }
      } catch (err) {
        // Silently catch to avoid disrupting user experience
        if (isMounted) {
          console.debug('[KeepAlive] Server ping attempted:', err?.message || err);
        }
      }
    };

    // Set up regular interval (every 9 minutes)
    const timerId = setInterval(pingServer, intervalMs);

    // Also ping when the visitor switches back to the tab if interval has elapsed
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastPingRef.current >= intervalMs
      ) {
        pingServer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs]);
}

export default useServerKeepAlive;
