import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');

const RUNTIME_FILES = [
  'index.html',
  '404.html',
  'sw.js',
  'robots.txt',
  'sitemap.xml',
  'manifest.webmanifest',
  'manifest-en.webmanifest',
  'assets/js/app.js',
  'assets/js/calculators.js',
  'assets/js/config.js',
  'assets/js/content.js',
  'assets/js/formulas.js',
  'assets/js/i18n.js',
  'assets/js/icons.js',
  'assets/js/pro.js',
  'assets/js/recommendations.js',
  'assets/js/references.js',
  'assets/js/renderers-v3.js',
  'assets/js/renderers.js',
  'assets/js/router.js',
  'assets/js/search.js',
  'assets/js/state.js',
  'assets/js/storage.js',
  'assets/js/validators.js',
  'assets/js/workflows.js',
  'assets/css/styles.css',
  'assets/css/styles-v3.css',
  'assets/css/styles-v4.css',
  'assets/css/styles-v5.css'
];

const read = p => readFileSync(join(ROOT, p), 'utf8');

test('runtime surfaces never link to the old /markovlab/ production URL', () => {
  const pattern = /castefeudal\.github\.io\/markovlab(?!2)/;
  for (const file of RUNTIME_FILES) {
    assert.doesNotMatch(read(file), pattern, `${file} references the old production URL`);
  }
});

test('runtime persistence uses only the markovlab2 namespace', () => {
  for (const file of ['assets/js/storage.js', 'assets/js/app.js', 'assets/js/workflows.js', 'index.html']) {
    const src = read(file);
    const offenders = src.match(/['"`](markovlab-(?!2)[a-z0-9-]*-?[a-z0-9]*)['"`]/g) || [];
    const filtered = offenders.filter(x => !/og-markovlab/.test(x));
    assert.equal(filtered.length, 0, `${file} still uses old-namespace keys: ${filtered.join(', ')}`);
  }
});

test('storage keys, drafts, workflow sessions and SW cache are namespaced to markovlab2', () => {
  assert.match(read('assets/js/storage.js'), /markovlab2-state-v/);
  assert.match(read('assets/js/app.js'), /markovlab2-draft-/);
  assert.match(read('assets/js/workflows.js'), /markovlab2-active-workflow/);
  const sw = read('sw.js');
  assert.match(sw, /CACHE='markovlab2-/);
  assert.match(sw, /startsWith\('markovlab2-'\)/);
  assert.doesNotMatch(sw, /startsWith\('markovlab-'\)/);
});

test('clear-data cannot delete old-app state', () => {
  const src = read('assets/js/storage.js');
  assert.doesNotMatch(src, /removeItem\('markovlab-/);
  assert.doesNotMatch(src, /removeItem\(`markovlab-/);
});

test('exports are labelled as the markovlab2 app', () => {
  assert.match(read('assets/js/storage.js'), /markovlab2/);
});

test('canonical, og:url and JSON-LD point at the markovlab2 origin path', () => {
  const html = read('index.html');
  assert.match(html, /rel="canonical" href="https:\/\/castefeudal\.github\.io\/markovlab2\/"/);
  assert.match(html, /og:url" content="https:\/\/castefeudal\.github\.io\/markovlab2\/"/);
  assert.match(html, /"url":"https:\/\/castefeudal\.github\.io\/markovlab2\/"/);
  assert.match(read('sitemap.xml'), /markovlab2/);
  assert.match(read('robots.txt'), /markovlab2\/sitemap\.xml/);
});
