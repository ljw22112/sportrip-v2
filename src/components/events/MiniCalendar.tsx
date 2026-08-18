'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SportEvent } from '@/types';
import { getSportInfo } from '@/lib/sports';

interface Props { events: SportEvent[]; }

export function MiniCalendar({ events }: Props) {
  const today = new Date();
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = cur.getFullYear();
  const month = cur.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCur(new Date(year, month - 1, 1));
  const nextMonth = () => setCur(new Date(year, month + 1, 1));

  // 이 달의 대회 날짜 맵
  const eventMap: Record<number, SportEvent[]> = {};
  events.forEach(e => {
    const d = new Date(e.start);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventMap[day]) eventMap[day] = [];
      eventMap[day].push(e);
    }
  });

  const todayStr = today.toISOString().slice(0, 10);
  const cells: (number | null)[] = Array(firstDay === 0 ? 6 : firstDay - 1).fill(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-[bg-bg]">
        <button onClick={prevMonth} className="p-1 rounded hover:bg-[#EBEBEB] transition-colors">
          <ChevronLeft className="w-4 h-4 text-[#555]"/>
        </button>
        <span className="font-bold text-[15px]">{year}년 {month + 1}월</span>
        <button onClick={nextMonth} className="p-1 rounded hover:bg-[#EBEBEB] transition-colors">
          <ChevronRight className="w-4 h-4 text-[#555]"/>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center text-[11px] font-bold text-faint py-1.5 border-b border-[#F0F0F0]">
        {['월','화','수','목','금','토','일'].map(d=>(
          <div key={d} className={d==='일'?'text-red-400':d==='토'?'text-blue-400':''}>{d}</div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 flex-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="border-b border-r border-[#F5F5F5]"/>;
          const dayStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const dayEvents = eventMap[day] || [];
          const isToday = dayStr === todayStr;
          const colIdx = i % 7;
          const isSun = colIdx === 6;
          const isSat = colIdx === 5;
          return (
            <div key={i}
              className={`border-b border-r border-[#F5F5F5] p-1 min-h-[56px] ${dayEvents.length?'hover:bg-[#F0F9F0] cursor-pointer':''}`}>
              <div className={`text-[12px] font-bold w-6 h-6 flex items-center justify-center rounded-full mx-auto mb-0.5
                ${isToday?'bg-[bg-primary] text-white':isSun?'text-red-400':isSat?'text-blue-400':'text-[#333]'}`}>
                {day}
              </div>
              {dayEvents.slice(0,2).map(e=>{
                const sp = getSportInfo(e.sport);
                return (
                  <Link key={e.id} href={`/events/${e.id}`}
                    className="block text-[9px] leading-tight truncate rounded px-0.5 mb-0.5 font-semibold"
                    style={{color:sp.color,background:sp.color+'15'}}>
                    {e.title}
                  </Link>
                );
              })}
              {dayEvents.length > 2 && (
                <div className="text-[9px] text-[bg-primary] font-bold text-center">+{dayEvents.length-2}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 링크 */}
      <div className="px-4 py-3 border-t border-[#F0F0F0]">
        <Link href="/calendar" className="block text-center text-[13px] font-bold text-[bg-primary] hover:underline">
          월간 캘린더 전체 보기 ›
        </Link>
      </div>
    </div>
  );
}
