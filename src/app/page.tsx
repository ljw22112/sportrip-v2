'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { EVENTS, getDynamicEvents } from '@/lib/data';
import { EventRow } from '@/components/events/EventRow';
import { KakaoMap as KoreaMap } from '@/components/events/KakaoMap';
import { Header } from '@/components/layout/Header';
import { RegionListView } from '@/components/events/RegionListView';
import { getSportInfo } from '@/lib/sports';

const REGIONS_LIST = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'];

const REGION_COLOR: Record<string,{border:string; bg:string; text:string; emoji:string}> = {
  서울: {border:'#E4572E', bg:'#FEF0EC', text:'#B03A1E', emoji:'🏙️'},
  부산: {border:'#2E86C1', bg:'#EBF5FB', text:'#1A5276', emoji:'🌊'},
  대구: {border:'#8E44AD', bg:'#F5EEF8', text:'#6C3483', emoji:'🍎'},
  인천: {border:'#27AE60', bg:'#EAFAF1', text:'#1E8449', emoji:'✈️'},
  광주: {border:'#E67E22', bg:'#FEF5E7', text:'#BA6A1A', emoji:'🌿'},
  대전: {border:'#2980B9', bg:'#EBF5FB', text:'#1F618D', emoji:'🔬'},
  울산: {border:'#C0392B', bg:'#FDEDEC', text:'#922B21', emoji:'🏭'},
  세종: {border:'#D4AC0D', bg:'#FEFDE7', text:'#9A7D0A', emoji:'🏛️'},
  경기: {border:'#1ABC9C', bg:'#E8F8F5', text:'#148F77', emoji:'🌾'},
  강원: {border:'#145A32', bg:'#E9F7EF', text:'#0B5345', emoji:'⛰️'},
  충북: {border:'#784212', bg:'#FDF0E6', text:'#6E2F1A', emoji:'🌲'},
  충남: {border:'#9B59B6', bg:'#F5EEF8', text:'#76448A', emoji:'🌻'},
  전북: {border:'#1A5276', bg:'#EBF5FB', text:'#154360', emoji:'🌊'},
  전남: {border:'#0E6655', bg:'#E8F8F5', text:'#0B5345', emoji:'🍊'},
  경북: {border:'#6C3483', bg:'#F5EEF8', text:'#5B2C6F', emoji:'🏯'},
  경남: {border:'#1F618D', bg:'#EBF5FB', text:'#154360', emoji:'🦀'},
  제주: {border:'#117A65', bg:'#E8F8F5', text:'#0E6655', emoji:'🍊'},
};
const KTO_LINKS = [
  ['오디(Odii) 오디오 가이드','https://korean.visitkorea.or.kr'],
  ['베니키아','https://www.benikea.com'],['두루누비','https://www.durunubi.kr'],
  ['공공 와이파이','https://korean.visitkorea.or.kr'],['관광두레','https://korean.visitkorea.or.kr'],
  ['한국관광 데이터랩','https://datalab.visitkorea.or.kr'],['여행가이드북','https://korean.visitkorea.or.kr'],
  ['고캠핑','https://www.gocamping.or.kr'],['템플스테이','https://www.templestay.com'],
  ['포토코리아','https://phoko.visitkorea.or.kr'],['한국관광산업포털','https://korean.visitkorea.or.kr'],
  ['대한민국 관광기념품 공모전','https://korean.visitkorea.or.kr'],
];

function calcN(s: string) { return Math.ceil((new Date(s).getTime()-Date.now())/86400000); }

export default function HomePage() {
  const [selectedRegion, setSelectedRegion] = useState<string|null>(null);
  const [ktoOpen, setKtoOpen] = useState(false);
  // 이번주 SSR 버그 수정 — 클라이언트에서만 날짜 계산
  const [weekEvs, setWeekEvs] = useState<ReturnType<typeof getDynamicEvents>>([]);
  const dynEv = getDynamicEvents();
  const today = new Date();
  const upcoming = dynEv.filter(e=>e.status!=='done').sort((a,b)=>{
    const dateDiff = calcN(a.start)-calcN(b.start);
    if (dateDiff !== 0) return dateDiff;
    return a.title.localeCompare(b.title, 'ko');
  }).slice(0,20);
  const thisMonthEv = dynEv.filter(e=>new Date(e.start).getMonth()===today.getMonth()&&e.status!=='done')
    .sort((a,b)=>{
      const dateDiff = a.start.localeCompare(b.start);
      if (dateDiff !== 0) return dateDiff;
      return a.title.localeCompare(b.title, 'ko');
    });

  useEffect(()=>{
    const t = new Date();
    const mon = new Date(t); mon.setDate(t.getDate()-t.getDay()+1);
    const sun = new Date(mon); sun.setDate(mon.getDate()+6);
    const fmt = (d:Date)=>d.toISOString().slice(0,10);
    setWeekEvs(dynEv.filter(e=>e.start>=fmt(mon)&&e.start<=fmt(sun)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <main style={{background:"#F7F5F0"}}>
        {/* 히어로 */}
        <div className="max-w-[1760px] mx-auto px-5 md:px-10 pt-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
            <div>
              <p className="text-[13px] font-bold text-[#0B5C43] mb-1">전국 스포츠 대회 일정 + 개최지 여행 정보를 한곳에</p>
              <h1 className="text-[26px] md:text-[34px] font-extrabold tracking-tight leading-tight">
                대회 보러 가는 길,<br/>
                <span style={{background:'linear-gradient(transparent 60%,#D6F14E 60%)'}}>그 지역까지 즐기고 오세요</span>
              </h1>
            </div>
            {/* 3단계 사용법 */}
            <div className="hidden md:flex items-center gap-0 ml-auto flex-shrink-0">
              {[
                {step:'①', icon:'🔍', label:'대회 찾기'},
                {step:'②', icon:'🌿', label:'주변 정보'},
                {step:'③', icon:'✈️', label:'여행 계획'},
              ].map((s,i)=>(
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center px-4">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-[11px] font-bold text-[#0B5C43] mt-0.5">{s.step} {s.label}</span>
                  </div>
                  {i<2 && <span className="text-[#DDDDDD] text-xl">→</span>}
                </div>
              ))}
            </div>
          </div>
          {/* 예정 대회 수 */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[28px] font-black text-[#0B5C43] tracking-tight">{dynEv.filter(e=>e.status!=='done').length}</span>
            <span className="text-[15px] font-semibold text-[#222]">건의 대회가 여러분을 기다리고 있어요</span>
          </div>
        </div>
        {/* 지도 + 캘린더 나란히 */}
        <section className="max-w-[1760px] mx-auto px-5 md:px-10 pt-4 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-[17px] font-bold text-[#222]">지도로 한눈에 보기</h2>
            <Link href="/calendar" className="ml-auto text-[14px] font-semibold text-[#0B5C43] border border-[#0B5C43] px-3 py-1 rounded-full hover:bg-[#E7F1EC] transition-colors">
              📅 캘린더 보기
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {/* 지도 — 1:1 비율 */}
            <div className="relative bg-[#C8DCE8] border-2 border-[#EBEBEB] rounded-2xl overflow-hidden md:flex-1"
              style={{aspectRatio:'1/1', maxHeight:'520px'}}>
              <KoreaMap events={EVENTS} className="w-full h-full"/>
            </div>
            {/* 캘린더 — 1:1 동일 크기 */}
            <div className="hidden md:flex flex-col md:flex-1 border-2 border-[#EBEBEB] rounded-2xl overflow-hidden bg-white"
              style={{aspectRatio:'1/1', maxHeight:'520px'}}>
              <div className="px-5 py-4 border-b border-[#EBEBEB] bg-[#F7F7F6]">
                <div className="font-bold text-[16px] text-[#222]">
                  {today.getMonth()+1}월 예정 대회
                  <span className="ml-2 text-[13px] text-[#0B5C43] font-semibold">{thisMonthEv.length}건</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-2">
                {thisMonthEv.slice(0,12).map(e=>{
                  const sp = getSportInfo(e.sport);
                  return (
                    <Link key={e.id} href={`/events/${e.id}`}
                      className="flex items-center gap-3 py-2.5 border-b border-[#F5F5F5] last:border-0 hover:bg-[#F7F7F6] rounded-lg px-2 -mx-2 transition-colors">
                      <div className="w-9 h-9 flex-shrink-0 rounded-xl border-2 flex items-center justify-center text-lg"
                        style={{borderColor:sp.color+'55',background:sp.color+'11'}}>
                        {sp.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] text-[#222] truncate">{e.title}</div>
                        <div className="text-[12px] text-[#717171]">{e.region} · {e.start.slice(5).replace('-','/')}</div>
                      </div>
                    </Link>
                  );
                })}
                {thisMonthEv.length === 0 && (
                  <div className="text-center py-8 text-[13px] text-[#717171]">이번달 예정 대회가 없습니다</div>
                )}
              </div>
              <div className="px-4 py-3 border-t border-[#EBEBEB]">
                <Link href="/calendar" className="block text-center text-[13px] font-bold text-[#0B5C43] hover:underline">
                  월간 캘린더로 전체 보기 ›
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 캐러셀 3개 */}
        <EventRow title="전체 대회" href="/events" events={upcoming.slice(0,6)}/>
        {thisMonthEv.length > 0 && (
          <EventRow title="이번달의 대회" href="/events?tab=month" events={thisMonthEv.slice(0,6)}/>
        )}
        {weekEvs.length > 0 && (
          <EventRow title="이번주의 대회" href="/events?tab=week" events={weekEvs.slice(0,6)}/>
        )}

        {/* 지역별 둘러보기 */}
        <section className="max-w-[1760px] mx-auto px-5 md:px-10 py-7 border-t border-[#EBEBEB]">
          <h2 className="text-[20px] md:text-[22px] font-extrabold tracking-tight mb-1">지역별로 둘러보기</h2>
          <p className="text-[#717171] text-[15px] mb-5">가고 싶은 지역을 고르면 그 지역의 대회만 모아 보여 드립니다.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {REGIONS_LIST.map(r=>{
              const cnt = dynEv.filter(e=>e.region===r&&e.status!=='done').length;
              return (
                <button key={r} onClick={()=>setSelectedRegion(r)}
                  className="rounded-2xl py-5 px-3 text-center transition-all group hover:shadow-md"
                  style={{
                    border: `2.5px solid ${(REGION_COLOR[r]||{border:'#EBEBEB'}).border}`,
                    background: (REGION_COLOR[r]||{bg:'#F7F7F6'}).bg,
                  }}>
                  <b className="block text-[18px] md:text-[20px] font-extrabold tracking-tight mt-1"
                    style={{color:(REGION_COLOR[r]||{text:'#222'}).text}}>{r}</b>
                  <span className={`text-[13px] mt-1 block font-bold ${cnt?'text-[#E4572E]':'text-[#AAAAAA]'}`}>
                    {cnt?`예정 ${cnt}건`:'없음'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* KTO 스트립 */}
        <div className="border-t border-[#EBEBEB] bg-white">
          <div className="max-w-[1760px] mx-auto">
            <div className="flex flex-col md:flex-row border-b border-[#EBEBEB]">
              <div className="flex items-center justify-between px-5 md:px-10 py-5 md:flex-1 border-b md:border-b-0 md:border-r border-[#EBEBEB]">
                <span className="text-[#222] font-semibold text-[15px]">관광안내</span>
                <b className="text-2xl font-extrabold tracking-widest">
                  <span className="text-[#E6397E]">1</span><span className="text-[#0B8A4B]">3</span>
                  <span className="text-[#2B6CB0]">3</span><span className="text-[#12A5B8]">0</span>
                </b>
              </div>
              <div className="flex items-center justify-between px-5 md:px-10 py-5 md:flex-1">
                <span className="text-[#222] font-semibold text-[15px]">지역번호</span>
                <span className="text-xl font-extrabold text-[#E8720C] tracking-widest">+ 120</span>
              </div>
            </div>
            <button onClick={()=>setKtoOpen(v=>!v)}
              className="w-full flex items-center justify-between px-5 md:px-10 py-4 hover:bg-[#F7F7F6] transition-colors border-b border-[#EBEBEB]">
              <span className="font-semibold text-[15px] text-[#222]">관광정보</span>
              <span className="text-xl font-light">{ktoOpen?'—':'+'}</span>
            </button>
            {ktoOpen && (
              <div className="px-5 md:px-10 py-5 bg-[#F7F7F6] border-b border-[#EBEBEB]">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {KTO_LINKS.map(([name,url])=>(
                    <li key={name} className="flex items-center gap-2 py-2 text-[14px]">
                      <span className="text-[#AAAAAA]">·</span>
                      <a href={url} target="_blank" rel="noopener" className="text-[#0B5C43] font-medium hover:underline">{name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <footer className="bg-[#F7F7F6] border-t border-[#EBEBEB] text-[#717171] text-[14px]">
          <div className="max-w-[1760px] mx-auto px-5 md:px-10 py-7 flex flex-wrap gap-6 items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.svg" alt="" className="h-8 w-8"/>
                <span className="font-extrabold text-[18px] text-[#1B1F1D] tracking-[-0.05em]">스포트립</span>
              </div>
              <p className="text-[13px] text-[#AAAAAA]">SpoTrip · 2026 관광데이터 활용 공모전</p>
              <p className="text-[12px] text-[#CCCCCC] mt-1">💡 하트 저장은 이 기기 브라우저에만 저장됩니다</p>
            </div>
            <div className="ml-auto text-right text-[13px]">
              
              출처: ⓒ한국관광공사
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] px-5 md:px-10 py-3.5 text-center text-[13px] text-[#AAAAAA]">
            © 2026 스포트립
          </div>
        </footer>
      </main>
    </>
  );
}
