'use client';
import { useState, useMemo } from 'react';
import { SportEvent } from '@/types';
import { KakaoMap } from './KakaoMap';
import { EventCard } from './EventCard';
import { SPORTS_15 } from '@/lib/sports';
import { ArrowLeft, X, Map, CalendarDays } from 'lucide-react';
import { calcDday, calcRegistrationStatus, REG_STATUS_LABELS } from '@/lib/data';

export function RegionListView({ region, events, onBack }: { region:string; events:SportEvent[]; onBack:()=>void }) {
  const [sort, setSort] = useState<'date'|'size'>('date');
  const [showMap, setShowMap] = useState(false);

  const sorted = useMemo(()=>[...events].sort((a,b)=>
    sort==='date'?a.start.localeCompare(b.start):parseInt(b.participants)-parseInt(a.participants)
  ),[events,sort]);

  return (
    <div className="flex min-h-screen" style={{background:'bg-bg'}}>
      <div className="flex-1 min-w-0 px-4 md:px-10 py-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-[13px] text-muted hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4"/> 뒤로
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-extrabold">{region}</h2>
            <span className="text-[13px] text-[bg-primary] font-bold">{sorted.length}건</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select value={sort} onChange={e=>setSort(e.target.value as 'date'|'size')}
              className="border border-[#DDD] rounded-full px-3 py-1.5 text-[13px] font-semibold bg-white outline-none">
              <option value="date">날짜 임박순</option>
              <option value="size">규모순</option>
            </select>
            <button onClick={()=>setShowMap(v=>!v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] font-semibold md:hidden
                ${showMap?'bg-[bg-primary] text-white border-[bg-primary]':'border-[#DDD] text-[#333]'}`}>
              <Map className="w-3.5 h-3.5"/>
            </button>
          </div>
        </div>

        {/* 모바일 지도 */}
        {showMap && (
          <div className="relative bg-[#C8DCE8] rounded-2xl overflow-hidden h-64 mb-5 md:hidden">
            <KakaoMap events={events} className="w-full h-full"/>
            <button onClick={()=>setShowMap(false)}
              className="absolute top-2 right-2 bg-[#222] text-white rounded-full px-3 py-1 text-xs font-bold">
              목록 보기
            </button>
          </div>
        )}

        {sorted.length===0 ? (
          <div className="border-2 border-dashed border-[#DDD] rounded-2xl p-12 text-center bg-white">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-bold text-ink mb-4">{region} 지역의 예정 대회가 없습니다</p>
            <button onClick={onBack} className="bg-[bg-primary] text-white px-5 py-2.5 rounded-xl text-sm font-bold">
              다른 지역 보기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sorted.map(e => <EventCard key={e.id} event={e}/>)}
          </div>
        )}
      </div>

      {/* 데스크톱 지도 */}
      <aside className="hidden md:block w-[400px] flex-shrink-0 sticky top-0 h-screen">
        <div className="relative w-full h-full bg-[#C8DCE8]">
          <KakaoMap events={events} className="w-full h-full"/>
        </div>
      </aside>
    </div>
  );
}
