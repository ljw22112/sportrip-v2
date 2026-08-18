'use client';
import Link from 'next/link';
import { SportEvent } from '@/types';
import { calcDday, calcVerified, VERIFIED_LABELS, calcRegistrationStatus, REG_STATUS_LABELS } from '@/lib/data';
import { getSportInfo } from '@/lib/sports';
import { useState, useEffect, useCallback, useId } from 'react';

function fmtDate(ds: string) {
  const [y,m,d] = ds.split('-').map(Number);
  return `${m}.${String(d).padStart(2,'0')} (${'일월화수목금토'[new Date(Date.UTC(y,m-1,d)).getUTCDay()]})`;
}

const LS_KEY = 'sportrip_saved';
export function getSavedIds(): Set<string> {
  if (typeof window==='undefined') return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(LS_KEY)||'[]')); } catch { return new Set(); }
}
export function toggleSaved(id: string): boolean {
  const s = getSavedIds();
  s.has(id) ? s.delete(id) : s.add(id);
  localStorage.setItem(LS_KEY, JSON.stringify([...s]));
  return s.has(id);
}

export function EventCard({ event }: { event: SportEvent }) {
  const [saved, setSaved] = useState(false);
  const sport = getSportInfo(event.sport);
  useEffect(()=>{ setSaved(getSavedIds().has(String(event.id))); },[event.id]);
  const handleHeart = useCallback((e: React.MouseEvent)=>{
    e.preventDefault(); e.stopPropagation();
    setSaved(toggleSaved(String(event.id)));
  },[event.id]);

  return (
    <article className="relative group cursor-pointer">
      {/* 썸네일 — 테두리만, 흰 배경, 종목 캐릭터 */}
      <Link href={`/events/${event.id}`}
        className="relative block rounded-2xl overflow-hidden border-2 hover:border-[--green] transition-all"
        style={{aspectRatio:'1/1', borderColor: sport.color + '55', background:'bg-bg'}}>
        {/* D-day — 크게 */}
        {event.status !== 'done' && (
          <div className="absolute top-0 left-0 right-0 flex items-center justify-center gap-2 pt-3 z-10">
            <span className="text-[26px] font-black tracking-tighter leading-none"
              style={{color: sport?.color || '#555'}}>
              {calcDday(event.start)}
            </span>
            <span className="text-[13px] font-bold text-[#555] mt-1">{event.region}</span>
          </div>
        )}
        {/* 종목 캐릭터 SVG */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <img src={sport.icon} alt={sport.label}
            className="w-4/5 h-4/5 object-contain drop-shadow-sm select-none"/>
          <div className="text-[11px] font-bold px-3 py-1 rounded-full text-white mt-2"
            style={{background: sport.color}}>
            {event.sport}
          </div>
        </div>
        {/* 하단 날짜 바 */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
          style={{background: sport.color + 'EE'}}>
          <div className="text-white font-bold text-[13px] tracking-tight">{fmtDate(event.start)}</div>

        </div>
      </Link>
      {/* 하트 */}
      <button onClick={handleHeart} aria-label={saved?'저장 해제':'저장'}
        className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center text-lg z-10 hover:scale-110 transition-transform">
        <svg width="18" height="18" viewBox="0 0 24 24" fill={saved?"#E4572E":"none"}
          stroke={saved?"#E4572E":"#717171"} strokeWidth="2.5" strokeLinecap="round"
          style={{transform:saved?'scale(1.2)':'scale(1)', transition:'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)'}}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      {/* 텍스트 */}
      <Link href={`/events/${event.id}`} className="block pt-2 px-0.5">
        <div className="font-bold text-[14px] text-ink truncate leading-tight">{event.title}</div>
        <div className="text-[12px] text-muted mt-0.5 leading-tight">{event.region} · {event.sport} · {fmtDate(event.start)}</div>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {(() => {
            const regStatus = calcRegistrationStatus(event.start);
            const regLabel = REG_STATUS_LABELS[regStatus];
            return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{color:regLabel.color,background:regLabel.bg}}>{regLabel.text}</span>;
          })()}
          {(() => {
            const vs = calcVerified(event.id, event.url||'');
            const vl = VERIFIED_LABELS[vs];
            return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{color:vl.color,background:vl.bg}}>{vl.text}</span>;
          })()}

        </div>
      </Link>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <div>
      <div className="rounded-2xl bg-gray-100 animate-pulse border-2 border-gray-200" style={{aspectRatio:'1/1'}}/>
      <div className="h-4 w-3/5 bg-gray-100 rounded mt-2.5 animate-pulse"/>
      <div className="h-3.5 w-2/5 bg-gray-100 rounded mt-1.5 animate-pulse"/>
    </div>
  );
}

export function EventCardHorizontal({ event }: { event: SportEvent }) {
  const sport = getSportInfo(event.sport);
  const [saved, setSaved] = useState(false);
  useEffect(()=>{ setSaved(getSavedIds().has(String(event.id))); },[event.id]);
  return (
    <Link href={`/events/${event.id}`}
      className="flex gap-4 py-4 border-b border-[#E8E8E6] items-center hover:bg-[#F7F7F6] px-2 -mx-2 rounded-xl transition-colors">
      <div className="w-14 h-14 flex-shrink-0 rounded-xl flex items-center justify-center text-3xl border-2"
        style={{borderColor: sport.color + '55', background: sport.color + '11'}}>
        {sport.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[14px] text-ink truncate">{event.title}</div>
        <div className="text-[13px] text-muted mt-0.5">{event.region} · {event.sport}</div>
        <div className="text-[13px] text-muted mt-0.5">
          {event.start}
          {event.status!=='done' && <span className="font-bold ml-2" style={{color:sport.color}}>{calcDday(event.start)}</span>}
        </div>
      </div>
      <span className="text-base flex-shrink-0">{saved?'❤️':'🤍'}</span>
    </Link>
  );
}
