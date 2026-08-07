'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Menu, X, Heart, Calendar, User } from 'lucide-react';

const SPORTS = ['전체','마라톤','러닝','자전거','축구','배드민턴','수영','테니스','트레일'];
const SPORT_ICONS: Record<string,string> = {
  전체:'⊕',마라톤:'🏃',러닝:'💨',자전거:'🚴',축구:'⚽',배드민턴:'🏸',수영:'🏊',테니스:'🎾',트레일:'🏔️'
};
const MONTHS = [8,9,10,11,12,3,4];

export function Header({ showSearch=false }: { showSearch?: boolean }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false); // 검색바 확장 여부
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
      {/* 딤 배경 — 검색 확장 시 */}
      {expanded && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={()=>setExpanded(false)}/>
      )}

      <header className={`sticky top-0 z-50 bg-white transition-shadow ${expanded ? 'shadow-none' : 'border-b border-[#EBEBEB]'}`}>

        {/* ── 에어비앤비 탑바 ── */}
        <div className="max-w-[1760px] mx-auto px-6 md:px-20">
          <div className="flex items-center h-20 gap-4">

            {/* 로고 */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image src="/logo.svg" alt="SpoTrip" width={130} height={35} priority
                className="h-[34px] w-auto"/>
            </Link>

            {/* ── 중앙: compact pill (에어비앤비 방식) ── */}
            {!expanded && showSearch && (
              <div className="hidden md:flex flex-1 justify-center px-4">
                <button
                  onClick={()=>setExpanded(true)}
                  className="flex items-center border border-[#DDDDDD] rounded-full shadow-md hover:shadow-lg transition-shadow py-2 pl-6 pr-2 gap-3 bg-white">
                  <span className="text-[13.5px] font-semibold text-[#222222] border-r border-[#DDDDDD] pr-3">대회 검색</span>
                  <span className="text-[13.5px] text-[#717171] border-r border-[#DDDDDD] pr-3">지역 선택</span>
                  <span className="text-[13.5px] text-[#717171] pr-1">종목 선택</span>
                  <div className="w-8 h-8 rounded-full bg-[#0B5C43] flex items-center justify-center flex-shrink-0">
                    <Search className="w-3.5 h-3.5 text-white"/>
                  </div>
                </button>
              </div>
            )}

            {/* 검색 확장 시 중앙 숨김 */}
            {(expanded || !showSearch) && <div className="flex-1"/>}

            {/* ── 우측 메뉴 ── */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Link href="/calendar"
                className="hidden md:flex items-center gap-1.5 text-[13.5px] font-semibold text-[#222222] hover:bg-[#F7F7F7] px-4 py-2.5 rounded-full transition-colors whitespace-nowrap">
                <Calendar className="w-4 h-4"/>
                캘린더
              </Link>
              <Link href="/events"
                className="hidden md:flex items-center gap-1.5 text-[13.5px] font-semibold text-[#222222] hover:bg-[#F7F7F7] px-4 py-2.5 rounded-full transition-colors whitespace-nowrap">
                <Heart className="w-4 h-4"/>
                저장한 대회
              </Link>
              {/* 햄버거 + 유저 버튼 (에어비앤비 동일) */}
              <button onClick={()=>setMenuOpen(v=>!v)}
                className="flex items-center gap-2 border border-[#DDDDDD] rounded-full py-2 pl-3 pr-2 hover:shadow-md transition-shadow ml-1">
                <Menu className="w-4 h-4 text-[#222222]"/>
                <div className="w-7 h-7 rounded-full bg-[#717171] flex items-center justify-center">
                  <User className="w-4 h-4 text-white"/>
                </div>
              </button>
            </div>
          </div>

          {/* ── 확장된 검색바 (에어비앤비 체크인 방식) ── */}
          {expanded && showSearch && (
            <div className="hidden md:block pb-5 relative z-50">
              <form onSubmit={handleSubmit}
                className="flex items-stretch bg-white border border-[#DDDDDD] rounded-full shadow-xl max-w-[860px] mx-auto">
                <div className="flex-1 flex flex-col px-8 py-3.5 rounded-l-full hover:bg-[#F7F7F7] transition-colors cursor-pointer min-w-0">
                  <label className="text-[11px] font-bold tracking-wide text-[#222222]">지역</label>
                  <input value={region} onChange={e=>setRegion(e.target.value)}
                    placeholder="지역명 또는 문장으로 검색" autoFocus
                    className="text-sm text-[#717171] bg-transparent outline-none placeholder:text-[#AAAAAA] mt-0.5"/>
                </div>
                <div className="w-px bg-[#EBEBEB] my-3"/>
                <div className="flex flex-col px-6 py-3.5 hover:bg-[#F7F7F7] transition-colors cursor-pointer min-w-[140px]">
                  <label className="text-[11px] font-bold tracking-wide text-[#222222]">날짜</label>
                  <select value={month} onChange={e=>setMonth(e.target.value)}
                    className="text-sm text-[#717171] bg-transparent outline-none cursor-pointer mt-0.5">
                    <option value="">전체 기간</option>
                    {MONTHS.map(m=><option key={m} value={m}>{m}월</option>)}
                  </select>
                </div>
                <div className="w-px bg-[#EBEBEB] my-3"/>
                <div className="flex flex-col px-6 py-3.5 hover:bg-[#F7F7F7] transition-colors cursor-pointer min-w-[130px]">
                  <label className="text-[11px] font-bold tracking-wide text-[#222222]">종목</label>
                  <select value={sportSel} onChange={e=>setSportSel(e.target.value)}
                    className="text-sm text-[#717171] bg-transparent outline-none cursor-pointer mt-0.5">
                    {SPORTS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-center px-3">
                  <button type="submit"
                    className="flex items-center gap-2 bg-[#0B5C43] hover:bg-[#083D2D] text-white font-semibold text-sm px-5 py-3.5 rounded-full transition-colors">
                    <Search className="w-4 h-4"/>
                    검색
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ── 종목 탭 — 에어비앤비 카테고리 바 ── */}
        {showSearch && !expanded && (
          <div className="border-t border-[#EBEBEB]">
            {/* 데스크톱 */}
            <nav className="hidden md:flex max-w-[1760px] mx-auto px-20 overflow-x-auto"
              style={{scrollbarWidth:'none'}}>
              {SPORTS.map(s=>(
                <Link key={s} href={s==='전체'?'/events':`/events?sport=${encodeURIComponent(s)}`}
                  onClick={()=>setActiveSport(s)}
                  className={`flex flex-col items-center gap-1.5 px-5 py-3 flex-shrink-0 border-b-2 transition-all text-xs font-semibold whitespace-nowrap -mb-px
                    ${activeSport===s?'border-[#222222] text-[#222222] opacity-100':'border-transparent text-[#717171] opacity-60 hover:opacity-100 hover:border-[#DDDDDD]'}`}>
                  <span className="text-2xl">{SPORT_ICONS[s]}</span>
                  <span>{s}</span>
                </Link>
              ))}
            </nav>
            {/* 모바일 종목탭 */}
            <nav className="md:hidden flex overflow-x-auto px-4" style={{scrollbarWidth:'none'}}>
              {SPORTS.map(s=>(
                <Link key={s} href={s==='전체'?'/events':`/events?sport=${encodeURIComponent(s)}`}
                  onClick={()=>setActiveSport(s)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 flex-shrink-0 border-b-2 transition-all text-[11px] font-semibold -mb-px
                    ${activeSport===s?'border-[#222222] text-[#222222]':'border-transparent text-[#717171]'}`}>
                  <span className="text-lg">{SPORT_ICONS[s]}</span>
                  <span>{s}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* 모바일 검색 버튼 pill */}
        {showSearch && (
          <div className="md:hidden px-4 pb-3 border-t border-[#EBEBEB]">
            <button onClick={()=>setExpanded(v=>!v)}
              className="w-full flex items-center gap-3 border border-[#DDDDDD] rounded-full py-3 px-5 shadow-sm hover:shadow-md transition-shadow bg-white">
              <Search className="w-4 h-4 text-[#0B5C43] flex-shrink-0"/>
              <span className="text-[13.5px] text-[#717171] flex-1 text-left">대회명, 지역, 종목 검색</span>
            </button>
            {expanded && (
              <div className="mt-2 bg-white border border-[#DDDDDD] rounded-2xl shadow-lg p-4 z-50 relative">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input value={region} onChange={e=>setRegion(e.target.value)} autoFocus
                    placeholder="지역명 또는 대회명 검색"
                    className="w-full px-4 py-3 border border-[#DDDDDD] rounded-xl text-sm outline-none focus:border-[#0B5C43]"/>
                  <div className="grid grid-cols-2 gap-3">
                    <select value={month} onChange={e=>setMonth(e.target.value)}
                      className="px-3 py-3 border border-[#DDDDDD] rounded-xl text-sm bg-white">
                      <option value="">전체 기간</option>
                      {MONTHS.map(m=><option key={m} value={m}>{m}월</option>)}
                    </select>
                    <select value={sportSel} onChange={e=>setSportSel(e.target.value)}
                      className="px-3 py-3 border border-[#DDDDDD] rounded-xl text-sm bg-white">
                      {SPORTS.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <button type="submit"
                    className="w-full py-3 bg-[#0B5C43] text-white font-bold rounded-xl text-sm">
                    검색
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 드롭다운 메뉴 */}
        {menuOpen && (
          <div className="absolute right-6 md:right-20 top-20 bg-white border border-[#EBEBEB] rounded-2xl shadow-2xl w-52 py-2 z-50">
            <Link href="/calendar" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7F7] text-[13.5px] font-medium text-[#222222]" onClick={()=>setMenuOpen(false)}>
              <Calendar className="w-4 h-4"/> 월간 캘린더
            </Link>
            <Link href="/events" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7F7] text-[13.5px] font-medium text-[#222222]" onClick={()=>setMenuOpen(false)}>
              <Heart className="w-4 h-4"/> 저장한 대회
            </Link>
            <div className="border-t border-[#EBEBEB] my-1"/>
            <Link href="/events" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7F7] text-[13.5px] font-medium text-[#222222]" onClick={()=>setMenuOpen(false)}>
              <Search className="w-4 h-4"/> 대회 찾기
            </Link>
          </div>
        )}

        {menuOpen && <div className="fixed inset-0 z-40" onClick={()=>setMenuOpen(false)}/>}
      </header>
    </>
  );
}
