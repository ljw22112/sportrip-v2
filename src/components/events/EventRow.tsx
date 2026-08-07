'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { SportEvent } from '@/types';
import { EventCard } from './EventCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props { title: string; href: string; events: SportEvent[] }

export function EventRow({ title, href, events }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 460, behavior: 'smooth' });

  return (
    <section style={{ maxWidth: 1760, margin: '0 auto', padding: '26px 80px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.01em' }}>{title}</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* 전체보기 버튼 */}
          <Link href={href}
            style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--green)', textDecoration: 'none', padding: '4px 12px', border: '1.5px solid var(--green)', borderRadius: 999 }}
            className="more-hover">
            전체보기 ›
          </Link>
          {/* 스크롤 화살표 */}
          {events.length > 0 && (
            <>
              <button onClick={() => scroll(-1)} aria-label="이전"
                style={{ width: 28, height: 28, background: 'var(--gray)', border: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronLeft style={{ width: 13, height: 13 }} />
              </button>
              <button onClick={() => scroll(1)} aria-label="다음"
                style={{ width: 28, height: 28, background: 'var(--gray)', border: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronRight style={{ width: 13, height: 13 }} />
              </button>
            </>
          )}
        </div>
      </div>

      {events.length === 0 ? (
        <div style={{ background: '#fff', border: '1px dashed var(--line)', borderRadius: 14, padding: 22, textAlign: 'center', fontSize: 13.5, color: 'var(--muted)' }}>
          이 기간에 열리는 대회가 없습니다.
        </div>
      ) : (
        <div ref={ref} style={{
          display: 'grid', gridAutoFlow: 'column',
          gridAutoColumns: 'calc((100% - 84px) / 7)',
          gap: 14, overflowX: 'auto', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', paddingBottom: 6,
        }}>
          {events.map(e => (
            <div key={e.id} style={{ scrollSnapAlign: 'start' }}>
              <EventCard event={e} />
            </div>
          ))}
        </div>
      )}
      <style>{`
        .more-hover:hover{background:var(--green-tint)}
        div::-webkit-scrollbar{display:none}
      `}</style>
    </section>
  );
}
