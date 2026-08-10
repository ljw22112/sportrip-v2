'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Menu, Heart, User } from 'lucide-react';
import { SPORTS_15 } from '@/lib/sports';

const MONTHS = [8,9,10,11,12,3,4];

export function Header({ showSearch=false }: { showSearch?: boolean }) {
  const router = useRouter();
  const [activeSport, setActiveSport] = useState('전체');
  const [region, setRegion] = useState('');
  const [month, setMonth] = useState('');
  const [sportSel, setSportSel] = useState('전체');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (region) p.set('q', region);
    if (month) p.set('month', month);
    if (sportSel !== '전체') p.set('sport', sportSel);
    router.push(`/events?${p.toString()}`);
    setMobileSearchOpen(false);
  };

  return (
    <>
      {menuOpen && <div className="fixed inset-0 z-40" onClick={()=>setMenuOpen(false)}/>}
      <header className="sticky top-0 z-50 bg-white border-b border-[#EBEBEB]">
        {/* ── 탑바 ── */}
        <div className="max-w-[1760px] mx-auto px-5 md:px-10">
          <div className="flex items-center h-28 gap-3">
            {/* 로고 — 에어비앤비처럼 크게 */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <Image src="/logo.svg" alt="SpoTrip" width={96} height={96} priority
                className="h-24 w-24"/>
              <span className="font-extrabold text-[22px] text-[#1B1F1D] hidden md:block"
                style={{letterSpacing:'-0.05em'}}>
                스포트립
              </span>
            </Link>
            <div className="flex-1"/>
            {/* 우측 버튼들 */}
            <div className="flex items-center gap-1">
              <Link href="/events" className="hidden md:flex items-center gap-1.5 text-[14px] font-semibold text-[#222] hover:bg-[#F7F7F7] px-3 py-2 rounded-full transition-colors">
                <Heart className="w-4 h-4"/> 저장
              </Link>
              <button onClick={()=>setMenuOpen(v=>!v)}
                className="flex items-center gap-2 border border-[#DDDDDD] rounded-full py-2 pl-3 pr-2 hover:shadow-md transition-shadow">
                <Menu className="w-4 h-4 text-[#222]"/>
                <div className="w-7 h-7 rounded-full bg-[#717171] flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white"/>
                </div>
              </button>
              {/* 모바일 검색 */}
              <button onClick={()=>setMobileSearchOpen(v=>!v)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-[#DDDDDD] ml-1">
                <Search className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>

        {showSearch && (
          <>
            {/* ── 15개 종목 탭 — 지도 카테고리와 동일 스타일 ── */}
            <div className="border-t border-[#EBEBEB] bg-white">
              <nav className="max-w-[1760px] mx-auto px-5 md:px-10 flex overflow-x-auto py-3 gap-2"
                style={{scrollbarWidth:'none'}}>
                {SPORTS_15.map(sp=>{
                  const active = activeSport === sp.key;
                  return (
                    <Link key={sp.key}
                      href={sp.key==='전체'?'/events':`/events?sport=${encodeURIComponent(sp.key)}`}
                      onClick={()=>setActiveSport(sp.key)}
                      className={`flex flex-col items-center justify-center gap-1 px-3 py-3 flex-shrink-0 rounded-2xl border-2 transition-all min-w-[72px]
                        ${active
                          ? 'border-[#0B5C43] bg-[#0B5C43] shadow-md'
                          : 'border-[#EBEBEB] bg-white hover:border-[#0B5C43] hover:bg-[#E7F1EC]'
                        }`}>
                      <img src={sp.icon} alt={sp.label}
                        className={`w-9 h-9 object-contain ${active?'brightness-0 invert':''}`}/>
                      <span className={`text-[11px] leading-tight text-center whitespace-nowrap ${active?'font-bold text-white':'font-semibold text-[#333]'}`}>
                        {sp.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* ── 검색바 — 종목탭 아래, 크게 ── */}
            <div className="border-t border-[#EBEBEB] hidden md:block">
              <div className="max-w-[1760px] mx-auto px-10 py-4">
                <form onSubmit={handleSubmit}
                  className="flex items-stretch bg-white border-2 border-[#DDDDDD] rounded-2xl hover:border-[#222] transition-colors focus-within:border-[#222]"
                  style={{height:64}}>
                  <div className="flex-1 flex flex-col justify-center px-8 min-w-0">
                    <label className="text-[11px] font-bold tracking-wider text-[#222] mb-0.5">대회 검색</label>
                    <input value={region} onChange={e=>setRegion(e.target.value)}
                      placeholder="지역명 또는 대회명으로 검색"
                      className="text-[15px] text-[#717171] bg-transparent outline-none placeholder:text-[#AAAAAA]"/>
                  </div>
                  <div className="w-px bg-[#EBEBEB] my-3"/>
                  <div className="flex flex-col justify-center px-8 min-w-[160px]">
                    <label className="text-[11px] font-bold tracking-wider text-[#222] mb-0.5">날짜</label>
                    <select value={month} onChange={e=>setMonth(e.target.value)}
                      className="text-[15px] text-[#717171] bg-transparent outline-none cursor-pointer">
                      <option value="">전체 기간</option>
                      {MONTHS.map(m=><option key={m} value={m}>{m}월</option>)}
                    </select>
                  </div>
                  <div className="w-px bg-[#EBEBEB] my-3"/>
                  <div className="flex flex-col justify-center px-8 min-w-[160px]">
                    <label className="text-[11px] font-bold tracking-wider text-[#222] mb-0.5">종목</label>
                    <select value={sportSel} onChange={e=>setSportSel(e.target.value)}
                      className="text-[15px] text-[#717171] bg-transparent outline-none cursor-pointer">
                      {SPORTS_15.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center px-4">
                    <button type="submit"
                      className="flex items-center gap-2 bg-[#0B5C43] hover:bg-[#083D2D] text-white font-bold text-[15px] px-6 h-12 rounded-xl transition-colors">
                      <Search className="w-5 h-5"/> 검색
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* 모바일 검색 드롭다운 */}
            {mobileSearchOpen && (
              <div className="md:hidden border-t border-[#EBEBEB] px-4 py-4">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input value={region} onChange={e=>setRegion(e.target.value)} autoFocus
                    placeholder="지역명 또는 대회명"
                    className="w-full px-4 py-3.5 border-2 border-[#DDD] rounded-xl text-[15px] outline-none focus:border-[#0B5C43]"/>
                  <div className="grid grid-cols-2 gap-3">
                    <select value={month} onChange={e=>setMonth(e.target.value)}
                      className="px-3 py-3.5 border-2 border-[#DDD] rounded-xl text-[14px] bg-white">
                      <option value="">전체 기간</option>
                      {MONTHS.map(m=><option key={m} value={m}>{m}월</option>)}
                    </select>
                    <select value={sportSel} onChange={e=>setSportSel(e.target.value)}
                      className="px-3 py-3.5 border-2 border-[#DDD] rounded-xl text-[14px] bg-white">
                      {SPORTS_15.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                  </div>
                  <button type="submit"
                    className="w-full py-4 bg-[#0B5C43] text-white font-bold rounded-xl text-[15px]">
                    검색하기
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        {/* 드롭다운 메뉴 */}
        {menuOpen && (
          <div className="absolute right-5 md:right-10 top-16 bg-white border border-[#EBEBEB] rounded-2xl shadow-2xl w-52 py-2 z-50">
            <Link href="/calendar" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7F7] text-[14px] font-medium text-[#222]" onClick={()=>setMenuOpen(false)}>
              📅 월간 캘린더
            </Link>
            <Link href="/events" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7F7] text-[14px] font-medium text-[#222]" onClick={()=>setMenuOpen(false)}>
              ❤️ 저장한 대회
            </Link>
            <div className="border-t border-[#EBEBEB] my-1"/>
            <Link href="/about" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7F7] text-[14px] font-medium text-[#222]" onClick={()=>setMenuOpen(false)}>
              ℹ️ 스포트립 소개
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
