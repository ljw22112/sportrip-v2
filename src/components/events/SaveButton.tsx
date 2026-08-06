'use client';
import { useState, useEffect } from 'react';
import { getSavedIds, toggleSaved } from './EventCard';

export function SaveButton({ eventId }: { eventId: string }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => { setSaved(getSavedIds().has(eventId)); }, [eventId]);

  const handle = () => {
    const next = toggleSaved(eventId);
    setSaved(next);
  };

  return (
    <button onClick={handle}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, padding: '7px 10px', borderRadius: 8, border: 0, background: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2, fontFamily: 'inherit' }}>
      {saved ? '❤️ 저장됨' : '저장'}
    </button>
  );
}
