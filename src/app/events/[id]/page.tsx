import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EVENTS, calcDday, calcStatus, calcVerified, VERIFIED_LABELS, calcRegistrationStatus, REG_STATUS_LABELS } from '@/lib/data';
import { Header } from '@/components/layout/Header';
import { getTourData } from '@/lib/courses';
import { TourSection } from '@/components/events/TourSection';
import { CourseSection } from '@/components/events/CourseSection';
import { getSportInfo } from '@/lib/sports';
import { ShareButton } from '@/components/events/ShareButton';
import { BackButton } from '@/components/events/BackButton';
import { SaveButton } from '@/components/events/SaveButton';
import { ExternalLink, MapPin, Calendar, Users } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ev = EVENTS.find(e => String(e.id) === id);
  if (!ev) return {};
  return {
    title: `${ev.title} | 스포트립`,
    description: `${ev.region} ${ev.sport} 대회 · ${ev.start} · ${ev.venue}. 개최지 주변 관광지·맛집·숙박 정보도 확인하세요.`,
    openGraph: {
      title: ev.title,
      description: `${ev.region} ${ev.sport} · ${ev.start}`,
    },
  };
}

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
  const verifiedStatus = calcVerified(ev.id, ev.url||'');
  const verifiedLabel  = VERIFIED_LABELS[verifiedStatus];
  const regStatus      = calcRegistrationStatus(ev.start);
  const regLabel       = REG_STATUS_LABELS[regStatus];
  const sport = getSportInfo(ev.sport);

  return (
    <>
      <Header/>
      <main className="max-w-[1760px] mx-auto px-5 md:px-10 pb-32 md:pb-16">
        {/* 뒤로가기 + 브레드크럼 */}
        <div className="flex items-center gap-3 py-4">
          <BackButton/>
          <span className="text-[#DDDDDD]">|</span>
          <p className="text-[14px] text-[#717171]">
            <Link href="/events" className="text-[#0B5C43] font-semibold hover:underline">대회 일정</Link>
            {' › '}{ev.region} · {ev.sport}
          </p>
        </div>

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
              <div className="flex items-center gap-4 px-5 py-3 bg-[#F7F7F6]">
                <span className="text-[13px] text-[#AAAAAA]">정보가 정확하지 않나요?</span>
                <a href="https://forms.gle/example" target="_blank" rel="noopener"
                  className="text-[13px] font-semibold text-[#0B5C43] hover:underline">
                  정보 수정 제보하기 →
                </a>
                <span className="text-[11px] text-[#AAAAAA] ml-auto">{verifiedLabel.text} · 8.11 확인</span>
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
                
              </div>
              {/* 지도 미리보기 + 길찾기 버튼 */}
              <div className="px-5 py-4">
                <p className="text-[13px] text-[#717171] mb-3">외부 지도 앱으로 길찾기</p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a href={`https://map.naver.com/v5/directions/-/-/${encodeURIComponent(ev.venue)},${ev.lng},${ev.lat}/transit`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] border-2 border-[#E0E0E0] text-[#333] hover:border-[#0B5C43] hover:text-[#0B5C43] transition-all bg-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    네이버 지도로 길찾기
                  </a>
                  <a href={`https://map.kakao.com/link/to/${encodeURIComponent(ev.venue)},${ev.lat},${ev.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] border-2 border-[#E0E0E0] text-[#333] hover:border-[#0B5C43] hover:text-[#0B5C43] transition-all bg-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    카카오맵으로 길찾기
                  </a>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${ev.lat},${ev.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] border-2 border-[#E0E0E0] text-[#333] hover:border-[#0B5C43] hover:text-[#0B5C43] transition-all bg-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10"/>
                    </svg>
                    구글 지도로 길찾기
                  </a>
                </div>
              </div>
            </div>

            {/* 주변 관광 정보 */}
            <section>
              <h2 className="text-[22px] font-extrabold tracking-tight mb-5">
                대회 장소 주변 여행 정보
              </h2>
              {/* 여행 코스 추천 */}
              <CourseSection
                eventTitle={ev.title}
                region={ev.region}
                lat={ev.lat}
                lng={ev.lng}
              />
              <div className="border-t border-[#EBEBEB] my-6"/>
              <h2 className="text-[22px] font-extrabold tracking-tight mb-5">주변 관광 정보</h2>
              <TourSection title="행사·축제" icon="🎊" sampleItems={tour.festival} lat={ev.lat} lng={ev.lng} contentTypeId="15"/>
              <TourSection title="역사 관광지" icon="🏛️" sampleItems={tour.attraction} lat={ev.lat} lng={ev.lng} contentTypeId="12"/>
              <TourSection title="문화·레포츠" icon="🎭" sampleItems={tour.culture} lat={ev.lat} lng={ev.lng} contentTypeId="14"/>
              <TourSection title="음식점" icon="🍽️" sampleItems={tour.food} lat={ev.lat} lng={ev.lng} contentTypeId="39"/>
              <TourSection title="숙박" icon="🏨" sampleItems={tour.hotel} lat={ev.lat} lng={ev.lng} contentTypeId="32"/>

            {/* 면책 문구 */}
            <div className="mt-8 p-4 bg-[#F7F7F6] border border-[#EBEBEB] rounded-xl text-[12px] text-[#AAAAAA] leading-relaxed">
              ⚠️ <strong>참가 신청 전 반드시 공식 사이트에서 확인하세요.</strong> 대회 일정·장소·접수 정보는 변경될 수 있습니다.
              대회 정보 출처: 공공데이터포털 전국대회정보 표준데이터 | 관광 정보 출처: ⓒ한국관광공사 (kto.visitkorea.or.kr)
            </div>
            </section>
            <p className="text-[12px] text-[#AAAAAA] mt-2 mb-8">
              출처: ⓒ한국관광공사 | 한국관광공사 국문 관광정보 서비스 (api.visitkorea.or.kr)
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
                    🎽 바로 접수하기 ↗
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
