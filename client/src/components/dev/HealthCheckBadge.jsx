import React, { useState, useEffect } from 'react';

/**
 * Dev-only health check monitor for Phase 0 backend verification.
 * Only rendered in development mode (import.meta.env.DEV).
 */
export default function HealthCheckBadge() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const isDev = Boolean(import.meta.env.DEV);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!isDev) return;

    const checkHealth = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/health`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setHealthData(data);
      } catch (err) {
        setError(err.message || 'Server unreachable');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, [apiUrl, isDev]);

  // Strictly guard in dev mode
  if (!isDev) {
    return null;
  }

  return (
    <aside
      aria-label="Development Health Check Monitor"
      className="mt-8 mb-4 border border-dashed border-stone-300 rounded-xl p-3 bg-stone-50/80 text-xs text-stone-600 max-w-xl mx-auto"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono uppercase font-bold text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded">
            DEV ONLY
          </span>
          <span className="font-medium text-stone-700">
            Phase 0 Health Check:
          </span>

          {loading && (
            <span className="inline-flex items-center gap-1 text-amber-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Checking...
            </span>
          )}

          {error && (
            <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Offline ({error})
            </span>
          )}

          {healthData && (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Online ({healthData.status})
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] text-stone-500 underline hover:text-stone-800"
        >
          {expanded ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      {expanded && (
        <div className="mt-2 pt-2 border-t border-stone-200 text-[11px]">
          <p className="font-mono text-stone-500 mb-1">
            Target: {apiUrl}/health
          </p>
          <pre className="bg-stone-800 text-stone-100 p-2 rounded text-[10px] overflow-x-auto">
            {JSON.stringify(
              healthData || { error: error || 'No response' },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </aside>
  );
}
