'use strict';
const fs   = require('fs');
const path = require('path');

const API_KEY   = process.env.DATA_GO_KR_KEY;
const ENDPOINT  = 'https://api.data.go.kr/openapi/tn_pubr_public_national_competition_information_api';
const PAGE_SIZE = 100;
const DATA_PATH = path.join(__dirname, '../src/lib/data.ts');

if (!API_KEY) { console.error('❌ DATA_GO_KR_KEY 없음'); process.exit(1); }

const REGIONS = ['서울','부산','대구','인천','광주','대전','울산','세종',
                 '경기','강원','충북','충남','전북','전남','경북','경남','제주'];

const SPORT_KEYWORDS = [
  ['마라톤','마라톤'],['달리기','러닝'],['러닝','러닝'],['육상','마라톤'],
  ['로드레이스','마라톤'],['자전거','사이클'],['사이클','사이클'],['철인','기타'],
  ['수영','수영'],['오픈워터','수영'],
  ['축구','축구'],['풋살','축구'],['배드민턴','배드민턴'],['테니스','테니스'],
  ['농구','농구'],['배구','배구'],['야구','야구'],
  ['태권도','태권도'],['유도','유도'],['씨름','기타'],
  ['트레일','기타'],['등산','기타'],['클라이밍','기타'],
  ['골프','골프'],['볼링','기타'],['탁구','기타'],['검도','기타'],
  ['체육','종합'],['종합','종합'],
];

const SPORT_ICON = {
  마라톤:'🏃',러닝:'💨',사이클:'🚴',축구:'⚽',배드민턴:'🏸',
  수영:'🏊',테니스:'🎾',종합:'🏅',기타:'🏆',농구:'🏀',
  배구:'🏐',야구:'⚾',태권도:'🥋',유도:'🥋',골프:'⛳',
};

const REGION_COORDS = {
  서울:[37.566,126.978],부산:[35.179,129.075],대구:[35.871,128.601],
  인천:[37.456,126.705],광주:[35.159,126.852],대전:[36.350,127.384],
  울산:[35.538,129.311],세종:[36.480,127.289],경기:[37.275,127.009],
  강원:[37.822,128.155],충북:[36.635,127.491],충남:[36.658,126.672],
  전북:[35.717,127.153],전남:[34.816,126.462],경북:[36.576,128.505],
  경남:[35.237,128.692],제주:[33.499,126.531],기타:[36.500,127.500],
};

function extractRegion(venueTxt, titleTxt) {
  const text = (venueTxt||'') + ' ' + (titleTxt||'');
  return REGIONS.find(r => text.includes(r)) || '기타';
}

function extractSport(title) {
  for (const [kw, sport] of SPORT_KEYWORDS) {
    if ((title||'').includes(kw)) return sport;
  }
  return '종합';
}

function calcStatus(start, end) {
  const today = new Date().toISOString().slice(0,10);
  if ((end||start) < today) return 'done';
  if (start <= today) return 'ongoing';
  return 'upcoming';
}

// ── API 한 페이지 호출 ────────────────────────────────────
async function fetchPage(pageNo) {
  const url = new URL(ENDPOINT);
  url.searchParams.set('serviceKey', API_KEY);
  url.searchParams.set('pageNo',     String(pageNo));
  url.searchParams.set('numOfRows',  String(PAGE_SIZE));
  url.searchParams.set('type',       'json');

  const res = await fetch(url.toString(), {
    signal: AbortSignal.timeout(20000),
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  // 실제 응답 구조: json.header / json.body (response 래퍼 없음)
  const header = json?.header || json?.response?.header;
  const body   = json?.body   || json?.response?.body;

  if (!header || header.resultCode !== '00') {
    throw new Error(`API resultCode: ${header?.resultCode} / ${header?.resultMsg}`);
  }

  // items: body.items.item (배열 or 단일 객체)
  const raw = body?.items?.item ?? body?.items ?? [];
  const items = Array.isArray(raw) ? raw : (raw ? [raw] : []);
  const total = Number(body?.totalCount ?? 0);

  return { items, total };
}

// ── 전체 페이지 수집 ──────────────────────────────────────
async function fetchAll() {
  console.log('📡 1페이지 수집 중...');
  const first = await fetchPage(1);
  console.log(`   전체: ${first.total}건`);

  const all = [...first.items];
  const totalPages = Math.ceil(first.total / PAGE_SIZE);

  for (let p = 2; p <= Math.min(totalPages, 30); p++) {
    process.stdout.write(`   ${p}/${totalPages} 페이지...\r`);
    try {
      const { items } = await fetchPage(p);
      all.push(...items);
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.warn(`\n   ⚠️  ${p}페이지 오류: ${e.message}`);
    }
  }
  console.log(`\n✅ 수집 완료: ${all.length}건`);
  return all;
}

// ── data.ts 병합 ──────────────────────────────────────────
function merge(rawItems) {
  const src = fs.readFileSync(DATA_PATH, 'utf-8');
  const ids  = [...src.matchAll(/\{id:(\d+),/g)].map(m => +m[1]);
  let nextId = ids.length ? Math.max(...ids) + 1 : 500;

  const existingTitles = new Set(
    [...src.matchAll(/title:'([^']+)'/g)].map(m => m[1])
  );

  // 2주 전 이전 종료 대회 제외
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);
  const cutoffStr = cutoff.toISOString().slice(0,10);

  const lines = [];
  let skipped = 0;

  for (const item of rawItems) {
    // ── 실제 API 필드명 매핑 ──
    const title  = (item.cnfrnNm       || '').trim();
    const venue  = (item.cnfrnHdmtRgnNm|| '').trim();
    const org    = (item.sprvsnInstNm  || '').trim();
    const start  = (item.cnfrnBgngYmd  || '').trim(); // 이미 YYYY-MM-DD
    const end    = (item.cnfrnEndYmd   || start).trim();
    const url    = (item.hmpgAddr      || '').trim();

    if (!title || title.length < 2)    { skipped++; continue; }
    if (!start || start.length < 10)   { skipped++; continue; }
    if (end < cutoffStr)               { skipped++; continue; }
    if (existingTitles.has(title))     { skipped++; continue; }

    const region = extractRegion(venue, title);
    const sport  = extractSport(title);
    const coords = REGION_COORDS[region] || REGION_COORDS['기타'];
    const status = calcStatus(start, end);
    const icon   = SPORT_ICON[sport] || '🏆';
    const safe   = s => String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    const desc   = `${title}. 주관: ${org||'미확인'}.`;

    lines.push(
      `  {id:${nextId++},title:'${safe(title)}',sport:'${sport}',icon:'${icon}',` +
      `venue:'${safe(venue||region+' 경기장')}',address:'${safe(region)}',` +
      `start:'${start}',end:'${end}',status:'${status}',region:'${region}',` +
      `desc:'${safe(desc)}',url:'${safe(url)}',` +
      `participants:'미정',lat:${coords[0]},lng:${coords[1]},distances:''},`
    );
    existingTitles.add(title);
  }

  console.log(`📊 추가 ${lines.length}건 / 제외 ${skipped}건`);

  if (lines.length === 0) {
    console.log('ℹ️  새 대회 없음 — data.ts 변경 없음');
    return 0;
  }

  const stamp   = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const insert  = src.lastIndexOf('];');
  const updated = src.slice(0, insert)
    + `\n  // ── 공공데이터 자동 수집: ${stamp} ──\n`
    + lines.join('\n') + '\n'
    + src.slice(insert);

  fs.writeFileSync(DATA_PATH, updated, 'utf-8');
  console.log(`✅ data.ts 업데이트 (+${lines.length}건)`);
  return lines.length;
}

// ── 실행 ──────────────────────────────────────────────────
(async () => {
  console.log('🏃 스포트립 전국대회정보 자동 수집');
  console.log(`📅 ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}\n`);
  try {
    const items = await fetchAll();
    const added = merge(items);
    process.exit(added > 0 ? 0 : 2);
  } catch (err) {
    console.error('❌ 오류:', err.message);
    process.exit(1);
  }
})();
