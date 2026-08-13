'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Heart, X } from 'lucide-react';
import { SPORTS_15 } from '@/lib/sports';
import { DateRangePicker } from './DateRangePicker';

export function Header({ showSearch=false, heroSlot }: { showSearch?: boolean; heroSlot?: React.ReactNode }) {
  const router = useRouter();
  const [activeSport, setActiveSport] = useState('전체');
  const [region, setRegion] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sportSel, setSportSel] = useState('전체');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (region) p.set('q', region);
    if (dateFrom) p.set('from', dateFrom);
    if (dateTo) p.set('to', dateTo);
    if (sportSel !== '전체') p.set('sport', sportSel);
    router.push(`/events?${p.toString()}`);
    setMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* ── 탑바 ── */}
      <div className="max-w-[1760px] mx-auto px-5 md:px-10">
        <div className="flex items-center h-20 gap-6">
          {/* 로고 */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <Image src="/logo.svg" alt="SporTrip" width={96} height={96} priority
              className="h-24 w-24"/>
            <span className="font-extrabold text-[22px] text-[#1B1F1D] hidden md:block"
              style={{letterSpacing:'-0.05em'}}>
              스포트립
            </span>
          </Link>

          {/* 중앙 네비 — 햄버거 없이 전부 노출 */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <Link href="/about"
              className="text-[16px] font-bold text-[#333] hover:text-[#0B5C43] transition-colors">
              스포트립 소개
            </Link>
            <Link href="/events"
              className="text-[16px] font-bold text-[#333] hover:text-[#0B5C43] transition-colors">
              대회 찾기
            </Link>
            <Link href="/calendar"
              className="text-[16px] font-bold text-[#333] hover:text-[#0B5C43] transition-colors">
              캘린더
            </Link>
            <Link href="/saved"
              className="text-[16px] font-bold text-[#333] hover:text-[#0B5C43] transition-colors">
              저장한 대회
            </Link>
          </nav>

          {/* 우측 */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            <Link href="/saved" className="hidden md:flex items-center gap-1.5 text-[14px] font-semibold text-[#0B5C43] hover:bg-[#E7F1EC] px-3 py-2 rounded-full transition-colors">
              <Heart className="w-4 h-4"/> 저장
            </Link>
            <button onClick={() => setMobileSearchOpen(v=>!v)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-[#DDDDDD]">
              {mobileSearchOpen ? <X className="w-4 h-4"/> : <Search className="w-4 h-4"/>}
            </button>
          </div>
        </div>
      </div>

      {heroSlot}

      {showSearch && (
        <>
          {/* ── 15개 종목 탭 ── */}
          <div className="bg-white">
            <nav className="max-w-[1760px] mx-auto px-5 md:px-10 flex overflow-x-auto py-3 gap-2"
              style={{scrollbarWidth:'none'}}>
              {SPORTS_15.map(sp=>{
                const active = activeSport === sp.key;
                return (
                  <Link key={sp.key}
                    href={sp.key==='전체'?'/events':`/events?sport=${encodeURIComponent(sp.key)}`}
                    onClick={()=>setActiveSport(sp.key)}
                    className={[
                      'flex flex-col items-center justify-center gap-1 px-3 py-2.5 flex-shrink-0 rounded-2xl border-2 transition-all min-w-[64px]',
                      active ? 'border-[#0B5C43] bg-[#0B5C43] shadow-md' : 'border-[#EBEBEB] bg-white hover:border-[#0B5C43] hover:bg-[#E7F1EC]'
                    ].join(' ')}>
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

          {/* ── 검색바 ── */}
          <div className="hidden md:block bg-white">
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
                <div className="flex-1 flex flex-col justify-center px-8 min-w-0">
                  <label className="text-[11px] font-bold tracking-wider text-[#222] mb-0.5">날짜</label>
                  <DateRangePicker from={dateFrom} to={dateTo} onChange={(f,t)=>{setDateFrom(f);setDateTo(t);}}/>
                </div>
                <div className="w-px bg-[#EBEBEB] my-3"/>
                <div className="flex-1 flex flex-col justify-center px-8 min-w-0">
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

          {/* 모바일 검색 */}
          {mobileSearchOpen && (
            <div className="md:hidden bg-white px-4 py-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <input value={region} onChange={e=>setRegion(e.target.value)} autoFocus
                  placeholder="지역명 또는 대회명"
                  className="w-full px-4 py-3.5 border-2 border-[#DDD] rounded-xl text-[15px] outline-none focus:border-[#0B5C43]"/>
                <div className="grid grid-cols-2 gap-3">
                  <div className="px-3 py-3.5 border-2 border-[#DDD] rounded-xl text-[14px] bg-white">
                    <DateRangePicker from={dateFrom} to={dateTo} onChange={(f,t)=>{setDateFrom(f);setDateTo(t);}}/>
                  </div>
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
    </header>
  );
}