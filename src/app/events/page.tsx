'use client';
import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventCard, EventCardSkeleton, EventCardHorizontal } from '@/components/events/EventCard';
import { KoreaMap } from '@/components/events/KoreaMap';
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

function EventsContent() {
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>('all');
  const [sport, setSport] = useState(params.get('sport')||'');
  const [keyword, setKeyword] = useState(params.get('q')||'');
  const [region, setRegion] = useState(params.get('region')||'');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState<'date'|'size'>('date');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(()=>{
    const fn=()=>setIsMobile(window.innerWidth<768);
    fn(); window.addEventListener('resize',fn);
    return()=>window.removeEventListener('resize',fn);
  },[]);
  useEffect(()=>{ if(!isMobile) setShowMap(true); },[isMobile]);

  const activeCount = [region,status].filter(Boolean).length;

  const base = useMemo(()=>{
    const de = getDynamicEvents();
    if(tab==='week'){const{start,end}=getWeekRange();return de.filter(e=>e.start>=start&&e.start<=end);}
    if(tab==='month'){const{start,end}=getMonthRange();return de.filter(e=>e.start>=start&&e.start<=end);}
    return de;
  },[tab]);

  const filtered = useMemo(()=>base.filter(e=>{
    if(sport&&sport!=='전체'&&e.sport!==sport) return false;
    if(region&&e.region!==region) return false;
    if(status&&e.status!==status) return false;
    if(keyword&&!e.title.includes(keyword)&&!e.region.includes(keyword)) return false;
    return true;
  }).sort((a,b)=>sort==='date'?a.start.localeCompare(b.start):parseInt(b.participants)-parseInt(a.participants))
  ,[base,sport,region,status,keyword,sort]);

  const reset=()=>{setRegion('');setStatus('');setKeyword('');setSport('');};

  return (
    <>
      <Header showSearch/>
      <div className="flex min-h-screen">
        {/* 목록 영역 */}
        <div className={`flex-1 min-w-0 ${showMap&&!isMobile?'max-w-[calc(100%-400px)]':''}`}>
          <div className="px-4 md:px-10 py-5">

            {/* 15개 종목 칩 */}
            <div className="flex overflow-x-auto gap-2 mb-5 pb-1" style={{scrollbarWidth:'none'}}>
              {SPORTS_15.map(sp=>{
                const active = sport===sp.key||(sp.key==='전체'&&!sport);
                return (
                  <button key={sp.key} onClick={()=>setSport(sp.key==='전체'?'':sp.key)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-bold border-2 transition-all
                      ${active ? 'text-white border-transparent' : 'bg-white text-[#333] border-[#E0E0E0] hover:border-[#333]'}`}
                    style={active ? {background:sp.color, borderColor:sp.color} : {}}>
                    <span className="text-base">{sp.emoji}</span>
                    <span>{sp.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 검색 + 필터 + 지도토글 */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AAAAAA]"/>
                <input value={keyword} onChange={e=>setKeyword(e.target.value)}
                  placeholder="대회명, 지역 검색..."
                  className="w-full pl-10 pr-8 py-3 border-2 border-[#E0E0E0] rounded-full text-[14px] outline-none focus:border-[#0B5C43] transition-colors"/>
                {keyword && <button onClick={()=>setKeyword('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA]"><X className="w-4 h-4"/></button>}
              </div>
              <button onClick={()=>setFilterOpen(v=>!v)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-full border-2 text-[14px] font-semibold transition-all
                  ${activeCount>0?'border-[#0B5C43] bg-[#0B5C43] text-white':'border-[#E0E0E0] text-[#333] hover:border-[#333]'}`}>
                <SlidersHorizontal className="w-4 h-4"/>
                <span className="hidden sm:inline">필터</span>
                {activeCount>0&&<span>{activeCount}</span>}
              </button>
              <button onClick={()=>setShowMap(v=>!v)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-full border-2 text-[14px] font-semibold transition-all
                  ${showMap?'border-[#0B5C43] bg-[#0B5C43] text-white':'border-[#E0E0E0] text-[#333] hover:border-[#333]'}`}>
                <Map className="w-4 h-4"/>
                <span className="hidden md:inline">{showMap?'지도 숨기기':'지도 보기'}</span>
              </button>
            </div>

            {/* 필터 패널 */}
            {filterOpen && (
              <div className="border-2 border-[#E0E0E0] rounded-2xl p-4 mb-4 bg-white">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[13px] font-bold mb-1.5 text-[#333]">지역</div>
                    <select value={region} onChange={e=>setRegion(e.target.value)}
                      className="w-full border-2 border-[#E0E0E0] rounded-xl px-3 py-2.5 text-[14px] bg-white outline-none">
                      <option value="">전체 지역</option>
                      {REGIONS.slice(1).map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold mb-1.5 text-[#333]">상태</div>
                    <select value={status} onChange={e=>setStatus(e.target.value)}
                      className="w-full border-2 border-[#E0E0E0] rounded-xl px-3 py-2.5 text-[14px] bg-white outline-none">
                      <option value="">전체</option>
                      <option value="upcoming">예정</option>
                      <option value="done">종료</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  <button onClick={()=>{reset();setFilterOpen(false);}} className="text-[14px] font-bold underline text-[#717171]">전체 해제</button>
                  <button onClick={()=>setFilterOpen(false)} className="bg-[#0B5C43] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold">적용</button>
                </div>
              </div>
            )}

            {/* 탭 */}
            <div className="flex border-b-2 border-[#EBEBEB] mb-5">
              {(['all','month','week'] as Tab[]).map((t,i)=>(
                <button key={t} onClick={()=>setTab(t)}
                  className={`px-4 py-3 text-[14px] font-bold border-b-2 -mb-0.5 transition-all whitespace-nowrap
                    ${tab===t?'border-[#222] text-[#222]':'border-transparent text-[#717171] hover:text-[#222]'}`}>
                  {['전체 대회','이번달의 대회','이번주의 대회'][i]}
                </button>
              ))}
              <select value={sort} onChange={e=>setSort(e.target.value as 'date'|'size')}
                className="ml-auto border-0 text-[14px] font-semibold text-[#717171] bg-white outline-none cursor-pointer self-center">
                <option value="date">날짜순</option>
                <option value="size">규모순</option>
              </select>
            </div>

            {/* 결과 수 + 태그 */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[15px] font-bold text-[#222]">{filtered.length}건</span>
              {region&&<span onClick={()=>setRegion('')} className="flex items-center gap-1 bg-[#E7F1EC] text-[#0B5C43] text-[12px] font-bold px-2.5 py-1 rounded-full cursor-pointer">{region} <X className="w-3 h-3"/></span>}
              {status&&<span onClick={()=>setStatus('')} className="flex items-center gap-1 bg-[#E7F1EC] text-[#0B5C43] text-[12px] font-bold px-2.5 py-1 rounded-full cursor-pointer">{{upcoming:'예정',done:'종료'}[status]} <X className="w-3 h-3"/></span>}
            </div>

            {/* 모바일 지도 */}
            {showMap&&isMobile&&(
              <div className="relative bg-[#C8DCE8] border-2 border-[#EBEBEB] rounded-2xl overflow-hidden h-72 mb-5">
                <KoreaMap events={filtered.filter(e=>e.status!=='done')} className="w-full h-full"/>
                <button onClick={()=>setShowMap(false)} className="absolute top-2 right-2 bg-[#222] text-white rounded-full px-3 py-1.5 text-[12px] font-bold z-20">
                  목록 보기
                </button>
              </div>
            )}

            {/* 빈 결과 */}
            {filtered.length===0&&(
              <div className="border-2 border-dashed border-[#EBEBEB] rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="font-bold text-[#222] text-[16px] mb-1">조건에 맞는 대회가 없습니다</p>
                <button onClick={reset} className="mt-4 bg-[#0B5C43] text-white px-6 py-3 rounded-xl text-[14px] font-bold">전체 초기화</button>
              </div>
            )}

            {/* 대회 목록 */}
            {tab==='all'&&filtered.length>0&&(
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {filtered.map(e=><EventCard key={e.id} event={e}/>)}
              </div>
            )}
            {tab!=='all'&&filtered.length>0&&(
              <div>{filtered.map(e=><EventCardHorizontal key={e.id} event={e}/>)}</div>
            )}
          </div>
        </div>

        {/* 데스크톱 지도 (sticky) */}
        {showMap&&!isMobile&&(
          <aside className="hidden md:block w-[400px] flex-shrink-0 sticky top-0 h-screen border-l-2 border-[#EBEBEB]">
            <div className="relative w-full h-full bg-[#C8DCE8]">
              <KoreaMap events={filtered.filter(e=>e.status!=='done')} className="w-full h-full"/>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <>
        <Header showSearch/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 md:p-10">
          {Array.from({length:8}).map((_,i)=><EventCardSkeleton key={i}/>)}
        </div>
      </>
    }>
      <EventsContent/>
    </Suspense>
  );
}
