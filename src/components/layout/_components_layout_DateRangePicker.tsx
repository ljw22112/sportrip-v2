'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  from: string; // YYYY-MM-DD or ''
  to: string;
  onChange: (from: string, to: string) => void;
}

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function short(ds: string) {
  const [,m,d] = ds.split('-');
  return `${parseInt(m)}.${parseInt(d)}`;
}

export function DateRangePicker({ from, to, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(() => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), 1); });
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => { setDraftFrom(from); setDraftTo(to); }, [from, to]);

  const year = cur.getFullYear();
  const month = cur.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  const handlePick = (ds: string) => {
    if (!draftFrom || (draftFrom && draftTo)) {
      // 새 선택 시작
      setDraftFrom(ds); setDraftTo('');
    } else {
      // 두번째 클릭 — 범위 완성
      if (ds < draftFrom) { setDraftTo(draftFrom); setDraftFrom(ds); }
      else setDraftTo(ds);
    }
  };

  const label = from && to ? `${short(from)} - ${short(to)}` : from ? `${short(from)} ~` : '전체 기간';

  return (
    <div className="relative" ref={wrapRef}>
      <button type="button" onClick={() => setOpen(v => !v)}
        className="text-[15px] text-[#717171] bg-transparent outline-none cursor-pointer text-left w-full">
        {label}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border-2 border-[#DDDDDD] rounded-2xl shadow-xl z-50 p-4 w-[300px]">
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={() => setCur(new Date(year, month - 1, 1))}
              className="p-1 rounded hover:bg-[#F0F0F0]"><ChevronLeft className="w-4 h-4"/></button>
            <span className="font-bold text-[14px]">{year}년 {month + 1}월</span>
            <button type="button" onClick={() => setCur(new Date(year, month + 1, 1))}
              className="p-1 rounded hover:bg-[#F0F0F0]"><ChevronRight className="w-4 h-4"/></button>
          </div>
          <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#AAAAAA] mb-1">
            {['일','월','화','수','목','금','토'].map(d=><div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i}/>;
              const ds = fmt(new Date(year, month, day));
              const isFrom = ds === draftFrom;
              const isTo = ds === draftTo;
              const inRange = draftFrom && draftTo && ds > draftFrom && ds < draftTo;
              return (
                <button key={i} type="button" onClick={() => handlePick(ds)}
                  className={`h-8 text-[13px] rounded-full font-semibold transition-colors
                    ${isFrom || isTo ? 'bg-[#0B5C43] text-white' : inRange ? 'bg-[#E7F1EC] text-[#0B5C43]' : 'hover:bg-[#F0F0F0] text-[#333]'}`}>
                  {day}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-[#F0F0F0]">
            <button type="button" onClick={() => { setDraftFrom(''); setDraftTo(''); onChange('', ''); setOpen(false); }}
              className="text-[13px] font-bold underline text-[#717171]">초기화</button>
            <button type="button"
              onClick={() => { onChange(draftFrom, draftTo || draftFrom); setOpen(false); }}
              className="bg-[#0B5C43] text-white px-4 py-2 rounded-xl text-[13px] font-bold">적용</button>
          </div>
        </div>
      )}
    </div>
  );
}