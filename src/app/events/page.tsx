'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventCard, EventCardSkeleton, EventCardHorizontal } from '@/components/events/EventCard';
import { EVENTS } from '@/lib/data';
import { getWeekRange, getMonthRange, cn } from '@/lib/utils';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { REGIONS } from '@/lib/data';

const CHIPS = [
  { label: '전체', icon: '⊕', sport: '' },
  { label: '마라톤', icon: '🏃', sport: '마라톤' },
  { label: '러닝', icon: '💨', sport: '마라톤' },
  { label: '자전거', icon: '🚴', sport: '사이클' },
  { label: '축구', icon: '⚽', sport: '축구' },
  { label: '배드민턴', icon: '🏸', sport: '배드민턴' },
  { label: '수영', icon: '🏊', sport: '수영' },
  { label: '테니스', icon: '🎾', sport: '테니스' },
  { label: '트레일', icon: '🏔️', sport: '기타' },
];

type Tab = 'all' | 'month' | 'week';

function EventsContent() {
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>('all');
  const [sport, setSport] = useState(params.get('sport') || '');
  const [keyword, setKeyword] = useState(params.get('keyword') || '');
  const [region, setRegion] = useState('');
  const [status, setStatus] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeChip, setActiveChip] = useState(params.get('sport') || '');

  const activeCount = [region, status].filter(Boolean).length;

  const base = useMemo(() => {
    if (tab === 'week') { const { start, end } = getWeekRange(); return EVENTS.filter(e => e.start >= start && e.start <= end); }
    if (tab === 'month') { const { start, end } = getMonthRange(); return EVENTS.filter(e => e.start >= start && e.start <= end); }
    return EVENTS;
  }, [tab]);

  const filtered = useMemo(() => base.filter(e => {
    if (sport && e.sport !== sport) return false;
    if (region && e.region !== region) return false;
    if (status && e.status !== status) return false;
    if (keyword && !e.title.includes(keyword) && !e.region.includes(keyword)) return false;
    return true;
  }).sort((a, b) => a.start.localeCompare(b.start)), [base, sport, region, status, keyword]);

  const reset = () => { setRegion(''); setStatus(''); setKeyword(''); setSport(''); setActiveChip(''); };

  return (
    <div className="max-w-[1120px] mx-auto px-5">

      {/* 종목 칩 */}
      <div className="flex gap-0 overflow-x-auto no-scrollbar border-b border-[#E5E5E5] -mx-5 px-5 mb-6">
        {CHIPS.map(({ label, icon, sport: s }) => {
          const active = activeChip === label || (label === '전체' && !activeChip);
          return (
            <button key={label}
              onClick={() => { setActiveChip(label === '전체' ? '' : label); setSport(label === '전체' ? '' : s); }}
              className={cn('flex flex-col items-center gap-1.5 px-5 py-3 flex-shrink-0 border-b-2 transition-all text-xs font-medium whitespace-nowrap',
                active ? 'border-[#1A1A1A] text-[#1A1A1A] opacity-100' : 'border-transparent text-[#717171] opacity-70 hover:opacity-100')}>
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* 검색 + 필터 */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AAAAAA]" />
          <input value={keyword} onChange={e => setKeyword(e.target.value)}
            placeholder="대회명, 지역, 종목 검색..."
            className="w-full pl-10 pr-4 py-2.5 border border-[#D0D0D0] rounded-full text-sm outline-none focus:border-[#1A1A1A] transition-colors" />
          {keyword && <button onClick={() => setKeyword('')} className="absolute right-3.5 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5 text-[#AAAAAA]" /></button>}
        </div>
        <button onClick={() => setFilterOpen(v => !v)}
          className={cn('flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all',
            activeCount > 0 ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' : 'border-[#D0D0D0] text-[#1A1A1A] hover:border-[#1A1A1A]')}>
          <SlidersHorizontal className="w-4 h-4" />
          필터 {activeCount > 0 && `(${activeCount})`}
        </button>
      </div>

      {/* 필터 드롭다운 */}
      {filterOpen && (
        <div className="mb-5 p-5 border border-[#E5E5E5] rounded-2xl bg-white shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-bold text-[#1A1A1A] mb-2">지역</div>
              <select value={region} onChange={e => setRegion(e.target.value)}
                className="w-full border border-[#D0D0D0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1A1A1A]">
                <option value="">전체 지역</option>
                {REGIONS.slice(1).map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <div className="text-xs font-bold text-[#1A1A1A] mb-2">상태</div>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full border border-[#D0D0D0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1A1A1A]">
                <option value="">전체</option>
                <option value="upcoming">예정</option>
                <option value="ongoing">진행중</option>
                <option value="done">종료</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={reset} className="text-sm font-semibold text-[#1A1A1A] underline">전체 해제</button>
            <button onClick={() => setFilterOpen(false)} className="bg-[#1A1A1A] text-white px-5 py-2 rounded-xl text-sm font-semibold">적용</button>
          </div>
        </div>
      )}

      {/* 탭 */}
      <div className="flex gap-0 border-b border-[#E5E5E5] mb-6">
        {([['all', '전체 대회'], ['month', '이번달의 대회'], ['week', '이번주의 대회']] as const).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all',
              tab === t ? 'border-[#1A1A1A] text-[#1A1A1A] font-semibold' : 'border-transparent text-[#717171] hover:text-[#1A1A1A]')}>
            {l}
          </button>
        ))}
      </div>

      {/* 결과 수 */}
      <p className="text-sm text-[#717171] mb-5"><span className="font-semibold text-[#1A1A1A]">{filtered.length}</span>개 대회</p>

      {/* 빈 결과 */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-semibold text-[#1A1A1A] mb-1">조건에 맞는 대회가 없습니다</p>
          <p className="text-sm text-[#717171] mb-5">필터를 조정하거나 검색어를 바꿔보세요</p>
          <button onClick={reset} className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold">초기화</button>
        </div>
      )}

      {/* 그리드 — 전체탭 */}
      {tab === 'all' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-8">
          {filtered.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      )}

      {/* 리스트 — 이번달·이번주 */}
      {tab !== 'all' && (
        <div className="divide-y divide-[#E5E5E5]">
          {filtered.length === 0 ? null : filtered.map(e => <EventCardHorizontal key={e.id} event={e} />)}
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1120px] mx-auto px-5 mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => <EventCardSkeleton key={i} />)}
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}
