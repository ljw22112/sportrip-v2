'use client';
import Link from 'next/link';
import { useState } from 'react';
import { EVENTS, getDynamicEvents } from '@/lib/data';
import { EventRow } from '@/components/events/EventRow';
import { KoreaMap } from '@/components/events/KoreaMap';
import { Header } from '@/components/layout/Header';
import { RegionListView } from '@/components/events/RegionListView';
import { ChevronRight } from 'lucide-react';

const REGIONS_LIST = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'];
const KTO_LINKS = [
  ['오디(Odii) 오디오 가이드','https://korean.visitkorea.or.kr'],
  ['베니키아','https://www.benikea.com'],
  ['두루누비','https://www.durunubi.kr'],
  ['공공 와이파이','https://korean.visitkorea.or.kr'],
  ['국가유산 유유자직','https://korean.visitkorea.or.kr'],
  ['관광두레','https://korean.visitkorea.or.kr'],
  ['한국관광 데이터랩','https://datalab.visitkorea.or.kr'],
  ['한국관광 콘텐츠랩','https://api.visitkorea.or.kr'],
  ['여행가이드북','https://korean.visitkorea.or.kr'],
  ['고캠핑','https://www.gocamping.or.kr'],
  ['관광불편신고센터','https://korean.visitkorea.or.kr'],
  ['템플스테이','https://www.templestay.com'],
  ['세이프스테이','https://korean.visitkorea.or.kr'],
  ['포토코리아','https://phoko.visitkorea.or.kr'],
  ['한국관광산업포털','https://korean.visitkorea.or.kr'],
  ['대한민국 관광기념품 공모전·박람회','https://korean.visitkorea.or.kr'],
];

function calcN(s: string) { return Math.ceil((new Date(s).getTime()-Date.now())/86400000); }

export default function HomePage() {
  const [selectedRegion, setSelectedRegion] = useState<string|null>(null);
  const [ktoOpen, setKtoOpen] = useState(false);
  const today = new Date();
  const mon = new Date(today); mon.setDate(today.getDate()-today.getDay()+1);
  const sun = new Date(mon); sun.setDate(mon.getDate()+6);
  const fmt = (d:Date)=>d.toISOString().slice(0,10);
  const dynEv = getDynamicEvents();
  const upcoming    = dynEv.filter(e=>e.status!=='done').sort((a,b)=>calcN(a.start)-calcN(b.start)).slice(0,20);
  const thisMonthEv = dynEv.filter(e=>new Date(e.start).getMonth()+1===today.getMonth()+1&&e.status!=='done');
  const thisWeekEv  = dynEv.filter(e=>e.start>=fmt(mon)&&e.start<=fmt(sun));

  if (selectedRegion) {
    return (<>
      <Header showSearch/>
      <RegionListView region={selectedRegion} events={dynEv.filter(e=>e.region===selectedRegion&&e.status!=='done')} onBack={()=>setSelectedRegion(null)}/>
    </>);
  }

  return (
    <>
      <Header showSearch/>
      <main>
        {/* 히어로 */}
        <div className="max-w-[1760px] mx-auto px-5 md:px-20 pt-5 pb-2 text-center">
          <h1 className="text-xl md:text-[26px] font-extrabold tracking-tight leading-snug">
            대회 보러 가는 길,{' '}
            <span style={{background:'linear-gradient(transparent 62%,#D6F14E 62%)'}}>그 지역까지</span>{' '}
            즐기고 오세요
          </h1>
          <p className="text-[--muted] mt-1.5 text-[13.5px] hidden md:block">
            전국 스포츠 대회 일정과 개최지 주변 관광지·맛집·숙소, 같은 기간 열리는 지역 축제까지 한곳에서 확인하세요.
          </p>
        </div>

        {/* 빠른 선택 칩 */}
        <div className="flex gap-2 justify-start md:justify-center flex-nowrap overflow-x-auto px-5 md:px-20 py-3"
          style={{scrollbarWidth:'none'}}>
          {[['이번 주말','weekend'],['다음 달','nextmonth'],['내 지역','near'],['축제와 함께','festival'],['캘린더','/calendar']].map(([label,val])=>(
            val.startsWith('/') ?
            <Link key={label} href={val}
              className="flex-shrink-0 h-9 px-4 border-2 border-[--green] rounded-full bg-white text-[13.5px] font-bold text-[--green] flex items-center hover:bg-[--green-tint] transition-colors">
              📅 {label}
            </Link> :
            <Link key={label} href={`/events?quick=${val}`}
              className="flex-shrink-0 h-9 px-4 border border-[--line] rounded-full bg-white text-[13.5px] font-semibold text-[--ink] flex items-center hover:border-[--ink] transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* 지도 */}
        <section className="max-w-[1760px] mx-auto px-5 md:px-20 pt-4 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-base font-bold text-[--ink]">지도로 한눈에 보기</h2>
            <Link href="/events" className="ml-auto text-[13.5px] font-semibold text-[--green]">목록으로 보기 ›</Link>
          </div>
          <div className="relative bg-[#D8E4DA] border border-[--line] rounded-2xl overflow-hidden h-[260px] md:h-[440px]">
            <KoreaMap events={EVENTS} className="w-full h-full"/>
            <div className="absolute right-3 top-3 flex flex-col bg-white rounded-xl overflow-hidden shadow-sm">
              <button className="w-8 h-8 text-base font-bold border-b border-[--line]">+</button>
              <button className="w-8 h-8 text-base font-bold">−</button>
            </div>
            <div className="absolute left-3 bottom-3 bg-white/90 rounded-full text-[11px] text-[--muted] px-3 py-1">
              점을 누르면 대회 상세로 이동합니다
            </div>
          </div>
        </section>

        {/* STEP (모바일 숨김 — 공간 절약) */}
        <section className="hidden md:block max-w-[1760px] mx-auto px-20 py-6 border-t border-[--line]">
          <h2 className="text-center text-xl font-extrabold tracking-tight mb-5">스포트립은 이렇게 씁니다</h2>
          <div className="grid grid-cols-3 gap-5 max-w-[960px] mx-auto">
            {[
              ['STEP 1','대회 찾기','지역·날짜·종목으로 거르거나, "11월 부산 마라톤"처럼 문장으로 검색합니다.'],
              ['STEP 2','주변 여행 정보 확인','개최지 주변 관광지·맛집·숙소와 대회 기간에 겹치는 지역 축제를 함께 보여 드립니다.'],
              ['STEP 3','저장하고 공유','마음에 든 대회는 하트로 저장하고, 일행에게 링크로 공유해 함께 떠나세요. 로그인 불필요.'],
            ].map(([bib,h,p])=>(
              <div key={bib} className="bg-[--gray] border border-[--line-soft] rounded-2xl p-5">
                <span className="inline-flex items-center text-[13px] font-extrabold bg-[#D6F14E] text-[#2A3308] rounded-md px-2.5 py-0.5 tracking-widest">{bib}</span>
                <h3 className="text-base font-bold mt-3 mb-1 tracking-tight">{h}</h3>
                <p className="text-[13.5px] text-[--muted]">{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3 캐러셀 */}
        <EventRow title="전체 대회" href="/events" events={upcoming}/>
        <EventRow title="이번달의 대회" href="/events?tab=month" events={thisMonthEv.length>0?thisMonthEv:upcoming.slice(0,10)}/>
        <EventRow title="이번주의 대회" href="/events?tab=week" events={thisWeekEv.length>0?thisWeekEv:upcoming.slice(0,6)}/>

        {/* 지역별 둘러보기 */}
        <section className="max-w-[1760px] mx-auto px-5 md:px-20 py-6 border-t border-[--line]">
          <h2 className="text-lg md:text-xl font-extrabold tracking-tight mb-1">지역별로 둘러보기</h2>
          <p className="text-[--muted] text-[13.5px] mb-4 hidden md:block">가고 싶은 지역을 고르면 그 지역의 대회만 모아 보여 드립니다.</p>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-2.5">
            {REGIONS_LIST.map(r=>{
              const cnt = dynEv.filter(e=>e.region===r&&e.status!=='done').length;
              return (
                <button key={r} onClick={()=>setSelectedRegion(r)}
                  className="bg-[--gray] border border-[--line-soft] rounded-xl py-3 px-2 text-center hover:bg-[--line-soft] transition-colors">
                  <b className="block text-[13.5px] md:text-[14.5px] tracking-tight">{r}</b>
                  <span className={`text-[11px] md:text-xs mt-1 block ${cnt?'text-[--signal]':'text-[--faint]'}`}>
                    {cnt?`예정 ${cnt}건`:'없음'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* KTO 스트립 */}
        <div className="border-t border-[--line] bg-white text-sm">
          <div className="max-w-[1760px] mx-auto">
            <div className="flex flex-col md:flex-row border-b border-[--line-soft]">
              <div className="flex items-center justify-between gap-2 px-5 md:px-20 py-4 md:flex-1 border-b md:border-b-0 md:border-r border-[--line-soft]">
                <span className="text-[--ink] font-medium">관광안내</span>
                <b className="text-xl font-extrabold tracking-widest">
                  <span className="text-[#E6397E]">1</span><span className="text-[#0B8A4B]">3</span>
                  <span className="text-[#2B6CB0]">3</span><span className="text-[#12A5B8]">0</span>
                </b>
              </div>
              <div className="flex items-center justify-between gap-2 px-5 md:px-20 py-4 md:flex-1">
                <span className="text-[--ink] font-medium">지역번호</span>
                <span className="text-lg font-extrabold text-[#E8720C] tracking-widest">+ 120</span>
              </div>
            </div>
            <button onClick={()=>setKtoOpen(v=>!v)}
              className="w-full flex items-center justify-between px-5 md:px-20 py-4 text-left hover:bg-[--gray] transition-colors border-b border-[--line-soft]">
              <span className="font-medium text-[--ink]">관광정보</span>
              <span className="text-xl font-light">{ktoOpen?'—':'+'}</span>
            </button>
            {ktoOpen && (
              <div className="px-5 md:px-20 py-5 bg-[--gray] border-b border-[--line-soft]">
                <p className="font-bold text-[13.5px] mb-4 text-[--ink]">관광정보</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {KTO_LINKS.map(([name,url])=>(
                    <li key={name} className="flex items-center gap-2 py-1.5 text-[13px]">
                      <span className="text-[--faint]">·</span>
                      <a href={url} target="_blank" rel="noopener" className="text-[--green] font-medium hover:underline">{name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <footer className="bg-[--gray] border-t border-[--line] text-[--muted] text-[13px]">
          <div className="max-w-[1760px] mx-auto px-5 md:px-20 py-7 flex flex-wrap gap-6 items-start">
            <div>
              <h4 className="text-[--ink] text-[13px] mb-2 font-semibold">스포트립</h4>
              <Link href="/events" className="block py-1 hover:text-[--ink]">대회 찾기</Link>
              <Link href="/calendar" className="block py-1 hover:text-[--ink]">월간 캘린더</Link>
            </div>
            <div className="ml-auto text-right text-[12.5px]">
              등록 대회 {EVENTS.length}건 · 예정 대회 {dynEv.filter(e=>e.status!=='done').length}건<br/>
              관광 정보: 한국관광공사 TourAPI
            </div>
          </div>
          <div className="border-t border-[--line] px-5 md:px-20 py-3.5 text-center text-xs text-[--faint]">
            © 2026 스포트립 · 2026 관광데이터 활용 공모전 출품작
          </div>
        </footer>
      </main>
    </>
  );
}
