'use client';
import { useState, useEffect } from 'react';
import { getSavedIds, toggleSaved } from './EventCard';
interface Props { eventId: string; className?: string; }
export function SaveButton({ eventId, className }: Props) {
  const [saved, setSaved] = useState(false);
  useEffect(()=>{ setSaved(getSavedIds().has(eventId)); },[eventId]);
  return (
    <button onClick={()=>setSaved(toggleSaved(eventId))}
      className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] border-2 border-[#EBEBEB] hover:border-[#222] transition-colors ${className}`}>
      {saved ? '❤️ 저장됨' : '🤍 저장하기'}
    </button>
  );
}
