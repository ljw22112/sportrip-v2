'use client';
import { useEffect, useState } from 'react';
import { TourSpot } from '@/lib/courses';
import { MapPin, Phone, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface ApiSpot {
  name: string; addr: string; tel: string;
  dist: number; img: string; url: string; desc: string;
}

interface Props {
  title: string;
  icon: string;
  sampleItems: TourSpot[];
  lat: number;
  lng: number;
  contentTypeId: string;
  barrierFree?: boolean;
}

export function TourSection({ title, icon, sampleItems, lat, lng, contentTypeId, barrierFree }: Props) {
  const [apiItems, setApiItems] = useState<ApiSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'sample'|'api'|'error'>('sample');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/tour?lat=${lat}&lng=${lng}&type=${contentTypeId}`, { signal: controller.signal });
        const data = await res.json();
        if (data.items?.length > 0) { setApiItems(data.items); setSource('api'); }
        else setSource('sample');
      } catch { setSource('error'); }
      finally { setLoading(false); }
    })();
    return () => controller.abort();
  }, [lat, lng, contentTypeId]);

  const showApi = source === 'api' && apiItems.length > 0;
  const items = showApi ? apiItems : sampleItems;
  const SHOW = 4;
  const displayItems = showAll ? items : items.slice(0, SHOW);
  const hasMore = items.length > SHOW;

  if (items.length === 0 && !loading) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[17px] font-bold text-ink">{icon} {title}</h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          loading ? 'bg-gray-100 text-gray-400' :
          showApi ? 'bg-[bg-primary-tint] text-[bg-primary]' : 'bg-gray-100 text-gray-500'
        }`}>
          {loading ? '불러오는 중...' : showApi ? '🌐 ⓒ한국관광공사' : '📋 샘플'}
        </span>
      </div>

      {/* 4개 그리드 */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i=>(
            <div key={i} className="bg-[#F7F7F6] border border-border rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-[#E8E8E6] rounded w-3/4 mb-2"/>
              <div className="h-3 bg-[#E8E8E6] rounded w-full"/>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {displayItems.map((item, i) => {
              // API 아이템 vs 샘플 아이템
              const name = (item as ApiSpot).name || (item as TourSpot).name || '';
              const addr = (item as ApiSpot).addr || (item as TourSpot).addr || '';
              const tel  = (item as ApiSpot).tel  || (item as TourSpot).tel  || '';
              const url  = (item as ApiSpot).url  || '';
              const dist = (item as ApiSpot).dist || 0;
              const img  = (item as ApiSpot).img  || '';

              const card = (
                <div key={i}
                  className={`bg-[#F7F7F6] border border-border rounded-xl overflow-hidden transition-all
                    ${url ? 'cursor-pointer hover:border-[bg-primary] hover:shadow-sm' : ''}`}
                  onClick={() => url && window.open(url, '_blank')}>
                  {img && (
                    <img src={img} alt={name} className="w-full h-24 object-cover"/>
                  )}
                  <div className="p-3">
                    <b className="block text-[13px] font-bold text-ink mb-1 line-clamp-2 leading-tight">{name}</b>
                    {addr && (
                      <div className="flex items-start gap-1 text-[11px] text-muted">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0"/>
                        <span className="line-clamp-1">{addr}</span>
                      </div>
                    )}
                    {tel && (
                      <div className="flex items-center gap-1 text-[11px] text-[bg-primary] mt-0.5">
                        <Phone className="w-3 h-3 flex-shrink-0"/>
                        <span>{tel}</span>
                      </div>
                    )}
                    {dist > 0 && (
                      <div className="text-[11px] text-faint mt-0.5">
                        {dist < 1000 ? `${Math.round(dist)}m` : `${(dist/1000).toFixed(1)}km`}
                      </div>
                    )}
                    {url && (
                      <div className="flex items-center gap-1 text-[11px] text-[bg-primary] mt-1.5 font-semibold">
                        <ExternalLink className="w-3 h-3"/>
                        자세히 보기
                      </div>
                    )}
                  </div>
                </div>
              );
              return card;
            })}
          </div>

          {/* 더보기 버튼 */}
          {hasMore && (
            <button onClick={() => setShowAll(v => !v)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-[#555] hover:border-[bg-primary] hover:text-[bg-primary] transition-all bg-white">
              {showAll
                ? <><ChevronUp className="w-4 h-4"/> 접기</>
                : <><ChevronDown className="w-4 h-4"/> {items.length - SHOW}개 더 보기</>
              }
            </button>
          )}
        </>
      )}
    </div>
  );
}
