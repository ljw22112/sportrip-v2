'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SPORTS = ['전체','마라톤','러닝','자전거','축구','배드민턴','수영','테니스','트레일'];
const MONTHS = [8,9,10,11,12,3,4];
const SPORT_ICONS: Record<string,string> = {
  전체:'⊕',마라톤:'🏃',러닝:'💨',자전거:'🚴',축구:'⚽',배드민턴:'🏸',수영:'🏊',테니스:'🎾',트레일:'🏔️'
};

interface HeaderProps { showSearch?: boolean }

export function Header({ showSearch=false }: HeaderProps) {
  const router = useRouter();
  const [activeSport, setActiveSport] = useState('전체');
  const [region, setRegion] = useState('');
  const [month, setMonth] = useState('');
  const [sportSel, setSportSel] = useState('전체');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (region) p.set('q', region);
    if (month) p.set('month', month);
    if (sportSel !== '전체') p.set('sport', sportSel);
    router.push(`/events?${p.toString()}`);
  };

  return (
    <header className="st-header">
      {/* 탑바 */}
      <div className="st-topbar">
        <Link href="/" className="st-logo">
          <Image src="/logo.svg" alt="SpoTrip" width={120} height={32} priority />
          <span className="st-beta">BETA</span>
        </Link>
        <div style={{marginLeft:'auto'}}>
          <Link href="/events" className="st-saved">♡ 저장한 대회</Link>
        </div>
      </div>

      {showSearch && <>
        {/* 종목 탭 */}
        <nav className="st-sport-tabs">
          {SPORTS.map(s => (
            <Link key={s} href={s==='전체'?'/events':`/events?sport=${encodeURIComponent(s)}`}
              onClick={()=>setActiveSport(s)}
              className={`st-tab ${activeSport===s?'active':''}`}>
              <span className="st-tab-icon">{SPORT_ICONS[s]}</span>
              <span>{s}</span>
            </Link>
          ))}
        </nav>

        {/* 검색바 */}
        <div className="st-searchwrap">
          <form onSubmit={handleSubmit} className="st-searchbar">
            <div className="st-cell">
              <label htmlFor="h-region">지역</label>
              <input id="h-region" value={region} onChange={e=>setRegion(e.target.value)}
                placeholder="지역명 또는 문장으로 검색" />
            </div>
            <div className="st-divider"/>
            <div className="st-cell st-cell-sm">
              <label htmlFor="h-month">날짜</label>
              <select id="h-month" value={month} onChange={e=>setMonth(e.target.value)}>
                <option value="">전체 기간</option>
                {MONTHS.map(m=><option key={m} value={m}>{m}월</option>)}
              </select>
            </div>
            <div className="st-divider"/>
            <div className="st-cell st-cell-sm">
              <label htmlFor="h-sport-sel">종목</label>
              <select id="h-sport-sel" value={sportSel} onChange={e=>setSportSel(e.target.value)}>
                {SPORTS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="st-go" aria-label="검색">🔍</button>
          </form>
          <p className="st-hint">문장으로 적어도 됩니다 — 예: <b>"11월 부산 마라톤"</b>을 그대로 입력해 보세요.</p>
        </div>
      </>}

      <style>{`
        .st-header{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.95);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
        .st-topbar{max-width:1240px;margin:0 auto;padding:12px 24px;display:flex;align-items:center;gap:16px}
        .st-logo{display:flex;align-items:center;gap:9px;font-weight:800;font-size:21px;letter-spacing:-.02em}
        .st-beta{font-size:11px;font-weight:600;color:var(--green);background:var(--green-tint);padding:2px 8px;border-radius:999px}
        .st-saved{display:inline-flex;align-items:center;gap:7px;font-weight:600;border-radius:999px;padding:9px 16px;color:var(--ink)}
        .st-saved:hover{background:var(--gray)}
        .st-sport-tabs{max-width:1240px;margin:0 auto;padding:4px 24px 0;display:flex;gap:4px;overflow-x:auto;scrollbar-width:none}
        .st-sport-tabs::-webkit-scrollbar{display:none}
        .st-tab{display:flex;flex-direction:column;align-items:center;gap:5px;padding:8px 13px 10px;color:var(--muted);border-bottom:2.5px solid transparent;font-size:12.5px;font-weight:600;flex-shrink:0;transition:color .15s;white-space:nowrap}
        .st-tab:hover{color:var(--ink)}
        .st-tab.active{color:var(--ink);border-bottom-color:var(--ink)}
        .st-tab-icon{font-size:22px}
        .st-searchwrap{max-width:1240px;margin:0 auto;padding:14px 24px 18px}
        .st-searchbar{display:flex;align-items:stretch;background:#fff;border:1px solid var(--line);border-radius:999px;box-shadow:0 1px 2px rgba(0,0,0,.06),0 4px 12px rgba(0,0,0,.06);max-width:760px;margin:0 auto;transition:box-shadow .15s}
        .st-searchbar:focus-within{box-shadow:0 3px 12px rgba(0,0,0,.14)}
        .st-cell{flex:1;display:flex;flex-direction:column;gap:1px;padding:10px 22px;border-radius:999px;min-width:0;transition:background .12s}
        .st-cell:hover{background:var(--gray)}
        .st-cell-sm{flex:0 0 auto;min-width:130px}
        .st-cell label{font-size:11px;font-weight:700;letter-spacing:.02em;color:var(--ink)}
        .st-cell input,.st-cell select{border:0;background:none;font-size:14px;width:100%;padding:0;outline:none;color:var(--muted);font-family:inherit;cursor:pointer}
        .st-cell input::placeholder{color:var(--faint)}
        .st-divider{width:1px;background:var(--line-soft);margin:6px 0}
        .st-go{align-self:center;margin:6px;width:46px;height:46px;border-radius:50%;background:var(--green);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s;font-size:18px}
        .st-go:hover{background:var(--green-deep)}
        .st-hint{text-align:center;font-size:12px;color:var(--faint);margin-top:8px}
        .st-hint b{color:var(--green);font-weight:600}
      `}</style>
    </header>
  );
}
