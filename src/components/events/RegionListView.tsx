'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { SportEvent } from '@/types';
import { EventCard } from './EventCard';
import { KoreaMap } from './KoreaMap';
import { ArrowLeft, X, Map } from 'lucide-react';
import { calcDday } from '@/lib/data';

export function RegionListView({ region, events, onBack }: { region:string; events:SportEvent[]; onBack:()=>void }) {
  const [sort, setSort] = useState<'date'|'size'>('date');
  const [showMap, setShowMap] = useState(false);
  const sorted = useMemo(()=>[...events].sort((a,b)=>sort==='date'?a.start.localeCompare(b.start):parseInt(b.participants)-parseInt(a.participants)),[events,sort]);

  return (
    <div className="flex min-h-screen">
      {/* 목록 */}
      <div className="flex-1 min-w-0 px-4 md:px-20 py-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-[--muted] mb-4 hover:text-[--ink] transition-colors">
          <ArrowLeft className="w-4 h-4"/> 처음으로
        </button>
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-[14px] font-bold">{sorted.length}건</span>
          <span onClick={onBack} className="flex items-center gap-1 bg-[--green-tint] text-[--green] text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer">
            {region} <X className="w-3 h-3"/>
          </span>
          <select value={sort} onChange={e=>setSort(e.target.value as 'date'|'size')}
            className="ml-auto border border-[--line] rounded-full px-3 py-1.5 text-[13.5px] font-semibold bg-white">
            <option value="date">날짜 임박순</option>
            <option value="size">규모순</option>
          </select>
          <button onClick={()=>setShowMap(v=>!v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] font-semibold md:hidden
              ${showMap?'bg-[--ink] text-white border-[--ink]':'border-[--line] text-[--ink]'}`}>
            <Map className="w-3.5 h-3.5"/>
          </button>
        </div>

        {/* 모바일 지도 */}
        {showMap&&(
          <div className="relative bg-[#D8E4DA] border border-[--line] rounded-2xl overflow-hidden h-56 mb-4 md:hidden">
            <KoreaMap events={events} className="w-full h-full"/>
            <button onClick={()=>setShowMap(false)} className="absolute top-2 right-2 bg-[--ink] text-white rounded-full px-3 py-1 text-xs font-bold">목록 보기</button>
          </div>
        )}

        {sorted.length===0?(
          <div className="border border-dashed border-[--line] rounded-2xl p-10 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-bold text-[--ink] mb-4">{region} 지역의 예정 대회가 없습니다</p>
            <button onClick={onBack} className="bg-[--green] text-white px-5 py-2.5 rounded-xl text-sm font-bold">다른 지역 보기</button>
          </div>
        ):(
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sorted.map(e=><EventCard key={e.id} event={e}/>)}
          </div>
        )}
      </div>

      {/* 데스크톱 지도 */}
      <aside className="hidden md:block w-[380px] flex-shrink-0 sticky top-0 h-screen border-l border-[--line]">
        <div className="relative w-full h-full bg-[#D8E4DA]">
          <KoreaMap events={events} className="w-full h-full"/>
          <div className="absolute right-3 top-3 flex flex-col bg-white rounded-xl overflow-hidden shadow-sm">
            <button className="w-8 h-8 text-sm font-bold border-b border-[--line]">+</button>
            <button className="w-8 h-8 text-sm font-bold">−</button>
          </div>
          <div className="absolute left-3 bottom-3 bg-white/90 rounded-full text-[11px] text-[--muted] px-3 py-1">
            점을 누르면 대회 상세로 이동
          </div>
        </div>
      </aside>
    </div>
  );
}
