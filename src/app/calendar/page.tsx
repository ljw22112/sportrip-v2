'use client';
import { useState } from 'react';
import Link from 'next/link';
import { EVENTS, getDynamicEvents } from '@/lib/data';
import { Header } from '@/components/layout/Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const REGION_COLOR: Record<string,string> = {
  서울:'#1a5276',부산:'#1a5276',경기:'#1a5276',
  강원:'#145a32',경남:'#145a32',전남:'#145a32',제주:'#145a32',
  대전:'#6e2f1a',충북:'#6e2f1a',충남:'#6e2f1a',
  경북:'#4a235a',전북:'#4a235a',광주:'#4a235a',
};
const getColor = (r:string) => REGION_COLOR[r]||'#34495e';
const DAYS = ['일','월','화','수','목','금','토'];
const MONTHS_KR = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

function fmtDate(ds:string){
  const[y,m,d]=ds.split('-').map(Number);
  const dow='일월화수목금토'[new Date(Date.UTC(y,m-1,d)).getUTCDay()];
  return`${m}월 ${d}일 (${dow})`;
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const dynEv = getDynamicEvents();

  const prevMonth = () => { if(month===0){setYear(y=>y-1);setMonth(11);}else setMonth(m=>m-1); };
  const nextMonth = () => { if(month===11){setYear(y=>y+1);setMonth(0);}else setMonth(m=>m+1); };

  const monthEvents = dynEv.filter(e=>{
    const d=new Date(e.start);
    return d.getFullYear()===year && d.getMonth()===month;
  }).sort((a,b)=>a.start.localeCompare(b.start));

  const firstDay = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const prevDays = new Date(year,month,0).getDate();
  const todayStr = today.toISOString().slice(0,10);

  const eventMap: Record<number,typeof dynEv> = {};
  monthEvents.forEach(e=>{
    const day=new Date(e.start).getDate();
    if(!eventMap[day])eventMap[day]=[];
    eventMap[day].push(e);
  });

  // 달력 셀 생성
  const cells: React.ReactNode[] = [];
  for(let i=firstDay-1;i>=0;i--){
    cells.push(<div key={`p${i}`} className="min-h-[80px] md:min-h-[100px] p-1.5 bg-[#F7F7F6] border-r border-b border-[#E8E8E6]">
      <span className="text-xs text-[#9E9E9B]">{prevDays-i}</span>
    </div>);
  }
  for(let day=1;day<=daysInMonth;day++){
    const ds=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const isToday=ds===todayStr;
    const dow=new Date(year,month,day).getDay();
    const evs=eventMap[day]||[];
    const MAX=2; const extra=evs.length-MAX;
    cells.push(
      <div key={day} className="min-h-[80px] md:min-h-[100px] p-1.5 bg-white border-r border-b border-[#E8E8E6]">
        <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium mb-1 rounded-full
          ${isToday?'bg-[#0B5C43] text-white font-bold':dow===0?'text-red-500':dow===6?'text-blue-500':'text-[#1B1F1D]'}`}>
          {day}
        </span>
        {evs.slice(0,MAX).map((ev,i)=>(
          <Link key={i} href={`/events/${ev.id}`}
            className="block mb-0.5 px-1.5 py-0.5 rounded text-[10px] md:text-[11px] font-semibold text-white truncate leading-tight"
            style={{background:getColor(ev.region)}}>
            <span className="opacity-80 mr-1">{ev.region}</span>{ev.title}
          </Link>
        ))}
        {extra>0&&<button className="text-[10px] text-[#0B5C43] font-bold">+{extra}개 더</button>}
      </div>
    );
  }
  const rem=7-(cells.length%7);
  if(rem<7)for(let i=1;i<=rem;i++){
    cells.push(<div key={`n${i}`} className="min-h-[80px] md:min-h-[100px] p-1.5 bg-[#F7F7F6] border-r border-b border-[#E8E8E6]">
      <span className="text-xs text-[#9E9E9B]">{i}</span>
    </div>);
  }
  const rows:React.ReactNode[]=[];
  for(let i=0;i<cells.length;i+=7){
    rows.push(<div key={i} className="grid grid-cols-7">{cells.slice(i,i+7)}</div>);
  }

  return (
    <>
      <Header showSearch/>
      <main className="max-w-[1760px] mx-auto px-4 md:px-20 py-5 pb-16">
        {/* 브레드크럼 */}
        <p className="text-xs text-[#717171] mb-3">
          <Link href="/events" className="text-[#0B5C43] font-semibold">대회 일정</Link> › 캘린더
        </p>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight mb-1">
          {year}년 {MONTHS_KR[month]} 대회 일정
        </h1>
        <p className="text-[13px] text-[#717171] mb-5 hidden md:block">
          전국 스포츠 대회 일정을 월간 캘린더로 확인하세요. 대회를 클릭하면 상세 정보를 볼 수 있어요.
        </p>

        {/* 네비게이션 */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="flex items-center gap-1 text-sm font-semibold text-[#0B5C43] hover:bg-[#E7F1EC] px-3 py-2 rounded-full transition-colors">
            <ChevronLeft className="w-4 h-4"/>
            <span className="hidden md:inline">{month===0?`${year-1}.12`:`${year}.${month}`}</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-lg md:text-xl font-extrabold tracking-tight">{year}. {month+1}</span>
            <button onClick={()=>{setYear(today.getFullYear());setMonth(today.getMonth());}}
              className="border border-[#E8E8E6] rounded-full px-3 py-1.5 text-xs font-semibold hover:border-[#222] transition-colors">
              오늘
            </button>
          </div>
          <button onClick={nextMonth} className="flex items-center gap-1 text-sm font-semibold text-[#0B5C43] hover:bg-[#E7F1EC] px-3 py-2 rounded-full transition-colors">
            <span className="hidden md:inline">{month===11?`${year+1}.1`:`${year}.${month+2}`}</span>
            <ChevronRight className="w-4 h-4"/>
          </button>
        </div>

        {/* 달력 그리드 — 데스크톱 */}
        <div className="hidden md:block border border-[#E8E8E6] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-[#E8E8E6]">
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
              <div className="text-4xl mb-3">📅</div>
              <p className="text-[#717171] text-sm">이 달에는 예정된 대회가 없습니다.</p>
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
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 데스크톱 목록 */}
        {monthEvents.length>0&&(
          <div className="hidden md:block mt-7">
            <h2 className="text-base font-bold mb-3">{year}년 {MONTHS_KR[month]} 대회 ({monthEvents.length}건)</h2>
            <div className="space-y-2">
              {monthEvents.map(e=>(
                <Link key={e.id} href={`/events/${e.id}`}
                  className="flex items-center gap-4 p-4 bg-white border border-[#E8E8E6] rounded-xl hover:shadow-sm transition-shadow">
                  <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                    style={{background:getColor(e.region)}}>
                    <span className="text-sm font-extrabold">{new Date(e.start).getDate()}</span>
                    <span className="text-[9px] opacity-80">{MONTHS_KR[new Date(e.start).getMonth()]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[14px] text-[#222]">{e.title}</div>
                    <div className="text-xs text-[#717171] mt-0.5">{e.region} · {e.sport} · {e.participants}</div>
                  </div>
                  <div className="text-xs text-[#717171] flex-shrink-0">{e.start}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
