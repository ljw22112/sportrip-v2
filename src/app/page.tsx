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
  광주:{border:'#E67E22',text:'#BA6A1A'}, 대전:{border:'#2980B9',text:'#1F618D'},
  울산:{border:'#C0392B',text:'#922B21'}, 세종:{border:'#D4AC0D',text:'#9A7D0A'},
  경기:{border:'#1ABC9C',text:'#148F77'}, 강원:{border:'#145A32',text:'#0B5345'},
  충북:{border:'#784212',text:'#6E2F1A'}, 충남:{border:'#9B59B6',text:'#76448A'},
  전북:{border:'#1A5276',text:'#154360'}, 전남:{border:'#0E6655',text:'#0B5345'},
  경북:{border:'#6C3483',text:'#5B2C6F'}, 경남:{border:'#1F618D',text:'#154360'},
  제주:{border:'#117A65',text:'#0E6655'},
};

const KTO_LINKS = [
  ['오디(Odii) 오디오 가이드','https://korean.visitkorea.or.kr'],
  ['베니키아','https://www.benikea.com'],['두루누비','https://www.durunubi.kr'],
  ['공공 와이파이','https://korean.visitkorea.or.kr'],['관광두레','https://korean.visitkorea.or.kr'],
  ['한국관광 데이터랩','https://datalab.visitkorea.or.kr'],['여행가이드북','https://korean.visitkorea.or.kr'],
  ['고캠핑','https://www.gocamping.or.kr'],['템플스테이','https://www.templestay.com'],
];

function calcN(s:string){return Math.ceil((new Date(s).getTime()-Date.now())/86400000);}

export default function HomePage() {
  const [selectedRegion, setSelectedRegion] = useState<string|null>(null);
  const [weekEvs, setWeekEvs] = useState<ReturnType<typeof getDynamicEvents>>([]);
  const dynEv = getDynamicEvents();
  const today = new Date();
  const upcoming = dynEv.filter(e=>e.status!=='done').sort((a,b)=>{
    const d=calcN(a.start)-calcN(b.start);
    return d!==0?d:a.title.localeCompare(b.title,'ko');
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
      <Header showSearch/>
      <RegionListView region={selectedRegion} events={dynEv.filter(e=>e.region===selectedRegion&&e.status!=='done')} onBack={()=>setSelectedRegion(null)}/>
    </>);
  }

  return (
    <>
      <Header showSearch/>
      <main style={{background:'#F7F5F0'}}>

        {/* ── 히어로 ── */}
        <section style={{background:'#0B5C43'}}>
          <div className="max-w-[1760px] mx-auto px-5 md:px-10 py-12 md:py-16">
            <p className="text-[16px] md:text-[20px] font-bold text-[#D6F14E] mb-3">전국 스포츠 대회 일정 + 개최지 여행 정보를 한곳에</p>
            <h1 className="text-[28px] md:text-[40px] font-extrabold text-white tracking-tight leading-tight mb-4">
              대회 보러 가는 길,<br/>
              <span className="text-[#D6F14E]">그 지역까지 즐기고 오세요</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[32px] font-black text-[#D6F14E] tracking-tight">{dynEv.filter(e=>e.status!=='done').length}</span>
              <span className="text-[16px] font-semibold text-white">개의 대회가 여러분을 기다리고 있어요</span>
            </div>
          </div>
        </section>

        {/* ── 지도 + 캘린더 ── */}
        <section className="max-w-[1760px] mx-auto px-5 md:px-10 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-extrabold tracking-tight">지도로 한눈에 보기</h2>
            <Link href="/calendar"
              className="flex items-center gap-2 bg-[#0B5C43] text-white font-bold text-[14px] px-5 py-2.5 rounded-xl hover:bg-[#083D2D] transition-colors">
              <CalendarDays className="w-4 h-4"/>
              캘린더 보기
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative bg-[#C8DCE8] rounded-2xl overflow-hidden" style={{aspectRatio:'1/1',maxHeight:'520px'}}>
              <KoreaMap events={EVENTS} className="w-full h-full"/>
            </div>
            <div className="hidden md:flex flex-col flex-1 rounded-2xl overflow-hidden border border-[#EBEBEB]" style={{aspectRatio:'1/1',maxHeight:'520px'}}>
              <MiniCalendar events={dynEv.filter(e=>e.status!=='done')}/>
            </div>
          </div>
        </section>

        {/* ── 대회 캐러셀 ── */}
        <EventRow title="다가오는 대회" href="/events" events={upcoming.slice(0,6)}/>
        {thisMonthEv.length>0 && <EventRow title="이번달의 대회" href="/events?tab=month" events={thisMonthEv.slice(0,6)}/>}
        {weekEvs.length>0 && <EventRow title="이번주의 대회" href="/events?tab=week" events={weekEvs.slice(0,6)}/>}

        {/* ── 지역별 둘러보기 ── */}
        <section className="max-w-[1760px] mx-auto px-5 md:px-10 py-8">
          <h2 className="text-[20px] md:text-[22px] font-extrabold tracking-tight mb-1">지역별로 둘러보기</h2>
          <p className="text-[#717171] text-[14px] mb-5">가고 싶은 지역을 선택하면 그 지역의 대회를 모아 보여드립니다.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {REGIONS_LIST.map(r=>{
              const cnt=dynEv.filter(e=>e.region===r&&e.status!=='done').length;
              const col=REGION_COLOR[r]||{border:'#EBEBEB',text:'#222'};
              return (
                <button key={r} onClick={()=>setSelectedRegion(r)}
                  className="rounded-xl py-3 px-2 text-center transition-all hover:bg-[#E7F1EC] hover:shadow-sm border border-[#E0E0E0]"
                  style={{background:'transparent'}}>
                  <b className="block text-[15px] font-extrabold text-[#222]">{r}</b>
                  <span className={`text-[11px] block font-bold mt-0.5 ${cnt?'text-[#0B5C43]':'text-[#CCCCCC]'}`}>
                    {cnt?`${cnt}개`:'없음'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 관광정보 KTO ── */}
        <section style={{background:'#F0EDE8'}}>
          <div className="max-w-[1760px] mx-auto px-5 md:px-10 py-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 bg-white rounded-2xl px-6 py-5 flex items-center justify-between">
                <span className="font-semibold text-[15px]">관광안내</span>
                <b className="text-2xl font-extrabold tracking-widest">
                  <span className="text-[#E6397E]">1</span><span className="text-[#0B8A4B]">3</span>
                  <span className="text-[#2B6CB0]">3</span><span className="text-[#12A5B8]">0</span>
                </b>
              </div>
              <div className="flex-1 bg-white rounded-2xl px-6 py-5 flex items-center justify-between">
                <span className="font-semibold text-[15px]">지역번호</span>
                <span className="text-xl font-extrabold text-[#E8720C] tracking-widest">+ 120</span>
              </div>
            </div>
            <h3 className="text-[16px] font-bold mb-3">관광 정보</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {KTO_LINKS.map(([name,url])=>(
                <a key={name} href={url} target="_blank" rel="noopener"
                  className="bg-white rounded-xl px-4 py-3 text-[13px] font-medium text-[#0B5C43] hover:bg-[#E7F1EC] transition-colors">
                  {name} ↗
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 푸터 ── */}
        <footer style={{background:'#1B1F1D'}} className="text-[#AAAAAA] text-[13px]">
          <div className="max-w-[1760px] mx-auto px-5 md:px-10 py-8 flex flex-wrap gap-6 items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.svg" alt="" className="h-8 w-8"/>
                <span className="font-extrabold text-[18px] text-white tracking-[-0.05em]">스포트립</span>
              </div>
              <p className="text-[12px]">SporTrip · 2026 관광데이터 활용 공모전</p>
              <p className="text-[12px] mt-1">출처: ⓒ한국관광공사 (kto.visitkorea.or.kr)</p>
              <p className="text-[12px] mt-1">💡 하트 저장은 이 기기 브라우저에만 저장됩니다</p>
            </div>
            <div className="ml-auto text-right text-[12px]">
              등록 대회 {EVENTS.length}건<br/>
              예정 대회 {dynEv.filter(e=>e.status!=='done').length}건
            </div>
          </div>
          <div className="px-5 md:px-10 py-3 text-center text-[12px] text-[#555]">
            © 2026 스포트립
          </div>
        </footer>
      </main>
    </>
  );
}
