'use client';
import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventCard, EventCardSkeleton, EventCardHorizontal } from '@/components/events/EventCard';
import { KoreaMap } from '@/components/events/KoreaMap';
import { Header } from '@/components/layout/Header';
import { EVENTS, REGIONS, getDynamicEvents } from '@/lib/data';
import { getWeekRange, getMonthRange } from '@/lib/utils';
import { Search, X, SlidersHorizontal, Map } from 'lucide-react';

const CHIPS = ['전체','마라톤','러닝','자전거','축구','배드민턴','수영','테니스','트레일','기타'];
type Tab = 'all'|'month'|'week';

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
  // 데스크톱에서는 기본 지도 표시
  useEffect(()=>{ if(!isMobile) setShowMap(true); },[isMobile]);

  const activeCount = [region,status].filter(Boolean).length;
  const base = useMemo(()=>{
    const de = getDynamicEvents();
    if(tab==='week'){const{start,end}=getWeekRange();return de.filter(e=>e.start>=start&&e.start<=end);}
    if(tab==='month'){const{start,end}=getMonthRange();return de.filter(e=>e.start>=start&&e.start<=end);}
    return de;
  },[tab]);

  const filtered = useMemo(()=>base.filter(e=>{
    if(sport&&sport!=='전체'&&e.sport!==sport)return false;
    if(region&&e.region!==region)return false;
    if(status&&e.status!==status)return false;
    if(keyword&&!e.title.includes(keyword)&&!e.region.includes(keyword))return false;
    return true;
  }).sort((a,b)=>sort==='date'?a.start.localeCompare(b.start):parseInt(b.participants)-parseInt(a.participants))
  ,[base,sport,region,status,keyword,sort]);

  const reset=()=>{setRegion('');setStatus('');setKeyword('');setSport('');};

  return (
    <>
      <Header showSearch/>
      <div className="flex min-h-screen">
        {/* 목록 영역 */}
        <div className={`flex-1 min-w-0 ${showMap&&!isMobile?'max-w-[calc(100%-380px)]':''}`}>
          <div className="max-w-[1760px] mx-auto px-4 md:px-20 py-4">
            {/* 종목 칩 */}
            <div className="flex overflow-x-auto gap-0 border-b border-[--line] -mx-4 md:-mx-20 px-4 md:px-20 mb-4"
              style={{scrollbarWidth:'none'}}>
              {CHIPS.map(s=>{
                const active=sport===s||(s==='전체'&&!sport);
                return(
                  <button key={s} onClick={()=>setSport(s==='전체'?'':s)}
                    className={`flex-shrink-0 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all -mb-px
                      ${active?'border-[--ink] text-[--ink]':'border-transparent text-[--muted] hover:text-[--ink]'}`}>
                    {s}
                  </button>
                );
              })}
            </div>

            {/* 검색 + 필터 */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[--faint]"/>
                <input value={keyword} onChange={e=>setKeyword(e.target.value)}
                  placeholder="대회명, 지역 검색..."
                  className="w-full pl-9 pr-8 py-2.5 border border-[--line] rounded-full text-[13.5px] outline-none focus:border-[--green] transition-colors"/>
                {keyword&&<button onClick={()=>setKeyword('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[--muted]"><X className="w-3.5 h-3.5"/></button>}
              </div>
              <button onClick={()=>setFilterOpen(v=>!v)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border text-[13.5px] font-semibold transition-all
                  ${activeCount>0?'border-[--ink] bg-[--ink] text-white':'border-[--line] text-[--ink] hover:border-[--ink]'}`}>
                <SlidersHorizontal className="w-3.5 h-3.5"/>
                <span className="hidden sm:inline">필터</span>
                {activeCount>0&&<span className="text-xs">{activeCount}</span>}
              </button>
              {/* 지도 토글 (모바일) */}
              <button onClick={()=>setShowMap(v=>!v)}
                className={`md:hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border text-[13.5px] font-semibold transition-all
                  ${showMap?'border-[--ink] bg-[--ink] text-white':'border-[--line] text-[--ink]'}`}>
                <Map className="w-3.5 h-3.5"/>
              </button>
              {/* 지도 토글 (데스크톱) */}
              <button onClick={()=>setShowMap(v=>!v)}
                className={`hidden md:flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border text-[13.5px] font-semibold transition-all
                  ${showMap?'border-[--ink] bg-[--ink] text-white':'border-[--line] text-[--ink] hover:border-[--ink]'}`}>
                <Map className="w-3.5 h-3.5"/>
                <span>{showMap?'지도 숨기기':'지도 보기'}</span>
              </button>
            </div>

            {/* 필터 패널 */}
            {filterOpen&&(
              <div className="border border-[--line] rounded-2xl p-4 mb-3 bg-white">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-bold mb-1.5">지역</div>
                    <select value={region} onChange={e=>setRegion(e.target.value)}
                      className="w-full border border-[--line] rounded-xl px-3 py-2.5 text-[13.5px] bg-white">
                      <option value="">전체 지역</option>
                      {REGIONS.slice(1).map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="text-xs font-bold mb-1.5">상태</div>
                    <select value={status} onChange={e=>setStatus(e.target.value)}
                      className="w-full border border-[--line] rounded-xl px-3 py-2.5 text-[13.5px] bg-white">
                      <option value="">전체</option>
                      <option value="upcoming">예정</option>
                      <option value="done">종료</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  <button onClick={()=>{reset();setFilterOpen(false);}} className="text-[13.5px] font-bold underline">전체 해제</button>
                  <button onClick={()=>setFilterOpen(false)} className="bg-[--ink] text-white px-4 py-2 rounded-xl text-[13.5px] font-bold">적용</button>
                </div>
              </div>
            )}

            {/* 탭 */}
            <div className="flex border-b border-[--line] mb-4">
              {(['all','month','week'] as Tab[]).map((t,i)=>(
                <button key={t} onClick={()=>setTab(t)}
                  className={`px-3 md:px-4 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-all whitespace-nowrap
                    ${tab===t?'border-[--ink] text-[--ink]':'border-transparent text-[--muted] hover:text-[--ink]'}`}>
                  {['전체 대회','이번달의 대회','이번주의 대회'][i]}
                </button>
              ))}
              <select value={sort} onChange={e=>setSort(e.target.value as 'date'|'size')}
                className="ml-auto border-0 text-[13px] font-semibold text-[--muted] bg-white outline-none cursor-pointer self-center">
                <option value="date">날짜순</option>
                <option value="size">규모순</option>
              </select>
            </div>

            {/* 활성 태그 */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-[13.5px] font-bold text-[--ink]">{filtered.length}건</span>
              {region&&<span onClick={()=>setRegion('')} className="flex items-center gap-1 bg-[--green-tint] text-[--green] text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer">{region} <X className="w-3 h-3"/></span>}
              {status&&<span onClick={()=>setStatus('')} className="flex items-center gap-1 bg-[--green-tint] text-[--green] text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer">{{upcoming:'예정',done:'종료'}[status]} <X className="w-3 h-3"/></span>}
            </div>

            {/* 모바일 지도 */}
            {showMap&&isMobile&&(
              <div className="relative bg-[#D8E4DA] border border-[--line] rounded-2xl overflow-hidden h-56 mb-4">
                <KoreaMap events={filtered.filter(e=>e.status!=='done')} className="w-full h-full"/>
                <button onClick={()=>setShowMap(false)} className="absolute top-2 right-2 bg-[--ink] text-white rounded-full px-3 py-1 text-xs font-bold">
                  목록 보기
                </button>
              </div>
            )}

            {/* 빈 결과 */}
            {filtered.length===0&&(
              <div className="border border-dashed border-[--line] rounded-2xl p-10 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-bold text-[--ink] mb-1">조건에 맞는 대회가 없습니다</p>
                <button onClick={reset} className="mt-4 bg-[--ink] text-white px-5 py-2.5 rounded-xl text-sm font-bold">전체 초기화</button>
              </div>
            )}

            {/* 전체탭: 2열(모바일) / 3~4열(데스크톱) 그리드 */}
            {tab==='all'&&filtered.length>0&&(
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {filtered.map(e=><EventCard key={e.id} event={e}/>)}
              </div>
            )}
            {/* 이번달·이번주: 리스트 */}
            {tab!=='all'&&filtered.length>0&&(
              <div>{filtered.map(e=><EventCardHorizontal key={e.id} event={e}/>)}</div>
            )}
          </div>
        </div>

        {/* 데스크톱 지도 (sticky) */}
        {showMap&&!isMobile&&(
          <aside className="hidden md:block w-[380px] flex-shrink-0 sticky top-0 h-screen border-l border-[--line]">
            <div className="relative w-full h-full bg-[#D8E4DA]">
              <KoreaMap events={filtered.filter(e=>e.status!=='done')} className="w-full h-full"/>
              <div className="absolute right-3 top-3 flex flex-col bg-white rounded-xl overflow-hidden shadow-sm">
                <button className="w-8 h-8 text-sm font-bold border-b border-[--line]">+</button>
                <button className="w-8 h-8 text-sm font-bold">−</button>
              </div>
              <div className="absolute left-3 bottom-3 bg-white/90 rounded-full text-[11px] text-[--muted] px-3 py-1">
                점을 누르면 대회 상세로 이동
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<><Header showSearch/><div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 md:p-20">{Array.from({length:8}).map((_,i)=><EventCardSkeleton key={i}/>)}</div></>}>
      <EventsContent/>
    </Suspense>
  );
}
