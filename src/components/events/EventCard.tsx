'use client';
import Link from 'next/link';
import { SportEvent } from '@/types';
import { calcDday } from '@/lib/data';
import { useState, useEffect, useCallback, useId } from 'react';

const SPORT_HUE: Record<string,number> = {
  마라톤:158,러닝:174,자전거:96,축구:140,배드민턴:200,수영:210,테니스:80,트레일:120,
  종합:150,기타:155,유도:160,야구:10,농구:30,배구:220,태권도:300,사이클:96,골프:100
};

function fmtDate(ds: string) {
  const [y,m,d] = ds.split('-').map(Number);
  return `${m}.${String(d).padStart(2,'0')} (${'일월화수목금토'[new Date(Date.UTC(y,m-1,d)).getUTCDay()]})`;
}
function wrap(t: string, n: number) {
  const out: string[] = []; let cur = '';
  for (const w of t.split(' ')) {
    if ((cur+' '+w).trim().length <= n) cur = (cur+' '+w).trim();
    else { if (cur) out.push(cur); cur = w.length>n?w.slice(0,n):w; }
  }
  if (cur) out.push(cur);
  return out.slice(0,3);
}

const LS_KEY = 'sportrip_saved';
export function getSavedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(LS_KEY)||'[]')); } catch { return new Set(); }
}
export function toggleSaved(id: string): boolean {
  const s = getSavedIds();
  s.has(id) ? s.delete(id) : s.add(id);
  localStorage.setItem(LS_KEY, JSON.stringify([...s]));
  return s.has(id);
}

// SVG 아트 — useId로 인스턴스마다 고유 gradient ID 생성
function ThumbArt({ event }: { event: SportEvent }) {
  const uid = useId(); // React 18 고유 ID — 같은 이벤트가 여러 캐러셀에 있어도 충돌 없음
  const gid = `g${uid.replace(/:/g,'')}`;
  const h = SPORT_HUE[event.sport] || 150;
  const lines = wrap(event.title, 8);
  const fs = Math.min(36, 352 / Math.max(...lines.map(l=>l.length)));
  return (
    <svg viewBox="0 0 400 408" preserveAspectRatio="xMidYMid slice" aria-hidden
      className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={`hsl(${h} 45% 26%)`}/>
          <stop offset="1" stopColor={`hsl(${h+15} 50% 44%)`}/>
        </linearGradient>
      </defs>
      <rect width="400" height="408" fill={`url(#${gid})`}/>
      <g stroke={`hsl(${h} 60% 82% / .16)`} strokeWidth="2">
        {[0.2,0.38,0.56,0.72].map((p,i)=>(
          <path key={i} d={`M-20 ${408*p} Q 140 ${408*(p-0.1)} 420 ${408*p}`} fill="none"/>
        ))}
      </g>
      {/* 상단 텍스트 영역 */}
      <text x="24" y="40" fill={`hsl(${h} 55% 90% / .8)`}
        fontFamily="Pretendard,sans-serif" fontSize="12" fontWeight="600" letterSpacing="2">
        2026 SPORTRIP
      </text>
      <rect x="24" y="78" width="44" height="6" rx="3" fill="#D6F14E"/>
      {lines.map((l,i)=>(
        <text key={i} x="24" y={118 + fs*0.35 + i*(fs*1.25)}
          fill="#fff" fontFamily="Pretendard,sans-serif"
          fontSize={fs} fontWeight="800" letterSpacing="-.5">{l}</text>
      ))}
      {/* 하단 날짜 바 */}
      <rect x="0" y="322" width="400" height="86" fill={`hsl(${h} 50% 15% / .9)`}/>
      <text x="24" y="360" fill="#D6F14E"
        fontFamily="Pretendard,sans-serif" fontSize="27" fontWeight="800" letterSpacing="1">
        {fmtDate(event.start)}
      </text>
      <text x="24" y="387" fill={`hsl(${h} 40% 92% / .85)`}
        fontFamily="Pretendard,sans-serif" fontSize="13" fontWeight="600">
        {event.region} · {event.sport}
      </text>
    </svg>
  );
}

export function EventCard({ event }: { event: SportEvent }) {
  const [saved, setSaved] = useState(false);
  useEffect(()=>{ setSaved(getSavedIds().has(String(event.id))); },[event.id]);
  const handleHeart = useCallback((e: React.MouseEvent)=>{
    e.preventDefault(); e.stopPropagation();
    setSaved(toggleSaved(String(event.id)));
  },[event.id]);

  return (
    <article className="relative cursor-pointer group">
      {/* 썸네일 */}
      <Link href={`/events/${event.id}`}
        className="relative block rounded-[13px] overflow-hidden hover:brightness-95 transition-all"
        style={{aspectRatio:'1/1.02'}}>
        <ThumbArt event={event}/>
        {event.status !== 'done' && (
          <div className="absolute top-2 left-2 bg-white/90 text-[#222] text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
            {calcDday(event.start)}
          </div>
        )}
      </Link>
      {/* 하트 */}
      <button onClick={handleHeart} aria-label={saved?'저장 해제':'저장'}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-base z-10 hover:scale-110 transition-transform">
        {saved ? '❤️' : '🤍'}
      </button>
      {/* 카드 하단 텍스트 */}
      <Link href={`/events/${event.id}`} className="block pt-2.5">
        <div className="font-semibold text-[13.5px] text-[#222] truncate">{event.title}</div>
        <div className="text-xs text-[#717171] mt-0.5">{event.region} · {event.sport}</div>
        <div className="text-xs text-[#717171] mt-0.5">{fmtDate(event.start)} · {event.participants}</div>
      </Link>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <div>
      <div className="rounded-[13px] bg-gray-100 animate-pulse" style={{aspectRatio:'1/1.02'}}/>
      <div className="h-3 w-3/5 bg-gray-100 rounded mt-2 animate-pulse"/>
      <div className="h-3 w-2/5 bg-gray-100 rounded mt-1.5 animate-pulse"/>
    </div>
  );
}

export function EventCardHorizontal({ event }: { event: SportEvent }) {
  const [saved, setSaved] = useState(false);
  const h = SPORT_HUE[event.sport]||150;
  useEffect(()=>{ setSaved(getSavedIds().has(String(event.id))); },[event.id]);
  const icons = ['🏃','🚴','⚽','🏸','🏊','🎾','🏔️','🏅','⚾','🏀','🏐','🥋'];
  const idx = Object.keys(SPORT_HUE).indexOf(event.sport);
  return (
    <Link href={`/events/${event.id}`}
      className="flex gap-4 py-4 border-b border-[#E8E8E6] items-start hover:bg-[#F7F7F6] px-2 -mx-2 rounded-xl transition-colors">
      <div className="w-14 h-14 flex-shrink-0 rounded-xl flex items-center justify-center text-2xl"
        style={{background:`linear-gradient(135deg,hsl(${h} 45% 26%),hsl(${h+15} 50% 44%))`}}>
        {icons[idx] || '🏆'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[13.5px] text-[#222] truncate">{event.title}</div>
        <div className="text-xs text-[#717171] mt-0.5">{event.region} · {event.sport}</div>
        <div className="text-xs text-[#717171] mt-0.5 font-mono">
          {event.start}
          {event.status!=='done'&&<span className="text-[#0B5C43] font-bold ml-2">{calcDday(event.start)}</span>}
        </div>
      </div>
      <span className="text-base flex-shrink-0 mt-1">{saved?'❤️':'🤍'}</span>
    </Link>
  );
}
