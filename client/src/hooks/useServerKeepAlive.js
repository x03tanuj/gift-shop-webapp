import { useEffect, useRef } from 'react';
import api from '../services/api.js';

const IDLE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes of inactivity pause

/**
 * Custom hook to ping backend and prevent Render free tier idle shutdown.
 * Includes smart user activity detection: if a visitor is completely idle
 * for over 15 minutes, pings pause so Render can sleep naturally and save
 * the user's monthly free instance hours. As soon as the user returns,
 * activity resumes.
 *
 * @param {number} [intervalMs=540000] - Ping interval in milliseconds (default: 9 minutes)
 */
export function useServerKeepAlive(intervalMs = 9 * 60 * 1000) {
  const lastPingRef = useRef(Date.now());
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    let isMounted = true;

    // Track user interaction to avoid burning free tier hours when user walks away
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach((ev) => {
      window.addEventListener(ev, updateActivity, { passive: true });
    });

    const pingServer = async () => {
      // Don't ping if user has been inactive for > 15 minutes
      if (Date.now() - lastActivityRef.current > IDLE_THRESHOLD_MS) {
        return;
      }

      try {
        await api.get('/health');
        if (isMounted) {
          lastPingRef.current = Date.now();
        }
      } catch (err) {
        if (isMounted) {
          console.debug('[KeepAlive] Server ping attempted:', err?.message || err);
        }
      }
    };

    // Set up regular interval (every 9 minutes)
    const timerId = setInterval(pingServer, intervalMs);

    // Also check on tab visibility change
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastActivityRef.current <= IDLE_THRESHOLD_MS &&
        Date.now() - lastPingRef.current >= intervalMs
      ) {
        pingServer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(timerId);
      activityEvents.forEach((ev) => {
        window.removeEventListener(ev, updateActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs]);
}

export default useServerKeepAlive;
