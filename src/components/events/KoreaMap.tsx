'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SportEvent } from '@/types';

// 한국 위경도 범위 → SVG 좌표 변환
// 위도: 33.0 ~ 38.7, 경도: 124.5 ~ 130.0
const LAT_MIN = 33.0, LAT_MAX = 38.7;
const LNG_MIN = 124.5, LNG_MAX = 130.0;
const SVG_W = 400, SVG_H = 480;

function toSVG(lat: number, lng: number): [number, number] {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * SVG_W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * SVG_H;
  return [x, y];
}

// 한국 지도 SVG 경로 (단순화 버전)
const KOREA_PATH = `
M 190,20 L 210,18 L 235,22 L 255,30 L 265,45 L 270,60
L 285,65 L 295,75 L 300,90 L 310,100 L 320,115
L 330,130 L 335,148 L 330,162 L 340,175 L 345,190
L 340,205 L 335,220 L 328,232 L 318,245 L 308,255
L 298,268 L 290,280 L 285,295 L 278,310 L 270,322
L 258,332 L 248,342 L 238,350 L 225,358 L 215,362
L 205,368 L 195,372 L 185,368 L 175,362 L 165,355
L 155,345 L 148,332 L 140,318 L 132,305 L 125,292
L 118,278 L 115,265 L 110,250 L 108,235 L 112,220
L 118,208 L 125,195 L 130,180 L 128,165 L 122,152
L 118,138 L 115,122 L 118,108 L 125,95 L 130,82
L 138,70 L 145,58 L 150,45 L 158,35 L 168,25 L 180,20 Z
M 155,390 L 165,388 L 172,394 L 168,402 L 158,404 L 150,398 Z
M 100,300 L 108,298 L 112,305 L 108,312 L 100,310 Z
M 350,210 L 358,208 L 362,215 L 358,222 L 350,220 Z
`;

// 제주도 경로
const JEJU_PATH = `M 165,440 L 195,436 L 220,440 L 228,450 L 220,460 L 195,465 L 168,460 L 158,450 Z`;

interface Props {
  events: SportEvent[];
  className?: string;
}

export function KoreaMap({ events, className }: Props) {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; event: SportEvent } | null>(null);

  // 종료 대회 제외, 좌표 있는 대회만
  const activeEvents = events.filter(e => e.status !== 'done' && e.lat && e.lng);

  const handleMarkerClick = (event: SportEvent) => {
    router.push(`/events/${event.id}`);
  };

  const handleMouseEnter = (e: React.MouseEvent<SVGCircleElement>, event: SportEvent, x: number, y: number) => {
    setHovered(event.id);
    setTooltip({ x, y, event });
  };

  const handleMouseLeave = () => {
    setHovered(null);
    setTooltip(null);
  };

  return (
    <div className={`relative bg-white ${className || ''}`}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-full"
        style={{ maxHeight: '520px' }}
      >
        {/* 배경 */}
        <rect width={SVG_W} height={SVG_H} fill="#F0F4F0" rx="12" />

        {/* 격자선 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 60} x2={SVG_W} y2={i * 60} stroke="#E0E8E0" strokeWidth="0.8" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 60} y1={0} x2={i * 60} y2={SVG_H} stroke="#E0E8E0" strokeWidth="0.8" />
        ))}

        {/* 한국 지도 */}
        <path d={KOREA_PATH} fill="#FFFFFF" stroke="#C8D8C8" strokeWidth="1.5" strokeLinejoin="round" />

        {/* 제주도 */}
        <path d={JEJU_PATH} fill="#FFFFFF" stroke="#C8D8C8" strokeWidth="1.5" strokeLinejoin="round" />

        {/* 이벤트 마커 */}
        {activeEvents.map((event) => {
          const [x, y] = toSVG(event.lat, event.lng);
          const isHovered = hovered === event.id;
          const label = event.title.length > 12 ? event.title.slice(0, 12) + '…' : event.title;

          return (
            <g key={event.id}>
              {/* 마커 */}
              <circle
                cx={x} cy={y} r={isHovered ? 9 : 6}
                fill={isHovered ? '#1E4D2B' : '#1A3A2A'}
                stroke="white" strokeWidth="1.5"
                className="cursor-pointer transition-all duration-150"
                onClick={() => handleMarkerClick(event)}
                onMouseEnter={(e) => handleMouseEnter(e, event, x, y)}
                onMouseLeave={handleMouseLeave}
              />
              {/* 라벨 */}
              <text
                x={x + 10} y={y + 4}
                fontSize="9" fill="#1A3A2A" fontFamily="Pretendard, sans-serif"
                className="pointer-events-none select-none"
                style={{ fontWeight: 500 }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 툴팁 */}
      {tooltip && (
        <div
          className="absolute bg-white border border-[#E5E5E5] rounded-xl shadow-lg p-3 text-xs pointer-events-none z-20 min-w-[160px]"
          style={{
            left: `${(tooltip.x / SVG_W) * 100}%`,
            top: `${(tooltip.y / SVG_H) * 100}%`,
            transform: 'translate(12px, -50%)',
          }}
        >
          <div className="font-semibold text-[#1A1A1A] mb-0.5">{tooltip.event.title}</div>
          <div className="text-[#717171]">{tooltip.event.region} · {tooltip.event.sport}</div>
          <div className="text-[#717171] font-mono">{tooltip.event.start}</div>
          <div className="text-[#1A3A2A] font-semibold mt-1">클릭하여 상세 보기 →</div>
        </div>
      )}


    </div>
  );
}
