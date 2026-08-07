'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SportEvent } from '@/types';
import { getSportInfo, SPORTS_15 } from '@/lib/sports';

// 지역 중심 좌표 (SVG 좌표계 변환)
const REGION_POS: Record<string,[number,number]> = {
  서울:[235,168], 경기:[240,188], 인천:[215,183],
  강원:[300,162], 충북:[270,230], 충남:[220,240],
  대전:[252,245], 세종:[240,238],
  전북:[220,295], 전남:[210,340], 광주:[208,330],
  경북:[320,248], 대구:[318,268], 경남:[308,318],
  부산:[335,328], 울산:[348,305],
  제주:[225,410],
};

const REGION_COLOR_MAP: Record<string,string> = {
  서울:'#1a5276',부산:'#154360',경기:'#1a5276',강원:'#145a32',
  경남:'#145a32',전남:'#145a32',제주:'#145a32',대전:'#7D6608',
  충북:'#7D6608',충남:'#7D6608',경북:'#4a235a',전북:'#4a235a',광주:'#4a235a',
  대구:'#6E2F1A',울산:'#1B4F72',인천:'#1F618D',세종:'#B7950B',
};

interface Props {
  events: SportEvent[];
  className?: string;
}

export function KoreaMap({ events, className }: Props) {
  const router = useRouter();
  const [activeSport, setActiveSport] = useState('전체');
  const [popup, setPopup] = useState<{region:string; events:SportEvent[]} | null>(null);

  // 필터된 이벤트
  const filtered = useMemo(()=>
    activeSport === '전체'
      ? events.filter(e=>e.status!=='done')
      : events.filter(e=>e.status!=='done' && e.sport===activeSport),
    [events, activeSport]
  );

  // 지역별 클러스터
  const clusters = useMemo(()=>{
    const map: Record<string, SportEvent[]> = {};
    filtered.forEach(e=>{
      if (!map[e.region]) map[e.region] = [];
      map[e.region].push(e);
    });
    return map;
  }, [filtered]);

  return (
    <div className="relative w-full h-full">
      {/* 종목 필터 칩 */}
      <div className="absolute top-3 left-3 right-3 z-10 flex gap-1.5 overflow-x-auto"
        style={{scrollbarWidth:'none'}}>
        {SPORTS_15.slice(0,8).map(sp=>(
          <button key={sp.key} onClick={()=>setActiveSport(sp.key)}
            className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold border transition-all
              ${activeSport===sp.key
                ? 'text-white border-transparent'
                : 'bg-white/90 text-[#222] border-[#DDD] hover:border-[#222]'}`}
            style={activeSport===sp.key ? {background: sp.color, borderColor: sp.color} : {}}>
            <span>{sp.emoji}</span>
            <span className="hidden sm:inline">{sp.label}</span>
          </button>
        ))}
      </div>

      {/* SVG 약식 한국 지도 */}
      <svg viewBox="0 0 420 470" className={className} style={{width:'100%',height:'100%'}}>
        {/* 배경 */}
        <rect width="420" height="470" fill="#D8E4DA" rx="16"/>

        {/* 한반도 약식 윤곽 */}
        <path d="M170 60 L260 55 L310 90 L340 140 L355 200 L350 280 L330 340 L310 380 L280 400 L250 405 L220 400 L200 380 L190 350 L175 320 L165 290 L155 250 L150 200 L160 150 L170 100 Z"
          fill="#C8D8CC" stroke="#8BA898" strokeWidth="1.5"/>
        {/* 제주도 */}
        <ellipse cx="225" cy="410" rx="28" ry="14" fill="#C8D8CC" stroke="#8BA898" strokeWidth="1.5"/>

        {/* 클러스터 마커 */}
        {Object.entries(clusters).map(([region, evs]) => {
          const pos = REGION_POS[region];
          if (!pos) return null;
          const [x, y] = pos;
          const count = evs.length;
          const color = REGION_COLOR_MAP[region] || '#555';
          const r = count >= 10 ? 22 : count >= 5 ? 18 : 14;

          return (
            <g key={region} style={{cursor:'pointer'}}
              onClick={()=>setPopup(popup?.region===region ? null : {region, events:evs})}>
              {/* 외곽 링 */}
              <circle cx={x} cy={y} r={r+5} fill={color} opacity="0.15"/>
              {/* 메인 원 */}
              <circle cx={x} cy={y} r={r} fill={color}/>
              {/* 대회 수 */}
              <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                fill="white" fontSize={count>=10?10:12} fontWeight="bold">
                {count}
              </text>
              {/* 지역명 */}
              <text x={x} y={y+r+10} textAnchor="middle"
                fill="#333" fontSize="10" fontWeight="600">
                {region}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 팝업 카드 */}
      {popup && (
        <div className="absolute inset-x-3 bottom-3 bg-white/97 border border-[#DDD] rounded-2xl shadow-xl z-20 max-h-[55%] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEE] flex-shrink-0">
            <div>
              <span className="font-bold text-[15px] text-[#222]">{popup.region}</span>
              <span className="text-[13px] text-[#717171] ml-2">예정 대회 {popup.events.length}건</span>
            </div>
            <button onClick={()=>setPopup(null)} className="text-[#717171] hover:text-[#222] text-xl font-light w-8 h-8 flex items-center justify-center">×</button>
          </div>
          <div className="overflow-y-auto flex-1 px-3 py-2">
            {popup.events.slice(0,8).map(ev=>{
              const sp = getSportInfo(ev.sport);
              return (
                <button key={ev.id} onClick={()=>router.push(`/events/${ev.id}`)}
                  className="w-full flex items-center gap-3 py-2.5 border-b border-[#F5F5F5] last:border-0 hover:bg-[#F7F7F6] rounded-lg px-2 -mx-2 transition-colors text-left">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl border-2 flex items-center justify-center text-xl"
                    style={{borderColor:sp.color+'55',background:sp.color+'11'}}>
                    {sp.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13px] text-[#222] truncate">{ev.title}</div>
                    <div className="text-[12px] text-[#717171]">{ev.start} · {ev.sport}</div>
                  </div>
                  <span className="text-[#0B5C43] text-[12px] font-bold flex-shrink-0">{ev.start.slice(5).replace('-','/')}</span>
                </button>
              );
            })}
            {popup.events.length > 8 && (
              <button onClick={()=>router.push(`/events?region=${popup.region}`)}
                className="w-full text-center py-2.5 text-[13px] font-bold text-[#0B5C43]">
                전체 {popup.events.length}개 보기 ›
              </button>
            )}
          </div>
        </div>
      )}

      {/* 팝업 없을 때 안내 */}
      {!popup && (
        <div className="absolute left-3 bottom-3 bg-white/90 rounded-full text-[11px] text-[#717171] px-3 py-1">
          지역 원을 클릭하면 대회 목록이 표시됩니다
        </div>
      )}
    </div>
  );
}
