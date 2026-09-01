'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SportEvent } from '@/types';
import { getSportInfo, SPORTS_15 } from '@/lib/sports';

const REGION_POS: Record<string,[number,number]> = {
  서울:[190,138], 인천:[152,152], 경기:[210,162],
  강원:[298,132], 충북:[252,205], 충남:[172,218],
  대전:[225,228], 세종:[208,220],
  전북:[185,268], 광주:[182,308], 전남:[178,325],
  대구:[302,258], 경북:[300,225], 울산:[342,288],
  경남:[288,308], 부산:[318,342],
  제주:[218,468],
};

const CLUSTER_COLORS = [
  '#E4572E','#2E86C1','#27AE60','#8E44AD','#D4AC0D',
  '#C0392B','#16A085','#D4FF3F','#2980B9','#8E44AD',
];

// SPORTS_15 직접 사용

interface Props { events: SportEvent[]; className?: string; }

export function KoreaMap({ events, className }: Props) {
  const router = useRouter();
  const [activeSport, setActiveSport] = useState('전체');
  const [popup, setPopup] = useState<{region:string; events:SportEvent[]} | null>(null);

  const filtered = useMemo(()=>
    activeSport==='전체'
      ? events.filter(e=>e.status!=='done')
      : events.filter(e=>e.status!=='done'&&e.sport===activeSport),
    [events, activeSport]
  );

  const clusters = useMemo(()=>{
    const map: Record<string, SportEvent[]> = {};
    filtered.forEach(e=>{ if(!map[e.region]) map[e.region]=[]; map[e.region].push(e); });
    return map;
  }, [filtered]);

  return (
    <div className="relative w-full h-full flex">

      {/* ── 좌측 종목 카테고리 패널 ── */}
      <div className="flex-shrink-0 w-[70px] md:w-[90px] bg-white/95 border-r border-border flex flex-col overflow-y-auto z-10"
        style={{scrollbarWidth:'none', height:'100%'}}>
        {SPORTS_15.map(sp=>{
          const active = activeSport === sp.key;
          return (
            <button key={sp.key} onClick={()=>setActiveSport(sp.key)}
              className={`flex flex-col items-center justify-center gap-0.5 py-2.5 px-1 flex-shrink-0 border-b border-[#F0F0F0] transition-all
                ${active ? 'bg-[bg-primary]' : 'hover:bg-[#F7F7F6]'}`}>
              <img src={sp.icon} alt={sp.label}
                className={`w-8 h-8 object-contain ${active?'brightness-0 invert':''}`}/>
              <span className={`text-[10px] md:text-[11px] font-bold leading-tight text-center
                ${active ? 'text-white' : 'text-[#333]'}`}>
                {sp.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 지도 영역 ── */}
      <div className="relative flex-1 overflow-hidden">
        <svg viewBox="0 0 520 540" style={{width:'100%',height:'100%',display:'block'}}>
          <defs>
            <radialGradient id="seaGrad2" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#C8DCE8"/>
              <stop offset="100%" stopColor="#A8C4D8"/>
            </radialGradient>
            <filter id="ls2">
              <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#00000020"/>
            </filter>
          </defs>

          {/* 바다 */}
          <rect width="520" height="540" fill="url(#seaGrad2)"/>

          {/* 본토 */}
          <path filter="url(#ls2)" fill="#B8CDB5" stroke="#7A9E7E" strokeWidth="1.2"
            d="M 158 72 L 178 64 L 210 60 L 248 60 L 282 65 L 315 72
               C 332 82, 345 98, 350 118
               L 354 145 L 356 170 L 357 195 L 358 220 L 360 248
               C 360 265, 358 278, 355 290
               C 350 308, 344 322, 335 332
               L 322 348 L 312 360 L 300 372 L 285 380
               L 272 376 L 258 383 L 244 387 L 230 384
               C 218 378, 208 372, 198 380
               L 185 385
               C 172 378, 158 368, 148 352
               C 138 338, 128 322, 122 305
               L 118 288 L 110 268
               C 106 252, 108 238, 115 225
               L 118 212 L 108 198 L 100 180
               C 104 168, 112 158, 118 148
               L 122 135 L 128 122
               C 135 108, 144 95, 155 84 Z"/>

          {/* 주요 섬 */}
          <ellipse cx="138" cy="148" rx="10" ry="7" fill="#B8CDB5" stroke="#7A9E7E" strokeWidth="0.8" transform="rotate(-20 138 148)"/>
          <ellipse cx="112" cy="320" rx="14" ry="8" fill="#B8CDB5" stroke="#7A9E7E" strokeWidth="0.8" transform="rotate(-10 112 320)"/>
          <ellipse cx="120" cy="342" rx="9" ry="5" fill="#B8CDB5" stroke="#7A9E7E" strokeWidth="0.8"/>
          <ellipse cx="135" cy="362" rx="10" ry="6" fill="#B8CDB5" stroke="#7A9E7E" strokeWidth="0.8" transform="rotate(15 135 362)"/>
          <path fill="#B8CDB5" stroke="#7A9E7E" strokeWidth="0.8" d="M 300 375 L 312 370 L 320 378 L 308 382 Z"/>
          <ellipse cx="255" cy="390" rx="12" ry="6" fill="#B8CDB5" stroke="#7A9E7E" strokeWidth="0.8" transform="rotate(-8 255 390)"/>
          <ellipse cx="232" cy="394" rx="10" ry="5" fill="#B8CDB5" stroke="#7A9E7E" strokeWidth="0.8"/>

          {/* 제주도 */}
          <ellipse cx="218" cy="468" rx="52" ry="22" fill="#B8CDB5" stroke="#7A9E7E" strokeWidth="1.2" filter="url(#ls2)"/>
          <text x="218" y="471" textAnchor="middle" fontSize="10" fill="#4A6741" fontWeight="700">제주</text>

          {/* 울릉도 */}
          <circle cx="432" cy="185" r="11" fill="#B8CDB5" stroke="#7A9E7E" strokeWidth="1.2" filter="url(#ls2)"/>
          <text x="432" y="188" textAnchor="middle" fontSize="8.5" fill="#4A6741" fontWeight="700">울릉</text>

          {/* 독도 */}
          <circle cx="468" cy="212" r="5" fill="#B8CDB5" stroke="#7A9E7E" strokeWidth="1"/>
          <circle cx="475" cy="218" r="4" fill="#B8CDB5" stroke="#7A9E7E" strokeWidth="1"/>
          <text x="474" y="230" textAnchor="middle" fontSize="7.5" fill="#4A6741" fontWeight="700">독도</text>
          <line x1="443" y1="188" x2="464" y2="210" stroke="#7A9E7E" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.6"/>

          {/* 라벨 */}
          <text x="450" y="150" textAnchor="middle" fontSize="11" fill="#6892A8" fontWeight="600" opacity="0.7">동해</text>
          <text x="72" y="240" textAnchor="middle" fontSize="11" fill="#6892A8" fontWeight="600" opacity="0.7">서해</text>
          <text x="280" y="448" textAnchor="middle" fontSize="11" fill="#6892A8" fontWeight="600" opacity="0.7">남해</text>
          <line x1="158" y1="72" x2="315" y2="72" stroke="#888" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5"/>
          <text x="238" y="56" textAnchor="middle" fontSize="9" fill="#888" fontWeight="600">DMZ</text>

          {/* 클러스터 마커 */}
          {Object.entries(clusters).map(([region, evs], idx)=>{
            const pos = REGION_POS[region];
            if (!pos) return null;
            const [x,y] = pos;
            const count = evs.length;
            const color = CLUSTER_COLORS[idx % CLUSTER_COLORS.length];
            const r = count >= 10 ? 20 : count >= 5 ? 16 : 13;
            return (
              <g key={region} style={{cursor:'pointer'}}
                onClick={()=>setPopup(popup?.region===region ? null : {region, events:evs})}>
                <circle cx={x} cy={y} r={r+6} fill={color} opacity="0.18"/>
                <circle cx={x} cy={y} r={r} fill={color}/>
                <text x={x} y={y+0.5} textAnchor="middle" dominantBaseline="central"
                  fill="white" fontSize={count>=10?10:11} fontWeight="800">{count}</text>
                <text x={x} y={y+r+11} textAnchor="middle"
                  fill="#2C3E2D" fontSize="9.5" fontWeight="700">{region}</text>
              </g>
            );
          })}
        </svg>

        {/* 팝업 */}
        {popup && (
          <div className="absolute inset-x-2 bottom-2 bg-white/97 border-2 border-[#DDD] rounded-2xl shadow-xl z-20 max-h-[55%] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEE] flex-shrink-0">
              <div>
                <span className="font-bold text-[16px] text-ink">{popup.region}</span>
                <span className="text-[13px] text-muted ml-2">예정 {popup.events.length}건</span>
              </div>
              <button onClick={()=>setPopup(null)} className="text-muted text-2xl font-light w-8 h-8 flex items-center justify-center">×</button>
            </div>
            <div className="overflow-y-auto flex-1 px-3 py-1.5">
              {popup.events.slice(0,10).map(ev=>{
                const sp = getSportInfo(ev.sport);
                return (
                  <button key={ev.id} onClick={()=>router.push(`/events/${ev.id}`)}
                    className="w-full flex items-center gap-3 py-2.5 border-b border-[#F5F5F5] last:border-0 hover:bg-[#F7F7F6] rounded-xl px-2 -mx-2 transition-colors text-left">
                    <div className="w-9 h-9 flex-shrink-0 rounded-xl border-2 flex items-center justify-center text-lg"
                      style={{borderColor:sp.color+'55',background:sp.color+'11'}}>
                    <img src={sp.icon} alt={sp.label} className="w-6 h-6 object-contain"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[13px] text-ink truncate">{ev.title}</div>
                      <div className="text-[12px] text-muted">{ev.start.slice(5).replace('-','/')} · {ev.sport}</div>
                    </div>
                  </button>
                );
              })}
              {popup.events.length > 10 && (
                <button onClick={()=>router.push(`/events?region=${popup.region}`)}
                  className="w-full text-center py-3 text-[13px] font-bold text-[bg-primary]">
                  전체 {popup.events.length}개 보기 ›
                </button>
              )}
            </div>
          </div>
        )}

        {!popup && (
          <div className="absolute left-2 bottom-2 bg-white/90 rounded-full text-[11px] text-muted px-3 py-1.5">
            지역 원 클릭 → 대회 목록
          </div>
        )}
      </div>
    </div>
  );
}
