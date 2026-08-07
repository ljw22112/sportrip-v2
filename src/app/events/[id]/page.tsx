import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { EVENTS, calcDday } from '@/lib/data';
import { SPORT_SVG, getTourData, TourSpot } from '@/lib/courses';
import { ShareButton } from '@/components/events/ShareButton';
import { SaveButton } from '@/components/events/SaveButton';

interface Props { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return EVENTS.map(e => ({ id: String(e.id) }));
}
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const ev = EVENTS.find(e => e.id === Number(id));
  return { title: ev ? `${ev.title} — 스포트립` : '대회를 찾을 수 없습니다' };
}

function fmtDate(ds: string) {
  const [y, m, d] = ds.split('-').map(Number);
  const dow = '일월화수목금토'[new Date(Date.UTC(y, m-1, d)).getUTCDay()];
  return `${y}년 ${m}월 ${d}일 (${dow})`;
}

// 관광 카테고리 섹션
function TourSection({ title, icon, items }: { title: string; icon: string; items: TourSpot[] }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: '-.01em' }}>
        {icon} {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: 'var(--gray)', border: '1px solid var(--line-soft)', borderRadius: 12, padding: '14px 16px' }}>
            <b style={{ display: 'block', fontSize: 14, letterSpacing: '-.01em', marginBottom: 4 }}>{item.name}</b>
            {item.addr && <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{item.addr}</p>}
            {item.desc && <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</p>}
            {item.tel && <p style={{ fontSize: 12, color: 'var(--green)', marginTop: 4 }}>📞 {item.tel}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// 지도 (약식 SVG)
function MiniMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const x = ((lng - 125.6) / (129.9 - 125.6) * 350 + 25).toFixed(1);
  const y = ((38.8 - lat) / (38.8 - 33.0) * 500 + 30).toFixed(1);
  const vx = Math.max(0, parseFloat(x) - 60).toFixed(0);
  const vy = Math.max(0, parseFloat(y) - 40).toFixed(0);
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)', background: '#D8E4DA', aspectRatio: '16/6' }}>
      <svg viewBox={`${vx} ${vy} 120 80`} style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect x="-100" y="-100" width="1000" height="1000" fill="#D8E4DA" />
        <polygon points="86,17 87,18 90,22 93,26 93,31 97,35 98,41 96,46 98,51 98,57 96,62 93,67 90,73 87,77 84,80 81,83 77,86 74,88 71,89 68,89 65,88 62,86 59,83 56,80 54,77 52,73 51,69 50,65 49,61 49,57 49,53 50,49 51,45 52,41 53,37 55,33 57,29 59,25 61,21 64,17 67,14 70,12 73,11 76,11 79,12 82,14"
          fill="#EFF3EC" stroke="#B7C7BA" strokeWidth="1.5" />
        <circle cx={x} cy={y} r="5" fill="#E4572E" stroke="#fff" strokeWidth="2" />
        <text x={x} y={(parseFloat(y) - 9).toFixed(0)} textAnchor="middle" fontSize="7" fontWeight="700"
          fill="#14201A" style={{ paintOrder: 'stroke' }} stroke="#fff" strokeWidth="2.5">
          {name.length > 10 ? name.slice(0, 10) + '…' : name}
        </text>
      </svg>
    </div>
  );
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const ev = EVENTS.find(e => e.id === Number(id));
  if (!ev) notFound();

  const dday = calcDday(ev.start);
  const ddayNum = Math.ceil((new Date(ev.start).getTime() - Date.now()) / 86400000);
  const isDone = ev.status === 'done';
  const sportSvg = SPORT_SVG[ev.sport] || SPORT_SVG['기타'];
  const tour = getTourData(ev.region);

  // 히어로 카드 — 이미지2 우측 스타일
  const h = { 마라톤:158,러닝:174,자전거:96,축구:140,배드민턴:200,수영:210,테니스:80,트레일:120,종합:150,기타:155 }[ev.sport] || 150;
  function fmtShort(ds: string) {
    const [y,m,d] = ds.split('-').map(Number);
    const dow = '일월화수목금토'[new Date(Date.UTC(y,m-1,d)).getUTCDay()];
    return `${m}.${String(d).padStart(2,'0')} (${dow})`;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 뒤로가기 */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '14px 24px 0' }}>
        <Link href="/events" style={{ fontSize: 13, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          ← 검색 결과로 돌아가기
        </Link>
      </div>

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '12px 20px 60px' }}>
        {/* 브레드크럼 */}
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
          <Link href="/events" style={{ color: 'var(--green)', fontWeight: 600 }}>대회 목록</Link> · {ev.sport} · {ev.region}
        </p>

        {/* 제목 + 공유/저장 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 10 }}>
          <h1 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.3, flex: 1 }}>
            {ev.title}
          </h1>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <ShareButton />
            <SaveButton eventId={String(ev.id)} />
          </div>
        </div>

        {/* 필 배지 */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1.5px solid var(--line)', borderRadius: 999, fontSize: 12.5, fontWeight: 700, padding: '4px 12px' }}>
            {ev.sport}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1.5px solid var(--line)', borderRadius: 999, fontSize: 12.5, fontWeight: 700, padding: '4px 12px' }}>
            {ev.region} {ev.venue.split(' ')[0]}
          </span>
          {!isDone && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1.5px solid var(--signal)', borderRadius: 999, fontSize: 12.5, fontWeight: 700, padding: '4px 12px', color: 'var(--signal)', background: 'var(--signal-tint)' }}>
              D-{ddayNum <= 0 ? 'DAY' : ddayNum} · {fmtShort(ev.start)}
            </span>
          )}
        </div>

        {/* 히어로 배너 — 이미지2 우측 스타일 */}
        <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 28, aspectRatio: '16/5', background: `linear-gradient(135deg, hsl(${h} 45% 26%), hsl(${h+15} 50% 44%))`, position: 'relative' }}>
          {/* 배경 웨이브 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }} viewBox="0 0 800 250" preserveAspectRatio="xMidYMid slice">
            {[0.3,0.5,0.7].map((p,i) => <path key={i} d={`M-20 ${250*p} Q 300 ${250*(p-0.15)} 820 ${250*p}`} stroke="white" strokeWidth="2" fill="none"/>)}
          </svg>
          {/* 종목 아이콘 */}
          <div style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', opacity: 0.15 }}>
            <Image src={sportSvg} alt="" width={120} height={120} />
          </div>
          {/* 텍스트 */}
          <div style={{ position: 'relative', zIndex: 1, padding: '28px 36px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: `hsl(${h} 55% 90% / .8)`, letterSpacing: 2, marginBottom: 8 }}>
              2026 SPORTRIP · {ev.region}
            </div>
            <div style={{ width: 40, height: 5, background: '#D6F14E', borderRadius: 3, marginBottom: 14 }} />
            <h2 style={{ fontSize: 'clamp(20px,2.8vw,32px)', fontWeight: 800, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.2, marginBottom: 12 }}>
              {ev.title}
            </h2>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#D6F14E', letterSpacing: 1 }}>
              {fmtShort(ev.start)} · {ev.region} {ev.venue.split(' ')[0]}
            </div>
          </div>
        </div>

        {/* 2단 레이아웃 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 40, alignItems: 'start' }}>

          {/* 좌측 */}
          <div>
            {/* 대회 소개 */}
            <section style={{ marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid var(--line)' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.01em', marginBottom: 12 }}>대회 소개</h2>
              <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.7 }}>{ev.desc}</p>
            </section>

            {/* 대회 기본 정보 — 표 형태 */}
            <section style={{ marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid var(--line)' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.01em', marginBottom: 12 }}>대회 기본 정보</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['종목·거리', `${ev.sport}${ev.distances ? ' · ' + ev.distances : ''}`],
                    ['일시', fmtDate(ev.start)],
                    ['집합 장소', ev.venue],
                    ['주소', ev.address],
                    ['참가 규모', ev.participants],
                  ].map(([th, td]) => (
                    <tr key={th} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                      <th style={{ width: 110, padding: '12px 0', fontSize: 14, color: 'var(--muted)', fontWeight: 500, textAlign: 'left', verticalAlign: 'top', background: 'none' }}>{th}</th>
                      <td style={{ padding: '12px 0', fontSize: 14.5, fontWeight: 400, color: 'var(--ink)' }}>{td}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* 위치 (지도) */}
            <section style={{ marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid var(--line)' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.01em', marginBottom: 12 }}>위치</h2>
              <MiniMap lat={ev.lat} lng={ev.lng} name={ev.venue} />
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <a href={`https://map.kakao.com/link/search/${encodeURIComponent(ev.venue)}`} target="_blank" rel="noopener"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, background: '#FEE500', color: '#3C1E1E', padding: '8px 14px', borderRadius: 10 }}>
                  카카오맵
                </a>
                <a href={`https://map.naver.com/v5/search/${encodeURIComponent(ev.venue)}`} target="_blank" rel="noopener"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, background: '#03C75A', color: '#fff', padding: '8px 14px', borderRadius: 10 }}>
                  네이버지도
                </a>
              </div>
            </section>

            {/* 주최 & 공식사이트 */}
            <section style={{ marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid var(--line)' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.01em', marginBottom: 12 }}>주최</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--line-soft)' }}>
                    <th style={{ width: 110, padding: '12px 0', fontSize: 14, color: 'var(--muted)', fontWeight: 500, textAlign: 'left', background: 'none', verticalAlign: 'top' }}>주최 기관</th>
                    <td style={{ padding: '12px 0', fontSize: 14.5 }}>
                      {ev.url ? (
                        <a href={ev.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', fontWeight: 600 }}>공식 사이트 바로가기 ↗</a>
                      ) : (
                        <span style={{ color: 'var(--muted)' }}>공식 사이트 준비 중</span>
                      )}
                    </td>
                  </tr>
                  {ev.url && (
                    <tr>
                      <th style={{ width: 110, padding: '12px 0', fontSize: 14, color: 'var(--muted)', fontWeight: 500, textAlign: 'left', background: 'none' }}>공식 사이트</th>
                      <td style={{ padding: '12px 0', fontSize: 14.5 }}>
                        <a href={ev.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', wordBreak: 'break-all', fontSize: 13.5 }}>{ev.url}</a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            {/* 관광·축제 정보 — 카테고리별 */}
            <section>
              <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.01em', marginBottom: 4 }}>
                {ev.region} 주변 여행 정보
              </h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
                한국관광공사 TourAPI 기반 · 영업시간과 휴무는 방문 전 확인해 주세요.
              </p>

              <TourSection title="대회 기간에 열리는 지역 축제" icon="🎊" items={tour.festival} />
              <TourSection title="역사 관광지" icon="🏛️" items={tour.attraction} />
              <TourSection title="문화·레포츠 시설" icon="🎭" items={tour.culture} />
              <TourSection title="음식점" icon="🍽️" items={tour.food} />
              <TourSection title="숙박" icon="🏨" items={tour.hotel} />

              <p style={{ fontSize: 12, color: 'var(--faint)', marginTop: 12 }}>
                여행 정보 출처:{' '}
                <a href="https://korean.visitkorea.or.kr" target="_blank" rel="noopener" style={{ color: 'var(--green)', fontWeight: 600 }}>
                  대한민국 구석구석(한국관광공사) ↗
                </a>
              </p>
            </section>
          </div>

          {/* 우측 — 대회 한눈에 (sticky) */}
          <aside>
            <div style={{ position: 'sticky', top: 80, background: '#fff', border: '1.5px solid var(--line)', borderRadius: 20, boxShadow: '0 2px 6px rgba(20,32,26,.08),0 12px 32px rgba(20,32,26,.12)', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 16, letterSpacing: '-.01em', marginBottom: 4 }}>
                <Image src={sportSvg} alt={ev.sport} width={22} height={22} />
                대회 한눈에
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14 }}>
                일정과 장소를 확인하고, 주변 여행 정보와 함께 저장해 두세요.
              </p>

              {/* 정보 표 */}
              <div style={{ marginBottom: 14 }}>
                {[
                  ['종목', `${ev.sport}${ev.distances ? ' · ' + ev.distances : ''}`],
                  ['일시', `${fmtShort(ev.start)}`],
                  ['장소', ev.venue],
                  ['주소', ev.address],
                  ['남은 날짜', isDone ? '종료된 대회' : ddayNum <= 0 ? 'D-DAY' : `D-${ddayNum}`],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 13.5, borderBottom: '1px solid var(--line-soft)', padding: '8px 0' }}>
                    <span style={{ color: 'var(--muted)', flexShrink: 0 }}>{label}</span>
                    <b style={{ fontWeight: 600, textAlign: 'right', wordBreak: 'keep-all', color: label === '남은 날짜' && !isDone ? 'var(--signal)' : 'var(--ink)' }}>{value}</b>
                  </div>
                ))}
              </div>

              {/* 일행에게 공유 버튼 */}
              <ShareButton full />

              {ev.url && (
                <div style={{ marginTop: 10 }}>
                  <a href={ev.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', width: '100%', background: 'var(--green)', color: '#fff', fontWeight: 700, fontSize: 15, textAlign: 'center', padding: '13px 0', borderRadius: 12, textDecoration: 'none' }}>
                    공식 사이트 바로가기 ↗
                  </a>
                </div>
              )}
              {!ev.url && (
                <div style={{ marginTop: 10, padding: '12px', background: 'var(--gray)', borderRadius: 12, fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
                  공식 사이트 준비 중
                </div>
              )}

              <p style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 12, lineHeight: 1.5 }}>
                관광·축제 정보는 한국관광공사 TourAPI 자료를 기준으로 구성됩니다(현재는 샘플). 스포트립은 예매·접수를 다루지 않는 정보 서비스입니다.
              </p>
            </div>
          </aside>
        </div>

        {/* 비슷한 대회 */}
        {(() => {
          const related = EVENTS.filter(e => e.id !== ev.id && (e.region === ev.region || e.sport === ev.sport) && e.status !== 'done').slice(0, 4);
          if (!related.length) return null;
          return (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>비슷한 대회</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {related.map(e => (
                  <Link key={e.id} href={`/events/${e.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ aspectRatio: '4/3', borderRadius: 12, background: `linear-gradient(135deg, hsl(${SPORT_SVG[e.sport]?158:150} 45% 26%), hsl(${SPORT_SVG[e.sport]?173:165} 50% 44%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontSize: 36 }}>
                      {['🏃','🚴','⚽','🏸','🏊','🎾','🏔️','🏅','⚾','🏀','🏐','🥋'][Object.keys(SPORT_SVG).indexOf(e.sport)] || '🏆'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>{e.sport} · {e.region}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'monospace' }}>{e.start}</div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
