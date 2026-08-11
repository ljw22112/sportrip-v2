'use client';
import { useEffect, useState } from 'react';
import { MapPin, Clock, ChevronRight } from 'lucide-react';

interface Spot {
  name: string; addr: string; img: string; url: string; dist: number;
}

interface Props {
  eventTitle: string;
  region: string;
  lat: number;
  lng: number;
}

// 지역별 샘플 여행지 (TourAPI 실패 시 fallback)
const REGION_SAMPLE: Record<string, {관광:string[], 음식:string[], 문화:string[], 숙박:string[]}> = {
  서울: { 관광:['경복궁','남산서울타워','북촌한옥마을'], 음식:['광장시장','이태원 음식거리','명동 먹자골목'], 문화:['국립중앙박물관','예술의전당','DDP'], 숙박:['명동 호텔','강남 호텔','홍대 게스트하우스'] },
  부산: { 관광:['해운대해수욕장','광안리해수욕장','감천문화마을'], 음식:['자갈치시장','국제시장','광안리 횟집거리'], 문화:['부산시립미술관','영화의전당','F1963'], 숙박:['해운대 호텔','광안리 호텔','남포동 호텔'] },
  제주: { 관광:['한라산국립공원','성산일출봉','만장굴'], 음식:['동문시장','올레시장','제주 흑돼지 거리'], 문화:['제주도립미술관','국립제주박물관','테디베어뮤지엄'], 숙박:['제주시 호텔','서귀포 리조트','애월 펜션'] },
  경기: { 관광:['수원화성','에버랜드','한국민속촌'], 음식:['수원 왕갈비 거리','안양 먹자골목','분당 카페거리'], 문화:['경기도미술관','백남준아트센터','실학박물관'], 숙박:['수원 호텔','성남 호텔','용인 리조트'] },
  강원: { 관광:['설악산국립공원','남이섬','강릉 경포대'], 음식:['속초 아바이순대','강릉 중앙시장','춘천 닭갈비 거리'], 문화:['강릉오죽헌','허균허난설헌기념관','강원도립미술관'], 숙박:['속초 호텔','강릉 호텔','평창 리조트'] },
  경남: { 관광:['통영 케이블카','거제도','남해 독일마을'], 음식:['통영 꿀빵 거리','창원 진해 음식거리','마산 아구찜 거리'], 문화:['경남도립미술관','국립진주박물관','통영 세병관'], 숙박:['창원 호텔','통영 호텔','거제 리조트'] },
  전남: { 관광:['순천만국가정원','보성 녹차밭','담양 죽녹원'], 음식:['여수 돌산갓김치','광양 불고기 거리','목포 세발낙지 거리'], 문화:['국립광주박물관','여수 예술관','목포근대역사관'], 숙박:['여수 호텔','순천 호텔','목포 호텔'] },
  경북: { 관광:['경주 불국사','안동 하회마을','영주 부석사'], 음식:['경주 찰보리빵 거리','안동 찜닭 골목','포항 물회 거리'], 문화:['국립경주박물관','안동 한국국학진흥원','포항 스틸아트뮤지엄'], 숙박:['경주 한옥스테이','안동 호텔','포항 호텔'] },
  충북: { 관광:['단양 도담삼봉','속리산국립공원','청주 상당산성'], 음식:['단양 마늘 요리 거리','충주 사과 거리','청주 먹자골목'], 문화:['청주고인쇄박물관','국립청주박물관','충주 세계무술박물관'], 숙박:['청주 호텔','충주 호텔','단양 리조트'] },
  충남: { 관광:['보령 대천해수욕장','태안 꽃지해수욕장','공주 공산성'], 음식:['공주 알밤 거리','천안 호두과자 거리','아산 온천 맛집'], 문화:['국립공주박물관','국립부여박물관','현충사'], 숙박:['아산 온천 호텔','천안 호텔','보령 해수욕장 펜션'] },
  전북: { 관광:['전주 한옥마을','무주 덕유산','변산반도'], 음식:['전주 비빔밥 골목','군산 빵 거리','정읍 먹자골목'], 문화:['전주 국립박물관','익산 왕궁리유적','군산근대역사박물관'], 숙박:['전주 한옥스테이','군산 호텔','익산 호텔'] },
  광주: { 관광:['무등산국립공원','양림동 역사문화마을','5·18민주광장'], 음식:['광주 상무지구 맛집','남광주시장','충장로 먹자골목'], 문화:['국립광주박물관','광주비엔날레','국립아시아문화전당'], 숙박:['광주 호텔','상무지구 호텔','운암동 호텔'] },
  대구: { 관광:['팔공산','달성공원','수성못'], 음식:['동성로 먹자골목','서문시장','안지랑 곱창 거리'], 문화:['대구미술관','국립대구박물관','동화사'], 숙박:['동성로 호텔','수성못 호텔','대구역 호텔'] },
  인천: { 관광:['강화도','인천 차이나타운','송도 센트럴파크'], 음식:['신포시장','소래포구','인천 짜장면 거리'], 문화:['인천시립박물관','개항장 문화재거리','인천상륙작전기념관'], 숙박:['송도 호텔','인천공항 호텔','강화도 펜션'] },
  대전: { 관광:['대전 엑스포과학공원','계족산황톳길','유성온천'], 음식:['중앙시장 먹자골목','성심당 본점','유성 맛집 거리'], 문화:['국립중앙과학관','대전시립미술관','한밭수목원'], 숙박:['유성 호텔','대전역 호텔','둔산동 호텔'] },
  울산: { 관광:['간절곶','태화강국가정원','반구대 암각화'], 음식:['언양불고기 거리','장생포 고래고기 거리','울산 회 거리'], 문화:['울산박물관','현대예술관','태화강 십리대밭'], 숙박:['울산 호텔','남구 호텔','언양 펜션'] },
  세종: { 관광:['세종호수공원','정부세종청사','베어트리파크'], 음식:['세종 조치원 먹자골목','도담동 카페거리','새롬동 맛집'], 문화:['국립세종도서관','세종예술의전당','밀마루전망대'], 숙박:['세종 호텔','조치원 호텔','도담동 게스트하우스'] },
};

const DEFAULT_SAMPLE = {
  관광:['지역 관광지'], 음식:['지역 맛집'], 문화:['지역 문화시설'], 숙박:['지역 숙박']
};

function makeSampleSpot(name: string, region: string, type: string): Spot {
  return { name, addr: `${region} 지역`, img: '', url: '', dist: 0 };
}

const DAY_TEMPLATES = [
  { label: '오전', time: '09:00~12:00', typeId: '12', sampleKey: '관광' as const },
  { label: '점심', time: '12:00~14:00', typeId: '39', sampleKey: '음식' as const },
  { label: '오후', time: '14:00~17:00', typeId: '14', sampleKey: '문화' as const },
  { label: '저녁', time: '17:00~19:00', typeId: '39', sampleKey: '음식' as const },
];

const NIGHT_TEMPLATES = [
  { label: '오전 (1일차)', time: '09:00~12:00', typeId: '12', sampleKey: '관광' as const },
  { label: '점심 (1일차)', time: '12:00~14:00', typeId: '39', sampleKey: '음식' as const },
  { label: '오후 (1일차)', time: '14:00~17:00', typeId: '15', sampleKey: '문화' as const },
  { label: '숙박',         time: '저녁 이후',   typeId: '32', sampleKey: '숙박' as const },
  { label: '오전 (2일차)', time: '09:00~12:00', typeId: '14', sampleKey: '관광' as const },
  { label: '점심 (2일차)', time: '12:00~14:00', typeId: '39', sampleKey: '음식' as const },
];

export function CourseSection({ eventTitle, region, lat, lng }: Props) {
  const [spots, setSpots]     = useState<Record<string, Record<string, Spot>>>({ day: {}, overnight: {} });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'day'|'overnight'>('day');
  const [isApi, setIsApi]     = useState(false);

  const sample = REGION_SAMPLE[region] || DEFAULT_SAMPLE;

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const daySpots:   Record<string, Spot> = {};
        const nightSpots: Record<string, Spot> = {};
        const seen = new Set<string>();
        let gotApi = false;

        for (const t of DAY_TEMPLATES) {
          const res = await fetch(`/api/tour?lat=${lat}&lng=${lng}&type=${t.typeId}`, { signal: controller.signal });
          const data = await res.json();
          const items: Spot[] = data.items || [];
          const fresh = items.find(it => !seen.has(it.name) && it.name);
          if (fresh) { daySpots[t.label] = fresh; seen.add(fresh.name); gotApi = true; }
          else {
            // 샘플 fallback
            const sArr = sample[t.sampleKey] || [];
            const sIdx = Object.keys(daySpots).filter(k => DAY_TEMPLATES.find(x=>x.label===k)?.sampleKey===t.sampleKey).length;
            const sName = sArr[sIdx % sArr.length] || '지역 관광지';
            daySpots[t.label] = makeSampleSpot(sName, region, t.typeId);
          }
        }

        const seen2 = new Set<string>();
        for (const t of NIGHT_TEMPLATES) {
          const res = await fetch(`/api/tour?lat=${lat}&lng=${lng}&type=${t.typeId}`, { signal: controller.signal });
          const data = await res.json();
          const items: Spot[] = data.items || [];
          const fresh = items.find(it => !seen2.has(it.name) && it.name);
          if (fresh) { nightSpots[t.label] = fresh; seen2.add(fresh.name); }
          else {
            const sArr = sample[t.sampleKey] || [];
            const sIdx = Object.keys(nightSpots).filter(k => NIGHT_TEMPLATES.find(x=>x.label===k)?.sampleKey===t.sampleKey).length;
            const sName = sArr[sIdx % sArr.length] || '지역 관광지';
            nightSpots[t.label] = makeSampleSpot(sName, region, t.typeId);
          }
        }

        setSpots({ day: daySpots, overnight: nightSpots });
        setIsApi(gotApi);
      } catch {
        // 전체 fallback
        const daySpots:   Record<string, Spot> = {};
        const nightSpots: Record<string, Spot> = {};
        DAY_TEMPLATES.forEach((t, i) => {
          const arr = sample[t.sampleKey] || ['지역 관광지'];
          daySpots[t.label] = makeSampleSpot(arr[i % arr.length], region, t.typeId);
        });
        NIGHT_TEMPLATES.forEach((t, i) => {
          const arr = sample[t.sampleKey] || ['지역 관광지'];
          nightSpots[t.label] = makeSampleSpot(arr[i % arr.length], region, t.typeId);
        });
        setSpots({ day: daySpots, overnight: nightSpots });
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [lat, lng, region]);

  const templates = activeTab === 'day' ? DAY_TEMPLATES : NIGHT_TEMPLATES;
  const curSpots  = spots[activeTab];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-[17px] font-bold text-[#222]">🗺️ 추천 여행 코스</h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isApi ? 'bg-[#E7F1EC] text-[#0B5C43]' : 'bg-gray-100 text-gray-500'}`}>
          {isApi ? '🌐 ⓒ한국관광공사' : '📋 추천 코스'}
        </span>
      </div>
      <p className="text-[13px] text-[#717171] mb-4">
        {eventTitle} 개최지 주변 {region} 여행 코스를 추천해 드립니다.
      </p>

      <div className="flex gap-2 mb-5">
        {(['day','overnight'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-[13px] font-bold border-2 transition-all
              ${activeTab===tab ? 'bg-[#0B5C43] border-[#0B5C43] text-white' : 'bg-white border-[#EBEBEB] text-[#555] hover:border-[#0B5C43]'}`}>
            {tab==='day' ? '🌞 당일치기' : '🌙 1박 2일'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-24 h-16 bg-[#F0F0F0] rounded-xl flex-shrink-0"/>
              <div className="flex-1 h-16 bg-[#F0F0F0] rounded-xl"/>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[47px] top-6 bottom-6 w-0.5 bg-[#EBEBEB] z-0"/>
          <div className="space-y-3">
            {templates.map(t => {
              const spot = curSpots[t.label];
              return (
                <div key={t.label} className="flex gap-3 items-start relative z-10">
                  <div className="flex-shrink-0 w-[94px] text-right">
                    <div className="inline-flex flex-col items-center bg-white border-2 border-[#0B5C43] rounded-xl px-2 py-1.5">
                      <span className="text-[10px] font-bold text-[#0B5C43]">{t.label}</span>
                      <span className="text-[9px] text-[#717171] flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5"/>{t.time}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#0B5C43] mt-3 flex-shrink-0"/>
                  {spot ? (
                    <div onClick={() => spot.url && window.open(spot.url, '_blank')}
                      className={`flex-1 flex gap-3 p-3 bg-white border border-[#EBEBEB] rounded-xl transition-all ${spot.url ? 'cursor-pointer hover:border-[#0B5C43] hover:shadow-sm' : ''}`}>
                      {spot.img && <img src={spot.img} alt={spot.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0"/>}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[14px] text-[#222] truncate">{spot.name}</div>
                        {spot.addr && (
                          <div className="flex items-center gap-1 text-[12px] text-[#717171] mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0"/><span className="truncate">{spot.addr}</span>
                          </div>
                        )}
                        {spot.dist > 0 && (
                          <div className="text-[11px] text-[#AAAAAA] mt-0.5">
                            대회장에서 {spot.dist < 1000 ? `${Math.round(spot.dist)}m` : `${(spot.dist/1000).toFixed(1)}km`}
                          </div>
                        )}
                        {spot.url && <div className="text-[11px] text-[#0B5C43] font-semibold mt-1">자세히 보기 →</div>}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 p-3 bg-[#F7F7F6] border border-[#EBEBEB] rounded-xl text-[13px] text-[#AAAAAA]">정보 없음</div>
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
