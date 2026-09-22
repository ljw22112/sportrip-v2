'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { SportEvent } from '@/types';
import { EventCard } from './EventCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function EventRow({ title, href, events }: { title:string; href:string; events:SportEvent[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({left:d*200,behavior:'smooth'});

  return (
    <section className="max-w-[1760px] mx-auto px-5 md:px-20 py-6 md:py-7">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base font-bold tracking-tight text-[--ink]">{title}</h2>
        <div className="ml-auto flex items-center gap-2">
          <Link href={href}
            className="text-[13px] font-semibold text-[--green] border border-[--green] px-3 py-1 rounded-full hover:bg-[--green-tint] transition-colors">
            전체보기 ›
          </Link>
          <button onClick={()=>scroll(-1)} className="flex w-7 h-7 bg-[--gray] rounded-full items-center justify-center hover:bg-[--line-soft] transition-colors">
            <ChevronLeft className="w-3.5 h-3.5"/>
          </button>
          <button onClick={()=>scroll(1)} className="flex w-7 h-7 bg-[--gray] rounded-full items-center justify-center hover:bg-[--line-soft] transition-colors">
            <ChevronRight className="w-3.5 h-3.5"/>
          </button>
        </div>
      </div>
      {events.length === 0 ? (
        <div className="border border-dashed border-[--line] rounded-2xl p-6 text-center text-[13.5px] text-[--muted]">
          이 기간에 열리는 대회가 없습니다.
        </div>
      ) : (
        <div ref={ref}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{scrollbarWidth:'none', WebkitOverflowScrolling:'touch'} as any}>
          {events.slice(0,6).map(e=>(
            <div key={e.id} className="flex-none w-[160px] md:w-[200px]">
              <EventCard event={e}/>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
