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
            <div className="border-2 border-[#EBEBEB] rounded-2xl overflow-hidden mb-5">
              {[
                ['📅 대회 기간', `${fmtDate(ev.start)}${ev.end && ev.end !== ev.start ? ` ~ ${fmtDate(ev.end)}` : ''}`],
                ['🏃 종목', ev.sport + (ev.distances ? ` · ${ev.distances}` : '')],
                ['👥 참가 규모', ev.participants],
              ].map(([label, val])=>(
                <div key={label} className="flex items-start gap-4 px-5 py-4 border-b border-[#EBEBEB]">
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

            {/* ── 개최 장소 + 길찾기 ── */}
            <div className="border-2 border-[#EBEBEB] rounded-2xl overflow-hidden mb-8">
              <div className="px-5 py-4 border-b border-[#EBEBEB] bg-[#F7F7F6]">
                <h3 className="font-bold text-[16px] text-[#222]">📍 개최 장소</h3>
              </div>
              <div className="px-5 py-4 border-b border-[#EBEBEB]">
                <div className="font-bold text-[17px] text-[#222] mb-1">{ev.venue}</div>
                <div className="text-[15px] text-[#717171]">{ev.address} · {ev.region}</div>
                {ev.lat && ev.lng && (
                  <div className="text-[13px] text-[#AAAAAA] mt-1">
                    좌표: {ev.lat.toFixed(4)}, {ev.lng.toFixed(4)}
                  </div>
                )}
              </div>
              {/* 지도 미리보기 + 길찾기 버튼 */}
              <div className="px-5 py-4">
                <p className="text-[13px] text-[#717171] mb-3">외부 지도 앱으로 길찾기</p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  {/* 네이버 지도 */}
                  <a href={`https://map.naver.com/v5/directions/-/-/${encodeURIComponent(ev.venue)},${ev.lng},${ev.lat}/transit?c=${ev.lng},${ev.lat},15,0,0,0,dh`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-[15px] text-white transition-opacity hover:opacity-90"
                    style={{background:'#03C75A'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
                    </svg>
                    네이버 지도 길찾기
                  </a>
                  {/* 카카오 지도 */}
                  <a href={`https://map.kakao.com/link/to/${encodeURIComponent(ev.venue)},${ev.lat},${ev.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-[15px] transition-opacity hover:opacity-90"
                    style={{background:'#FEE500', color:'#3C1E1E'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#3C1E1E">
                      <path d="M12 3C6.48 3 2 6.92 2 11.75c0 3.04 1.87 5.72 4.7 7.28L5.5 23l4.64-2.73c.62.09 1.24.14 1.86.14 5.52 0 10-3.92 10-8.75S17.52 3 12 3z"/>
                    </svg>
                    카카오맵 길찾기
                  </a>
                  {/* 구글 지도 */}
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${ev.lat},${ev.lng}&destination_place_id=${encodeURIComponent(ev.venue)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-[15px] border-2 border-[#EBEBEB] text-[#333] transition-all hover:border-[#4285F4] hover:text-[#4285F4]">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    구글 지도
                  </a>
                </div>
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
            <p className="text-[12px] text-[#AAAAAA] mt-2 mb-8">
              출처: ⓒ한국관광공사 | 한국관광공사 국문 관광정보 서비스
            </p>
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
