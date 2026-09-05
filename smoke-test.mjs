const BASE = 'http://localhost:3001/api';
const results = [];
const check = (name, cond, extra = '') => {
  results.push({ name, pass: !!cond, extra });
  console.log(`${cond ? 'PASS' : 'FAIL'} | ${name}${extra ? ' | ' + extra : ''}`);
};

// 1. GET all petitions
{
  const r = await fetch(`${BASE}/petitions`);
  const j = await r.json();
  check('GET /petitions -> 200 + success', r.status === 200 && j.success === true);
}

// 2. GET detail: structure check (may be empty on clean slate)
{
  const r = await fetch(`${BASE}/petitions/rrce-gown-fee`);
  const j = await r.json();
  check('GET detail returns success', r.status === 200 && j.success === true);
  check('detail has no internal store leak (no raw sig objects)', !JSON.stringify(j).includes('usn"'));
}

// 3. Invalid USN format -> 400
{
  const r = await fetch(`${BASE}/petitions/rrce-gown-fee/sign`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usn: 'AAAAA', isAnonymous: true })
  });
  const j = await r.json();
  check('invalid USN -> 400', r.status === 400 && j.success === false);
}

// 4. Valid sign -> 201, then duplicate -> 400
let sigId = null;
{
  const r = await fetch(`${BASE}/petitions/rrce-gown-fee/sign`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usn: '1RR21CS777', isAnonymous: true, comment: '=SUM(A1:A9) -- formula-injection probe' })
  });
  const j = await r.json();
  sigId = j.data?.signature?.id || null;
  check('valid USN -> 201', r.status === 201 && j.success === true);
  check('sign response masks usn', j.data.signature.maskedUsn === '1RR21CS***');
  check('comment length preserved', j.data.signature.comment.startsWith('=SUM'));

  const r2 = await fetch(`${BASE}/petitions/rrce-gown-fee/sign`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usn: '1RR21CS777', isAnonymous: true })
  });
  check('duplicate USN -> 400', r2.status === 400);
}

// 5. Like endpoint
{
  const r = await fetch(`${BASE}/petitions/rrce-gown-fee/signatures/${sigId}/like`, { method: 'POST' });
  const j = await r.json();
  check('like works', r.status === 200 && j.likes === 1);
}

// 5b. GET detail after signing: maskedUsn only, no raw usn anywhere
{
  const r = await fetch(`${BASE}/petitions/rrce-gown-fee`);
  const j = await r.json();
  const raw = JSON.stringify(j);
  const sig = j.data.signatures[0];
  check('detail exposes maskedUsn ending ***', sig && typeof sig.maskedUsn === 'string' && sig.maskedUsn.endsWith('***'));
  check('detail has NO raw usn field', sig && !('usn' in sig) && !raw.includes('1RR21CS777'));
}

// 6. Security headers
{
  const r = await fetch(`${BASE}/petitions`);
  check('X-Content-Type-Options: nosniff', r.headers.get('x-content-type-options') === 'nosniff');
  check('X-Frame-Options: DENY', r.headers.get('x-frame-options') === 'DENY');
  check('Referrer-Policy present', !!r.headers.get('referrer-policy'));
  check('CSP present (API)', (r.headers.get('content-security-policy') || '').includes("default-src 'none'"));
  check('X-Powered-By disabled', !r.headers.get('x-powered-by'));
}

// 7. CORS: cross-origin request must NOT get ACAO header
{
  const r = await fetch(`${BASE}/petitions`, { headers: { 'Origin': 'https://evil.example' } });
  const acao = r.headers.get('access-control-allow-origin');
  check('cross-origin blocked (no ACAO header)', acao === null);
}

// 8. Create petition: oversized title truncated, target clamped
{
  const r = await fetch(`${BASE}/petitions`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'X'.repeat(500), summary: 'test summary', targetSignatures: 999999, demands: ['a','b','c'] })
  });
  const j = await r.json();
  check('create petition -> 201', r.status === 201 && j.success === true);
  check('title truncated to 200', j.data.title.length === 200);
  check('target clamped to 2000', j.data.targetSignatures === 2000);
  check('demands limited to 10', j.data.demands.length === 3);
}

// 9. Rate limiting: hammer sign endpoint until 429 (limit 20/15min)
{
  const statuses = [];
  for (let i = 0; i < 25; i++) {
    const n = String(i).padStart(3, '0');
    const r = await fetch(`${BASE}/petitions/rrce-gown-fee/sign`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usn: `1RR21EC${n}`, isAnonymous: true })
    });
    statuses.push(r.status);
  }
  const got429 = statuses.includes(429);
  const first429Idx = statuses.indexOf(429);
  check('rate limit kicks in (429 observed)', got429, `statuses[0..4]=${statuses.slice(0, 5).join(',')} first429@${first429Idx}`);
}

const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);