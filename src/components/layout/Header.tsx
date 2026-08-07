'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Menu, Heart, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';

const SPORTS = ['전체','마라톤','러닝','자전거','축구','배드민턴','수영','테니스','트레일'];
const SPORT_ICONS: Record<string,string> = {
  전체:'🌐', 마라톤:'🏃', 러닝:'💨', 자전거:'🚴', 축구:'⚽',
  배드민턴:'🏸', 수영:'🏊', 테니스:'🎾', 트레일:'🏔️'
};
const MONTHS = [8,9,10,11,12,3,4];

export function Header({ showSearch=false }: { showSearch?: boolean }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [activeSport, setActiveSport] = useState('전체');
  const [region, setRegion] = useState('');
  const [month, setMonth] = useState('');
  const [sportSel, setSportSel] = useState('전체');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (region) p.set('q', region);
    if (month) p.set('month', month);
    if (sportSel !== '전체') p.set('sport', sportSel);
    router.push(`/events?${p.toString()}`);
    setExpanded(false);
  };

  return (
    <>
      {expanded && <div className="fixed inset-0 bg-black/20 z-40" onClick={()=>setExpanded(false)}/>}
      {menuOpen && <div className="fixed inset-0 z-40" onClick={()=>setMenuOpen(false)}/>}

      <header className="sticky top-0 z-50 bg-white border-b border-[#EBEBEB]">

        {/* ── 탑바 ── */}
        <div className="max-w-[1760px] mx-auto px-4 md:px-10">
          <div className="flex items-center h-16 md:h-20 gap-4">

            {/* 로고 */}
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.svg" alt="SpoTrip" width={120} height={32} priority
                className="h-7 md:h-8 w-auto"/>
              <span className="hidden">스포트립</span>
            </Link>

            {/* 중앙: 데스크톱 compact pill */}
            {!expanded && showSearch && (
              <div className="hidden md:flex flex-1 justify-center">
                <button onClick={()=>setExpanded(true)}
                  className="flex items-center border border-[#DDDDDD] rounded-full shadow-md hover:shadow-lg transition-shadow py-2 pl-5 pr-2 gap-0 bg-white max-w-[440px] w-full">
                  <span className="text-[13px] font-semibold text-[#222] px-3 border-r border-[#DDDDDD]">대회 검색</span>
                  <span className="text-[13px] text-[#717171] px-3 border-r border-[#DDDDDD]">지역 선택</span>
                  <span className="text-[13px] text-[#717171] px-3 flex-1 text-left">종목 선택</span>
                  <div className="w-8 h-8 rounded-full bg-[#0B5C43] flex items-center justify-center flex-shrink-0">
                    <Search className="w-3.5 h-3.5 text-white"/>
                  </div>
                </button>
              </div>
            )}
            {(expanded || !showSearch) && <div className="flex-1"/>}

            {/* 우측 */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Link href="/calendar" className="hidden md:flex items-center gap-1.5 text-[13px] font-semibold text-[#222] hover:bg-[#F7F7F7] px-3 py-2 rounded-full transition-colors">
                <Calendar className="w-4 h-4"/> 캘린더
              </Link>
              <Link href="/events" className="hidden md:flex items-center gap-1.5 text-[13px] font-semibold text-[#222] hover:bg-[#F7F7F7] px-3 py-2 rounded-full transition-colors">
                <Heart className="w-4 h-4"/> 저장
              </Link>
              <button onClick={()=>setMenuOpen(v=>!v)}
                className="flex items-center gap-2 border border-[#DDDDDD] rounded-full py-1.5 pl-3 pr-1.5 hover:shadow-md transition-shadow">
                <Menu className="w-4 h-4 text-[#222]"/>
                <div className="w-7 h-7 rounded-full bg-[#717171] flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white"/>
                </div>
              </button>
            </div>
          </div>

          {/* 확장 검색바 (데스크톱) */}
          {expanded && showSearch && (
            <div className="hidden md:block pb-5 relative z-50">
              <form onSubmit={handleSubmit}
                className="flex items-stretch bg-white border border-[#DDDDDD] rounded-full shadow-xl max-w-[760px] mx-auto">
                <div className="flex-1 flex flex-col px-6 py-3 rounded-l-full hover:bg-[#F7F7F7] transition-colors min-w-0">
                  <label className="text-[11px] font-bold tracking-wide text-[#222]">지역</label>
                  <input value={region} onChange={e=>setRegion(e.target.value)}
                    placeholder="어느 지역?" autoFocus
                    className="text-sm text-[#717171] bg-transparent outline-none placeholder:text-[#AAAAAA] mt-0.5"/>
                </div>
                <div className="w-px bg-[#EBEBEB] my-3"/>
                <div className="flex flex-col px-5 py-3 hover:bg-[#F7F7F7] transition-colors min-w-[130px]">
                  <label className="text-[11px] font-bold tracking-wide text-[#222]">날짜</label>
                  <select value={month} onChange={e=>setMonth(e.target.value)}
                    className="text-sm text-[#717171] bg-transparent outline-none cursor-pointer mt-0.5">
                    <option value="">전체 기간</option>
                    {MONTHS.map(m=><option key={m} value={m}>{m}월</option>)}
                  </select>
                </div>
                <div className="w-px bg-[#EBEBEB] my-3"/>
                <div className="flex flex-col px-5 py-3 hover:bg-[#F7F7F7] transition-colors min-w-[120px]">
                  <label className="text-[11px] font-bold tracking-wide text-[#222]">종목</label>
                  <select value={sportSel} onChange={e=>setSportSel(e.target.value)}
                    className="text-sm text-[#717171] bg-transparent outline-none cursor-pointer mt-0.5">
                    {SPORTS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-center px-3">
                  <button type="submit"
                    className="flex items-center gap-2 bg-[#0B5C43] hover:bg-[#083D2D] text-white font-semibold text-sm px-5 py-3 rounded-full transition-colors">
                    <Search className="w-4 h-4"/> 검색
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ── 카테고리 바 (에어비앤비 스타일: 아이콘+텍스트 가로) ── */}
        {showSearch && !expanded && (
          <div className="border-t border-[#EBEBEB]">
            {/* 데스크톱 */}
            <nav className="hidden md:flex max-w-[1760px] mx-auto px-10 overflow-x-auto"
              style={{scrollbarWidth:'none'}}>
              {SPORTS.map(s=>{
                const active = activeSport===s;
                return (
                  <Link key={s}
                    href={s==='전체'?'/events':`/events?sport=${encodeURIComponent(s)}`}
                    onClick={()=>setActiveSport(s)}
                    className={`flex items-center gap-2 px-4 py-3.5 flex-shrink-0 border-b-2 transition-all whitespace-nowrap
                      ${active
                        ? 'border-[#222222] text-[#222222]'
                        : 'border-transparent text-[#717171] hover:text-[#222222] hover:border-[#DDDDDD]'
                      }`}>
                    {/* 아이콘 왼쪽, 텍스트 오른쪽 — 에어비앤비 동일 */}
                    <span className="text-[22px] leading-none">{SPORT_ICONS[s]}</span>
                    <span className={`text-[13px] ${active?'font-bold':'font-medium'}`}>{s}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 모바일: 아이콘+텍스트 가로, 스크롤 */}
            <nav className="md:hidden flex overflow-x-auto px-4 gap-1"
              style={{scrollbarWidth:'none'}}>
              {SPORTS.map(s=>{
                const active = activeSport===s;
                return (
                  <Link key={s}
                    href={s==='전체'?'/events':`/events?sport=${encodeURIComponent(s)}`}
                    onClick={()=>setActiveSport(s)}
                    className={`flex items-center gap-1.5 px-3 py-3 flex-shrink-0 border-b-2 transition-all whitespace-nowrap -mb-px
                      ${active
                        ? 'border-[#222222] text-[#222222]'
                        : 'border-transparent text-[#717171]'
                      }`}>
                    <span className="text-base leading-none">{SPORT_ICONS[s]}</span>
                    <span className={`text-[12px] ${active?'font-bold':'font-medium'}`}>{s}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* 모바일 검색 pill + 드롭다운 */}
        {showSearch && (
          <div className="md:hidden px-4 pb-3 border-t border-[#EBEBEB]">
            <button onClick={()=>setExpanded(v=>!v)}
              className="w-full flex items-center gap-3 border border-[#DDDDDD] rounded-full py-3 px-4 shadow-sm bg-white">
              <Search className="w-4 h-4 text-[#0B5C43] flex-shrink-0"/>
              <span className="text-[13px] text-[#717171] flex-1 text-left">대회명, 지역, 종목 검색</span>
            </button>
            {expanded && (
              <div className="mt-2 bg-white border border-[#DDDDDD] rounded-2xl shadow-xl p-4 relative z-50">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <div className="text-[11px] font-bold text-[#222] mb-1.5">지역</div>
                    <input value={region} onChange={e=>setRegion(e.target.value)} autoFocus
                      placeholder="지역명 또는 대회명"
                      className="w-full px-4 py-3 border border-[#DDDDDD] rounded-xl text-sm outline-none focus:border-[#0B5C43]"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[11px] font-bold text-[#222] mb-1.5">날짜</div>
                      <select value={month} onChange={e=>setMonth(e.target.value)}
                        className="w-full px-3 py-3 border border-[#DDDDDD] rounded-xl text-sm bg-white">
                        <option value="">전체 기간</option>
                        {MONTHS.map(m=><option key={m} value={m}>{m}월</option>)}
                      </select>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#222] mb-1.5">종목</div>
                      <select value={sportSel} onChange={e=>setSportSel(e.target.value)}
                        className="w-full px-3 py-3 border border-[#DDDDDD] rounded-xl text-sm bg-white">
                        {SPORTS.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full py-3.5 bg-[#0B5C43] text-white font-bold rounded-xl text-sm">
                    검색하기
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 드롭다운 메뉴 */}
        {menuOpen && (
          <div className="absolute right-4 md:right-10 top-16 md:top-20 bg-white border border-[#EBEBEB] rounded-2xl shadow-2xl w-52 py-2 z-50">
            <Link href="/calendar" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7F7] text-[13.5px] font-medium text-[#222]" onClick={()=>setMenuOpen(false)}>
              <Calendar className="w-4 h-4"/> 월간 캘린더
            </Link>
            <Link href="/events" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7F7] text-[13.5px] font-medium text-[#222]" onClick={()=>setMenuOpen(false)}>
              <Heart className="w-4 h-4"/> 저장한 대회
            </Link>
            <div className="border-t border-[#EBEBEB] my-1"/>
            <Link href="/events" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7F7] text-[13.5px] font-medium text-[#222]" onClick={()=>setMenuOpen(false)}>
              <Search className="w-4 h-4"/> 전체 대회 찾기
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
