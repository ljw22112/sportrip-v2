import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';
import { getDynamicEvents } from '@/lib/data';
import EventsPageClient from './EventsPageClient';

// 서버에서 초기 이벤트 데이터 렌더 (SSG)
function EventsSSRFallback() {
  const events = getDynamicEvents().filter(e => e.status !== 'done').slice(0, 12);
  return (
    <>
      <Header showSearch/>
      <noscript>
        <div style={{padding:'40px',textAlign:'center',fontFamily:'sans-serif'}}>
          <h2>자바스크립트를 활성화해주세요</h2>
          <p>스포트립은 자바스크립트가 필요합니다.</p>
        </div>
      </noscript>
      <main className="max-w-[1760px] mx-auto px-5 md:px-10 py-8">
        <h1 className="text-2xl font-black mb-2 tracking-tight">전국 스포츠 대회 일정</h1>
        <p className="text-[14px] text-muted mb-6">마라톤·배드민턴·수영 등 130건 이상의 대회를 종목·지역·날짜로 검색하세요</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {events.map(e => <EventCard key={e.id} event={e}/>)}
        </div>
      </main>
    </>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsSSRFallback/>}>
      <EventsPageClient/>
    </Suspense>
  );
}
