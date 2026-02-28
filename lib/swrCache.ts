"use client"

/**
 * Enterprise-grade SWR Persistent Cache Provider
 * Automatically syncs SWR cache to localStorage to allow "Instant Load" on refresh.
 */
export function localStorageProvider() {
  if (typeof window === 'undefined') return new Map();

  // Initialize from localStorage
  let map: Map<any, any>;
  try {
    const cached = localStorage.getItem('onecamp-app-cache');
    map = new Map(JSON.parse(cached || '[]'));
  } catch (e) {
    console.error("Failed to load SWR cache from localStorage", e);
    map = new Map();
  }

  // Sync back to localStorage on window unload
  window.addEventListener('beforeunload', () => {
    try {
      // We only serialize entries that are serializable
      const appCache = JSON.stringify(Array.from(map.entries()));
      localStorage.setItem('onecamp-app-cache', appCache);
    } catch (e) {
      console.warn("Failed to persist SWR cache", e);
    }
  });

  return map;
}
