'use client';
import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventCard, EventCardSkeleton, EventCardHorizontal } from '@/components/events/EventCard';
import { KakaoMap as KoreaMap } from '@/components/events/KakaoMap';
import { Header } from '@/components/layout/Header';
import { EVENTS, REGIONS, getDynamicEvents } from '@/lib/data';
import { SPORTS_15 } from '@/lib/sports';
import { Search, X, SlidersHorizontal, Map } from 'lucide-react';

type Tab = 'all'|'month'|'week';

function getWeekRange() {
  const today = new Date(); const mon = new Date(today);
  mon.setDate(today.getDate()-today.getDay()+1);
  const sun = new Date(mon); sun.setDate(mon.getDate()+6);
  const fmt=(d:Date)=>d.toISOString().slice(0,10);
  return {start:fmt(mon),end:fmt(sun)};
}
function getMonthRange() {
  const today = new Date();
  const y=today.getFullYear(), m=today.getMonth()+1;
  return {start:`${y}-${String(m).padStart(2,'0')}-01`,end:`${y}-${String(m).padStart(2,'0')}-31`};
}

export default function EventsPageClient() {
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>('all');
  const [sport, setSport] = useState(params.get('sport')||'');
  const [region, setRegion] = useState(params.get('region')||'');
  const [query, setQuery] = useState(params.get('q')||'');
  const [showMap, setShowMap] = useState(false);
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');

  const allEvents = getDynamicEvents();

  const filtered = useMemo(()=>{
    let evs = allEvents;
    if (tab==='month'){const {start,end}=getMonthRange(); evs=evs.filter(e=>e.start>=start&&e.start<=end);}
    if (tab==='week'){const {start,end}=getWeekRange(); evs=evs.filter(e=>e.start>=start&&e.start<=end);}
    if (sport) evs=evs.filter(e=>e.sport===sport);
    if (region) evs=evs.filter(e=>e.region===region);
    if (query) evs=evs.filter(e=>e.title.includes(query)||e.venue.includes(query)||e.region.includes(query));
    return evs;
  },[tab,sport,region,query,allEvents]);

  return (
    <>
      <Header showSearch/>
      <div className="flex min-h-screen">
        {/* 필터 사이드바 */}
        <aside className="hidden md:flex flex-col gap-2 w-[200px] flex-shrink-0 p-4 border-r border-border bg-white">
          <div className="font-bold text-[13px] text-muted mb-1 tracking-wider">종목</div>
          {SPORTS_15.map(sp=>(
            <button key={sp.key} onClick={()=>setSport(sp.key==='전체'?'':sp.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all text-left ${sport===(sp.key==='전체'?'':sp.key)?'bg-[#0F0F0F] text-white':'hover:bg-[#F5F5F5] text-ink'}`}>
              <img src={sp.icon} alt={sp.label} className="w-5 h-5 object-contain"/>
              {sp.label}
            </button>
          ))}
          <div className="font-bold text-[13px] text-muted mt-3 mb-1 tracking-wider">지역</div>
          {['전체',...REGIONS].map(r=>(
            <button key={r} onClick={()=>setRegion(r==='전체'?'':r)}
              className={`px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all text-left ${region===(r==='전체'?'':r)?'bg-[#0F0F0F] text-white':'hover:bg-[#F5F5F5] text-ink'}`}>
              {r}
            </button>
          ))}
        </aside>

        {/* 메인 */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-[1560px] mx-auto px-4 md:px-8 py-6">
            {/* 탭 + 검색 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <div className="flex gap-1 bg-[#F5F5F5] rounded-xl p-1">
                {(['all','month','week'] as Tab[]).map(t=>(
                  <button key={t} onClick={()=>setTab(t)}
                    className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${tab===t?'bg-white shadow text-ink':'text-muted hover:text-ink'}`}>
                    {t==='all'?'전체':t==='month'?'이번달':'이번주'}
                  </button>
                ))}
              </div>
              <div className="flex-1 flex items-center gap-2 bg-[#F5F5F5] rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-muted flex-shrink-0"/>
                <input value={query} onChange={e=>setQuery(e.target.value)}
                  placeholder="대회명·지역 검색" className="flex-1 bg-transparent text-[14px] outline-none"/>
                {query && <button onClick={()=>setQuery('')}><X className="w-4 h-4 text-muted"/></button>}
              </div>
              <span className="text-[13px] text-muted font-semibold">{filtered.length}건</span>
            </div>

            {/* 결과 없음 */}
            {filtered.length===0 && (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                <p className="font-bold text-[18px] mb-2">검색 결과가 없어요</p>
                <p className="text-muted text-[14px] mb-5">다른 종목이나 지역으로 검색해보세요</p>
                <button onClick={()=>{setSport('');setRegion('');setQuery('');setTab('all');}}
                  className="px-5 py-2.5 font-bold text-[14px] rounded-xl" style={{background:'#0F0F0F',color:'#fff'}}>
                  필터 초기화
                </button>
              </div>
            )}

            {/* 그리드 */}
            {filtered.length>0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filtered.map(e=><EventCard key={e.id} event={e}/>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
