'use client';
import Link from 'next/link';
import { SportEvent } from '@/types';
import { calcDday } from '@/lib/data';
import { useState, useEffect, useCallback } from 'react';

const SPORT_HUE: Record<string,number> = {
  마라톤:158,러닝:174,자전거:96,축구:140,배드민턴:200,수영:210,테니스:80,트레일:120,종합:150,기타:155
};
const SPORT_ICO: Record<string,string> = {
  마라톤:'🏃',러닝:'💨',자전거:'🚴',축구:'⚽',배드민턴:'🏸',수영:'🏊',테니스:'🎾',트레일:'🏔️',종합:'🏅',기타:'🏆'
};

function fmtDate(ds: string) {
  const [y,m,d] = ds.split('-').map(Number);
  const dow = '일월화수목금토'[new Date(Date.UTC(y,m-1,d)).getUTCDay()];
  return `${m}.${String(d).padStart(2,'0')} (${dow})`;
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

// localStorage 저장 키
const LS_KEY = 'sportrip_saved';
export function getSavedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(LS_KEY)||'[]')); } catch { return new Set(); }
}
export function toggleSaved(id: string): boolean {
  const s = getSavedIds();
  if (s.has(id)) { s.delete(id); } else { s.add(id); }
  localStorage.setItem(LS_KEY, JSON.stringify([...s]));
  return s.has(id);
}

function ThumbArt({ event }: { event: SportEvent }) {
  const h = SPORT_HUE[event.sport] || 150;
  const lines = wrap(event.title, 8);
  const maxLen = Math.max(...lines.map(l => l.length));
  const fs = Math.min(36, 352/maxLen);
  const lh = fs*1.25;
  const id = `g-${event.id}`;
  return (
    <svg viewBox="0 0 400 408" preserveAspectRatio="xMidYMid slice" role="img" aria-label={event.title}
      style={{ width:'100%', height:'100%', display:'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={`hsl(${h} 45% 26%)`}/>
          <stop offset="1" stopColor={`hsl(${h+15} 50% 44%)`}/>
        </linearGradient>
      </defs>
      <rect width="400" height="408" fill={`url(#${id})`}/>
      <g stroke={`hsl(${h} 60% 82% / .16)`} strokeWidth="2">
        {[0.2,0.38,0.56,0.72].map((p,i) => <path key={i} d={`M-20 ${408*p} Q 140 ${408*(p-0.1)} 420 ${408*p}`} fill="none"/>)}
      </g>
      <text x="270" y="180" fontSize="110" opacity=".12" textAnchor="middle">{SPORT_ICO[event.sport]||'🏆'}</text>
      <text x="24" y="40" fill={`hsl(${h} 55% 90% / .8)`} fontFamily="Pretendard,sans-serif" fontSize="12" fontWeight="600" letterSpacing="2">2026 SPORTRIP</text>
      <rect x="24" y="78" width="44" height="6" rx="3" fill="#D6F14E"/>
      {lines.map((l,i) => (
        <text key={i} x="24" y={118+fs*0.35+i*lh} fill="#fff" fontFamily="Pretendard,sans-serif" fontSize={fs} fontWeight="800" letterSpacing="-.5">{l}</text>
      ))}
      <rect x="0" y="322" width="400" height="86" fill={`hsl(${h} 50% 15% / .9)`}/>
      <text x="24" y="360" fill="#D6F14E" fontFamily="Pretendard,sans-serif" fontSize="27" fontWeight="800" letterSpacing="1">{fmtDate(event.start)}</text>
      <text x="24" y="387" fill={`hsl(${h} 40% 92% / .85)`} fontFamily="Pretendard,sans-serif" fontSize="13" fontWeight="600">
        {event.region} · {event.sport}{event.distances ? ' ' + event.distances.split('·')[0].trim() : ''}
      </text>
    </svg>
  );
}

export function EventCard({ event }: { event: SportEvent }) {
  const [saved, setSaved] = useState(false);

  // 마운트 후 localStorage에서 읽기
  useEffect(() => { setSaved(getSavedIds().has(String(event.id))); }, [event.id]);

  const handleHeart = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const next = toggleSaved(String(event.id));
    setSaved(next);
    // 간단한 피드백
    const el = document.getElementById(`toast-${event.id}`);
    if (el) { el.textContent = next ? '관심 대회로 저장했습니다 ♥' : '저장을 해제했습니다'; el.style.opacity='1'; setTimeout(() => { el.style.opacity='0'; }, 2000); }
  }, [event.id]);

  const dday = calcDday(event.start);

  return (
    <article style={{ position:'relative', cursor:'pointer' }}>
      {/* 썸네일 */}
      <Link href={`/events/${event.id}`} style={{ display:'block', position:'relative', aspectRatio:'1/1.02', borderRadius:13, overflow:'hidden', background:'var(--green-tint)' }}
        className="card-thumb-link">
        <ThumbArt event={event} />
        {event.status !== 'done' && (
          <div style={{ position:'absolute', top:8, left:8, background:'rgba(255,255,255,.92)', color:'var(--ink)', fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:999 }}>
            {dday}
          </div>
        )}
      </Link>

      {/* 하트 버튼 (로그인 없이 저장) */}
      <button onClick={handleHeart} aria-label={saved?'저장 해제':'관심 대회 저장'}
        style={{ position:'absolute', top:8, right:8, width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, filter:'drop-shadow(0 1px 3px rgba(0,0,0,.3))', border:0, background:'none', cursor:'pointer', transition:'transform .1s', zIndex:2 }}
        className="heart-btn">
        {saved ? '❤️' : '🤍'}
      </button>

      {/* 카드 하단 텍스트 */}
      <Link href={`/events/${event.id}`} style={{ display:'block', textDecoration:'none', color:'inherit', padding:'8px 2px 0' }}>
        <div style={{ fontWeight:700, fontSize:13.5, letterSpacing:'-.01em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{event.title}</div>
        <div style={{ color:'var(--muted)', fontSize:12, fontWeight:600, marginTop:2 }}>{event.region} · {event.sport}</div>
        <div style={{ color:'var(--muted)', fontSize:12, marginTop:1 }}>{fmtDate(event.start)} · 정원 {event.participants}</div>
      </Link>

      {/* 토스트 피드백 */}
      <div id={`toast-${event.id}`} style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'var(--ink)', color:'#fff', fontSize:13.5, fontWeight:600, borderRadius:999, padding:'11px 20px', opacity:0, pointerEvents:'none', transition:'opacity .2s', zIndex:120, whiteSpace:'nowrap' }}/>

      <style>{`
        .card-thumb-link:hover{filter:brightness(.96)}
        .heart-btn:hover{transform:scale(1.15)}
      `}</style>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <div>
      <div style={{ aspectRatio:'1/1.02', borderRadius:13, background:'var(--line-soft)', animation:'shimmer 1.4s infinite' }}/>
      <div style={{ height:12, borderRadius:6, background:'var(--line-soft)', marginTop:8, width:'60%', animation:'shimmer 1.4s infinite' }}/>
      <div style={{ height:12, borderRadius:6, background:'var(--line-soft)', marginTop:6, animation:'shimmer 1.4s infinite' }}/>
      <style>{`@keyframes shimmer{0%{opacity:.55}50%{opacity:1}100%{opacity:.55}}`}</style>
    </div>
  );
}

export function EventCardHorizontal({ event }: { event: SportEvent }) {
  const [saved, setSaved] = useState(false);
  const dday = calcDday(event.start);
  const h = SPORT_HUE[event.sport] || 150;
  useEffect(() => { setSaved(getSavedIds().has(String(event.id))); }, [event.id]);
  return (
    <Link href={`/events/${event.id}`} style={{ display:'flex', gap:16, padding:'14px 0', borderBottom:'1px solid var(--line)', alignItems:'flex-start', textDecoration:'none', color:'inherit' }}>
      <div style={{ width:60, height:60, flexShrink:0, borderRadius:10, background:`linear-gradient(135deg,hsl(${h} 45% 26%),hsl(${h+15} 50% 44%))`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>
        {SPORT_ICO[event.sport]||'🏆'}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:700, fontSize:13.5, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{event.title}</div>
        <div style={{ color:'var(--muted)', fontSize:12, marginTop:2 }}>{event.region} · {event.sport}</div>
        <div style={{ fontSize:12, marginTop:1 }}>
          <span style={{ color:'var(--muted)' }}>{event.start}</span>
          {event.status !== 'done' && <span style={{ color:'var(--green)', fontWeight:700, marginLeft:8 }}>{dday}</span>}
        </div>
      </div>
      <span style={{ fontSize:17, flexShrink:0 }}>{saved?'❤️':'🤍'}</span>
    </Link>
  );
}
