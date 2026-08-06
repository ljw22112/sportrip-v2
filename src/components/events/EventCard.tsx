'use client';
import Link from 'next/link';
import { SportEvent } from '@/types';
import { calcDday } from '@/lib/data';
import { MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const S_COLOR = { upcoming: 'text-[#1A3A2A] bg-[#E8F5E9]', ongoing: 'text-[#7C4D00] bg-[#FFF3E0]', done: 'text-[#717171] bg-[#F7F7F7]' };
const S_LABEL = { upcoming: '예정', ongoing: '진행중', done: '종료' };

export function EventCard({ event }: { event: SportEvent }) {
  const dday = calcDday(event.start);
  const isDone = event.status === 'done';

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <div className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* 썸네일 — 에어비앤비처럼 밝은 배경 */}
        <div className="relative aspect-[4/3] bg-[#F0F4F0] flex items-center justify-center overflow-hidden rounded-2xl mb-2.5">
          <span className="text-6xl group-hover:scale-105 transition-transform duration-300">{event.icon}</span>
          {/* D-Day */}
          {!isDone && (
            <div className="absolute top-3 left-3 bg-white text-[#1A1A1A] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              {dday}
            </div>
          )}
        </div>

        {/* 텍스트 — 에어비앤비 카드 텍스트 구조 */}
        <div className="px-0.5">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[13px] font-semibold text-[#1A1A1A] line-clamp-1">{event.title}</span>
            <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2', S_COLOR[event.status])}>
              {S_LABEL[event.status]}
            </span>
          </div>
          <div className="text-[13px] text-[#717171]">{event.region} · {event.sport}</div>
          <div className="text-[13px] text-[#717171] font-mono">{event.start}</div>
          {event.participants && (
            <div className="text-[13px] font-semibold text-[#1A1A1A] mt-0.5">{event.participants} 참가</div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] bg-[#F7F7F7] rounded-2xl mb-2.5" />
      <div className="h-3.5 w-3/4 bg-[#F0F0F0] rounded mb-1.5" />
      <div className="h-3 w-1/2 bg-[#F0F0F0] rounded mb-1.5" />
      <div className="h-3 w-2/5 bg-[#F0F0F0] rounded" />
    </div>
  );
}

export function EventCardHorizontal({ event }: { event: SportEvent }) {
  const dday = calcDday(event.start);
  return (
    <Link href={`/events/${event.id}`} className="group flex gap-4 py-4 border-b border-[#E5E5E5] hover:bg-[#F7F7F7] px-2 rounded-xl transition-colors -mx-2">
      <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-[#F0F4F0] flex items-center justify-center text-3xl">{event.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[13px] text-[#1A1A1A] line-clamp-2 mb-0.5 group-hover:underline">{event.title}</div>
        <div className="text-[13px] text-[#717171]">{event.region} · {event.sport}</div>
        <div className="text-[13px] text-[#717171] font-mono">{event.start} <span className="text-[#1A3A2A] font-semibold">{dday}</span></div>
      </div>
    </Link>
  );
}
