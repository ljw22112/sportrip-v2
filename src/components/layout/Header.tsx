'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Heart, X } from 'lucide-react';
import { SPORTS_15 } from '@/lib/sports';

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
    <header className="sticky top-0 z-50" style={{background:'#0F0F0F'}}>
      {/* 탑바 */}
      <div className="max-w-[1760px] mx-auto px-5 md:px-10">
        <div className="flex items-center h-16 gap-6">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
            <Image src="/logo.svg" alt="SporTrip" width={36} height={36} priority className="h-9 w-9 brightness-0 invert"/>
            <span className="font-black text-[20px] tracking-[-0.05em]"
              style={{color:'#D4FF3F'}}>SporTrip</span>
          </Link>

          {/* 중앙 네비 */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {[
              {href:'/events', label:'대회 찾기'},
              {href:'/calendar', label:'캘린더'},
              {href:'/saved', label:'저장한 대회'},
              {href:'/about', label:'스포트립 소개'},
            ].map(n=>(
              <Link key={n.href} href={n.href}
                className="text-[13px] font-semibold px-3 py-2 rounded-lg transition-colors"
                style={{color:'rgba(255,255,255,.55)'}}
                onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
                onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.55)')}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto md:ml-0">
            <Link href="/saved" className="hidden md:flex items-center gap-1.5 text-[13px] font-semibold px-3 py-2 rounded-lg transition-colors"
              style={{color:'rgba(255,255,255,.55)'}}>
              <Heart className="w-4 h-4"/> 저장
            </Link>
            <button onClick={() => setMobileSearchOpen(v=>!v)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg"
              style={{background:'rgba(255,255,255,.1)',color:'#fff'}}>
              {mobileSearchOpen ? <X className="w-4 h-4"/> : <Search className="w-4 h-4"/>}
            </button>
          </div>
        </div>
      </div>

      {showSearch && (
        <>
          {/* 종목 탭 */}
          <div style={{background:'#1C1C1C', borderTop:'0.5px solid rgba(255,255,255,.08)'}}>
            <nav className="max-w-[1760px] mx-auto px-5 md:px-10 flex overflow-x-auto py-2.5 gap-1.5"
              style={{scrollbarWidth:'none'}}>
              {SPORTS_15.map(sp=>{
                const active = activeSport === sp.key;
                return (
                  <Link key={sp.key}
                    href={sp.key==='전체'?'/events':`/events?sport=${encodeURIComponent(sp.key)}`}
                    onClick={()=>setActiveSport(sp.key)}
                    className="flex flex-col items-center justify-center gap-1 px-3 py-2 flex-shrink-0 rounded-xl transition-all min-w-[60px]"
                    style={active
                      ? {background:'#D4FF3F'}
                      : {background:'rgba(255,255,255,.06)'}}>
                    <img src={sp.icon} alt={sp.label}
                      className={`w-8 h-8 object-contain ${active?'':'brightness-0 invert opacity-70'}`}/>
                    <span className="text-[10px] font-bold whitespace-nowrap"
                      style={{color: active ? '#1A2E0A' : 'rgba(255,255,255,.6)'}}>
                      {sp.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 검색바 */}
          <div className="hidden md:block" style={{background:'#0F0F0F', borderTop:'0.5px solid rgba(255,255,255,.08)', paddingBottom:'12px'}}>
            <div className="max-w-[1760px] mx-auto px-10 pt-3">
              <form onSubmit={handleSubmit}
                className="flex items-stretch rounded-xl overflow-hidden border"
                style={{height:52, background:'#fff', borderColor:'#E0E0E0'}}>
                <div className="flex-1 flex flex-col justify-center px-6 min-w-0">
                  <label className="text-[10px] font-bold tracking-wider" style={{color:'#A0A0A0'}}>대회 검색</label>
                  <input value={region} onChange={e=>setRegion(e.target.value)}
                    placeholder="지역명 또는 대회명"
                    className="text-[14px] bg-transparent outline-none placeholder:text-[#CCCCCC]"
                    style={{color:'#0F0F0F'}}/>
                </div>
                <div style={{width:'0.5px', background:'#E0E0E0', margin:'10px 0'}}/>
                <div className="flex-1 flex flex-col justify-center px-6 min-w-0">
                  <label className="text-[10px] font-bold tracking-wider" style={{color:'#A0A0A0'}}>날짜</label>
                  <select value={month} onChange={e=>setMonth(e.target.value)}
                    className="text-[14px] bg-transparent outline-none cursor-pointer"
                    style={{color:'#0F0F0F'}}>
                    <option value="">전체 기간</option>
                    {MONTHS.map(m=><option key={m} value={m}>{m}월</option>)}
                  </select>
                </div>
                <div style={{width:'0.5px', background:'#E0E0E0', margin:'10px 0'}}/>
                <div className="flex-1 flex flex-col justify-center px-6 min-w-0">
                  <label className="text-[10px] font-bold tracking-wider" style={{color:'#A0A0A0'}}>종목</label>
                  <select value={sportSel} onChange={e=>setSportSel(e.target.value)}
                    className="text-[14px] bg-transparent outline-none cursor-pointer"
                    style={{color:'#0F0F0F'}}>
                    {SPORTS_15.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
                <div className="flex items-center px-3">
                  <button type="submit"
                    className="flex items-center gap-2 font-bold text-[14px] px-5 h-10 rounded-lg transition-all"
                    style={{background:'#D4FF3F', color:'#1A2E0A'}}>
                    <Search className="w-4 h-4"/> 검색
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 모바일 검색 */}
          {mobileSearchOpen && (
            <div className="md:hidden px-4 py-4" style={{background:'#1C1C1C'}}>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input value={region} onChange={e=>setRegion(e.target.value)} autoFocus
                  placeholder="지역명 또는 대회명"
                  className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                  style={{background:'rgba(255,255,255,.08)', color:'#fff', border:'0.5px solid rgba(255,255,255,.15)'}}/>
                <div className="grid grid-cols-2 gap-2">
                  <select value={month} onChange={e=>setMonth(e.target.value)}
                    className="px-3 py-3 rounded-xl text-[13px] outline-none"
                    style={{background:'rgba(255,255,255,.08)', color:'#fff', border:'0.5px solid rgba(255,255,255,.15)'}}>
                    <option value="">전체 기간</option>
                    {MONTHS.map(m=><option key={m} value={m}>{m}월</option>)}
                  </select>
                  <select value={sportSel} onChange={e=>setSportSel(e.target.value)}
                    className="px-3 py-3 rounded-xl text-[13px] outline-none"
                    style={{background:'rgba(255,255,255,.08)', color:'#fff', border:'0.5px solid rgba(255,255,255,.15)'}}>
                    {SPORTS_15.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
                <button type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-[14px]"
                  style={{background:'#D4FF3F', color:'#1A2E0A'}}>
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
