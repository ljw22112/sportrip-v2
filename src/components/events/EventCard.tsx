'use client';
import Link from 'next/link';
import { SportEvent } from '@/types';
import { calcDday } from '@/lib/data';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// 종목별 카드 그라디언트
const SPORT_GRADIENT: Record<string, string> = {
  '마라톤':  'from-[#1A3A2A] to-[#2D6A4F]',
  '배드민턴':'from-[#1A2A3A] to-[#2D4A6A]',
  '수영':    'from-[#1A2A4A] to-[#2D5A8A]',
  '축구':    'from-[#2A1A3A] to-[#4A2D6A]',
  '테니스':  'from-[#3A2A1A] to-[#6A4A2D]',
  '사이클':  'from-[#1A3A3A] to-[#2D6A6A]',
  '골프':    'from-[#2A3A1A] to-[#4A6A2D]',
  '야구':    'from-[#3A1A1A] to-[#6A2D2D]',
  '농구':    'from-[#3A2A1A] to-[#7A5A2A]',
  '배구':    'from-[#1A1A3A] to-[#2D2D7A]',
  '태권도':  'from-[#3A1A2A] to-[#6A2D4A]',
  '종합':    'from-[#1A3A2A] to-[#3A6A1A]',
  '기타':    'from-[#2A2A2A] to-[#4A4A4A]',
};

function fmt(dateStr: string) {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const days = ['일','월','화','수','목','금','토'];
  const dow = days[d.getDay()];
  return `${month}.${String(day).padStart(2,'0')} (${dow})`;
}

export function EventCard({ event, saved: initSaved = false }: { event: SportEvent; saved?: boolean }) {
  const [saved, setSaved] = useState(initSaved);
  const dday = calcDday(event.start);
  const grad = SPORT_GRADIENT[event.sport] || SPORT_GRADIENT['기타'];

  return (
    <div className="flex-shrink-0 w-[200px] sm:w-[220px]">
      {/* 카드 본체 */}
      <Link href={`/events/${event.id}`} className="block relative rounded-2xl overflow-hidden mb-2.5 group"
        style={{ aspectRatio: '3/4' }}>
        {/* 그라디언트 배경 */}
        <div className={cn('absolute inset-0 bg-gradient-to-br', grad)} />
        {/* 패턴 오버레이 */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* 상단 */}
        <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between">
          <div>
            <div className="text-[9px] font-bold text-white/60 tracking-widest mb-1">2026 SPORTRIP</div>
            <div className="w-8 h-0.5 bg-[#D4FF4A]" />
          </div>
          <button onClick={e => { e.preventDefault(); e.stopPropagation(); setSaved(v => !v); }}
            className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors">
            <Heart className={cn('w-3.5 h-3.5', saved ? 'fill-white text-white' : 'text-white/80')} />
          </button>
        </div>

        {/* 제목 */}
        <div className="absolute inset-x-3 top-1/3">
          <p className="text-white font-bold text-base leading-snug line-clamp-4">{event.title}</p>
        </div>

        {/* 하단 날짜 */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="text-[#D4FF4A] font-black text-xl leading-none mb-1">{fmt(event.start)}</div>
          <div className="text-white/60 text-[10px] truncate">{event.region} · {event.venue}</div>
        </div>
      </Link>

      {/* 카드 아래 텍스트 (에어비앤비+runneron 스타일) */}
      <Link href={`/events/${event.id}`} className="block">
        <div className="font-semibold text-[13px] text-[#1A1A1A] line-clamp-1 mb-0.5">{event.title}</div>
        <div className="text-[12px] text-[#717171]">{event.region} {event.venue.slice(0,6)} · {event.sport}</div>
        <div className="text-[12px] text-[#FF5722]">
          {fmt(event.start)} · 정원 {event.participants}
        </div>
      </Link>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[200px] sm:w-[220px] animate-pulse">
      <div className="bg-[#F0F0F0] rounded-2xl mb-2.5" style={{ aspectRatio: '3/4' }} />
      <div className="h-3.5 w-3/4 bg-[#F0F0F0] rounded mb-1.5" />
      <div className="h-3 w-1/2 bg-[#F0F0F0] rounded" />
    </div>
  );
}

export function EventCardHorizontal({ event }: { event: SportEvent }) {
  const dday = calcDday(event.start);
  return (
    <Link href={`/events/${event.id}`} className="group flex gap-4 py-4 border-b border-[#E5E5E5] hover:bg-[#F7F7F7] px-2 rounded-xl transition-colors -mx-2">
      <div className={cn('w-16 h-16 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs text-center leading-tight p-1',
        SPORT_GRADIENT[event.sport] || SPORT_GRADIENT['기타'])}>
        {event.sport}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[13px] text-[#1A1A1A] line-clamp-2 mb-0.5 group-hover:underline">{event.title}</div>
        <div className="text-[12px] text-[#717171]">{event.region} · {event.sport}</div>
        <div className="text-[12px] text-[#FF5722] font-mono">{event.start} <span className="text-[#1A3A2A] font-semibold">{dday}</span></div>
      </div>
    </Link>
  );
}
