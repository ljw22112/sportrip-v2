'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getDynamicEvents, getAllEvents } from '@/lib/data';
import { SPORTS_15 } from '@/lib/sports';
import { Header } from '@/components/layout/Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const REGION_COLOR: Record<string,string> = {
  서울:'#1a5276',부산:'#154360',경기:'#1a5276',강원:'#145a32',
  경남:'#145a32',전남:'#145a32',제주:'#145a32',대전:'#6e2f1a',
  충북:'#6e2f1a',충남:'#6e2f1a',경북:'#4a235a',전북:'#4a235a',광주:'#4a235a',
};
const getColor = (r:string) => REGION_COLOR[r]||'#34495e';

const MONTHS_KR = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
const DAYS = ['일','월','화','수','목','금','토'];

// SPORT_LIST → SPORTS_15 사용

function fmtDate(ds:string){
  const[y,m,d]=ds.split('-').map(Number);
  return`${m}월 ${d}일 (${'일월화수목금토'[new Date(Date.UTC(y,m-1,d)).getUTCDay()]})`;
}

export default function CalendarPage() {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [activeSport, setActiveSport] = useState('전체');
  const [dayPopup, setDayPopup] = useState<{ dateStr: string; events: ReturnType<typeof getDynamicEvents> } | null>(null);

  const allEvents = getDynamicEvents();

  // 종목 필터 적용
  const filtered = useMemo(() =>
    activeSport === '전체'
      ? allEvents
      : allEvents.filter(e => e.sport === activeSport),
    [activeSport, allEvents]
  );

  // 이번 달 이벤트
  const monthEvents = useMemo(() =>
    filtered.filter(e => {
      const d = new Date(e.start);
      return d.getFullYear()===year && d.getMonth()===month;
    }).sort((a,b)=>a.start.localeCompare(b.start)),
    [filtered, year, month]
  );

  const prevMonth = () => { if(month===0){setYear(y=>y-1);setMonth(11);}else setMonth(m=>m-1); };
  const nextMonth = () => { if(month===11){setYear(y=>y+1);setMonth(0);}else setMonth(m=>m+1); };

  const firstDay    = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const prevDays    = new Date(year,month,0).getDate();
  const todayStr    = today.toISOString().slice(0,10);

  const eventMap: Record<number,typeof allEvents> = {};
  monthEvents.forEach(e=>{
    const day=new Date(e.start).getDate();
    if(!eventMap[day])eventMap[day]=[];
    eventMap[day].push(e);
  });

  // 달력 셀
  const cells: React.ReactNode[] = [];
  for(let i=firstDay-1;i>=0;i--){
    cells.push(
      <div key={`p${i}`} className="min-h-[90px] md:min-h-[110px] p-1.5 bg-[#F7F7F6] border-r border-b border-[#E8E8E6]">
        <span className="text-xs text-[#AAAAAA]">{prevDays-i}</span>
      </div>
    );
  }
  for(let day=1;day<=daysInMonth;day++){
    const ds=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const isToday=ds===todayStr;
    const dow=new Date(year,month,day).getDay();
    const evs=eventMap[day]||[];
    const MAX=3; const extra=evs.length-MAX;
    const hasEvents = evs.length>0;
    cells.push(
      <div key={day}
        onClick={()=>{ if(hasEvents) setDayPopup({dateStr:ds, events:evs}); }}
        className={`min-h-[90px] md:min-h-[110px] p-1.5 bg-white border-r border-b border-[#E8E8E6] relative ${hasEvents?'cursor-pointer hover:bg-[#F7FBF8] transition-colors':''}`}>
        <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium mb-1 rounded-full
          ${isToday?'bg-[#0B5C43] text-white font-bold':dow===0?'text-red-500':dow===6?'text-blue-500':'text-[#1B1F1D]'}`}>
          {day}
        </span>
        {evs.slice(0,MAX).map((ev,i)=>(
          <Link key={i} href={`/events/${ev.id}`} onClick={(e)=>e.stopPropagation()}
            className="block mb-0.5 px-1.5 py-0.5 rounded text-[10px] md:text-[11px] font-semibold truncate leading-tight hover:opacity-80 transition-opacity border"
            style={{color:getColor(ev.region),borderColor:getColor(ev.region)+'55',background:getColor(ev.region)+'11'}}>
            <span className="opacity-75 mr-0.5">{ev.region}</span>{ev.title}
          </Link>
        ))}
        {extra>0&&(
          <span className="text-[10px] text-[#0B5C43] font-bold cursor-pointer">+{extra}개 더</span>
        )}
      </div>
    );
  }
  const rem=7-(cells.length%7);
  if(rem<7)for(let i=1;i<=rem;i++){
    cells.push(
      <div key={`n${i}`} className="min-h-[90px] md:min-h-[110px] p-1.5 bg-[#F7F7F6] border-r border-b border-[#E8E8E6]">
        <span className="text-xs text-[#AAAAAA]">{i}</span>
      </div>
    );
  }
  const rows:React.ReactNode[]=[];
  for(let i=0;i<cells.length;i+=7){
    rows.push(<div key={i} className="grid grid-cols-7">{cells.slice(i,i+7)}</div>);
  }

  return (
    <>
      <Header showSearch/>
      <main className="max-w-[1760px] mx-auto px-4 md:px-20 py-5 pb-20">
        {/* 브레드크럼 */}
        <p className="text-xs text-[#717171] mb-3">
          <Link href="/events" className="text-[#0B5C43] font-semibold">대회 일정</Link> › 캘린더
        </p>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight mb-1">
          {year}년 {MONTHS_KR[month]} 대회 일정
        </h1>
        <p className="text-[13px] text-[#717171] mb-5 hidden md:block">
          종목을 선택하면 해당 종목의 대회만 표시됩니다.
        </p>

        {/* ── 종목 필터 칩 ── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 pt-1" style={{scrollbarWidth:'none'}}>
          {SPORTS_15.map(sp=>(
            <button key={sp.key} onClick={()=>setActiveSport(sp.label)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] font-semibold flex-shrink-0 border-2 transition-all
                ${activeSport===sp.label
                  ? 'bg-[#0B5C43] border-[#0B5C43]'
                  : 'bg-white text-[#222] border-[#EBEBEB] hover:border-[#0B5C43] hover:bg-[#E7F1EC]'}`}>
              <img src={sp.icon} alt={sp.label}
                className={`w-7 h-7 object-contain flex-shrink-0 ${activeSport===sp.label?'brightness-0 invert':''}`}/>
              <span className={activeSport===sp.label?'text-white':''}>{sp.label}</span>
            </button>
          ))}
        </div>

        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth}
            className="flex items-center gap-1 text-sm font-semibold text-[#0B5C43] hover:bg-[#E7F1EC] px-3 py-2 rounded-full transition-colors">
            <ChevronLeft className="w-4 h-4"/>
            <span className="hidden md:inline">{month===0?`${year-1}.12`:`${year}.${month}`}</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-lg md:text-xl font-extrabold tracking-tight">
              {year}. {month+1}
              {activeSport!=='전체'&&(
                <span className="ml-2 text-sm font-semibold text-[#0B5C43]">· {activeSport}</span>
              )}
            </span>
            <button onClick={()=>{setYear(today.getFullYear());setMonth(today.getMonth());}}
              className="border border-[#E8E8E6] rounded-full px-3 py-1.5 text-xs font-semibold hover:border-[#222] transition-colors">
              오늘
            </button>
          </div>
          <button onClick={nextMonth}
            className="flex items-center gap-1 text-sm font-semibold text-[#0B5C43] hover:bg-[#E7F1EC] px-3 py-2 rounded-full transition-colors">
            <span className="hidden md:inline">{month===11?`${year+1}.1`:`${year}.${month+2}`}</span>
            <ChevronRight className="w-4 h-4"/>
          </button>
        </div>

        {/* 이번달 대회 수 */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[13px] text-[#717171]">
            {MONTHS_KR[month]} 대회
            <span className="font-bold text-[#222] mx-1">{monthEvents.length}건</span>
            {activeSport!=='전체'&&<span className="text-[#0B5C43] font-semibold">({activeSport})</span>}
          </span>
          {activeSport!=='전체'&&(
            <button onClick={()=>setActiveSport('전체')}
              className="text-[11px] text-[#717171] underline">전체 보기</button>
          )}
        </div>

        {/* 달력 그리드 — 데스크톱 */}
        <div className="hidden md:block border border-[#E8E8E6] rounded-2xl overflow-hidden mb-6">
          <div className="grid grid-cols-7 bg-[#F7F7F6] border-b border-[#E8E8E6]">
            {DAYS.map((d,i)=>(
              <div key={d} className={`text-center py-2.5 text-xs font-bold border-r border-[#E8E8E6] last:border-r-0
                ${i===0?'text-red-500':i===6?'text-blue-500':'text-[#1B1F1D]'}`}>{d}</div>
            ))}
          </div>
          {rows}
        </div>

        {/* 모바일 — 리스트뷰 */}
        <div className="md:hidden">
          {monthEvents.length===0?(
            <div className="text-center py-12 border border-dashed border-[#E8E8E6] rounded-2xl">
              <div className="flex justify-center mb-3">
                {activeSport==='전체'
                  ? <span className="text-5xl">📅</span>
                  : <img src={SPORTS_15.find(s=>s.label===activeSport)?.icon||'/icons/etc.svg'}
                      alt={activeSport} className="w-16 h-16 object-contain"/>}
              </div>
              <p className="text-[#717171] text-sm font-medium">
                {activeSport==='전체'?'이 달에는 예정된 대회가 없습니다.':
                  `이 달에는 ${activeSport} 대회가 없습니다.`}
              </p>
              {activeSport!=='전체'&&(
                <button onClick={()=>setActiveSport('전체')}
                  className="mt-3 text-sm text-[#0B5C43] font-semibold underline">전체 대회 보기</button>
              )}
            </div>
          ):(
            <div className="space-y-2">
              {monthEvents.map(e=>(
                <Link key={e.id} href={`/events/${e.id}`}
                  className="flex items-center gap-3 p-3.5 bg-white border border-[#E8E8E6] rounded-2xl hover:shadow-sm transition-shadow">
                  <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                    style={{background:getColor(e.region)}}>
                    <span className="text-sm font-extrabold leading-none">{new Date(e.start).getDate()}</span>
                    <span className="text-[9px] opacity-80">{MONTHS_KR[new Date(e.start).getMonth()]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13.5px] text-[#222] truncate">{e.title}</div>
                    <div className="text-xs text-[#717171] mt-0.5">{e.region} · {e.sport}</div>
                    <div className="text-xs text-[#717171] mt-0.5">{fmtDate(e.start)} · {e.participants}</div>
                  </div>
                  <img src={SPORTS_15.find(s=>s.label===e.sport)?.icon||'/icons/etc.svg'}
                    alt={e.sport} className="w-8 h-8 object-contain flex-shrink-0"/>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 데스크톱 목록 */}
        {monthEvents.length>0&&(
          <div className="hidden md:block mt-2">
            <h2 className="text-base font-bold mb-3 text-[#222]">
              {MONTHS_KR[month]} {activeSport!=='전체'?activeSport:''} 대회 목록 ({monthEvents.length}건)
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {monthEvents.map(e=>(
                <Link key={e.id} href={`/events/${e.id}`}
                  className="flex items-center gap-4 p-4 bg-white border border-[#E8E8E6] rounded-xl hover:shadow-sm transition-shadow">
                  <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                    style={{background:getColor(e.region)}}>
                    <span className="text-sm font-extrabold">{new Date(e.start).getDate()}</span>
                    <span className="text-[9px] opacity-80">{MONTHS_KR[new Date(e.start).getMonth()]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[14px] text-[#222] truncate">{e.title}</div>
                    <div className="text-xs text-[#717171] mt-0.5">{e.region} · {e.sport} · {e.participants}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xl">{SPORTS_15.find(s=>s.label===e.sport)?.icon||'/icons/etc.svg'}</span>
                    <span className="text-xs text-[#717171]">{e.start}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 데스크톱 빈 상태 */}
        {monthEvents.length===0&&(
          <div className="hidden md:flex flex-col items-center justify-center py-16 border border-dashed border-[#E8E8E6] rounded-2xl">
            <div className="text-5xl mb-4">
              {activeSport==='전체'
                ? <span className="text-5xl">📅</span>
                : <img src={SPORTS_15.find(s=>s.label===activeSport)?.icon||'/icons/etc.svg'}
                    alt={activeSport} className="w-16 h-16 object-contain"/>}
            </div>
            <p className="font-semibold text-[#222] mb-1">
              {activeSport==='전체'?'이 달에는 예정된 대회가 없습니다.':
                `이 달에는 ${activeSport} 대회가 없습니다.`}
            </p>
            {activeSport!=='전체'&&(
              <button onClick={()=>setActiveSport('전체')}
                className="mt-3 text-sm text-[#0B5C43] font-semibold underline">전체 대회 보기</button>
            )}
          </div>
        )}
      </main>

      {/* ── 날짜 클릭 팝업 (지도 팝업과 동일한 패턴) ── */}
      {dayPopup && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 px-3"
          onClick={()=>setDayPopup(null)}>
          <div className="w-full md:w-[420px] bg-white rounded-t-2xl md:rounded-2xl shadow-xl max-h-[70vh] overflow-hidden flex flex-col"
            onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEE] flex-shrink-0">
              <div>
                <span className="font-bold text-[16px] text-[#222]">{fmtDate(dayPopup.dateStr)}</span>
                <span className="text-[13px] text-[#717171] ml-2">대회 {dayPopup.events.length}건</span>
              </div>
              <button onClick={()=>setDayPopup(null)}
                className="text-[#717171] text-2xl w-8 h-8 flex items-center justify-center">×</button>
            </div>
            <div className="overflow-y-auto flex-1 px-3 py-1.5">
              {dayPopup.events.map(ev=>(
                <Link key={ev.id} href={`/events/${ev.id}`}
                  className="flex items-center gap-3 py-2.5 border-b border-[#F5F5F5] last:border-0 hover:bg-[#F7F7F6] rounded-xl px-2 -mx-2 transition-colors">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl border-2 flex items-center justify-center p-1.5"
                    style={{borderColor:(SPORTS_15.find(s=>s.label===ev.sport)?.color||'#999')+'55', background:(SPORTS_15.find(s=>s.label===ev.sport)?.color||'#999')+'11'}}>
                    <img src={SPORTS_15.find(s=>s.label===ev.sport)?.icon||'/icons/etc.png'} alt={ev.sport} className="w-full h-full object-contain"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13px] text-[#222] truncate">{ev.title}</div>
                    <div className="text-[12px] text-[#717171]">{ev.region} · {ev.sport}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}