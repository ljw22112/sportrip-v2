'use client';
import Link from 'next/link';
import { useState } from 'react';
import { EVENTS, getDynamicEvents } from '@/lib/data';
import { EventRow } from '@/components/events/EventRow';
import { KoreaMap } from '@/components/events/KoreaMap';
import { Header } from '@/components/layout/Header';
import { RegionListView } from '@/components/events/RegionListView';
import { Calendar } from 'lucide-react';

const REGIONS_LIST = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'];

const KTO_LINKS_LEFT = ['오디(Odii) 오디오 가이드','베니키아','두루누비','공공 와이파이','국가유산 유유자적','관광두레','한국관광 데이터랩','한국관광 콘텐츠랩'];
const KTO_LINKS_RIGHT = ['여행가이드북','고캠핑','관광불편신고센터','템플스테이','세이프스테이','포토코리아','한국관광산업포털','대한민국 관광기념품 공모전·박람회'];
const KTO_URLS: Record<string,string> = {
  '오디(Odii) 오디오 가이드':'https://korean.visitkorea.or.kr','베니키아':'https://www.benikea.com',
  '두루누비':'https://www.durunubi.kr','공공 와이파이':'https://korean.visitkorea.or.kr',
  '국가유산 유유자직':'https://korean.visitkorea.or.kr','관광두레':'https://korean.visitkorea.or.kr',
  '한국관광 데이터랩':'https://datalab.visitkorea.or.kr','한국관광 콘텐츠랩':'https://api.visitkorea.or.kr',
  '여행가이드북':'https://korean.visitkorea.or.kr','고캠핑':'https://www.gocamping.or.kr',
  '관광불편신고센터':'https://korean.visitkorea.or.kr','템플스테이':'https://www.templestay.com',
  '세이프스테이':'https://korean.visitkorea.or.kr','포토코리아':'https://phoko.visitkorea.or.kr',
  '한국관광산업포털':'https://korean.visitkorea.or.kr','대한민국 관광기념품 공모전·박람회':'https://korean.visitkorea.or.kr',
};

function calcDdayNum(s: string) { return Math.ceil((new Date(s).getTime() - Date.now()) / 86400000); }

export default function HomePage() {
  const [selectedRegion, setSelectedRegion] = useState<string|null>(null);
  const [ktoOpen, setKtoOpen] = useState(false);

  const today = new Date();
  const mon = new Date(today); mon.setDate(today.getDate() - today.getDay() + 1);
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  const fmt = (d: Date) => d.toISOString().slice(0,10);

  const dynEvents = getDynamicEvents();
  const upcoming     = dynEvents.filter(e => e.status !== 'done').sort((a,b) => calcDdayNum(a.start)-calcDdayNum(b.start)).slice(0,20);
  const thisMonthEv  = dynEvents.filter(e => new Date(e.start).getMonth()+1 === today.getMonth()+1 && e.status !== 'done');
  const thisWeekEv   = dynEvents.filter(e => e.start >= fmt(mon) && e.start <= fmt(sun));

  if (selectedRegion) {
    return (
      <>
        <Header showSearch />
        <RegionListView region={selectedRegion} events={dynEvents.filter(e => e.region===selectedRegion&&e.status!=='done')} onBack={()=>setSelectedRegion(null)} />
      </>
    );
  }

  return (
    <>
      <Header showSearch />
      <main>

        {/* ── 히어로 카피 ── */}
        <div style={{ maxWidth:1760, margin:'0 auto', padding:'20px 80px 6px', textAlign:'center' }}>
          <h1 style={{ fontSize:'clamp(20px,2.6vw,26px)', fontWeight:800, letterSpacing:'-.02em', lineHeight:1.3 }}>
            대회 보러 가는 길,{' '}
            <span style={{ background:'linear-gradient(transparent 62%,#D6F14E 62%)' }}>그 지역까지</span>{' '}
            즐기고 오세요
          </h1>
          <p style={{ color:'var(--muted)', marginTop:6, fontSize:13.5 }}>
            전국 스포츠 대회 일정과 개최지 주변 관광지·맛집·숙소, 같은 기간 열리는 지역 축제까지 한곳에서 확인하세요.
          </p>
        </div>

        {/* 빠른 선택 칩 + 캘린더 버튼 */}
        <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', padding:'12px 80px' }}>
          {[['이번 주말','weekend'],['다음 달','nextmonth'],['내 지역','near'],['축제와 함께','festival']].map(([label,k])=>(
            <Link key={k} href={`/events?quick=${k}`} className="quick-chip">{label}</Link>
          ))}
          {/* 월간 캘린더 버튼 (이미지1) */}
          <Link href="/calendar" style={{ display:'inline-flex', alignItems:'center', gap:7, height:34, padding:'0 16px', borderRadius:999, background:'#2e86c1', color:'#fff', fontSize:13.5, fontWeight:700, textDecoration:'none', transition:'background .15s' }}
            className="cal-btn">
            <Calendar style={{ width:15, height:15 }} />
            월간 캘린더로 보기
          </Link>
        </div>

        {/* ── 지도 ── */}
        <section style={{ maxWidth:1760, margin:'0 auto', padding:'26px 80px 8px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
            <h2 style={{ fontSize:16, fontWeight:700 }}>지도로 한눈에 보기</h2>
            <Link href="/events" style={{ marginLeft:'auto', fontSize:13.5, fontWeight:600, color:'var(--green)' }}>목록으로 보기 ›</Link>
          </div>
          <div style={{ position:'relative', background:'#D8E4DA', border:'1px solid var(--line)', borderRadius:20, overflow:'hidden', height:440 }}>
            <KoreaMap events={EVENTS} className="w-full h-full" />
            <div className="map-zoom-btns"><button>+</button><button>−</button></div>
            <div className="map-note">약식 지도 — 점을 누르면 대회 상세로 이동합니다</div>
          </div>
        </section>

        {/* ── STEP 섹션 (지도 바로 아래) ── */}
        <section style={{ maxWidth:1760, margin:'0 auto', padding:'26px 80px', borderTop:'1px solid var(--line)' }}>
          <h2 style={{ textAlign:'center', fontSize:21, fontWeight:800, letterSpacing:'-.02em' }}>스포트립은 이렇게 씁니다</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:22, maxWidth:960, margin:'18px auto 0' }}>
            {[
              ['STEP 1','대회 찾기','지역·날짜·종목으로 거르거나, "11월 부산 마라톤"처럼 문장으로 검색합니다.'],
              ['STEP 2','주변 여행 정보 확인','개최지 주변 관광지·맛집·숙소와 대회 기간에 겹치는 지역 축제를 함께 보여 드립니다.'],
              ['STEP 3','저장하고 공유','마음에 든 대회는 하트로 저장하고, 일행에게 링크로 공유해 함께 떠나세요.\n로그인 없이도 이용 가능합니다.'],
            ].map(([bib,h,p])=>(
              <div key={bib} style={{ background:'var(--gray)', border:'1px solid var(--line-soft)', borderRadius:20, padding:20 }}>
                <span className="step-bib">{bib}</span>
                <h3 style={{ margin:'10px 0 4px', fontSize:16, letterSpacing:'-.01em' }}>{h}</h3>
                <p style={{ fontSize:13.5, color:'var(--muted)', whiteSpace:'pre-line' }}>{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3개 캐러셀 ── */}
        <EventRow title="전체 대회" href="/events" events={upcoming} />
        <EventRow title="이번달의 대회" href="/events?tab=month" events={thisMonthEv.length>0?thisMonthEv:upcoming.slice(0,10)} />
        <EventRow title="이번주의 대회" href="/events?tab=week" events={thisWeekEv.length>0?thisWeekEv:upcoming.slice(0,6)} />

        <hr className="lanes" style={{ marginTop:30 }}/>

        {/* ── 지역별 둘러보기 ── */}
        <section style={{ maxWidth:1760, margin:'0 auto', padding:'26px 80px 34px', borderTop:'1px solid var(--line)' }}>
          <h2 style={{ fontSize:20, fontWeight:800, letterSpacing:'-.02em' }}>지역별로 둘러보기</h2>
          <p style={{ color:'var(--muted)', fontSize:13.5, margin:'4px 0 16px' }}>가고 싶은 지역을 고르면 그 지역의 대회만 모아 보여 드립니다.</p>
          <div className="region-grid">
            {REGIONS_LIST.map(r=>{
              const cnt=EVENTS.filter(e=>e.region===r&&e.status!=='done').length;
              return(
                <button key={r} onClick={()=>setSelectedRegion(r)} className="region-tile">
                  <b>{r}</b>
                  <span style={{ color:cnt?'#E4572E':'var(--faint)', fontSize:12, marginTop:3, display:'block' }}>
                    {cnt?`예정 대회 ${cnt}건`:'예정 대회 없음'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── KTO 스트립 (5번사진, 맨 아래) ── */}
        <div className="kto-strip">
          <div className="kto-inner">
            {/* 1330 + 120 */}
            <div className="kto-row">
              <div className="kto-cell">
                <span className="kto-label">관광안내</span>
                <b className="kto-1330">
                  <span style={{color:'#E6397E'}}>1</span><span style={{color:'#0B8A4B'}}>3</span>
                  <span style={{color:'#2B6CB0'}}>3</span><span style={{color:'#12A5B8'}}>0</span>
                </b>
              </div>
              <div className="kto-cell">
                <span className="kto-label">지역번호</span>
                <span className="kto-120">+ 120</span>
              </div>
            </div>
            {/* 관광정보 아코디언 */}
            <div className="kto-row">
              <button className="kto-acc-btn" onClick={()=>setKtoOpen(v=>!v)}>
                <span className="kto-label">관광정보</span>
                <span style={{ fontSize:20, fontWeight:400 }}>{ktoOpen?'—':'+'}</span>
              </button>
            </div>
            {ktoOpen&&(
              <div className="kto-panel">
                <h5 className="kto-panel-title">관광정보</h5>
                <ul className="kto-link-list">
                  {[...KTO_LINKS_LEFT,...KTO_LINKS_RIGHT].map(name=>(
                    <li key={name}><a href={KTO_URLS[name]||'#'} target="_blank" rel="noopener">{name}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── 푸터 ── */}
        <footer className="st-footer">
          <div className="st-foot-inner">
            <div>
              <h4>스포트립</h4>
              <Link href="/events">대회 찾기</Link>
              <Link href="/calendar">월간 캘린더</Link>
            </div>
            <div style={{ marginLeft:'auto', textAlign:'right' }}>
              등록 대회 {EVENTS.length}건 · 예정 대회 {dynEvents.filter(e=>e.status!=='done').length}건<br/>
              관광 정보: 한국관광공사 TourAPI
            </div>
          </div>
          <div className="st-foot-legal">© 2026 스포트립 · 2026 관광데이터 활용 공모전 출품작</div>
        </footer>

        <style>{`
          .quick-chip{height:34px;padding:0 16px;border:1.5px solid var(--line);border-radius:999px;background:#fff;font-size:13.5px;font-weight:600;color:var(--ink);display:inline-flex;align-items:center;text-decoration:none;transition:border-color .15s}
          .quick-chip:hover{border-color:var(--ink)}
          .cal-btn:hover{background:#1a5276!important}
          .step-bib{display:inline-flex;align-items:center;font-weight:800;font-size:13px;background:#D6F14E;color:#2A3308;border-radius:6px;padding:2px 10px;letter-spacing:.04em}
          .map-zoom-btns{position:absolute;right:12px;top:12px;display:flex;flex-direction:column;background:#fff;border-radius:10px;box-shadow:var(--shadow-1);overflow:hidden}
          .map-zoom-btns button{width:34px;height:34px;font-size:17px;font-weight:700;cursor:pointer;border:0;background:transparent}
          .map-zoom-btns button:hover{background:var(--gray)}
          .map-note{position:absolute;left:12px;bottom:12px;background:rgba(255,255,255,.92);border-radius:10px;font-size:11.5px;color:var(--muted);padding:5px 10px}
          .region-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
          @media(max-width:880px){.region-grid{grid-template-columns:repeat(3,1fr)}}
          @media(max-width:420px){.region-grid{grid-template-columns:repeat(2,1fr)}}
          .region-tile{background:var(--gray);border:1px solid var(--line-soft);border-radius:14px;padding:14px 8px;text-align:center;cursor:pointer;transition:background .15s;font-family:inherit}
          .region-tile:hover{background:var(--line-soft)}
          .region-tile b{display:block;font-size:14.5px;letter-spacing:-.01em}
          .kto-strip{background:#fff;border-top:1px solid var(--line);font-size:14px}
          .kto-inner{max-width:1760px;margin:0 auto}
          .kto-row{display:flex;align-items:stretch;border-bottom:1px solid var(--line-soft)}
          .kto-cell{flex:1;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 80px}
          .kto-cell+.kto-cell{border-left:1px solid var(--line-soft)}
          .kto-label{color:var(--ink);font-weight:500}
          .kto-1330{font-size:22px;font-weight:800;letter-spacing:2px}
          .kto-120{color:#E8720C;font-size:18px;font-weight:800;letter-spacing:1px}
          .kto-acc-btn{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 80px;background:none;border:0;cursor:pointer;font-size:14px;text-align:left;font-family:inherit}
          .kto-acc-btn:hover{background:var(--gray)}
          .kto-panel{background:var(--gray);border-bottom:1px solid var(--line-soft);padding:20px 80px}
          .kto-panel-title{font-size:13.5px;margin-bottom:14px;color:var(--ink);font-weight:700}
          .kto-link-list{list-style:none;columns:2;column-gap:40px;padding:0;margin:0}
          .kto-link-list li{padding:5px 0;font-size:13px;break-inside:avoid}
          .kto-link-list li::before{content:"·";margin-right:8px;color:var(--faint)}
          .kto-link-list a{color:#0B5C43;font-weight:500}
          .kto-link-list a:hover{text-decoration:underline}
          @media(max-width:640px){.kto-row{flex-direction:column}.kto-cell+.kto-cell{border-left:0;border-top:1px solid var(--line-soft)}.kto-link-list{columns:1}}
          .st-footer{background:var(--gray);color:var(--muted);font-size:13px;border-top:1px solid var(--line)}
          .st-foot-inner{max-width:1760px;margin:0 auto;padding:30px 80px;display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start}
          .st-foot-inner h4{color:var(--ink);font-size:13px;margin-bottom:8px}
          .st-foot-inner a{display:block;padding:3px 0;color:var(--muted);text-decoration:none}
          .st-foot-inner a:hover{color:var(--ink);text-decoration:underline}
          .st-foot-legal{border-top:1px solid var(--line);padding:14px 80px;text-align:center;font-size:12px;color:var(--faint)}
        `}</style>
      </main>
    </>
  );
}
