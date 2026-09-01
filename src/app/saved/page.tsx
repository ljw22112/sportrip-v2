'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EVENTS, getDynamicEvents } from '@/lib/data';
import { EventCard } from '@/components/events/EventCard';
import { Header } from '@/components/layout/Header';
import { Heart } from 'lucide-react';

export default function SavedPage() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem('sportrip_saved') || '[]');
      setSavedIds(new Set(ids));
    } catch {}
    setLoaded(true);
  }, []);

  const allEvents = getDynamicEvents();
  const savedEvents = allEvents.filter(e => savedIds.has(String(e.id)));

  return (
    <>
      <Header showSearch/>
      <main className="max-w-[1760px] mx-auto px-4 md:px-10 py-6 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-[#E4572E] fill-[#E4572E]"/>
          <h1 className="text-[22px] font-extrabold tracking-tight">저장한 대회</h1>
          {loaded && <span className="text-[14px] text-muted">{savedEvents.length}건</span>}
        </div>

        {/* localStorage 안내 */}
        <div className="bg-[#FFF9F0] border border-[#FFE0B2] rounded-xl px-4 py-3 mb-6 text-[13px] text-[#7A5A00]">
          💡 하트로 저장한 대회는 이 기기 브라우저에만 보관됩니다. 다른 기기에서는 보이지 않으며, 브라우저 데이터 삭제 시 목록이 초기화될 수 있습니다.
        </div>

        {!loaded ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse"/>)}
          </div>
        ) : savedEvents.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border rounded-2xl">
            <Heart className="w-12 h-12 text-[#EBEBEB] mx-auto mb-4"/>
            <p className="font-bold text-[16px] text-ink mb-1">아직 저장한 대회가 없어요</p>
            <p className="text-[14px] text-muted mb-6">대회 카드의 하트를 눌러 저장해 보세요</p>
            <Link href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-xl text-[14px]" style={{background:'#0F0F0F',color:'#fff'}}>
              대회 찾기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {savedEvents.map(e => <EventCard key={e.id} event={e}/>)}
          </div>
        )}
      </main>
    </>
  );
}
