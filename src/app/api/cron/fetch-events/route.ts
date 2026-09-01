import { NextRequest, NextResponse } from 'next/server';

const API_KEY    = process.env.DATA_GO_KR_KEY || '';
const GH_TOKEN   = process.env.GITHUB_TOKEN   || '';
const GH_REPO    = process.env.GITHUB_REPO    || 'ljw22112/sportrip-v2';
const CRON_SECRET = process.env.CRON_SECRET   || '';

const REGIONS = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'];
const REGION_COORDS: Record<string,[number,number]> = {
  서울:[37.5665,126.9780],부산:[35.1796,129.0756],대구:[35.8714,128.6014],
  인천:[37.4563,126.7052],광주:[35.1595,126.8526],대전:[36.3504,127.3845],
  울산:[35.5384,129.3114],세종:[36.4800,127.2890],경기:[37.4138,127.5183],
  강원:[37.8228,128.1555],충북:[36.6358,127.4914],충남:[36.5184,126.8000],
  전북:[35.7175,127.1530],전남:[34.8679,126.9910],경북:[36.4919,128.8889],
  경남:[35.4606,128.2132],제주:[33.4996,126.5312],기타:[36.5,127.5],
};
const SPORT_KEYWORDS: [string,string][] = [
  ['마라톤','마라톤'],['사이클','사이클'],['수영','수영'],['철인','종합'],
  ['테니스','테니스'],['배드민턴','배드민턴'],['축구','축구'],['농구','농구'],
  ['배구','배구'],['야구','야구'],['태권도','태권도'],['유도','유도'],
  ['골프','골프'],['육상','마라톤'],['러닝','러닝'],['트레일','트레일'],
];
const SPORT_ICON: Record<string,string> = {
  마라톤:'🏃',러닝:'💨',사이클:'🚴',축구:'⚽',배드민턴:'🏸',
  수영:'🏊',테니스:'🎾',트레일:'🏔️',농구:'🏀',배구:'🏐',
  야구:'⚾',태권도:'🥋',골프:'⛳',종합:'🏅',기타:'🏆',
};

const safe = (s: string) => String(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");
const extractRegion = (v: string, t: string) => REGIONS.find(r => ((v||'')+(t||'')).includes(r)) || '기타';
const extractSport  = (t: string) => SPORT_KEYWORDS.find(([kw]) => (t||'').includes(kw))?.[1] || '종합';
const calcStatus    = (s: string, e: string) => {
  const now = new Date().toISOString().slice(0,10);
  return e < now ? 'done' : s <= now ? 'ongoing' : 'upcoming';
};
const normalize = (t: string) => t.replace(/제\d+회|20\d\d년?/g,'').replace(/\s+/g,' ').trim();
const dedupKey  = (t: string, s: string, r: string) => normalize(t)+'|'+s+'|'+r;

async function fetchPage(p: number) {
  const url = `https://api.data.go.kr/openapi/tn_pubr_public_national_competition_information_api`
    + `?serviceKey=${encodeURIComponent(API_KEY)}&type=json&numOfRows=100&pageNo=${p}`;
  const res = await fetch(url, {
    cache:'no-store',
    headers:{'User-Agent':'Mozilla/5.0 (compatible; SpoTrip/1.0)','Accept':'application/json'},
    signal: AbortSignal.timeout(30000),
  });
  const json = await res.json();
  const body = json.response?.body || json.body;
  if (!body) throw new Error('API 응답 오류: ' + JSON.stringify(json).slice(0,100));
  const raw = body.items?.item || [];
  return { total: Number(body.totalCount||0), items: (Array.isArray(raw)?raw:[raw]).filter(Boolean) };
}

async function getDataTs() {
  const res = await fetch(`https://api.github.com/repos/${GH_REPO}/contents/src/lib/data.ts`,
    { headers:{'Authorization':`token ${GH_TOKEN}`,'User-Agent':'SpoTrip-Bot'} });
  const j = await res.json();
  return { sha:j.sha, src:Buffer.from(j.content,'base64').toString('utf-8') };
}

export async function GET(req: NextRequest) {
  // Vercel Cron은 자동으로 Authorization 헤더 추가
  // 브라우저 직접 접속도 허용 (테스트용)
  if (!API_KEY) return NextResponse.json({ error:'DATA_GO_KR_KEY 없음' }, { status:500 });
  if (!GH_TOKEN) return NextResponse.json({ error:'GITHUB_TOKEN 없음' }, { status:500 });

  try {
    const first = await fetchPage(0);
    let items = [...first.items];
    const pages = Math.min(Math.ceil(first.total/100), 10);
    for (let p = 1; p < pages; p++) {
      await new Promise(r => setTimeout(r, 300));
      items = items.concat((await fetchPage(p)).items);
    }

    const { sha, src } = await getDataTs();
    const ids = (src.match(/\{id:(\d+),/g)||[]).map(m=>+m.match(/\d+/)![0]);
    let nextId = ids.length ? Math.max(...ids)+1 : 500;

    const titles = new Set((src.match(/title:'([^']+)'/g)||[]).map(m=>m.slice(7,-1)));
    const keys   = new Set<string>();
    for (const m of src.matchAll(/title:'([^']+)'[^}]*start:'([^']+)'[^}]*region:'([^']+)'/g))
      keys.add(dedupKey(m[1],m[2],m[3]));

    const cutoff = new Date(); cutoff.setDate(cutoff.getDate()-14);
    const cutoffStr = cutoff.toISOString().slice(0,10);
    const lines: string[] = [];
    let skipped = 0;

    for (const item of items) {
      const title = (item.CNFRN_NM || item.cnfrnNm || '').trim();
      const venue = (item.CNFRN_HDMT_RGN_NM || item.cnfrnHdmtRgnNm || '').trim();
      const org   = (item.SPRVSN_INST_NM || item.sprvsnInstNm || '').trim();
      const start = (item.CNFRN_BGNG_YMD || item.cnfrnBgngYmd || '').trim();
      const end   = (item.CNFRN_END_YMD  || item.cnfrnEndYmd  || start).trim();
      const url   = (item.HMPG_ADDR      || item.hmpgAddr     || '').trim();
      if (!title||title.length<2||!start||start.length<8) { skipped++; continue; }
      if (end<cutoffStr) { skipped++; continue; }
      const rgn=extractRegion(venue,title), dk=dedupKey(title,start,rgn);
      if (titles.has(title)||keys.has(dk)) { skipped++; continue; }
      const sport=extractSport(title), coords=REGION_COORDS[rgn]||REGION_COORDS['기타'];
      lines.push(
        `  {id:${nextId++},title:'${safe(title)}',sport:'${sport}',icon:'${SPORT_ICON[sport]||'🏆'}',`+
        `venue:'${safe(venue||rgn)}',address:'${safe(rgn)}',start:'${start}',end:'${end}',`+
        `status:'${calcStatus(start,end)}',region:'${rgn}',`+
        `desc:'${safe(title)}. 주관: ${safe(org||'미확인')}.',url:'${safe(url)}',`+
        `participants:'미정',lat:${coords[0]},lng:${coords[1]},distances:''},`
      );
      titles.add(title); keys.add(dk);
    }

    if (!lines.length)
      return NextResponse.json({ ok:true, message:`신규 없음 (제외 ${skipped}건)`, added:0 });

    const insertPoint = src.lastIndexOf('];');
    const newSrc = src.slice(0,insertPoint) + lines.join('\n') + '\n' + src.slice(insertPoint);
    await fetch(`https://api.github.com/repos/${GH_REPO}/contents/src/lib/data.ts`,{
      method:'PUT',
      headers:{'Authorization':`token ${GH_TOKEN}`,'User-Agent':'SpoTrip-Bot','Content-Type':'application/json'},
      body:JSON.stringify({
        message:`chore: 전국대회정보 자동 업데이트 ${new Date().toISOString().slice(0,10)} +${lines.length}건`,
        content:Buffer.from(newSrc).toString('base64'), sha,
      }),
    });

    return NextResponse.json({ ok:true, added:lines.length, skipped, total:items.length });
  } catch(e:any) {
    return NextResponse.json({ ok:false, error:e.message }, { status:500 });
  }
}
