import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EVENTS, calcDday, calcStatus } from '@/lib/data';
import { Header } from '@/components/layout/Header';
import { getTourData } from '@/lib/courses';
import { TourSection } from '@/components/events/TourSection';
import { getSportInfo } from '@/lib/sports';
import { ShareButton } from '@/components/events/ShareButton';
import { SaveButton } from '@/components/events/SaveButton';
import { ExternalLink, MapPin, Calendar, Users } from 'lucide-react';

export async function generateStaticParams() {
  return EVENTS.map(e => ({ id: String(e.id) }));
}

function fmtDate(ds: string) {
  const [y,m,d] = ds.split('-').map(Number);
  return `${y}년 ${m}월 ${d}일 (${'일월화수목금토'[new Date(Date.UTC(y,m-1,d)).getUTCDay()]})`;
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ev = EVENTS.find(e => String(e.id) === id);
  if (!ev) return notFound();

  const tour  = getTourData(ev.region);
  const dday  = calcDday(ev.start);
  const isDone = calcStatus(ev.start, ev.end) === 'done';
  const sport = getSportInfo(ev.sport);

  return (
    <>
      <Header/>
      <main className="max-w-[1760px] mx-auto px-5 md:px-10 pb-32 md:pb-16">
        {/* 브레드크럼 */}
        <p className="text-[14px] text-[#717171] py-4">
          <Link href="/events" className="text-[#0B5C43] font-semibold hover:underline">대회 일정</Link>
          {' › '}{ev.region} · {ev.sport}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8 md:gap-12 items-start">
          {/* ── 좌측 메인 ── */}
          <div>
            {/* 종목 배지 + D-day */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-[15px]"
                style={{borderColor:sport.color, color:sport.color, background:sport.color+'11'}}>
                <span className="text-2xl">{sport.emoji}</span>
                {ev.sport}
              </div>
              {!isDone && (
                <span className="text-white font-bold text-[15px] px-4 py-2 rounded-full"
                  style={{background:sport.color}}>{dday}</span>
              )}
              {isDone && <span className="bg-[#F7F7F6] text-[#AAAAAA] font-semibold text-[15px] px-4 py-2 rounded-full">종료된 대회</span>}
            </div>

            {/* 대회명 */}
            <h1 className="text-[26px] md:text-[32px] font-extrabold tracking-tight leading-tight mb-6">{ev.title}</h1>

            {/* 핵심 정보 테이블 */}
            <div className="border-2 border-[#EBEBEB] rounded-2xl overflow-hidden mb-8">
              {[
                ['📅 대회 기간', `${fmtDate(ev.start)}${ev.end && ev.end !== ev.start ? ` ~ ${fmtDate(ev.end)}` : ''}`],
                ['📍 장소', ev.venue],
                ['🗺️ 주소', ev.address + (ev.venue ? ` · ${ev.venue}` : '')],
                ['🏃 종목', ev.sport + (ev.distances ? ` · ${ev.distances}` : '')],
                ['👥 참가 규모', ev.participants],
              ].map(([label, val])=>(
                <div key={label} className="flex items-start gap-4 px-5 py-4 border-b border-[#EBEBEB] last:border-0">
                  <span className="text-[15px] text-[#717171] font-semibold w-32 flex-shrink-0">{label}</span>
                  <span className="text-[16px] font-medium text-[#222] flex-1">{val}</span>
                </div>
              ))}
              {/* 공식 사이트 */}
              <div className="flex items-center gap-4 px-5 py-4">
                <span className="text-[15px] text-[#717171] font-semibold w-32 flex-shrink-0">🌐 공식 사이트</span>
                {ev.url ? (
                  <a href={ev.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[16px] font-bold text-[#0B5C43] hover:underline flex-1 min-w-0">
                    <ExternalLink className="w-4 h-4 flex-shrink-0"/>
                    <span className="truncate">{ev.url}</span>
                  </a>
                ) : (
                  <span className="text-[15px] text-[#AAAAAA]">준비 중</span>
                )}
              </div>
            </div>

            {/* 주변 관광 정보 */}
            <section>
              <h2 className="text-[22px] font-extrabold tracking-tight mb-5">
                {ev.region} 주변 여행 정보
              </h2>
              <TourSection title="행사·축제" icon="🎊" sampleItems={tour.festival} lat={ev.lat} lng={ev.lng} contentTypeId="15"/>
              <TourSection title="역사 관광지" icon="🏛️" sampleItems={tour.attraction} lat={ev.lat} lng={ev.lng} contentTypeId="12"/>
              <TourSection title="문화·레포츠" icon="🎭" sampleItems={tour.culture} lat={ev.lat} lng={ev.lng} contentTypeId="14"/>
              <TourSection title="음식점" icon="🍽️" sampleItems={tour.food} lat={ev.lat} lng={ev.lng} contentTypeId="39"/>
              <TourSection title="숙박" icon="🏨" sampleItems={tour.hotel} lat={ev.lat} lng={ev.lng} contentTypeId="32"/>
            </section>
          </div>

          {/* ── 우측 사이드 (데스크톱) ── */}
          <aside className="hidden md:block sticky top-6">
            <div className="border-2 border-[#EBEBEB] rounded-2xl overflow-hidden">
              {/* 종목 캐릭터 카드 */}
              <div className="aspect-square flex flex-col items-center justify-center bg-white border-b-2 border-[#EBEBEB]"
                style={{background:sport.color+'08'}}>
                <div className="text-[80px] leading-none mb-4">{sport.emoji}</div>
                {!isDone && (
                  <div className="text-white font-bold text-[18px] px-5 py-2 rounded-full"
                    style={{background:sport.color}}>{dday}</div>
                )}
              </div>
              <div className="p-5">
                <div className="text-[18px] font-bold text-[#222] mb-1">{ev.title}</div>
                <div className="text-[15px] text-[#717171] mb-4">{ev.region} · {fmtDate(ev.start)}</div>
                {ev.url ? (
                  <a href={ev.url} target="_blank" rel="noopener noreferrer"
                    className="block w-full text-center py-4 rounded-xl font-bold text-[16px] text-white transition-colors"
                    style={{background:sport.color}}>
                    공식 사이트 바로가기 ↗
                  </a>
                ) : (
                  <div className="block w-full text-center py-4 rounded-xl text-[15px] text-[#AAAAAA] bg-[#F7F7F6]">
                    공식 사이트 준비 중
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <SaveButton eventId={String(ev.id)} className="flex-1"/>
                  <ShareButton url={`/events/${ev.id}`} title={ev.title} className="flex-1"/>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 모바일 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#EBEBEB] px-5 py-3.5 md:hidden z-40 flex items-center gap-3 shadow-lg">
        <div className="text-2xl">{sport.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[14px] text-[#222] truncate">{ev.title}</div>
          <div className="text-[13px] text-[#717171]">
            {isDone ? '종료된 대회' : <span className="font-bold" style={{color:sport.color}}>{dday}</span>}
          </div>
        </div>
        {ev.url ? (
          <a href={ev.url} target="_blank" rel="noopener"
            className="flex-shrink-0 text-white font-bold text-[14px] px-5 py-3 rounded-xl"
            style={{background:sport.color}}>
            공식 사이트 ↗
          </a>
        ) : (
          <span className="flex-shrink-0 bg-[#F7F7F6] text-[#717171] text-[14px] px-5 py-3 rounded-xl">준비 중</span>
        )}
      </div>
    </>
  );
}
