'use client';
import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventCard, EventCardSkeleton, EventCardHorizontal } from '@/components/events/EventCard';
import { KoreaMap } from '@/components/events/KoreaMap';
import { Header } from '@/components/layout/Header';
import { EVENTS, REGIONS } from '@/lib/data';
import { getWeekRange, getMonthRange, cn } from '@/lib/utils';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';

const SPORT_CHIPS = ['전체','마라톤','러닝','자전거','축구','배드민턴','수영','테니스','트레일','기타'];

type Tab = 'all'|'month'|'week';

function EventsContent() {
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>('all');
  const [sport, setSport] = useState(params.get('sport')||'');
  const [keyword, setKeyword] = useState(params.get('q')||params.get('keyword')||'');
  const [region, setRegion] = useState(params.get('region')||'');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState<'date'|'size'>('date');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 920);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activeCount = [region, status].filter(Boolean).length;

  const base = useMemo(() => {
    if (tab === 'week') { const {start,end}=getWeekRange(); return EVENTS.filter(e=>e.start>=start&&e.start<=end); }
    if (tab === 'month') { const {start,end}=getMonthRange(); return EVENTS.filter(e=>e.start>=start&&e.start<=end); }
    return EVENTS;
  }, [tab]);

  const filtered = useMemo(() => base.filter(e => {
    if (sport && sport!=='전체' && e.sport!==sport) return false;
    if (region && e.region!==region) return false;
    if (status && e.status!==status) return false;
    if (keyword && !e.title.includes(keyword)&&!e.region.includes(keyword)&&!e.venue.includes(keyword)) return false;
    return true;
  }).sort((a,b) => sort==='date' ? a.start.localeCompare(b.start) : parseInt(b.participants)-parseInt(a.participants)),
  [base,sport,region,status,keyword,sort]);

  const reset = () => { setRegion(''); setStatus(''); setKeyword(''); setSport(''); };

  const mapVisible = showMap && !isMobile;

  return (
    <>
      <Header showSearch />

      {/* 이미지4 스타일: 목록+지도 분할 레이아웃 */}
      <div style={{ display:'grid', gridTemplateColumns: mapVisible ? 'minmax(0,1fr) minmax(320px,42%)' : '1fr', minHeight:'calc(100vh - 130px)', maxWidth:'100%' }}>

        {/* 좌측: 목록 */}
        <div style={{ padding:'18px 24px 40px' }}>

          {/* 종목 칩 */}
          <div style={{ display:'flex', gap:2, overflowX:'auto', borderBottom:'1px solid var(--line)', marginBottom:14, paddingBottom:0, marginLeft:-24, marginRight:-24, paddingLeft:24, paddingRight:24, scrollbarWidth:'none' }}>
            {SPORT_CHIPS.map(s => {
              const active = sport===s||(s==='전체'&&!sport);
              return (
                <button key={s} onClick={() => setSport(s==='전체'?'':s)}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'6px 12px 8px', flexShrink:0, borderTop:0, borderLeft:0, borderRight:0, borderBottom: active?'2.5px solid var(--ink)':'2.5px solid transparent', color: active?'var(--ink)':'var(--muted)', fontSize:12, fontWeight:600, cursor:'pointer', background:'none', transition:'color .15s', whiteSpace:'nowrap' }}>
                  {s}
                </button>
              );
            })}
          </div>

          {/* 검색 + 필터 */}
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <div style={{ position:'relative', flex:1 }}>
              <Search style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', width:15, height:15, color:'var(--faint)' }} />
              <input value={keyword} onChange={e=>setKeyword(e.target.value)}
                placeholder="대회명, 지역, 종목 검색..."
                style={{ width:'100%', paddingLeft:36, paddingRight:36, paddingTop:9, paddingBottom:9, border:'1.5px solid var(--line)', borderRadius:999, fontSize:13.5, outline:'none', fontFamily:'inherit' }} />
              {keyword && <button onClick={()=>setKeyword('')} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', border:0, background:'none', cursor:'pointer', display:'flex', color:'var(--muted)' }}><X style={{width:14,height:14}}/></button>}
            </div>
            <button onClick={()=>setFilterOpen(v=>!v)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 14px', border:'1.5px solid', borderColor: activeCount>0?'var(--ink)':'var(--line)', background: activeCount>0?'var(--ink)':'#fff', color: activeCount>0?'#fff':'var(--ink)', borderRadius:999, fontSize:13.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              <SlidersHorizontal style={{width:15,height:15}}/>필터{activeCount>0?` (${activeCount})`:''}
            </button>
            <select value={sort} onChange={e=>setSort(e.target.value as 'date'|'size')}
              style={{ border:'1.5px solid var(--line)', borderRadius:999, padding:'9px 12px', background:'#fff', fontSize:13.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display: isMobile?'none':'block' }}>
              <option value="date">날짜 임박순</option>
              <option value="size">규모순</option>
            </select>
            {!isMobile && (
              <button onClick={() => setShowMap(v=>!v)}
                style={{ padding:'9px 14px', border:'1.5px solid var(--line)', borderRadius:999, fontSize:13.5, fontWeight:600, cursor:'pointer', background:'#fff', fontFamily:'inherit', whiteSpace:'nowrap' }}>
                {showMap ? '🗺️ 지도 숨기기' : '🗺️ 지도 보기'}
              </button>
            )}
          </div>

          {/* 필터 패널 */}
          {filterOpen && (
            <div style={{ border:'1px solid var(--line)', borderRadius:16, padding:18, marginBottom:12, background:'#fff' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, marginBottom:6 }}>지역</div>
                  <select value={region} onChange={e=>setRegion(e.target.value)}
                    style={{ width:'100%', border:'1.5px solid var(--line)', borderRadius:10, padding:'8px 10px', fontSize:13.5, fontFamily:'inherit', cursor:'pointer', background:'#fff' }}>
                    <option value="">전체 지역</option>
                    {REGIONS.slice(1).map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, marginBottom:6 }}>상태</div>
                  <select value={status} onChange={e=>setStatus(e.target.value)}
                    style={{ width:'100%', border:'1.5px solid var(--line)', borderRadius:10, padding:'8px 10px', fontSize:13.5, fontFamily:'inherit', cursor:'pointer', background:'#fff' }}>
                    <option value="">전체</option>
                    <option value="upcoming">예정</option>
                    <option value="ongoing">진행중</option>
                    <option value="done">종료</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:12 }}>
                <button onClick={()=>{reset();setFilterOpen(false);}} style={{ fontSize:13.5, fontWeight:700, textDecoration:'underline', cursor:'pointer', border:0, background:'none' }}>전체 해제</button>
                <button onClick={()=>setFilterOpen(false)} style={{ background:'var(--ink)', color:'#fff', border:0, borderRadius:10, padding:'8px 18px', fontWeight:700, fontSize:13.5, cursor:'pointer', fontFamily:'inherit' }}>적용</button>
              </div>
            </div>
          )}

          {/* 탭 */}
          <div style={{ display:'flex', borderBottom:'1px solid var(--line)', marginBottom:14 }}>
            {([['all','전체 대회'],['month','이번달의 대회'],['week','이번주의 대회']] as const).map(([t,l]) => (
              <button key={t} onClick={()=>setTab(t)}
                style={{ padding:'10px 14px', fontSize:13.5, fontWeight:600, borderBottom: tab===t?'2px solid var(--ink)':'2px solid transparent', background:'none', fontFamily:'inherit', marginBottom:-1, whiteSpace:'nowrap' }}>
                {l}
              </button>
            ))}
          </div>

          {/* 결과 + 태그 */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, alignItems:'center', marginBottom:14 }}>
            <span style={{ fontSize:14, fontWeight:700 }}>대회 {filtered.length}건</span>
            {region && <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:'var(--green-tint)', color:'var(--green)', fontSize:12.5, fontWeight:700, borderRadius:999, padding:'4px 10px' }}>{region} <button onClick={()=>setRegion('')} style={{ border:0, background:'none', cursor:'pointer', display:'flex', color:'inherit' }}><X style={{width:12,height:12}}/></button></span>}
            {status && <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:'var(--green-tint)', color:'var(--green)', fontSize:12.5, fontWeight:700, borderRadius:999, padding:'4px 10px' }}>{{upcoming:'예정',ongoing:'진행중',done:'종료'}[status]} <button onClick={()=>setStatus('')} style={{ border:0, background:'none', cursor:'pointer', display:'flex', color:'inherit' }}><X style={{width:12,height:12}}/></button></span>}
          </div>

          {/* 빈 결과 */}
          {filtered.length === 0 && (
            <div style={{ border:'1px dashed var(--line)', borderRadius:20, padding:40, textAlign:'center' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:17, fontWeight:700, marginBottom:6 }}>조건에 맞는 대회가 없습니다</div>
              <p style={{ color:'var(--muted)', fontSize:14, marginBottom:16 }}>기간을 넓히거나 종목 조건을 풀어보세요.</p>
              <button onClick={reset} style={{ background:'var(--ink)', color:'#fff', border:0, borderRadius:12, padding:'10px 20px', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>전체 조건 지우기</button>
            </div>
          )}

          {/* 그리드 */}
          {tab==='all' && filtered.length>0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
              {filtered.map(e=><EventCard key={e.id} event={e}/>)}
            </div>
          )}
          {tab!=='all' && filtered.length>0 && (
            <div>{filtered.map(e=><EventCardHorizontal key={e.id} event={e}/>)}</div>
          )}
        </div>

        {/* 우측: 지도 (이미지4처럼) */}
        {mapVisible && (
          <aside style={{ position:'sticky', top:130, height:'calc(100vh - 130px)', background:'#DEE8E0', borderLeft:'1px solid var(--line)' }}>
            <div style={{ position:'relative', width:'100%', height:'100%' }}>
              <KoreaMap events={filtered.filter(e=>e.status!=='done')} className="w-full h-full" />
              <div style={{ position:'absolute', right:12, top:12, display:'flex', flexDirection:'column', background:'#fff', borderRadius:10, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.1)' }}>
                <button style={{ width:34, height:34, fontSize:17, fontWeight:700, border:0, cursor:'pointer', background:'transparent' }}>+</button>
                <button style={{ width:34, height:34, fontSize:17, fontWeight:700, border:0, cursor:'pointer', background:'transparent' }}>−</button>
              </div>
              <div style={{ position:'absolute', left:12, bottom:12, background:'rgba(255,255,255,.92)', borderRadius:10, fontSize:11.5, color:'var(--muted)', padding:'5px 10px' }}>
                약식 지도 — 점을 누르면 대회 상세로 이동합니다
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* 모바일 지도 토글 */}
      {isMobile && (
        <button onClick={()=>setShowMap(v=>!v)} style={{ position:'fixed', bottom:18, left:'50%', transform:'translateX(-50%)', background:'var(--ink)', color:'#fff', border:0, borderRadius:999, padding:'11px 20px', fontWeight:700, fontSize:13.5, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(0,0,0,.18)', zIndex:60 }}>
          🗺️ {showMap ? '목록 보기' : '지도 보기'}
        </button>
      )}
    </>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <><Header showSearch />
      <div style={{ maxWidth:1240, margin:'0 auto', padding:'24px', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
        {Array.from({length:6}).map((_,i)=><EventCardSkeleton key={i}/>)}
      </div></>
    }>
      <EventsContent/>
    </Suspense>
  );
}
