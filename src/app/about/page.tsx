import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { EVENTS } from '@/lib/data';

const STATS = [
  { num: '168+', label: '등록 대회', desc: '전국 스포츠 대회 데이터베이스' },
  { num: '17', label: '지역 커버리지', desc: '전국 17개 시·도 완전 커버' },
  { num: '15', label: '종목 카테고리', desc: '마라톤부터 골프까지' },
  { num: '5', label: 'TourAPI 카테고리', desc: '관광지·축제·음식·숙박·문화' },
];

const FEATURES = [
  {
    icon: '🏃',
    title: '대회 찾기',
    desc: '전국 스포츠 대회 일정을 지역·종목·날짜로 검색하세요. 마라톤, 배드민턴, 축구 등 15개 종목 168개 이상의 대회를 한눈에 확인할 수 있습니다.',
  },
  {
    icon: '🗺️',
    title: '지도로 탐색',
    desc: '카카오맵 기반 실제 지도에서 대회 개최지를 확인하세요. 종목별 필터로 원하는 대회만 표시하고, 클릭 한 번으로 해당 지역 대회 목록을 바로 볼 수 있습니다.',
  },
  {
    icon: '🌿',
    title: '주변 여행 정보',
    desc: '한국관광공사 TourAPI를 활용해 대회 개최지 주변 관광지·음식점·숙박·축제 정보를 실시간으로 제공합니다. 대회 참가와 여행을 한 번에 계획하세요.',
  },
  {
    icon: '📅',
    title: '월간 캘린더',
    desc: '월별 대회 일정을 캘린더로 한눈에 확인하세요. 종목별 필터로 관심 있는 대회만 골라 볼 수 있습니다.',
  },
  {
    icon: '📍',
    title: '길찾기 연동',
    desc: '네이버 지도·카카오맵·구글 지도와 연동해 대회 장소까지 바로 길찾기가 가능합니다. 대중교통부터 자동차까지 원하는 방법으로 이동하세요.',
  },
  {
    icon: '❤️',
    title: '대회 저장',
    desc: '마음에 드는 대회는 하트로 저장하세요. 로그인 없이도 바로 저장되며, 저장한 대회를 언제든지 확인할 수 있습니다.',
  },
];

const DATA_SOURCES = [
  {
    logo: '🏛️',
    name: '공공데이터포털',
    api: '전국대회정보 표준데이터',
    desc: '국민체육진흥법에 따라 지방자치단체에서 관리하는 전국 스포츠 대회 정보를 매주 자동으로 수집합니다.',
    url: 'https://www.data.go.kr',
    badge: '매주 자동 업데이트',
  },
  {
    logo: '🇰🇷',
    name: '한국관광공사',
    api: '국문 관광정보 서비스 (TourAPI)',
    desc: '한국관광공사가 제공하는 고품질 관광 콘텐츠 API로 대회 장소 주변 관광지·음식점·숙박·축제 정보를 실시간 제공합니다.',
    url: 'https://api.visitkorea.or.kr',
    badge: '실시간 연동',
  },
];

const TECH_STACK = [
  { name: 'Next.js 15', desc: '웹 프레임워크', icon: '⚡' },
  { name: 'TypeScript', desc: '타입 안전성', icon: '🔷' },
  { name: 'Tailwind CSS', desc: 'UI 스타일링', icon: '🎨' },
  { name: 'Kakao Maps API', desc: '지도 서비스', icon: '🗺️' },
  { name: 'TourAPI', desc: '관광 정보', icon: '🌿' },
  { name: 'Vercel', desc: '배포 플랫폼', icon: '🚀' },
  { name: 'GitHub Actions', desc: '데이터 자동화', icon: '🤖' },
];

const ROADMAP = [
  { phase: 'Phase 1', status: 'done', title: '대회 정보 플랫폼', items: ['전국 대회 데이터베이스', '카카오맵 지도 연동', '종목별 필터링', '월간 캘린더'] },
  { phase: 'Phase 2', status: 'current', title: '여행 정보 연동', items: ['TourAPI 관광 정보 실시간 연동', '길찾기 외부 지도 연결', '지역별 여행 코스 추천', '대회 장소 주변 정보'] },
  { phase: 'Phase 3', status: 'plan', title: '커뮤니티·고도화', items: ['회원 가입 및 로그인', '대회 후기 및 평점', '함께 가요 모집 기능', '알림 서비스'] },
  { phase: 'Phase 4', status: 'plan', title: '비즈니스 확장', items: ['대회 주최자 등록 서비스', '스포츠 브랜드 제휴', '광고 플랫폼', '프리미엄 구독'] },
];

export default function AboutPage() {
  const upcomingCount = EVENTS.filter(e => e.status !== 'done').length;

  return (
    <>
      <Header/>
      <main className="max-w-[1760px] mx-auto">

        {/* 히어로 섹션 */}
        <section className="px-5 md:px-20 py-16 md:py-24 text-center border-b border-[#EBEBEB]"
          style={{background:'linear-gradient(135deg, #E7F1EC 0%, #F0F9F0 50%, #FEFDE7 100%)'}}>
          <div className="inline-flex items-center gap-2 bg-white border border-[#0B5C43] text-[#0B5C43] text-[13px] font-bold px-4 py-1.5 rounded-full mb-6">
            🏆 2026 한국관광공사 관광데이터 활용 공모전 출품작
          </div>
          <h1 className="text-[32px] md:text-[48px] font-extrabold tracking-tight leading-tight mb-4">
            대회 보러 가는 길,<br/>
            <span style={{background:'linear-gradient(transparent 60%,#D6F14E 60%)'}}>그 지역까지 즐기고 오세요</span>
          </h1>
          <p className="text-[17px] text-[#555] max-w-[640px] mx-auto mb-8 leading-relaxed">
            스포트립은 전국 스포츠 대회 일정과 개최지 주변 관광 정보를 한 번에 제공하는<br className="hidden md:block"/> 스포츠 관광 플랫폼입니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/events"
              className="px-6 py-3.5 bg-[#0B5C43] text-white font-bold text-[16px] rounded-xl hover:bg-[#083D2D] transition-colors">
              대회 찾아보기
            </Link>
            <Link href="/calendar"
              className="px-6 py-3.5 border-2 border-[#0B5C43] text-[#0B5C43] font-bold text-[16px] rounded-xl hover:bg-[#E7F1EC] transition-colors">
              캘린더 보기
            </Link>
          </div>
        </section>

        {/* 통계 */}
        <section className="px-5 md:px-20 py-12 border-b border-[#EBEBEB]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.num} className="text-center p-6 bg-[#F7F7F6] rounded-2xl">
                <div className="text-[40px] md:text-[48px] font-extrabold text-[#0B5C43] tracking-tight">{s.num}</div>
                <div className="text-[16px] font-bold text-[#222] mt-1">{s.label}</div>
                <div className="text-[13px] text-[#717171] mt-1">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 핵심 기능 */}
        <section className="px-5 md:px-20 py-14 border-b border-[#EBEBEB]">
          <h2 className="text-[26px] md:text-[32px] font-extrabold tracking-tight mb-2">핵심 기능</h2>
          <p className="text-[16px] text-[#717171] mb-10">스포트립이 제공하는 주요 서비스를 소개합니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="p-6 border-2 border-[#EBEBEB] rounded-2xl hover:border-[#0B5C43] hover:shadow-sm transition-all">
                <div className="text-[36px] mb-3">{f.icon}</div>
                <h3 className="text-[18px] font-bold text-[#222] mb-2">{f.title}</h3>
                <p className="text-[14px] text-[#717171] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 데이터 출처 */}
        <section className="px-5 md:px-20 py-14 border-b border-[#EBEBEB] bg-[#F7F7F6]">
          <h2 className="text-[26px] md:text-[32px] font-extrabold tracking-tight mb-2">데이터 출처</h2>
          <p className="text-[16px] text-[#717171] mb-10">신뢰할 수 있는 공공 데이터를 기반으로 서비스를 제공합니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DATA_SOURCES.map(d => (
              <div key={d.name} className="bg-white border-2 border-[#EBEBEB] rounded-2xl p-6 hover:border-[#0B5C43] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-[40px]">{d.logo}</div>
                  <span className="text-[11px] font-bold bg-[#E7F1EC] text-[#0B5C43] px-3 py-1 rounded-full">{d.badge}</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#222] mb-0.5">{d.name}</h3>
                <p className="text-[13px] text-[#0B5C43] font-semibold mb-3">{d.api}</p>
                <p className="text-[14px] text-[#717171] leading-relaxed mb-4">{d.desc}</p>
                <a href={d.url} target="_blank" rel="noopener noreferrer"
                  className="text-[13px] font-semibold text-[#0B5C43] hover:underline">
                  공식 사이트 방문 ↗
                </a>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-[#AAAAAA] mt-6 text-center">
            출처: ⓒ한국관광공사 | 공공데이터포털 전국대회정보 표준데이터
          </p>
        </section>

        {/* 기술 스택 */}
        <section className="px-5 md:px-20 py-14 border-b border-[#EBEBEB]">
          <h2 className="text-[26px] md:text-[32px] font-extrabold tracking-tight mb-2">기술 스택</h2>
          <p className="text-[16px] text-[#717171] mb-10">최신 기술로 빠르고 안정적인 서비스를 구현했습니다.</p>
          <div className="flex flex-wrap gap-3">
            {TECH_STACK.map(t => (
              <div key={t.name} className="flex items-center gap-2.5 px-4 py-3 bg-[#F7F7F6] border border-[#EBEBEB] rounded-xl">
                <span className="text-xl">{t.icon}</span>
                <div>
                  <div className="text-[14px] font-bold text-[#222]">{t.name}</div>
                  <div className="text-[12px] text-[#717171]">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 서비스 발전 로드맵 */}
        <section className="px-5 md:px-20 py-14 border-b border-[#EBEBEB] bg-[#F7F7F6]">
          <h2 className="text-[26px] md:text-[32px] font-extrabold tracking-tight mb-2">서비스 로드맵</h2>
          <p className="text-[16px] text-[#717171] mb-10">스포트립의 성장 계획을 공유합니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {ROADMAP.map(r => (
              <div key={r.phase} className={`p-5 rounded-2xl border-2 ${
                r.status==='done' ? 'bg-[#E7F1EC] border-[#0B5C43]' :
                r.status==='current' ? 'bg-white border-[#D6F14E] shadow-md' :
                'bg-white border-[#EBEBEB]'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-bold text-[#717171]">{r.phase}</span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    r.status==='done' ? 'bg-[#0B5C43] text-white' :
                    r.status==='current' ? 'bg-[#D6F14E] text-[#2A3308]' :
                    'bg-[#EBEBEB] text-[#717171]'
                  }`}>
                    {r.status==='done' ? '완료' : r.status==='current' ? '진행 중' : '예정'}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-[#222] mb-3">{r.title}</h3>
                <ul className="space-y-1.5">
                  {r.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-[13px] text-[#555]">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        r.status==='done' ? 'bg-[#0B5C43]' :
                        r.status==='current' ? 'bg-[#D6F14E]' : 'bg-[#AAAAAA]'
                      }`}/>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 비즈니스 모델 */}
        <section className="px-5 md:px-20 py-14 border-b border-[#EBEBEB]">
          <h2 className="text-[26px] md:text-[32px] font-extrabold tracking-tight mb-2">비즈니스 모델</h2>
          <p className="text-[16px] text-[#717171] mb-10">스포트립의 지속 가능한 수익 모델입니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon:'📣', title:'대회 주최자 서비스', desc:'스포츠 대회 주최자가 직접 대회를 등록·홍보할 수 있는 프리미엄 서비스. 참가자 모집부터 결과 공지까지 원스톱으로 관리합니다.', badge:'Phase 3' },
              { icon:'🤝', title:'스포츠 브랜드 제휴', desc:'스포츠 용품 브랜드, 숙박 업체, 여행사와의 제휴를 통한 광고·커머스 수익. 대회 참가자에게 맞춤 상품을 추천합니다.', badge:'Phase 4' },
              { icon:'⭐', title:'프리미엄 구독', desc:'알림 서비스, 우선 신청, 전용 분석 리포트 등 부가 서비스를 제공하는 월정액 구독 모델입니다.', badge:'Phase 4' },
            ].map(b => (
              <div key={b.title} className="p-6 border-2 border-[#EBEBEB] rounded-2xl">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[36px]">{b.icon}</span>
                  <span className="text-[11px] font-bold bg-[#F7F7F6] text-[#717171] px-2.5 py-1 rounded-full">{b.badge}</span>
                </div>
                <h3 className="text-[17px] font-bold text-[#222] mb-2">{b.title}</h3>
                <p className="text-[14px] text-[#717171] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 md:px-20 py-16 text-center"
          style={{background:'linear-gradient(135deg, #0B5C43 0%, #083D2D 100%)'}}>
          <h2 className="text-[28px] md:text-[36px] font-extrabold text-white tracking-tight mb-3">
            지금 바로 시작하세요
          </h2>
          <p className="text-[16px] text-white/80 mb-8">
            전국 168개 이상의 스포츠 대회와 주변 여행 정보를 스포트립에서 확인하세요.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/events"
              className="px-8 py-4 bg-[#D6F14E] text-[#2A3308] font-extrabold text-[16px] rounded-xl hover:opacity-90 transition-opacity">
              대회 찾기
            </Link>
            <Link href="/calendar"
              className="px-8 py-4 border-2 border-white text-white font-bold text-[16px] rounded-xl hover:bg-white/10 transition-colors">
              캘린더 보기
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
