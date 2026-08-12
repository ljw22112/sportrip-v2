'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SPORTS_15 } from '@/lib/sports';
import { SportEvent } from '@/types';

const REGIONS = ['전체','서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'];
const PERIODS = [
  { label:'전체 기간', value:'' },
  { label:'이번달', value:'month' },
  { label:'2개월 이내', value:'2month' },
  { label:'3개월 이내', value:'3month' },
  { label:'6개월 이내', value:'6month' },
];

interface Props { events: SportEvent[]; }

export function WizardSearch({ events }: Props) {
  const router = useRouter();
  const [sport, setSport] = useState('');
  const [region, setRegion] = useState('');
  const [period, setPeriod] = useState('');

  const matchCount = useMemo(() => {
    const today = new Date();
    return events.filter(e => {
      if (e.status === 'done') return false;
      if (sport && e.sport !== sport) return false;
      if (region && region !== '전체' && e.region !== region) return false;
      if (period) {
        const months = period === 'month' ? 1 : period === '2month' ? 2 : period === '3month' ? 3 : 6;
        const limit = new Date(today);
        limit.setMonth(today.getMonth() + months);
        if (new Date(e.start) > limit) return false;
      }
      return true;
    }).length;
  }, [events, sport, region, period]);

  const handleSearch = () => {
    const p = new URLSearchParams();
    if (sport) p.set('sport', sport);
    if (region && region !== '전체') p.set('region', region);
    if (period === 'month') p.set('tab', 'month');
    router.push('/events?' + p.toString());
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 items-end">
      {/* 종목 선택 */}
      <div className="flex-1">
        <div className="text-[11px] font-bold text-white/60 mb-2">① 어떤 종목?</div>
        <div className="flex flex-wrap gap-1.5">
          {SPORTS_15.filter(s => s.key !== '전체').map(sp => {
            const active = sport === sp.key;
            return (
              <button key={sp.key}
                onClick={() => setSport(active ? '' : sp.key)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all',
                  active
                    ? 'bg-[#D6F14E] border-[#D6F14E] text-[#1A2E0A]'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                ].join(' ')}>
                <img src={sp.icon} alt={sp.label}
                  className={['w-4 h-4 object-contain', active ? '' : 'brightness-0 invert'].join(' ')}/>
                {sp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 지역 + 기간 + 버튼 */}
      <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-[200px]">
        <div>
          <div className="text-[11px] font-bold text-white/60 mb-1.5">② 어느 지역?</div>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2.5 text-[14px] outline-none cursor-pointer">
            {REGIONS.map(r => (
              <option key={r} value={r === '전체' ? '' : r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <div className="text-[11px] font-bold text-white/60 mb-1.5">③ 언제?</div>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2.5 text-[14px] outline-none cursor-pointer">
            {PERIODS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="w-full py-3 bg-[#D6F14E] text-[#1A2E0A] font-extrabold rounded-xl text-[15px] hover:opacity-90 transition-opacity">
          {matchCount > 0 ? matchCount + '개 대회 찾기 →' : '대회 찾기 →'}
        </button>
      </div>
    </div>
  );
}
