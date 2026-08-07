/**
 * 스포트립 대회 데이터 자동 수집
 * 소스: 공공데이터포털 - 전국대회정보 표준데이터
 * API: tn_pubr_public_national_competition_information_api
 * 실행: node scripts/fetch-events.js
 */
'use strict';

const fs   = require('fs');
const path = require('path');

// ── 설정 ──────────────────────────────────────────────────
const API_KEY   = process.env.DATA_GO_KR_KEY;       // GitHub Secret
const ENDPOINT  = 'https://api.data.go.kr/openapi/tn_pubr_public_national_competition_information_api';
const PAGE_SIZE = 100;
const DATA_PATH = path.join(__dirname, '../src/lib/data.ts');

if (!API_KEY) {
  console.error('❌ DATA_GO_KR_KEY 환경변수가 없습니다.');
  console.error('   GitHub Secrets에 DATA_GO_KR_KEY를 등록해 주세요.');
  process.exit(1);
}

// ── 지역 추출 ──────────────────────────────────────────────
const REGIONS = ['서울','부산','대구','인천','광주','대전','울산','세종',
                 '경기','강원','충북','충남','전북','전남','경북','경남','제주'];

function extractRegion(venueNm = '', compNm = '') {
  const text = venueNm + ' ' + compNm;
  return REGIONS.find(r => text.includes(r)) || '기타';
}

// ── 종목 추출 ──────────────────────────────────────────────
const SPORT_KEYWORDS: [string, string][] = [
  ['마라톤','마라톤'], ['달리기','러닝'], ['러닝','러닝'], ['육상','마라톤'],
  ['자전거','사이클'], ['사이클','사이클'], ['철인','기타'],
  ['수영','수영'], ['오픈워터','수영'],
  ['축구','축구'], ['풋살','축구'],
  ['배드민턴','배드민턴'],
  ['테니스','테니스'],
  ['농구','농구'], ['배구','배구'], ['야구','야구'],
  ['태권도','태권도'], ['유도','유도'], ['씨름','기타'],
  ['트레일','기타'], ['등산','기타'], ['클라이밍','기타'],
  ['골프','골프'], ['볼링','기타'], ['탁구','기타'],
  ['사격','기타'], ['양궁','기타'], ['역도','기타'],
  ['체육','종합'], ['종합','종합'],
];

function extractSport(compNm = '') {
  for (const [kw, sport] of SPORT_KEYWORDS) {
    if (compNm.includes(kw)) return sport;
  }
  return '종합';
}

const SPORT_ICON: Record<string,string> = {
  마라톤:'🏃',러닝:'💨',사이클:'🚴',축구:'⚽',배드민턴:'🏸',
  수영:'🏊',테니스:'🎾',종합:'🏅',기타:'🏆',농구:'🏀',
  배구:'🏐',야구:'⚾',태권도:'🥋',유도:'🥋',골프:'⛳',
};

// ── 좌표 (지역 중심) ──────────────────────────────────────
const REGION_COORDS: Record<string,[number,number]> = {
  서울:[37.566,126.978],부산:[35.179,129.075],대구:[35.871,128.601],
  인천:[37.456,126.705],광주:[35.159,126.852],대전:[36.350,127.384],
  울산:[35.538,129.311],세종:[36.480,127.289],경기:[37.275,127.009],
  강원:[37.822,128.155],충북:[36.635,127.491],충남:[36.658,126.672],
  전북:[35.717,127.153],전남:[34.816,126.462],경북:[36.576,128.505],
  경남:[35.237,128.692],제주:[33.499,126.531],기타:[36.500,127.500],
};

// ── 날짜 포맷 (YYYYMMDD → YYYY-MM-DD) ────────────────────
function toDate(raw = '') {
  const s = raw.replace(/\D/g,'');
  if (s.length === 8) return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
  return '';
}

// ── status 계산 ────────────────────────────────────────────
function calcStatus(start: string, end: string) {
  const today = new Date().toISOString().slice(0,10);
  if (end < today)    return 'done';
  if (start <= today) return 'ongoing';
  return 'upcoming';
}

// ── API 호출 (한 페이지) ──────────────────────────────────
async function fetchPage(pageNo: number) {
  const url = new URL(ENDPOINT);
  url.searchParams.set('serviceKey', API_KEY);
  url.searchParams.set('pageNo',     String(pageNo));
  url.searchParams.set('numOfRows',  String(PAGE_SIZE));
  url.searchParams.set('type',       'json');

  const res = await fetch(url.toString(), {
    signal: AbortSignal.timeout(15000),
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  const body  = json?.response?.body;
  const items = body?.items ?? [];
  const total = body?.totalCount ?? 0;

  return {
    items: Array.isArray(items) ? items : [items].filter(Boolean),
    total,
  };
}

// ── 전체 페이지 수집 ──────────────────────────────────────
async function fetchAll() {
  console.log('📡 API 호출 중 (1페이지)...');
  const first = await fetchPage(1);
  console.log(`   전체 데이터: ${first.total}건`);

  const all = [...first.items];
  const totalPages = Math.ceil(first.total / PAGE_SIZE);

  for (let p = 2; p <= Math.min(totalPages, 20); p++) {
    process.stdout.write(`   ${p}/${totalPages} 페이지 수집 중...\r`);
    try {
      const { items } = await fetchPage(p);
      all.push(...items);
      await new Promise(r => setTimeout(r, 200)); // rate limit
    } catch (e) {
      console.warn(`\n   ⚠️  ${p}페이지 실패: ${e.message}`);
    }
  }
  console.log(`\n✅ 수집 완료: ${all.length}건`);
  return all;
}

// ── data.ts 에 병합 ───────────────────────────────────────
function merge(rawItems: any[]) {
  const src = fs.readFileSync(DATA_PATH, 'utf-8');

  // 기존 최대 ID
  const ids = [...src.matchAll(/\{id:(\d+),/g)].map(m => +m[1]);
  let nextId = ids.length ? Math.max(...ids) + 1 : 400;

  // 기존 대회명 (중복 방지)
  const existingTitles = new Set(
    [...src.matchAll(/title:'([^']+)'/g)].map(m => m[1])
  );

  const today = new Date().toISOString().slice(0,10);
  // 2주 전 날짜 (이미 끝난 대회 제외)
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);
  const cutoffStr = cutoff.toISOString().slice(0,10);

  const lines: string[] = [];
  let skipped = 0;

  for (const item of rawItems) {
    // ── 필드 매핑 (API 항목명 기준) ──
    const title   = (item.compNm        || item.대회명       || '').trim();
    const venueNm = (item.compSitNm     || item.대회개최지명  || '').trim();
    const org     = (item.suprInstNm    || item.주관기관명   || '').trim();
    const startRaw= (item.compStartDt   || item.대회시작일자  || '');
    const endRaw  = (item.compEndDt     || item.대회종료일자  || '');
    const siteUrl = (item.hmpgAddr      || item.홈페이지주소  || '').trim();
    const tel     = (item.inquiryPhone  || item.문의처전화번호|| '').trim();

    if (!title || title.length < 2) { skipped++; continue; }

    const start = toDate(startRaw);
    const end   = toDate(endRaw) || start;

    if (!start) { skipped++; continue; }
    // 너무 오래된 대회 제외
    if (end && end < cutoffStr) { skipped++; continue; }

    // 중복 체크
    if (existingTitles.has(title)) { skipped++; continue; }

    const region  = extractRegion(venueNm, title);
    const sport   = extractSport(title);
    const coords  = REGION_COORDS[region] || REGION_COORDS['기타'];
    const status  = calcStatus(start, end);
    const icon    = SPORT_ICON[sport] || '🏆';
    const desc    = `${title}. 주관: ${org||'미확인'}. ${venueNm||region} 개최.`;

    const safe = (s: string) => s.replace(/\\/g,'\\\\').replace(/'/g,"\\'");

    lines.push(
      `  {id:${nextId++},title:'${safe(title)}',sport:'${sport}',icon:'${icon}',` +
      `venue:'${safe(venueNm||region+' 경기장')}',address:'${safe(region)}',` +
      `start:'${start}',end:'${end}',status:'${status}',region:'${region}',` +
      `desc:'${safe(desc)}',url:'${safe(siteUrl)}',` +
      `participants:'미정',lat:${coords[0]},lng:${coords[1]},distances:''},`
    );
    existingTitles.add(title);
  }

  console.log(`\n📊 처리 결과: 추가 ${lines.length}건 / 제외 ${skipped}건`);

  if (lines.length === 0) {
    console.log('ℹ️  새로 추가할 대회 없음');
    return 0;
  }

  const stamp   = new Date().toLocaleString('ko-KR', {timeZone:'Asia/Seoul'});
  const comment = `\n  // ── 자동 수집: ${stamp} (공공데이터포털 전국대회정보) ──\n`;
  const insert  = src.lastIndexOf('];');
  const updated = src.slice(0, insert) + comment + lines.join('\n') + '\n' + src.slice(insert);

  fs.writeFileSync(DATA_PATH, updated, 'utf-8');
  console.log(`✅ data.ts 업데이트 완료 (+${lines.length}건)`);
  return lines.length;
}

// ── 메인 ──────────────────────────────────────────────────
(async () => {
  console.log('🏃 스포트립 대회 데이터 자동 수집');
  console.log(`📅 ${new Date().toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})}\n`);

  try {
    const items = await fetchAll();
    const added = merge(items);
    process.exit(added > 0 ? 0 : 2);
  } catch (err: any) {
    console.error('❌ 오류:', err.message);
    process.exit(1);
  }
})();
