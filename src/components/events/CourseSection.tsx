'use client';
import { useEffect, useState } from 'react';
import { MapPin, Clock, ChevronRight } from 'lucide-react';

interface Spot {
  name: string; addr: string; img: string; url: string; dist: number;
}

interface Course {
  label: string;
  time: string;
  spots: Spot[];
}

interface Props {
  eventTitle: string;
  region: string;
  lat: number;
  lng: number;
}

const COURSE_TEMPLATES = [
  { label: '오전', time: '09:00~12:00', typeId: '12' },  // 관광지
  { label: '점심', time: '12:00~14:00', typeId: '39' },  // 음식점
  { label: '오후', time: '14:00~17:00', typeId: '14' },  // 문화시설
  { label: '저녁', time: '17:00~19:00', typeId: '39' },  // 음식점
];

const OVERNIGHT_TEMPLATES = [
  { label: '오전 (1일차)', time: '09:00~12:00', typeId: '12' },
  { label: '점심 (1일차)', time: '12:00~14:00', typeId: '39' },
  { label: '오후 (1일차)', time: '14:00~17:00', typeId: '15' },  // 축제
  { label: '숙박',        time: '저녁 이후',   typeId: '32' },  // 숙박
  { label: '오전 (2일차)', time: '09:00~12:00', typeId: '14' },
  { label: '점심 (2일차)', time: '12:00~14:00', typeId: '39' },
];

export function CourseSection({ eventTitle, region, lat, lng }: Props) {
  const [daySpots, setDaySpots]   = useState<Record<string, Spot>>({});
  const [nightSpots, setNightSpots] = useState<Record<string, Spot>>({});
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState<'day'|'overnight'>('day');

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        // 당일치기 코스 데이터
        const dayResults: Record<string, Spot> = {};
        const seen = new Set<string>();
        for (const t of COURSE_TEMPLATES) {
          const res = await fetch(`/api/tour?lat=${lat}&lng=${lng}&type=${t.typeId}`, { signal: controller.signal });
          const data = await res.json();
          const items = data.items || [];
          // 이전에 나온 장소 제외
          const fresh = items.find((it: Spot) => !seen.has(it.name));
          if (fresh) { dayResults[t.label] = fresh; seen.add(fresh.name); }
        }
        setDaySpots(dayResults);

        // 1박 2일 코스
        const nightResults: Record<string, Spot> = {};
        const seen2 = new Set<string>();
        for (const t of OVERNIGHT_TEMPLATES) {
          const res = await fetch(`/api/tour?lat=${lat}&lng=${lng}&type=${t.typeId}`, { signal: controller.signal });
          const data = await res.json();
          const items = data.items || [];
          const fresh = items.find((it: Spot) => !seen2.has(it.name));
          if (fresh) { nightResults[t.label] = fresh; seen2.add(fresh.name); }
        }
        setNightSpots(nightResults);
      } catch {}
      finally { setLoading(false); }
    })();
    return () => controller.abort();
  }, [lat, lng]);

  const templates = activeTab === 'day' ? COURSE_TEMPLATES : OVERNIGHT_TEMPLATES;
  const spots     = activeTab === 'day' ? daySpots : nightSpots;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-[17px] font-bold text-[#222]">🗺️ 추천 여행 코스</h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F1EC] text-[#0B5C43]">
          ⓒ한국관광공사
        </span>
      </div>
      <p className="text-[13px] text-[#717171] mb-4">
        {eventTitle} 개최지 주변 {region} 여행 코스를 추천해 드립니다.
      </p>

      {/* 탭 */}
      <div className="flex gap-2 mb-5">
        {(['day','overnight'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-[13px] font-bold border-2 transition-all
              ${activeTab===tab
                ? 'bg-[#0B5C43] border-[#0B5C43] text-white'
                : 'bg-white border-[#EBEBEB] text-[#555] hover:border-[#0B5C43]'}`}>
            {tab==='day' ? '🌞 당일치기 코스' : '🌙 1박 2일 코스'}
          </button>
        ))}
      </div>

      {/* 코스 타임라인 */}
      {loading ? (
        <div className="space-y-3">
          {templates.map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-24 h-16 bg-[#F0F0F0] rounded-xl flex-shrink-0"/>
              <div className="flex-1">
                <div className="h-4 bg-[#F0F0F0] rounded w-1/3 mb-2"/>
                <div className="h-3 bg-[#F0F0F0] rounded w-2/3"/>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* 세로 연결선 */}
          <div className="absolute left-[47px] top-6 bottom-6 w-0.5 bg-[#EBEBEB] z-0"/>

          <div className="space-y-3">
            {templates.map((t, idx) => {
              const spot = spots[t.label];
              return (
                <div key={t.label} className="flex gap-3 items-start relative z-10">
                  {/* 시간 뱃지 */}
                  <div className="flex-shrink-0 w-[94px] text-right">
                    <div className="inline-flex flex-col items-center bg-white border-2 border-[#0B5C43] rounded-xl px-2 py-1.5">
                      <span className="text-[10px] font-bold text-[#0B5C43]">{t.label}</span>
                      <span className="text-[9px] text-[#717171] flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5"/>{t.time}
                      </span>
                    </div>
                  </div>

                  {/* 화살표 */}
                  <ChevronRight className="w-4 h-4 text-[#0B5C43] mt-3 flex-shrink-0"/>

                  {/* 장소 카드 */}
                  {spot ? (
                    <a href={spot.url || '#'} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex gap-3 p-3 bg-white border border-[#EBEBEB] rounded-xl hover:border-[#0B5C43] hover:shadow-sm transition-all cursor-pointer">
                      {spot.img && (
                        <img src={spot.img} alt={spot.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"/>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[14px] text-[#222] truncate">{spot.name}</div>
                        {spot.addr && (
                          <div className="flex items-center gap-1 text-[12px] text-[#717171] mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0"/>
                            <span className="truncate">{spot.addr}</span>
                          </div>
                        )}
                        {spot.dist > 0 && (
                          <div className="text-[11px] text-[#AAAAAA] mt-0.5">
                            대회장에서 {spot.dist < 1000 ? `${Math.round(spot.dist)}m` : `${(spot.dist/1000).toFixed(1)}km`}
                          </div>
                        )}
                        {spot.url && (
                          <div className="text-[11px] text-[#0B5C43] font-semibold mt-1">자세히 보기 →</div>
                        )}
                      </div>
                    </a>
                  ) : (
                    <div className="flex-1 p-3 bg-[#F7F7F6] border border-[#EBEBEB] rounded-xl">
                      <div className="text-[13px] text-[#AAAAAA]">주변 정보를 불러오는 중입니다...</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
