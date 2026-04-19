'use client';

import { useEffect } from 'react';

export function TrackVisit() {
  useEffect(() => {
    const key = `tracked:${window.location.pathname}`;
    const last = sessionStorage.getItem(key);
    if (last) return;

    sessionStorage.setItem(key, '1');
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pagePath: window.location.pathname })
    }).catch(() => undefined);
  }, []);

  return null;
}
