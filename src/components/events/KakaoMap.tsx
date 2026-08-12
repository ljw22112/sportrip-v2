'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SportEvent } from '@/types';
import { getSportInfo, SPORTS_15 } from '@/lib/sports';

declare global {
  interface Window { kakao: any; }
}

const KAKAO_KEY = 'ea0bac9cb1bcae92ec228bcd1bbed72f';

interface Props { events: SportEvent[]; className?: string; }

export function KakaoMap({ events, className }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [activeSport, setActiveSport] = useState('전체');
  const [loaded, setLoaded] = useState(false);
  const [popup, setPopup] = useState<{region:string; events:SportEvent[]} | null>(null);
  const router = useRouter();

  const filtered = events.filter(e =>
    e.status !== 'done' &&
    (activeSport === '전체' || e.sport === activeSport)
  );

  // SDK 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.kakao?.maps) { setLoaded(true); return; }
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(() => setLoaded(true));
    document.head.appendChild(script);
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!loaded || !mapRef.current || mapInstanceRef.current) return;
    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(36.5, 127.8),
      level: 13,
    });
    map.addControl(new window.kakao.maps.ZoomControl(), window.kakao.maps.ControlPosition.RIGHT);
    mapInstanceRef.current = map;
  }, [loaded]);

  // 마커 렌더링
  useEffect(() => {
    if (!loaded || !mapInstanceRef.current) return;
    const { kakao } = window;
    const map = mapInstanceRef.current;

    // 기존 오버레이 제거
    map.overlays && map.overlays.forEach((o: any) => o.setMap(null));
    map.overlays = [];

    // 지역 그룹
    const regionMap: Record<string, SportEvent[]> = {};
    filtered.forEach(e => {
      if (!regionMap[e.region]) regionMap[e.region] = [];
      regionMap[e.region].push(e);
    });

    Object.entries(regionMap).forEach(([region, evs]) => {
      const first = evs[0];
      const sp = getSportInfo(first.sport);
      const count = evs.length;
      const size = count >= 10 ? 50 : count >= 5 ? 42 : 36;

      // HTML 오버레이 — onclick 속성으로 직접 이벤트 연결
      const id = `marker-${region.replace(/\s/g,'')}`;
      const content = document.createElement('div');
      content.innerHTML = `
        <div id="${id}" style="
          display:flex;flex-direction:column;align-items:center;
          cursor:pointer;user-select:none;
        ">
          <div style="
            width:${size}px;height:${size}px;
            background:${sp.color};
            border:3px solid white;
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 3px 10px rgba(0,0,0,0.35);
            font-size:${count>=10?15:14}px;
            font-weight:900;color:white;
            font-family:Pretendard,sans-serif;
          ">${count}</div>
          <div style="
            background:rgba(20,20,20,0.8);color:white;
            font-size:11px;font-weight:700;
            padding:2px 7px;border-radius:10px;
            margin-top:3px;white-space:nowrap;
            font-family:Pretendard,sans-serif;
          ">${region}</div>
          <div style="
            width:0;height:0;
            border-left:5px solid transparent;
            border-right:5px solid transparent;
            border-top:6px solid rgba(20,20,20,0.8);
          "></div>
        </div>`;

      // 클릭 이벤트 직접 바인딩
      content.querySelector(`#${id}`)?.addEventListener('click', (e) => {
        e.stopPropagation();
        setPopup(prev => prev?.region === region ? null : { region, events: evs });
      });

      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(first.lat, first.lng),
        content: content,
        yAnchor: 1,
        zIndex: 3,
      });
      overlay.setMap(map);
      map.overlays.push(overlay);
    });
  }, [loaded, filtered]);

  return (
    <div className="relative w-full h-full flex">
      {/* 종목 패널 */}
      <div className="flex-shrink-0 w-[68px] md:w-[88px] bg-white/95 border-r border-[#EBEBEB] flex flex-col overflow-y-auto z-10"
        style={{scrollbarWidth:'none'}}>
        {SPORTS_15.map(sp => {
          const active = activeSport === sp.key;
          return (
            <button key={sp.key}
              onClick={() => { setActiveSport(sp.key); setPopup(null); }}
              className={`flex flex-col items-center justify-center gap-0.5 py-2.5 px-1 flex-shrink-0 border-b border-[#F0F0F0] transition-all
                ${active ? 'bg-[#0B5C43]' : 'hover:bg-[#F7F7F6]'}`}>
              <img src={sp.icon} alt={sp.label}
                className={`w-7 h-7 md:w-8 md:h-8 object-contain ${active ? 'brightness-0 invert' : ''}`}/>
              <span className={`text-[9px] md:text-[10px] font-bold leading-tight text-center
                ${active ? 'text-white' : 'text-[#333]'}`}>{sp.label}</span>
            </button>
          );
        })}
      </div>

      {/* 카카오 지도 */}
      <div className="relative flex-1 overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#E8F0E4] z-10">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-[14px] font-semibold text-[#555]">지도 불러오는 중...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full"/>

        {/* 팝업 */}
        {popup && (
          <div className="absolute inset-x-2 bottom-2 bg-white border-2 border-[#DDD] rounded-2xl shadow-xl z-20 max-h-[55%] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEE] flex-shrink-0">
              <div>
                <span className="font-bold text-[16px] text-[#222]">{popup.region}</span>
                <span className="text-[13px] text-[#717171] ml-2">예정 {popup.events.length}건</span>
              </div>
              <button onClick={() => setPopup(null)}
                className="text-[#717171] text-2xl w-8 h-8 flex items-center justify-center">×</button>
            </div>
            <div className="overflow-y-auto flex-1 px-3 py-1.5">
              {popup.events.slice(0,10).map(ev => {
                const sp = getSportInfo(ev.sport);
                return (
                  <button key={ev.id} onClick={() => router.push(`/events/${ev.id}`)}
                    className="w-full flex items-center gap-3 py-2.5 border-b border-[#F5F5F5] last:border-0 hover:bg-[#F7F7F6] rounded-xl px-2 -mx-2 transition-colors text-left">
                    <div className="w-10 h-10 flex-shrink-0 rounded-xl border-2 flex items-center justify-center p-1.5"
                      style={{borderColor:sp.color+'55',background:sp.color+'11'}}>
                      <img src={sp.icon} alt={sp.label} className="w-full h-full object-contain"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[13px] text-[#222] truncate">{ev.title}</div>
                      <div className="text-[12px] text-[#717171]">{ev.start.slice(5).replace('-','/')} · {ev.sport}</div>
                    </div>
                    <span className="text-[12px] font-bold flex-shrink-0" style={{color:sp.color}}>
                      {ev.start.slice(5).replace('-','/')}
                    </span>
                  </button>
                );
              })}
              {popup.events.length > 10 && (
                <button onClick={() => router.push(`/events?region=${popup.region}`)}
                  className="w-full text-center py-3 text-[13px] font-bold text-[#0B5C43]">
                  전체 {popup.events.length}개 보기 ›
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
