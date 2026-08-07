'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { SportEvent } from '@/types';
import { EventCard } from './EventCard';
import { KoreaMap } from './KoreaMap';
import { ArrowLeft, X } from 'lucide-react';
import { calcDday } from '@/lib/data';

interface Props {
  region: string;
  events: SportEvent[];
  onBack: () => void;
}

export function RegionListView({ region, events, onBack }: Props) {
  const [sort, setSort] = useState<'date'|'size'>('date');

  const sorted = useMemo(() => [...events].sort((a, b) =>
    sort === 'date'
      ? a.start.localeCompare(b.start)
      : parseInt(b.participants) - parseInt(a.participants)
  ), [events, sort]);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(320px,40%)', minHeight:'calc(100vh - 130px)' }}>
      {/* 좌측: 목록 */}
      <div style={{ padding:'18px 80px 40px', overflowY:'auto' }}>
        {/* 뒤로 + 결과 헤더 */}
        <button onClick={onBack}
          style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'var(--muted)', marginBottom:14, cursor:'pointer', border:0, background:'none', padding:0 }}>
          <ArrowLeft style={{ width:15, height:15 }} />
          처음으로
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:14 }}>
          <span style={{ fontSize:14, fontWeight:700 }}>대회 {sorted.length}건</span>
          {/* 필터 태그 */}
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--green-tint)', color:'var(--green)', fontSize:12.5, fontWeight:700, borderRadius:999, padding:'5px 11px' }}>
            {region}
            <button onClick={onBack} style={{ display:'flex', cursor:'pointer', border:0, background:'none', color:'inherit', padding:0 }}>
              <X style={{ width:13, height:13 }} />
            </button>
          </span>
          {/* 정렬 */}
          <select value={sort} onChange={e => setSort(e.target.value as 'date'|'size')}
            style={{ marginLeft:'auto', border:'1.5px solid var(--line)', borderRadius:999, padding:'7px 12px', background:'#fff', fontSize:13.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            <option value="date">날짜 임박순</option>
            <option value="size">규모순</option>
          </select>
        </div>

        {sorted.length === 0 ? (
          <div style={{ background:'#fff', border:'1px dashed var(--line)', borderRadius:20, padding:40, textAlign:'center' }}>
            <div style={{ fontSize:17, fontWeight:700, marginBottom:6 }}>예정 대회가 없습니다</div>
            <p style={{ color:'var(--muted)', fontSize:14, marginBottom:16 }}>{region} 지역의 예정 대회를 준비 중입니다.</p>
            <button onClick={onBack}
              style={{ background:'var(--green)', color:'#fff', border:0, borderRadius:12, padding:'10px 20px', fontWeight:700, fontSize:14, cursor:'pointer' }}>
              다른 지역 보기
            </button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
            {sorted.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </div>

      {/* 우측: 지도 (sticky) */}
      <aside style={{ position:'sticky', top:130, height:'calc(100vh - 130px)', background:'#DEE8E0', borderLeft:'1px solid var(--line)' }}>
        <div style={{ position:'relative', width:'100%', height:'100%' }}>
          <KoreaMap events={events} className="w-full h-full" />
          <div style={{ position:'absolute', right:12, top:12, display:'flex', flexDirection:'column', background:'#fff', borderRadius:10, overflow:'hidden', boxShadow:'var(--shadow-1)' }}>
            <button style={{ width:34, height:34, fontSize:17, fontWeight:700, border:0, background:'transparent', cursor:'pointer' }}>+</button>
            <button style={{ width:34, height:34, fontSize:17, fontWeight:700, border:0, background:'transparent', cursor:'pointer' }}>−</button>
          </div>
          <div style={{ position:'absolute', left:12, bottom:12, background:'rgba(255,255,255,.92)', borderRadius:10, fontSize:11.5, color:'var(--muted)', padding:'5px 10px' }}>
            약식 지도 — 점을 누르면 대회 상세로 이동합니다
          </div>
        </div>
      </aside>
    </div>
  );
}
