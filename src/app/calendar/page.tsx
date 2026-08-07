'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EVENTS, getDynamicEvents } from '@/lib/data';
import { Header } from '@/components/layout/Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SPORT_HUE: Record<string,number> = {마라톤:158,러닝:174,자전거:96,축구:140,배드민턴:200,수영:210,테니스:80,트레일:120,종합:150,기타:155};
const REGION_COLOR: Record<string,string> = {
  서울:'#1a5276',부산:'#1a5276',경기:'#1a5276',
  강원:'#145a32',경남:'#145a32',전남:'#145a32',제주:'#145a32',
  대전:'#6e2f1a',충북:'#6e2f1a',충남:'#6e2f1a',
  경북:'#4a235a',전북:'#4a235a',광주:'#4a235a',
};

function getColor(region: string) {
  return REGION_COLOR[region] || '#34495e';
}

const DAYS = ['일','월','화','수','목','금','토'];
const MONTHS_KR = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

export default function CalendarPage() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  const prevMonth = () => { if (month === 0) { setYear(y => y-1); setMonth(11); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y+1); setMonth(0); } else setMonth(m => m+1); };

  // 이 달의 대회
  const dynEv = getDynamicEvents();
  const monthEvents = dynEv.filter(e => {
    const d = new Date(e.start);
    return d.getFullYear() === year && d.getMonth() === month;
  }).sort((a,b) => a.start.localeCompare(b.start));

  // 달력 격자 생성
  const firstDay = new Date(year, month, 1).getDay(); // 0=일
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  // 날짜별 이벤트 맵
  const eventMap: Record<number, typeof EVENTS> = {};
  monthEvents.forEach(e => {
    const day = new Date(e.start).getDate();
    if (!eventMap[day]) eventMap[day] = [];
    eventMap[day].push(e);
  });

  const todayStr = today.toISOString().slice(0,10);

  return (
    <>
      <Header showSearch />
      <main style={{ maxWidth: 1140, margin: '0 auto', padding: '20px 80px 60px' }}>
        {/* 브레드크럼 */}
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
          <Link href="/events" style={{ color: 'var(--green)', fontWeight: 600 }}>대회 일정</Link> › 캘린더
        </p>

        {/* 제목 */}
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 4 }}>
          {year}년 {MONTHS_KR[month]} 대회 일정
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 28 }}>
          전국 스포츠 대회 일정을 월간 캘린더로 확인하세요. 대회를 클릭하면 상세 정보를 볼 수 있어요.
        </p>

        {/* 캘린더 네비 */}
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 80px', borderBottom: '1px solid var(--line)' }}>
            <button onClick={prevMonth} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: 'var(--green)', border: 0, background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <ChevronLeft style={{ width: 16, height: 16 }} /> {month === 0 ? `${year-1}.12` : `${year}.${month}`}
            </button>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em' }}>{year}. {month+1}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
                style={{ border: '1.5px solid var(--line)', borderRadius: 8, padding: '5px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#fff', fontFamily: 'inherit' }}>
                오늘
              </button>
              <button onClick={nextMonth} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: 'var(--green)', border: 0, background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                {month === 11 ? `${year+1}.1` : `${year}.${month+2}`} <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>

          {/* 요일 헤더 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid var(--line)' }}>
            {DAYS.map((d, i) => (
              <div key={d} style={{ textAlign: 'center', padding: '10px 0', fontSize: 13, fontWeight: 700, color: i === 0 ? '#e74c3c' : i === 6 ? '#2980b9' : 'var(--ink)', borderRight: i < 6 ? '1px solid var(--line-soft)' : 'none' }}>
                {d}
              </div>
            ))}
          </div>

          {/* 날짜 격자 */}
          {(() => {
            const cells: React.ReactNode[] = [];

            // 이전 달
            for (let i = firstDay - 1; i >= 0; i--) {
              cells.push(
                <div key={`prev-${i}`} style={{ minHeight: 100, padding: '8px 6px', borderRight: '1px solid var(--line-soft)', borderBottom: '1px solid var(--line-soft)', background: 'var(--gray)' }}>
                  <span style={{ fontSize: 13, color: 'var(--faint)' }}>{prevDays - i}</span>
                </div>
              );
            }

            // 이번 달
            for (let day = 1; day <= daysInMonth; day++) {
              const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const isToday = dateStr === todayStr;
              const dow = new Date(year, month, day).getDay();
              const events = eventMap[day] || [];
              const MAX_SHOW = 3;
              const extra = events.length - MAX_SHOW;

              cells.push(
                <div key={day} style={{ minHeight: 100, padding: '8px 6px', borderRight: '1px solid var(--line-soft)', borderBottom: '1px solid var(--line-soft)', background: '#fff', position: 'relative' }}>
                  {/* 날짜 숫자 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 13, fontWeight: isToday ? 800 : 500,
                      color: isToday ? '#fff' : dow === 0 ? '#e74c3c' : dow === 6 ? '#2980b9' : 'var(--ink)',
                      background: isToday ? 'var(--green)' : 'none',
                      width: isToday ? 24 : 'auto', height: isToday ? 24 : 'auto',
                      borderRadius: isToday ? '50%' : 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{day}</span>
                  </div>

                  {/* 이벤트 칩 */}
                  {events.slice(0, MAX_SHOW).map((ev, i) => (
                    <Link key={i} href={`/events/${ev.id}`}
                      style={{ display: 'block', marginBottom: 2, padding: '2px 6px', borderRadius: 4, background: getColor(ev.region), color: '#fff', fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'none', lineHeight: 1.5 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.85, marginRight: 3, background: 'rgba(255,255,255,.2)', padding: '0 3px', borderRadius: 3 }}>{ev.region}</span>
                      {ev.title}
                    </Link>
                  ))}
                  {extra > 0 && (
                    <button onClick={() => {}} style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700, border: 0, background: 'none', cursor: 'pointer', padding: '1px 0', fontFamily: 'inherit' }}>
                      +{extra}개 더
                    </button>
                  )}
                </div>
              );
            }

            // 다음 달
            const remaining = 7 - (cells.length % 7);
            if (remaining < 7) {
              for (let i = 1; i <= remaining; i++) {
                cells.push(
                  <div key={`next-${i}`} style={{ minHeight: 100, padding: '8px 6px', borderRight: i < remaining ? '1px solid var(--line-soft)' : 'none', borderBottom: '1px solid var(--line-soft)', background: 'var(--gray)' }}>
                    <span style={{ fontSize: 13, color: 'var(--faint)' }}>{i}</span>
                  </div>
                );
              }
            }

            const rows: React.ReactNode[] = [];
            for (let i = 0; i < cells.length; i += 7) {
              rows.push(
                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
                  {cells.slice(i, i+7)}
                </div>
              );
            }
            return rows;
          })()}
        </div>

        {/* 이번 달 대회 목록 */}
        {monthEvents.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>
              {year}년 {MONTHS_KR[month]} 대회 목록 ({monthEvents.length}건)
            </h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {monthEvents.map(e => (
                <Link key={e.id} href={`/events/${e.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#fff', border: '1px solid var(--line)', borderRadius: 12, textDecoration: 'none', color: 'inherit', transition: 'box-shadow .15s' }}
                  className="cal-list-item">
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: getColor(e.region), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{new Date(e.start).getDate()}</span>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>{MONTHS_KR[new Date(e.start).getMonth()]}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{e.region} · {e.sport} · {e.participants}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', flexShrink: 0 }}>{e.start}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {monthEvents.length === 0 && (
          <div style={{ marginTop: 28, textAlign: 'center', padding: 40, background: '#fff', border: '1px dashed var(--line)', borderRadius: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📅</div>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>이 달에는 예정된 대회가 없습니다.</p>
          </div>
        )}
      </main>
      <style>{`.cal-list-item:hover{box-shadow:var(--shadow-1)}`}</style>
    </>
  );
}
