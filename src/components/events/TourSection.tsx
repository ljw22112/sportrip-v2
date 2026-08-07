'use client';
import { useEffect, useState } from 'react';
import { TourSpot } from '@/lib/courses';
import { ExternalLink, Phone, MapPin } from 'lucide-react';

interface ApiSpot {
  name: string; addr: string; tel: string;
  dist: number; img: string; url: string; desc: string;
}

interface Props {
  title: string;
  icon: string;
  sampleItems: TourSpot[];      // 즉시 표시 (샘플)
  lat: number;
  lng: number;
  contentTypeId: string;        // TourAPI 타입
}

const TYPE_COLOR: Record<string,string> = {
  '12':'bg-blue-50 text-blue-700',
  '14':'bg-purple-50 text-purple-700',
  '15':'bg-orange-50 text-orange-700',
  '32':'bg-green-50 text-green-700',
  '39':'bg-amber-50 text-amber-700',
};

export function TourSection({ title, icon, sampleItems, lat, lng, contentTypeId }: Props) {
  const [apiItems, setApiItems]   = useState<ApiSpot[]>([]);
  const [loading,  setLoading]    = useState(true);
  const [source,   setSource]     = useState<'sample'|'api'|'error'>('sample');

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          `/api/tour?lat=${lat}&lng=${lng}&type=${contentTypeId}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (data.items?.length > 0) {
          setApiItems(data.items);
          setSource('api');
        } else {
          setSource('sample');
        }
      } catch {
        setSource('error');
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [lat, lng, contentTypeId]);

  // 표시할 아이템 — API 데이터 있으면 우선, 없으면 샘플
  const showApi  = source === 'api' && apiItems.length > 0;
  const colorCls = TYPE_COLOR[contentTypeId] || 'bg-gray-50 text-gray-700';

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-base font-bold text-[#222]">{icon} {title}</h3>
        {/* 데이터 소스 배지 */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          loading  ? 'bg-gray-100 text-gray-400' :
          showApi  ? 'bg-[#E7F1EC] text-[#0B5C43]' :
                     'bg-gray-100 text-gray-500'
        }`}>
          {loading ? '로딩 중...' : showApi ? '🌐 TourAPI 실데이터' : '📋 샘플 데이터'}
        </span>
      </div>

      {/* API 데이터 카드 */}
      {showApi && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apiItems.map((item, i) => (
            <div key={i} className="bg-[#F7F7F6] border border-[#E8E8E6] rounded-xl p-4">
              {item.img && (
                <img src={item.img} alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"/>
              )}
              <div className="flex items-start justify-between gap-2">
                <b className="text-[13.5px] text-[#222] leading-tight">{item.name}</b>
                {item.dist > 0 && (
                  <span className="text-[11px] text-[#717171] flex-shrink-0">
                    {item.dist < 1000 ? `${Math.round(item.dist)}m` : `${(item.dist/1000).toFixed(1)}km`}
                  </span>
                )}
              </div>
              {item.addr && (
                <div className="flex items-center gap-1 text-[12px] text-[#717171] mt-1">
                  <MapPin className="w-3 h-3 flex-shrink-0"/>{item.addr}
                </div>
              )}
              {item.tel && (
                <div className="flex items-center gap-1 text-[12px] text-[#0B5C43] mt-0.5">
                  <Phone className="w-3 h-3 flex-shrink-0"/>{item.tel}
                </div>
              )}
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener"
                  className="inline-flex items-center gap-1 text-[11px] text-[#0B5C43] mt-1.5 hover:underline">
                  <ExternalLink className="w-3 h-3"/>자세히 보기
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 샘플 데이터 카드 (API 없을 때) */}
      {!showApi && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleItems.map((item, i) => (
            <div key={i} className="bg-[#F7F7F6] border border-[#E8E8E6] rounded-xl p-4">
              <b className="block text-[13.5px] text-[#222] mb-1">{item.name}</b>
              {item.addr && (
                <div className="flex items-center gap-1 text-[12px] text-[#717171]">
                  <MapPin className="w-3 h-3 flex-shrink-0"/>{item.addr}
                </div>
              )}
              {item.desc && <p className="text-[12px] text-[#717171] mt-1 leading-relaxed">{item.desc}</p>}
              {item.tel && (
                <div className="flex items-center gap-1 text-[12px] text-[#0B5C43] mt-1">
                  <Phone className="w-3 h-3 flex-shrink-0"/>{item.tel}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 로딩 스켈레톤 */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1,2].map(i => (
            <div key={i} className="bg-[#F7F7F6] border border-[#E8E8E6] rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-[#E8E8E6] rounded w-2/3 mb-2"/>
              <div className="h-3 bg-[#E8E8E6] rounded w-full mb-1"/>
              <div className="h-3 bg-[#E8E8E6] rounded w-3/4"/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
