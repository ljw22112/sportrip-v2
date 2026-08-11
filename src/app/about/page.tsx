import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { SportripIcon, IconTile } from '@/components/SportripIcon';
import { EVENTS } from '@/lib/data';
import { ExternalLink } from 'lucide-react';

const upcomingCount = EVENTS.filter(e => e.status !== 'done').length;

const FEATURES = [
  { icon:'findEvent'  as const, tone:'brand' as const, title:'대회 찾기',     desc:'전국 스포츠 대회 일정을 지역·종목·날짜로 검색. 15개 종목 대회를 한눈에 확인하세요.' },
  { icon:'mapExplore' as const, tone:'brand' as const, title:'지도로 탐색',   desc:'카카오맵 기반 실제 지도에서 대회 개최지를 확인하고, 종목별 필터로 원하는 대회를 찾으세요.' },
  { icon:'travelInfo' as const, tone:'green' as const, title:'주변 여행 정보', desc:'TourAPI 기반으로 대회 장소 주변 관광지·음식점·숙박·축제 정보를 실시간 제공합니다.' },
  { icon:'calendar'   as const, tone:'amber' as const, title:'월간 캘린더',   desc:'월별 대회 일정을 캘린더로 확인하고, 종목 필터로 원하는 대회만 골라 보세요.' },
  { icon:'directions' as const, tone:'brand' as const, title:'길찾기 연동',   desc:'네이버 지도·카카오맵·구글 지도와 연동해 대회 장소까지 바로 길찾기가 가능합니다.' },
  { icon:'save'       as const, tone:'rose'  as const, title:'대회 저장',     desc:'마음에 드는 대회는 저장해두세요. 로그인 없이 바로 저장되며 언제든 확인할 수 있습니다.' },
];

const DATA_SOURCES = [
  { icon:'publicData' as const, tone:'slate' as const, name:'공공데이터포털', sub:'전국대회정보 표준데이터', desc:'국민체육진흥법에 따라 지방자치단체에서 관리하는 전국 스포츠 대회 정보를 매주 자동 수집합니다.', badge:'매주 자동 업데이트', url:'https://www.data.go.kr' },
  { icon:'tourOrg'   as const, tone:'brand' as const, name:'한국관광공사', sub:'국문 관광정보 서비스 (TourAPI)', desc:'한국관광공사가 제공하는 고품질 관광 콘텐츠 API로 주변 관광지·음식점·숙박·축제 정보를 실시간 제공합니다.', badge:'실시간 연동', url:'https://api.visitkorea.or.kr' },
];

const TECH_STACK = [
  { icon:'nextjs'     as const, name:'Next.js 15',     role:'웹 프레임워크' },
  { icon:'typescript' as const, name:'TypeScript',     role:'타입 안전성' },
  { icon:'tailwind'   as const, name:'Tailwind CSS',   role:'UI 스타일링' },
  { icon:'kakaoMap'   as const, name:'Kakao Maps API', role:'지도 서비스' },
  { icon:'tourApi'    as const, name:'TourAPI',        role:'관광 정보' },
  { icon:'vercel'     as const, name:'Vercel',         role:'배포 플랫폼' },
  { icon:'automation' as const, name:'GitHub Actions', role:'데이터 자동화' },
];

const ROADMAP = [
  { phase:'Phase 1', status:'done',    title:'대회 정보 플랫폼',  items:['전국 대회 DB 구축','카카오맵 지도 연동','종목별 필터링','월간 캘린더'] },
  { phase:'Phase 2', status:'current', title:'여행 정보 연동',    items:['TourAPI 관광 정보 실시간 연동','길찾기 외부 지도 연결','지역별 여행 코스 추천','대회 장소 주변 정보'] },
  { phase:'Phase 3', status:'plan',    title:'커뮤니티·고도화',   items:['회원 가입 및 로그인','대회 후기 및 평점','함께 가요 모집','알림 서비스'] },
  { phase:'Phase 4', status:'plan',    title:'비즈니스 확장',     items:['대회 주최자 등록 서비스','스포츠 브랜드 제휴','광고 플랫폼','프리미엄 구독'] },
];

const BUSINESS = [
  { icon:'organizer'   as const, tone:'brand' as const, title:'대회 주최자 서비스', badge:'Phase 3', desc:'대회 주최자가 직접 등록·홍보할 수 있는 프리미엄 서비스. 참가자 모집부터 결과 공지까지 원스톱.' },
  { icon:'partnership' as const, tone:'green' as const, title:'스포츠 브랜드 제휴', badge:'Phase 4', desc:'스포츠 용품 브랜드, 숙박, 여행사와의 제휴 광고·커머스 수익. 참가자에게 맞춤 상품을 추천합니다.' },
  { icon:'premium'     as const, tone:'amber' as const, title:'프리미엄 구독',      badge:'Phase 4', desc:'알림 서비스, 우선 신청, 전용 리포트 등 부가 서비스를 제공하는 월정액 구독 모델입니다.' },
];

export default function AboutPage() {
  return (
    <>
      <Header/>
      <main>

        {/* ── 히어로 ── */}
        <section style={{background:'linear-gradient(135deg,#0B5C43 0%,#0F7A5A 60%,#145A3A 100%)'}}>
          <div className="max-w-[1760px] mx-auto px-6 md:px-20 py-16 md:py-24">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-[13px] font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <SportripIcon name="contest" size={15} className="text-[#D6F14E]"/>
              2026 한국관광공사 관광데이터 활용 공모전 출품작
            </div>
            <h1 className="text-[32px] md:text-[52px] font-extrabold text-white tracking-tight leading-tight mb-4">
              대회 보러 가는 길,<br/>
              <span className="text-[#D6F14E]">그 지역까지</span> 즐기고 오세요
            </h1>
            <p className="text-white/75 text-[16px] md:text-[18px] mb-8 max-w-[560px] leading-relaxed">
              전국 스포츠 대회 일정과 개최지 주변 관광 정보를 한 번에 제공하는<br className="hidden md:block"/> 스포츠 관광 플랫폼입니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/events"
                className="px-7 py-3.5 bg-[#D6F14E] text-[#1A2E0A] font-extrabold text-[15px] rounded-xl hover:opacity-90 transition-opacity">
                대회 찾아보기
              </Link>
              <Link href="/calendar"
                className="px-7 py-3.5 border-2 border-white/40 text-white font-bold text-[15px] rounded-xl hover:bg-white/10 transition-colors">
                캘린더 보기
              </Link>
            </div>
          </div>
        </section>

        {/* ── 통계 바 ── */}
        <section className="bg-[#F7F5F0] border-b border-[#E8E8E4]">
          <div className="max-w-[1760px] mx-auto px-6 md:px-20 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {num:`${EVENTS.length}+`, label:'등록 대회', sub:'전국 스포츠 DB'},
                {num:'17', label:'지역 커버리지', sub:'17개 시·도'},
                {num:'15', label:'종목 카테고리', sub:'마라톤~골프'},
                {num:'5', label:'TourAPI 카테고리', sub:'관광·음식·숙박·축제·문화'},
              ].map(s=>(
                <div key={s.label} className="text-center">
                  <div className="text-[40px] md:text-[48px] font-black text-[#0B5C43] tracking-tighter">{s.num}</div>
                  <div className="text-[15px] font-bold text-[#222] mt-0.5">{s.label}</div>
                  <div className="text-[12px] text-[#717171] mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 핵심 기능 ── */}
        <section className="max-w-[1760px] mx-auto px-6 md:px-20 py-14">
          <div className="mb-10">
            <p className="text-[13px] font-bold text-[#0B5C43] uppercase tracking-widest mb-2">FEATURES</p>
            <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-tight">핵심 기능</h2>
            <div className="w-12 h-1 bg-[#D6F14E] mt-3 rounded-full"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f=>(
              <div key={f.title} className="p-6 bg-white border border-[#EBEBEB] rounded-2xl hover:border-[#0B5C43] hover:shadow-sm transition-all">
                <IconTile name={f.icon} tone={f.tone} size={24}/>
                <h3 className="text-[17px] font-bold text-[#222] mt-4 mb-2">{f.title}</h3>
                <p className="text-[14px] text-[#717171] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 데이터 출처 ── */}
        <section style={{background:'#F0EDE8'}}>
          <div className="max-w-[1760px] mx-auto px-6 md:px-20 py-14">
            <div className="mb-10">
              <p className="text-[13px] font-bold text-[#0B5C43] uppercase tracking-widest mb-2">DATA SOURCES</p>
              <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-tight">데이터 출처</h2>
              <div className="w-12 h-1 bg-[#D6F14E] mt-3 rounded-full"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DATA_SOURCES.map(d=>(
                <div key={d.name} className="bg-white border border-[#DDDAD5] rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-5">
                    <IconTile name={d.icon} tone={d.tone} size={26}/>
                    <span className="text-[11px] font-bold bg-[#E7F1EC] text-[#0B5C43] px-3 py-1 rounded-full">{d.badge}</span>
                  </div>
                  <h3 className="text-[19px] font-bold text-[#222] mb-0.5">{d.name}</h3>
                  <p className="text-[13px] text-[#0B5C43] font-semibold mb-3">{d.sub}</p>
                  <p className="text-[14px] text-[#555] leading-relaxed mb-4">{d.desc}</p>
                  <a href={d.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0B5C43] hover:underline">
                    공식 사이트 방문
                    <SportripIcon name="external" size={13}/>
                  </a>
                </div>
              ))}
            </div>
            <p className="text-[12px] text-[#AAAAAA] mt-6 text-center">출처: ⓒ한국관광공사 | 공공데이터포털 전국대회정보 표준데이터</p>
          </div>
        </section>

        {/* ── 기술 스택 ── */}
        <section className="max-w-[1760px] mx-auto px-6 md:px-20 py-14">
          <div className="mb-10">
            <p className="text-[13px] font-bold text-[#0B5C43] uppercase tracking-widest mb-2">TECH STACK</p>
            <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-tight">기술 스택</h2>
            <div className="w-12 h-1 bg-[#D6F14E] mt-3 rounded-full"/>
          </div>
          <div className="flex flex-wrap gap-3">
            {TECH_STACK.map(t=>(
              <div key={t.name} className="flex items-center gap-3 px-5 py-3.5 bg-white border border-[#EBEBEB] rounded-2xl hover:border-[#0B5C43] transition-colors">
                <SportripIcon name={t.icon} size={22} className="text-[#0B5C43]"/>
                <div>
                  <div className="text-[14px] font-bold text-[#222]">{t.name}</div>
                  <div className="text-[12px] text-[#717171]">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 로드맵 ── */}
        <section style={{background:'#F0EDE8'}}>
          <div className="max-w-[1760px] mx-auto px-6 md:px-20 py-14">
            <div className="mb-10">
              <p className="text-[13px] font-bold text-[#0B5C43] uppercase tracking-widest mb-2">ROADMAP</p>
              <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-tight">서비스 로드맵</h2>
              <div className="w-12 h-1 bg-[#D6F14E] mt-3 rounded-full"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {ROADMAP.map(r=>(
                <div key={r.phase} className={`p-5 rounded-2xl border-2 ${
                  r.status==='done'    ? 'bg-[#E7F1EC] border-[#0B5C43]' :
                  r.status==='current' ? 'bg-white border-[#D6F14E] shadow-md' :
                                         'bg-white border-[#DDDAD5]'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#717171]">{r.phase}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      r.status==='done'    ? 'bg-[#0B5C43] text-white' :
                      r.status==='current' ? 'bg-[#D6F14E] text-[#2A3308]' :
                                             'bg-[#EBEBEB] text-[#717171]'}`}>
                      {r.status==='done' ? '완료' : r.status==='current' ? '진행 중' : '예정'}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-[#222] mb-3">{r.title}</h3>
                  <ul className="space-y-1.5">
                    {r.items.map(item=>(
                      <li key={item} className="flex items-center gap-2 text-[13px] text-[#555]">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          r.status==='done' ? 'bg-[#0B5C43]' :
                          r.status==='current' ? 'bg-[#8AB020]' : 'bg-[#CCCCCC]'}`}/>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 비즈니스 모델 ── */}
        <section className="max-w-[1760px] mx-auto px-6 md:px-20 py-14">
          <div className="mb-10">
            <p className="text-[13px] font-bold text-[#0B5C43] uppercase tracking-widest mb-2">BUSINESS MODEL</p>
            <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-tight">비즈니스 모델</h2>
            <div className="w-12 h-1 bg-[#D6F14E] mt-3 rounded-full"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {BUSINESS.map(b=>(
              <div key={b.title} className="p-6 bg-white border border-[#EBEBEB] rounded-2xl">
                <div className="flex items-start justify-between mb-4">
                  <IconTile name={b.icon} tone={b.tone} size={24}/>
                  <span className="text-[11px] font-bold bg-[#F7F5F0] text-[#717171] px-2.5 py-1 rounded-full">{b.badge}</span>
                </div>
                <h3 className="text-[16px] font-bold text-[#222] mb-2">{b.title}</h3>
                <p className="text-[14px] text-[#717171] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{background:'#0B5C43'}}>
          <div className="max-w-[1760px] mx-auto px-6 md:px-20 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-[26px] md:text-[32px] font-extrabold text-white tracking-tight">지금 바로 시작하세요</h2>
              <p className="text-white/70 mt-1">{EVENTS.length}개 이상의 스포츠 대회와 주변 여행 정보를 스포트립에서 확인하세요.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/events" className="px-7 py-3.5 bg-[#D6F14E] text-[#1A2E0A] font-extrabold rounded-xl hover:opacity-90 transition-opacity text-[15px]">
                대회 찾기
              </Link>
              <Link href="/calendar" className="px-7 py-3.5 border-2 border-white/40 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-[15px]">
                캘린더 보기
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
