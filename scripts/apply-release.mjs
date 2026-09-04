// Generates versioned runtime artifacts from assets/js/config.js (single source of truth).
// Updates: cache-busting queries across index.html, sw.js, app.js, renderers chain.
import { readFileSync, writeFileSync } from 'node:fs';
import { RELEASE } from '../assets/js/config.js';

const root = new URL('..', import.meta.url).pathname;
const bust = RELEASE.bust;
const cache = RELEASE.cache;

// app.js imports the whole runtime graph with ?v= busts; propagate the current bust
import { readdirSync } from 'node:fs';
const jsFiles = readdirSync(root + 'assets/js').filter(f => f.endsWith('.js')).map(f => 'assets/js/' + f);
for (const file of jsFiles) {
  const p = root + file;
  let s = readFileSync(p, 'utf8');
  s = s.replace(/\?v=[^'"]+/g, `?${bust}`);
  writeFileSync(p, s);
}

// sw.js: cache name + CORE busts
{
  const p = root + 'sw.js';
  let s = readFileSync(p, 'utf8');
  s = s.replace(/const CACHE='[^']+'/, `const CACHE='${cache}'`);
  s = s.replace(/\?v=[^'"]+/g, `?${bust}`);
  writeFileSync(p, s);
}

// index.html: stylesheet busts
{
  const p = root + 'index.html';
  let s = readFileSync(p, 'utf8');
  s = s.replace(/\?v=[^"]+/g, `?${bust}`);
  writeFileSync(p, s);
}

console.log(`release metadata applied: ${RELEASE.version}-${RELEASE.revision} (cache: ${cache})`);
