'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { SportEvent } from '@/types';
import { EventCard } from './EventCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  href: string;
  events: SportEvent[];
}

export function EventRow({ title, href, events }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -460 : 460, behavior: 'smooth' });
  };

  if (events.length === 0) return null;

  return (
    <div className="mb-12">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <Link href={href} className="flex items-center gap-1 text-base font-bold text-[#1A1A1A] hover:underline">
          {title}
          <ChevronRight className="w-4 h-4" />
        </Link>
        <div className="flex gap-1">
          <button onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-[#D0D0D0] flex items-center justify-center hover:border-[#1A1A1A] transition-colors bg-white">
            <ChevronLeft className="w-4 h-4 text-[#1A1A1A]" />
          </button>
          <button onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-[#D0D0D0] flex items-center justify-center hover:border-[#1A1A1A] transition-colors bg-white">
            <ChevronRight className="w-4 h-4 text-[#1A1A1A]" />
          </button>
        </div>
      </div>

      {/* 가로 스크롤 카드 행 — 6개 보임 */}
      <div ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {events.map(e => <EventCard key={e.id} event={e} />)}
      </div>
    </div>
  );
}
