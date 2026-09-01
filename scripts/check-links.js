#!/usr/bin/env node
// 스포트립 외부 링크 점검 스크립트
const https = require('https');
const http = require('http');
const { EVENTS } = require('./src/lib/data.ts');

async function check(url) {
  return new Promise((resolve) => {
    if (!url) return resolve({ status: 'no-url', url });
    try {
      const mod = url.startsWith('https') ? https : http;
      const req = mod.get(url, { timeout: 5000 }, (res) => {
        resolve({ status: res.statusCode, url });
        req.destroy();
      });
      req.on('error', () => resolve({ status: 'error', url }));
      req.on('timeout', () => { req.destroy(); resolve({ status: 'timeout', url }); });
    } catch { resolve({ status: 'error', url }); }
  });
}

(async () => {
  console.log(`전체 ${EVENTS.length}건 링크 점검 시작...`);
  const results = await Promise.all(EVENTS.map(e => check(e.url)));
  const errors = results.filter(r => r.status !== 200 && r.status !== 'no-url');
  console.log(`\n오류 ${errors.length}건:`);
  errors.forEach(r => console.log(`  [${r.status}] ${r.url}`));
})();
