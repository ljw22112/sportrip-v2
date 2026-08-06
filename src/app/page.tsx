'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { KoreaMap } from '@/components/events/KoreaMap';
import { EventRow } from '@/components/events/EventRow';
import { EVENTS } from '@/lib/data';
import { getWeekRange, getMonthRange } from '@/lib/utils';

const CHIPS = [
  { label: '전체',    icon: '⊕',  sport: '' },
  { label: '마라톤',  icon: '🏃',  sport: '마라톤' },
  { label: '러닝',    icon: '💨',  sport: '마라톤' },
  { label: '자전거',  icon: '🚴',  sport: '사이클' },
  { label: '축구',    icon: '⚽',  sport: '축구' },
  { label: '배드민턴', icon: '🏸', sport: '배드민턴' },
  { label: '수영',    icon: '🏊',  sport: '수영' },
  { label: '테니스',  icon: '🎾',  sport: '테니스' },
  { label: '트레일',  icon: '🏔️',  sport: '기타' },
];

const QUICK = [
  { label: '이번 주말', param: 'period=weekend' },
  { label: '다음 달',   param: 'period=nextmonth' },
  { label: '내 지역',   param: 'myloc=1' },
  { label: '축제와 함께', param: 'festival=1' },
];

const SPORTS_LIST = ['전체','마라톤','배드민턴','수영','축구','테니스','사이클','골프','야구','농구','배구','태권도','기타'];
const DATE_LIST   = ['전체 기간','이번 주','이번 달','다음 달','3개월 이내','6개월 이내'];

export default function HomePage() {
  const router = useRouter();
  const [activeChip, setActiveChip] = useState('');
  const [keyword, setKeyword] = useState('');
  const [date, setDate]   = useState('전체 기간');
  const [sport, setSport] = useState('전체');
  const [dateOpen,  setDateOpen]  = useState(false);
  const [sportOpen, setSportOpen] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (sport !== '전체') params.set('sport', sport);
    router.push(`/events?${params.toString()}`);
    setDateOpen(false); setSportOpen(false);
  };

  // 섹션별 대회 필터
  const upcoming = EVENTS.filter(e => e.status !== 'done').slice(0, 20);
  const { start: ws, end: we } = getWeekRange();
  const { start: ms, end: me } = getMonthRange();
  const thisWeek  = EVENTS.filter(e => e.start >= ws && e.start <= we);
  const thisMonth = EVENTS.filter(e => e.start >= ms && e.start <= me);

  return (
    <div className="max-w-[1120px] mx-auto px-5">

      {/* ── 종목 칩 ── */}
      <div className="flex gap-0 overflow-x-auto no-scrollbar border-b border-[#E5E5E5] -mx-5 px-5 mb-6">
        {CHIPS.map(({ label, icon, sport: s }) => {
          const active = activeChip === label || (label === '전체' && !activeChip);
          return (
            <Link key={label} href={s ? `/events?sport=${s}` : '/events'}
              onClick={() => setActiveChip(label === '전체' ? '' : label)}
              className={`flex flex-col items-center gap-1.5 px-5 py-3 flex-shrink-0 border-b-2 transition-all text-xs font-medium whitespace-nowrap
                ${active ? 'border-[#1A1A1A] text-[#1A1A1A] opacity-100' : 'border-transparent text-[#717171] opacity-70 hover:opacity-100'}`}>
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* ── 검색바 ── */}
      <div className="flex items-stretch border border-[#D0D0D0] rounded-2xl overflow-hidden shadow-sm mb-3">
        <div className="flex-1 px-5 py-3.5 min-w-0">
          <div className="text-[11px] font-semibold text-[#1A1A1A] mb-1">지역</div>
          <input value={keyword} onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="지역명 또는 문장으로 검색"
            className="w-full text-sm text-[#717171] bg-transparent outline-none placeholder:text-[#AAAAAA]" />
        </div>
        <div className="w-px bg-[#E5E5E5] my-3" />
        <div className="relative px-5 py-3.5 min-w-[140px]">
          <div className="text-[11px] font-semibold text-[#1A1A1A] mb-1">날짜</div>
          <button onClick={() => { setDateOpen(v => !v); setSportOpen(false); }}
            className="flex items-center gap-2 text-sm text-[#717171] w-full text-left">
            {date}
            <svg className="w-3.5 h-3.5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {dateOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#E5E5E5] rounded-xl shadow-lg w-44 py-1 z-50">
              {DATE_LIST.map(d => (
                <button key={d} onClick={() => { setDate(d); setDateOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#F7F7F7] ${date === d ? 'font-semibold text-[#1A3A2A]' : 'text-[#1A1A1A]'}`}>{d}</button>
              ))}
            </div>
          )}
        </div>
        <div className="w-px bg-[#E5E5E5] my-3" />
        <div className="relative px-5 py-3.5 min-w-[120px]">
          <div className="text-[11px] font-semibold text-[#1A1A1A] mb-1">종목</div>
          <button onClick={() => { setSportOpen(v => !v); setDateOpen(false); }}
            className="flex items-center gap-2 text-sm text-[#717171] w-full text-left">
            {sport}
            <svg className="w-3.5 h-3.5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {sportOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#E5E5E5] rounded-xl shadow-lg w-40 py-1 z-50 max-h-64 overflow-y-auto">
              {SPORTS_LIST.map(s => (
                <button key={s} onClick={() => { setSport(s); setSportOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#F7F7F7] ${sport === s ? 'font-semibold text-[#1A3A2A]' : 'text-[#1A1A1A]'}`}>{s}</button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center px-3">
          <button onClick={handleSearch}
            className="w-10 h-10 bg-[#1E4D2B] hover:bg-[#1A3A2A] rounded-full flex items-center justify-center transition-colors">
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* 힌트 */}
      <p className="text-xs text-[#717171] text-center mb-10">
        문장으로 적어도 됩니다 — 예: <span className="font-semibold text-[#1A1A1A]">"11월 부산 마라톤"</span>을 그대로 입력해 보세요.
      </p>

      {/* ── 히어로 카피 ── */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] leading-tight mb-3">
          대회 보러 가는 길,<br />
          <span className="relative inline-block">
            <span className="relative z-10">그 지역까지 즐기고 오세요</span>
            <span className="absolute bottom-0 left-0 right-0 h-3 bg-[#D4FF4A] -z-0 rounded-sm" />
          </span>
        </h1>
        <p className="text-sm text-[#717171] max-w-md mx-auto leading-relaxed mb-6">
          전국 스포츠 대회 일정과 개최지 주변 관광지·맛집·숙소,<br />
          같은 기간 열리는 지역 축제까지 한곳에서 확인하세요.
        </p>
        {/* 퀵 필터 */}
        <div className="flex flex-wrap gap-2 justify-center">
          {QUICK.map(({ label, param }) => (
            <Link key={label} href={`/events?${param}`}
              className="px-4 py-2 border border-[#D0D0D0] rounded-full text-sm font-medium text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F7F7F7] transition-all">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── 대회 카드 섹션 3개 (샘플과 동일) ── */}
      <div className="mt-12">
        <EventRow title="전체 대회" href="/events" events={upcoming} />
        <EventRow title="이번달의 대회" href="/events?tab=month" events={thisMonth.length > 0 ? thisMonth : upcoming.slice(0, 10)} />
        <EventRow title="이번주의 대회" href="/events?tab=week" events={thisWeek.length > 0 ? thisWeek : upcoming.slice(0, 6)} />
      </div>

      {/* ── 지도로 한눈에 보기 ── */}
      <div className="mt-6 mb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#1A1A1A]">지도로 한눈에 보기</h2>
          <Link href="/events" className="flex items-center gap-1 text-sm font-medium text-[#717171] hover:text-[#1A1A1A] transition-colors">
            로 보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </Link>
        </div>
        <div className="border border-[#E5E5E5] rounded-2xl overflow-hidden relative" style={{ height: '440px' }}>
          <KoreaMap events={EVENTS} className="w-full h-full" />
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            <button className="w-8 h-8 bg-white border border-[#E5E5E5] rounded-lg flex items-center justify-center text-lg font-light text-[#1A1A1A] hover:bg-[#F7F7F7] shadow-sm">+</button>
            <button className="w-8 h-8 bg-white border border-[#E5E5E5] rounded-lg flex items-center justify-center text-lg font-light text-[#1A1A1A] hover:bg-[#F7F7F7] shadow-sm">−</button>
          </div>
        </div>
      </div>

      {/* 드롭다운 닫기 */}
      {(dateOpen || sportOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setDateOpen(false); setSportOpen(false); }} />
      )}
    </div>
  );
}
