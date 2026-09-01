'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { EVENTS, getDynamicEvents } from '@/lib/data';
import { EventRow } from '@/components/events/EventRow';
import { KakaoMap as KoreaMap } from '@/components/events/KakaoMap';
import { Header } from '@/components/layout/Header';
import { RegionListView } from '@/components/events/RegionListView';
import { getSportInfo } from '@/lib/sports';
import { CalendarDays } from 'lucide-react';
import { MiniCalendar } from '@/components/events/MiniCalendar';

const REGIONS_LIST = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'];

const REGION_COLOR: Record<string,{border:string;text:string}> = {
  서울:{border:'#E4572E',text:'#B03A1E'}, 부산:{border:'#2E86C1',text:'#1A5276'},
  대구:{border:'#8E44AD',text:'#6C3483'}, 인천:{border:'#27AE60',text:'#1E8449'},
  광주:{border:'#D4FF3F',text:'#BA6A1A'}, 대전:{border:'#2980B9',text:'#1F618D'},
  울산:{border:'#C0392B',text:'#922B21'}, 세종:{border:'#D4AC0D',text:'#9A7D0A'},
  경기:{border:'#1ABC9C',text:'#148F77'}, 강원:{border:'#145A32',text:'#0B5345'},
  충북:{border:'#784212',text:'#6E2F1A'}, 충남:{border:'#9B59B6',text:'#76448A'},
  전북:{border:'#1A5276',text:'#154360'}, 전남:{border:'#0E6655',text:'#0B5345'},
  경북:{border:'#6C3483',text:'#5B2C6F'}, 경남:{border:'#1F618D',text:'#154360'},
  제주:{border:'#117A65',text:'#0E6655'},
};

const KTO_LINKS = [
  ['베니키아 호텔','https://www.benikea.com'],
  ['두루누비 (자전거·도보 여행)','https://www.durunubi.kr'],
  ['한국관광 데이터랩','https://datalab.visitkorea.or.kr'],
  ['고캠핑','https://www.gocamping.or.kr'],
  ['템플스테이','https://www.templestay.com'],
  ['한국관광공사 공식사이트','https://korean.visitkorea.or.kr'],
];

function calcN(s:string){return Math.ceil((new Date(s).getTime()-Date.now())/86400000);}

export default function HomePage() {
  const [selectedRegion, setSelectedRegion] = useState<string|null>(null);
  const [weekEvs, setWeekEvs] = useState<ReturnType<typeof getDynamicEvents>>([]);
  const dynEv = getDynamicEvents();
  const today = new Date();
  // 이번달 대회 — 순수 날짜순 정렬 (골든패스 고정 제거)
  const thisMonth = today.getMonth();
  const thisYear  = today.getFullYear();
  const upcoming = dynEv.filter(e=>e.status!=='done').sort((a,b)=>{
    // 이번달 대회 우선
    const aThisMonth = new Date(a.start).getMonth()===thisMonth && new Date(a.start).getFullYear()===thisYear ? 0 : 1;
    const bThisMonth = new Date(b.start).getMonth()===thisMonth && new Date(b.start).getFullYear()===thisYear ? 0 : 1;
    if (aThisMonth !== bThisMonth) return aThisMonth - bThisMonth;
    // 그 안에서 날짜순
    const d = calcN(a.start) - calcN(b.start);
    return d !== 0 ? d : a.title.localeCompare(b.title,'ko');
  }).slice(0,20);
  const thisMonthEv = dynEv.filter(e=>new Date(e.start).getMonth()===today.getMonth()&&e.status!=='done')
    .sort((a,b)=>{const d=a.start.localeCompare(b.start);return d!==0?d:a.title.localeCompare(b.title,'ko');});

  useEffect(()=>{
    const t=new Date();
    const mon=new Date(t);mon.setDate(t.getDate()-t.getDay()+1);
    const sun=new Date(mon);sun.setDate(mon.getDate()+6);
    const fmt=(d:Date)=>d.toISOString().slice(0,10);
    setWeekEvs(dynEv.filter(e=>e.start>=fmt(mon)&&e.start<=fmt(sun)));
  },[]);

  if (selectedRegion) {
    return (<>
      <Header/>
      <RegionListView region={selectedRegion} events={dynEv.filter(e=>e.region===selectedRegion&&e.status!=='done')} onBack={()=>setSelectedRegion(null)}/>
    </>);
  }

  return (
    <>
      <Header/>
      <main style={{background:'#F5F5F5'}}>

        {/* ── 히어로 ── */}
        <section style={{background:'#1C1C1C'}}>
          <div className="max-w-[1760px] mx-auto px-5 md:px-10 py-12 md:py-16">
            <p className="text-[16px] md:text-[20px] font-bold text-[#D4FF3F] mb-3">전국 스포츠 대회 일정 + 개최지 여행 정보를 한곳에</p>
            <h1 className="font-black tracking-[-0.04em] leading-tight mb-4 text-white" style={{fontSize:"clamp(28px,5vw,48px)"}}>
              대회 보러 가는 길,<br/>
              <span className="text-[#D4FF3F]">그 지역까지 즐기고 오세요</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[32px] font-black text-[#D4FF3F] tracking-tight">{dynEv.filter(e=>e.status!=='done').length}</span>
              <span className="text-[16px] font-semibold text-white">개의 대회가 기다리고 있어요</span>
            </div>
            {/* AI 소개 */}
            <div className="mt-6 p-4 rounded-2xl" style={{background:'rgba(212,255,63,0.1)',border:'1px solid rgba(212,255,63,0.25)'}}>
              <div className="text-[13px] font-bold mb-1" style={{color:'#D4FF3F'}}>✨ AI 여행 코스</div>
              <p className="text-[14px] text-white leading-relaxed">대회를 고르면 전날·당일·다음날 코스는 <b className="text-[#D4FF3F]">AI가 짜드립니다.</b> 한국관광공사 TourAPI 실데이터 기반.</p>
            </div>
            {/* 히어로 CTA */}
            <div className="flex gap-3 mt-6 flex-wrap">
              <Link href="/events" className="flex items-center gap-2 font-bold text-[15px] px-6 py-3 rounded-xl transition-all hover:opacity-90" style={{background:'#D4FF3F',color:'#0F0F0F'}}>
                대회 찾기 →
              </Link>
              <Link href="/calendar" className="flex items-center gap-2 font-bold text-[15px] px-6 py-3 rounded-xl transition-all" style={{background:'rgba(255,255,255,0.1)',color:'#fff',border:'1px solid rgba(255,255,255,0.2)'}}>
                캘린더 보기
              </Link>
            </div>
          </div>
        </section>

        {/* ── 지도 + 캘린더 ── */}
        <section className="max-w-[1760px] mx-auto px-5 md:px-10 py-8" style={{background:'#0F0F0F'}}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-extrabold tracking-tight text-white">지도로 한눈에 보기</h2>
            <Link href="/calendar"
              className="flex items-center gap-2 font-bold text-[14px] px-5 py-2.5 rounded-xl transition-all hover:opacity-80" style={{background:'#D4FF3F',color:'#0F0F0F'}}>
              <CalendarDays className="w-4 h-4"/>
              캘린더 보기
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative bg-[#C8DCE8] rounded-2xl overflow-hidden" style={{aspectRatio:'1/1',maxHeight:'520px'}}>
              <KoreaMap events={EVENTS} className="w-full h-full"/>
            </div>
            <div className="flex flex-col flex-1 rounded-2xl overflow-hidden border border-border" style={{aspectRatio:'1/1',maxHeight:'520px'}}>
              <MiniCalendar events={dynEv.filter(e=>e.status!=='done')}/>
            </div>
          </div>
        </section>

        {/* ── 대회 캐러셀 ── */}
        <EventRow title="이번달의 대회" href="/events" events={upcoming.slice(0,6)}/>
        {(() => {
          const shownIds = new Set(upcoming.slice(0,6).map(e=>e.id));
          const marathons = dynEv.filter(e=>e.sport==='마라톤'&&e.status!=='done'&&!shownIds.has(e.id))
            .sort((a,b)=>new Date(a.start).getTime()-new Date(b.start).getTime()).slice(0,6);
          return marathons.length>0 ? <EventRow title="마라톤 대회" href="/events?sport=마라톤" events={marathons}/> : null;
        })()}

        {/* ── 지역별 둘러보기 ── */}
        <section className="max-w-[1760px] mx-auto px-5 md:px-10 py-8">
          <h2 className="text-[24px] font-extrabold tracking-tight mb-1">지역별로 둘러보기</h2>
          <p className="text-muted text-[14px] mb-5">가고 싶은 지역을 선택하면 그 지역의 대회를 모아 보여드립니다.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {REGIONS_LIST.map(r=>{
              const cnt=dynEv.filter(e=>e.region===r&&e.status!=='done').length;
              const col=REGION_COLOR[r]||{border:'#EBEBEB',text:'#222'};
              return (
                <button key={r} onClick={()=>setSelectedRegion(r)}
                  className="rounded-xl py-3 px-2 text-center transition-all hover:bg-[bg-primary-tint] hover:shadow-sm border border-[#E0E0E0]"
                  style={{background:'transparent'}}>
                  <b className="block text-[15px] font-extrabold text-ink">{r}</b>
                  <span className={`text-[11px] block font-bold mt-0.5 ${cnt?'text-[#0F0F0F]':'text-[#CCCCCC]'}`}>
                    {cnt?`${cnt}개`:'없음'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 관광정보 KTO ── */}
        <section style={{background:'#E8E8E8'}}>
          <div className="max-w-[1760px] mx-auto px-5 md:px-10 py-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 bg-white rounded-2xl px-6 py-5 flex items-center justify-between">
                <span className="font-semibold text-[15px]">관광안내전화 (국번없이)</span>
                <b className="text-2xl font-extrabold tracking-widest">
                  <span className="text-[#E6397E]">1</span><span className="text-[#0B8A4B]">3</span>
                  <span className="text-[#2B6CB0]">3</span><span className="text-[#12A5B8]">0</span>
                </b>
              </div>
              <div className="flex-1 bg-white rounded-2xl px-6 py-5 flex items-center justify-between">
                <span className="font-semibold text-[15px]">지자체 민원</span>
                <span className="text-xl font-extrabold text-[#D4FF3F] tracking-widest">+ 120</span>
              </div>
            </div>
            <h3 className="text-[16px] font-bold mb-3">관광 정보</h3>
            <div className="flex flex-wrap gap-2">
              {KTO_LINKS.map(([name,url])=>(
                <a key={name} href={url} target="_blank" rel="noopener"
                  className="text-[13px] font-semibold px-4 py-2 rounded-full border border-border hover:border-ink hover:bg-white transition-all">
                  {name} ↗
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 푸터 ── */}
        <footer style={{background:'#0F0F0F',color:'rgba(255,255,255,0.75)'}} className="text-[13px]">
          <div className="max-w-[1760px] mx-auto px-5 md:px-10 py-8 flex flex-wrap gap-6 items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.svg" alt="" className="h-14 w-14 brightness-0 invert"/>
                <span className="font-black text-[28px] text-white tracking-[-0.05em]">스포트립</span>
              </div>
              <p className="text-[12px]">SporTrip · 2026 관광데이터 활용 공모전</p>
              <p className="text-[12px] mt-1">출처: ⓒ한국관광공사 (kto.visitkorea.or.kr)</p>
              <p className="text-[12px] mt-1">💡 하트로 저장한 대회는 이 기기 브라우저에만 보관됩니다</p>
            </div>
            <div className="ml-auto text-right text-[12px]">
              등록 대회 {EVENTS.length}건<br/>
              예정 대회 {dynEv.filter(e=>e.status!=='done').length}건
            </div>
          </div>
          <div className="px-5 md:px-10 py-3 text-center text-[12px]" style={{color:'rgba(255,255,255,0.35)',borderTop:'0.5px solid rgba(255,255,255,0.08)'}}>
            © 2026 스포트립
          </div>
        </footer>
      </main>
    </>
  );
}
