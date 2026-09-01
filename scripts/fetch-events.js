'use strict';
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const DATA_PATH = path.join(__dirname, '../src/lib/data.ts');
const API_KEY   = process.env.DATA_GO_KR_KEY || '';
const GH_TOKEN  = process.env.GITHUB_TOKEN   || '';
const GH_REPO   = process.env.GITHUB_REPO    || '';

if (!API_KEY) { console.error('❌ DATA_GO_KR_KEY 없음'); process.exit(1); }

// ── 지역·종목 분류 ──
const REGIONS = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'];
const REGION_COORDS = {
  서울:[37.5665,126.9780],부산:[35.1796,129.0756],대구:[35.8714,128.6014],
  인천:[37.4563,126.7052],광주:[35.1595,126.8526],대전:[36.3504,127.3845],
  울산:[35.5384,129.3114],세종:[36.4800,127.2890],경기:[37.4138,127.5183],
  강원:[37.8228,128.1555],충북:[36.6358,127.4914],충남:[36.5184,126.8000],
  전북:[35.7175,127.1530],전남:[34.8679,126.9910],경북:[36.4919,128.8889],
  경남:[35.4606,128.2132],제주:[33.4996,126.5312],기타:[36.5,127.5],
};
const SPORT_KEYWORDS = [
  ['마라톤','마라톤'],['사이클','사이클'],['수영','수영'],['철인','종합'],
  ['테니스','테니스'],['배드민턴','배드민턴'],['축구','축구'],['농구','농구'],
  ['배구','배구'],['야구','야구'],['태권도','태권도'],['유도','유도'],
  ['골프','골프'],['씨름','종합'],['볼링','종합'],['탁구','종합'],
  ['육상','마라톤'],['러닝','러닝'],['트레일','트레일'],
];
const SPORT_ICON = {
  마라톤:'🏃',러닝:'💨',사이클:'🚴',축구:'⚽',배드민턴:'🏸',
  수영:'🏊',테니스:'🎾',트레일:'🏔️',농구:'🏀',배구:'🏐',
  야구:'⚾',태권도:'🥋',골프:'⛳',종합:'🏅',기타:'🏆',
};

function safe(s) {
  return String(s || '').replace(/\\/g,'\\\\').replace(/'/g,"\\'");
}
function extractRegion(venue, title) {
  var text = (venue || '') + ' ' + (title || '');
  return REGIONS.find(function(r){ return text.includes(r); }) || '기타';
}
function extractSport(title) {
  for (var i = 0; i < SPORT_KEYWORDS.length; i++) {
    if ((title || '').includes(SPORT_KEYWORDS[i][0])) return SPORT_KEYWORDS[i][1];
  }
  return '종합';
}
function calcStatus(start, end) {
  var now = new Date().toISOString().slice(0,10);
  if (end < now) return 'done';
  if (start <= now) return 'ongoing';
  return 'upcoming';
}
function normalizeTitle(t) {
  return t.replace(/제\d+회|20\d\d년?|^(제\d+회\s*)?/,'').replace(/\s+/g,' ').trim();
}
function makeDedupKey(t, s, r) {
  return normalizeTitle(t) + '|' + s + '|' + r;
}

// ── HTTP 요청 ──
function fetchPage(pageNo) {
  return new Promise(function(resolve, reject) {
    var params = new URLSearchParams({
      numOfRows:'100', pageNo:String(pageNo - 1),
    });
    var url = 'https://api.data.go.kr/openapi/tn_pubr_public_national_competition_information_api'
            + '?serviceKey=' + encodeURIComponent(API_KEY)
            + '&type=json'
            + '&' + params;
    var options = {
      timeout: 90000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SpoTrip-Bot/1.0)',
        'Accept': 'application/json',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      }
    };
    if (pageNo === 1) console.log('  URL 앞부분:', url.slice(0,100));
    var req = https.get(url, options, function(res) {
      var data = '';
      res.on('data', function(c){ data += c; });
      res.on('end', function() {
        try {
          var json = JSON.parse(data);
          // 응답 구조: {response:{body}} 또는 {body} 둘 다 대응
          // 응답 구조 양방향 대응
          var body = (json.response && json.response.body) || json.body;
          var header = (json.response && json.response.header) || json.header || {};
          var resultCode = header.resultCode || header.resultCode;
          if (body && resultCode && resultCode !== '00' && resultCode !== '0000') {
            return reject(new Error('API 오류 [' + resultCode + ']: ' + (header.resultMsg || '')));
          }
          if (!body) {
            console.log('  응답 샘플:', data.slice(0,200));
            return reject(new Error('응답 구조 오류: ' + (json.header && json.header.resultMsg || '알 수 없음')));
          }
          var items = body.items ? (Array.isArray(body.items.item) ? body.items.item : [body.items.item]) : [];
          resolve({ total: body.totalCount || 0, items: items.filter(Boolean) });
        } catch(e) { reject(new Error('JSON 파싱 오류: ' + data.slice(0,100))); }
      });
    });
    req.on('error', reject);
    req.on('timeout', function(){ req.destroy(); reject(new Error('요청 타임아웃')); });
  });
}

async function fetchAll() {
  var first = await fetchPage(1);
  var total = first.total;
  console.log('   전체: ' + total + '건');
  var items = first.items.slice();
  var pages = Math.ceil(total / 100);
  for (var p = 2; p <= Math.min(pages, 30); p++) {
    await new Promise(function(r){ setTimeout(r, 500); });
    var res = await fetchPage(p);
    items = items.concat(res.items);
  }
  console.log('✅ 수집: ' + items.length + '건');
  return items;
}

// ── 병합 ──
function merge(rawItems) {
  var src    = fs.readFileSync(DATA_PATH, 'utf-8');
  var ids    = (src.match(/\{id:(\d+),/g) || []).map(function(m){ return +m.match(/\d+/)[0]; });
  var nextId = ids.length ? Math.max.apply(null, ids) + 1 : 500;

  var existingTitles = new Set((src.match(/title:'([^']+)'/g) || []).map(function(m){ return m.slice(7,-1); }));

  var existingKeys = new Set();
  var keyRe = /title:'([^']+)'[^}]*start:'([^']+)'[^}]*region:'([^']+)'/g;
  var km;
  while ((km = keyRe.exec(src)) !== null) {
    existingKeys.add(makeDedupKey(km[1], km[2], km[3]));
  }

  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);
  var cutoffStr = cutoff.toISOString().slice(0,10);

  var lines   = [];
  var skipped = 0;

  rawItems.forEach(function(item) {
    var title = (item.CNFRN_NM        || '').trim();
    var venue = (item.CNFRN_HDMT_RGN_NM || '').trim();
    var org   = (item.SPRVSN_INST_NM   || '').trim();
    var start = (item.CNFRN_BGNG_YMD   || '').trim();
    var end   = (item.CNFRN_END_YMD    || start).trim();
    var url   = (item.HMPG_ADDR       || '').trim();

    if (!title || title.length < 2)  { skipped++; return; }
    if (!start || start.length < 10) { skipped++; return; }
    if (end < cutoffStr)             { skipped++; return; }

    var rgn    = extractRegion(venue, title);
    var dk     = makeDedupKey(title, start, rgn);
    if (existingTitles.has(title) || existingKeys.has(dk)) { skipped++; return; }

    var sport  = extractSport(title);
    var coords = REGION_COORDS[rgn] || REGION_COORDS['기타'];
    var status = calcStatus(start, end);
    var icon   = SPORT_ICON[sport] || '🏆';

    lines.push(
      "  {id:" + nextId++ + ",title:'" + safe(title) + "',sport:'" + sport + "',icon:'" + icon + "'," +
      "venue:'" + safe(venue || rgn) + "',address:'" + safe(rgn) + "'," +
      "start:'" + start + "',end:'" + end + "',status:'" + status + "',region:'" + rgn + "'," +
      "desc:'" + safe(title) + ". 주관: " + safe(org || '미확인') + ".',url:'" + safe(url) + "'," +
      "participants:'미정',lat:" + coords[0] + ",lng:" + coords[1] + ",distances:''},"
    );
    existingTitles.add(title);
    existingKeys.add(dk);
  });

  if (lines.length === 0) {
    console.log('ℹ️  신규 대회 없음 (제외: ' + skipped + '건)');
    return 0;
  }

  var newSrc = src.replace('];\n\n// ── 런타임', lines.join('\n') + '\n];\n\n// ── 런타임');
  if (GH_TOKEN && GH_REPO) {
    // GitHub API로 업데이트
    return updateViaGithubAPI(newSrc, lines.length, skipped);
  } else {
    fs.writeFileSync(DATA_PATH, newSrc, 'utf-8');
    console.log('✅ 로컬 저장: +' + lines.length + '건 (제외: ' + skipped + '건)');
    return lines.length;
  }
}

function updateViaGithubAPI(content, added, skipped) {
  return new Promise(function(resolve, reject) {
    var b64 = Buffer.from(content).toString('base64');
    var [owner, repo] = GH_REPO.split('/');
    // SHA 조회
    https.get({
      hostname: 'api.github.com',
      path: '/repos/' + owner + '/' + repo + '/contents/src/lib/data.ts',
      headers: { 'User-Agent':'SpoTrip-Bot', 'Authorization':'token ' + GH_TOKEN },
    }, function(res) {
      var d = '';
      res.on('data', function(c){ d += c; });
      res.on('end', function() {
        var sha = JSON.parse(d).sha;
        var body = JSON.stringify({
          message: 'chore: 전국대회정보 자동 업데이트 (' + new Date().toISOString().slice(0,10) + ') +' + added + '건',
          content: b64, sha: sha,
        });
        var req2 = https.request({
          hostname: 'api.github.com',
          path: '/repos/' + owner + '/' + repo + '/contents/src/lib/data.ts',
          method: 'PUT',
          headers: {
            'User-Agent':'SpoTrip-Bot','Authorization':'token ' + GH_TOKEN,
            'Content-Type':'application/json','Content-Length':Buffer.byteLength(body),
          },
        }, function(r2) {
          var d2 = '';
          r2.on('data', function(c){ d2 += c; });
          r2.on('end', function() {
            if (r2.statusCode === 200 || r2.statusCode === 201) {
              console.log('✅ GitHub 업데이트: +' + added + '건 (제외: ' + skipped + '건)');
              resolve(added);
            } else {
              reject(new Error('GitHub PUT 실패: ' + r2.statusCode + ' ' + d2.slice(0,100)));
            }
          });
        });
        req2.on('error', reject);
        req2.write(body);
        req2.end();
      });
    }).on('error', reject);
  });
}

// ── 메인 ──
(async function() {
  console.log('🏃 스포트립 전국대회정보 자동 수집');
  console.log('📅 ' + new Date().toLocaleString('ko-KR', { timeZone:'Asia/Seoul' }) + '\n');
  try {
    console.log('📡 1페이지 수집 중...');
    var items = await fetchAll();
    var added = await merge(items);
    process.exit(added > 0 ? 0 : 2);
  } catch(err) {
    console.error('❌ 오류:', err.message);
    process.exit(1);
  }
})();
