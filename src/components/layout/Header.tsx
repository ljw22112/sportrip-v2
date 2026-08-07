'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Heart, X, ChevronDown, Calendar } from 'lucide-react';

const SPORTS = ['전체','마라톤','러닝','자전거','축구','배드민턴','수영','테니스','트레일'];
const SPORT_ICONS: Record<string,string> = {
  전체:'⊕',마라톤:'🏃',러닝:'💨',자전거:'🚴',축구:'⚽',배드민턴:'🏸',수영:'🏊',테니스:'🎾',트레일:'🏔️'
};
const MONTHS = [8,9,10,11,12,3,4];

export function Header({ showSearch=false }: { showSearch?: boolean }) {
  const router = useRouter();
  const [activeSport, setActiveSport] = useState('전체');
  const [region, setRegion] = useState('');
  const [month, setMonth] = useState('');
  const [sportSel, setSportSel] = useState('전체');
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[--line]">
      {/* 데스크톱 탑바 */}
      <div className="max-w-[1760px] mx-auto px-5 md:px-20 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight flex-shrink-0">
          <Image src="/logo.svg" alt="SpoTrip" width={110} height={30} priority />
          <span className="text-[11px] font-semibold text-[--green] bg-[--green-tint] px-2 py-0.5 rounded-full">BETA</span>
        </Link>

        {/* 모바일: 검색 + 저장 아이콘만 */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => setMobileSearchOpen(v=>!v)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-[--line]">
            <Search className="w-4 h-4 text-[--ink]"/>
          </button>
          <Link href="/events" className="w-9 h-9 flex items-center justify-center rounded-full border border-[--line]">
            <Heart className="w-4 h-4 text-[--ink]"/>
          </Link>
        </div>

        {/* 데스크톱: 저장한 대회 */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/calendar" className="flex items-center gap-1.5 text-sm font-medium text-[--ink] hover:bg-[--gray] px-3 py-2 rounded-full transition-colors">
            <Calendar className="w-4 h-4"/> 캘린더
          </Link>
          <Link href="/events" className="flex items-center gap-1.5 text-sm font-medium text-[--ink] hover:bg-[--gray] px-3 py-2 rounded-full transition-colors">
            <Heart className="w-4 h-4"/> 저장한 대회
          </Link>
        </div>
      </div>

      {/* 모바일 검색 드롭다운 */}
      {mobileSearchOpen && showSearch && (
        <div className="md:hidden border-t border-[--line] bg-white px-4 py-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input value={region} onChange={e=>setRegion(e.target.value)}
              placeholder="지역명 또는 대회명 검색"
              className="w-full px-4 py-3 border border-[--line] rounded-xl text-sm outline-none focus:border-[--green]"/>
            <div className="grid grid-cols-2 gap-3">
              <select value={month} onChange={e=>setMonth(e.target.value)}
                className="px-3 py-3 border border-[--line] rounded-xl text-sm bg-white">
                <option value="">전체 기간</option>
                {MONTHS.map(m=><option key={m} value={m}>{m}월</option>)}
              </select>
              <select value={sportSel} onChange={e=>setSportSel(e.target.value)}
                className="px-3 py-3 border border-[--line] rounded-xl text-sm bg-white">
                {SPORTS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit"
              className="w-full py-3 bg-[--green] text-white font-bold rounded-xl text-sm">
              검색
            </button>
          </form>
        </div>
      )}

      {showSearch && (
        <>
          {/* 종목 탭 (데스크톱) */}
          <nav className="hidden md:flex max-w-[1760px] mx-auto px-20 gap-1 overflow-x-auto border-b border-[--line]"
            style={{scrollbarWidth:'none'}}>
            {SPORTS.map(s => (
              <Link key={s} href={s==='전체'?'/events':`/events?sport=${encodeURIComponent(s)}`}
                onClick={()=>setActiveSport(s)}
                className={`flex flex-col items-center gap-1.5 px-5 py-3 flex-shrink-0 border-b-2 transition-all text-xs font-semibold whitespace-nowrap -mb-px
                  ${activeSport===s ? 'border-[--ink] text-[--ink]' : 'border-transparent text-[--muted] hover:text-[--ink]'}`}>
                <span className="text-xl">{SPORT_ICONS[s]}</span>
                <span>{s}</span>
              </Link>
            ))}
          </nav>

          {/* 검색바 (데스크톱) */}
          <div className="hidden md:block max-w-[1760px] mx-auto px-20 py-4">
            <form onSubmit={handleSubmit}
              className="flex items-stretch bg-white border border-[--line] rounded-full shadow-sm hover:shadow-md transition-shadow max-w-[880px] mx-auto focus-within:shadow-md">
              <div className="flex-1 flex flex-col px-6 py-2.5 min-w-0 hover:bg-[--gray] rounded-l-full transition-colors">
                <label className="text-[11px] font-bold tracking-wider text-[--ink]">지역</label>
                <input value={region} onChange={e=>setRegion(e.target.value)}
                  placeholder="지역명 또는 문장으로 검색"
                  className="text-sm text-[--muted] bg-transparent outline-none placeholder:text-[--faint]"/>
              </div>
              <div className="w-px bg-[--line-soft] my-2"/>
              <div className="flex flex-col px-6 py-2.5 min-w-[140px] hover:bg-[--gray] transition-colors">
                <label className="text-[11px] font-bold tracking-wider text-[--ink]">날짜</label>
                <select value={month} onChange={e=>setMonth(e.target.value)}
                  className="text-sm text-[--muted] bg-transparent outline-none cursor-pointer">
                  <option value="">전체 기간</option>
                  {MONTHS.map(m=><option key={m} value={m}>{m}월</option>)}
                </select>
              </div>
              <div className="w-px bg-[--line-soft] my-2"/>
              <div className="flex flex-col px-6 py-2.5 min-w-[120px] hover:bg-[--gray] transition-colors">
                <label className="text-[11px] font-bold tracking-wider text-[--ink]">종목</label>
                <select value={sportSel} onChange={e=>setSportSel(e.target.value)}
                  className="text-sm text-[--muted] bg-transparent outline-none cursor-pointer">
                  {SPORTS.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center px-2">
                <button type="submit"
                  className="w-10 h-10 rounded-full bg-[--green] hover:bg-[--green-deep] flex items-center justify-center transition-colors">
                  <Search className="w-4 h-4 text-white"/>
                </button>
              </div>
            </form>
            <p className="text-center text-xs text-[--faint] mt-2">
              문장으로 적어도 됩니다 — 예: <b className="text-[--green]">"11월 부산 마라톤"</b>을 그대로 입력해 보세요.
            </p>
          </div>

          {/* 종목 탭 (모바일) - 모바일 검색 안 열렸을 때만 */}
          {!mobileSearchOpen && (
            <nav className="md:hidden flex overflow-x-auto border-b border-[--line] px-4"
              style={{scrollbarWidth:'none'}}>
              {SPORTS.map(s => (
                <Link key={s} href={s==='전체'?'/events':`/events?sport=${encodeURIComponent(s)}`}
                  className={`flex flex-col items-center gap-1 px-3 py-2 flex-shrink-0 border-b-2 transition-all text-[11px] font-semibold -mb-px
                    ${activeSport===s ? 'border-[--ink] text-[--ink]' : 'border-transparent text-[--muted]'}`}
                  onClick={()=>setActiveSport(s)}>
                  <span className="text-lg">{SPORT_ICONS[s]}</span>
                  <span>{s}</span>
                </Link>
              ))}
            </nav>
          )}
        </>
      )}
    </header>
  );
}
