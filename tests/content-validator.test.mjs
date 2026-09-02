import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { CALCULATORS } from '../assets/js/calculators.js';
import { categories } from '../assets/js/i18n.js';
import { DOMAIN_CONTENT } from '../assets/js/content.js';
import { REFERENCES } from '../assets/js/references.js';
import { RELEASE_CONFIG } from '../assets/js/config.js';

const ROOT = join(import.meta.dirname, '..');

function loadJSON(path) { return JSON.parse(readFileSync(path, 'utf-8')); }
function loadJS(path) { return readFileSync(path, 'utf-8'); }
function getAllFiles(dir, exts) {
  if (!existsSync(dir)) return [];
  let results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) results = results.concat(getAllFiles(full, exts));
    else if (exts.includes(extname(full))) results.push(full);
  }
  return results;
}

describe('Content Validator', () => {
  it('every calculator has RU and EN title and description', () => {
    for (const calc of CALCULATORS) {
      assert.ok(calc.title?.ru && calc.title?.en, `Missing title for: ${calc.id}`);
      assert.ok(calc.description?.ru && calc.description?.en, `Missing description for: ${calc.id}`);
    }
  });

  it('every calculator has keywords array', () => {
    for (const calc of CALCULATORS) {
      assert.ok(Array.isArray(calc.keywords), `Missing keywords for: ${calc.id}`);
    }
  });

  it('every calculator has a valid category', () => {
    const valid = new Set(Object.keys(categories));
    for (const calc of CALCULATORS) {
      assert.ok(valid.has(calc.category), `Invalid category "${calc.category}" for: ${calc.id}`);
    }
  });

  it('every calculator has methodType and evidenceStrength', () => {
    const methods = new Set(['math', 'guideline', 'validated-estimate', 'screening', 'heuristic', 'experimental']);
    const evidence = new Set(['high', 'moderate', 'limited', 'experimental']);
    for (const calc of CALCULATORS) {
      assert.ok(methods.has(calc.methodType), `Invalid methodType for: ${calc.id}`);
      assert.ok(evidence.has(calc.evidenceStrength), `Invalid evidenceStrength for: ${calc.id}`);
    }
  });

  it('calculator sources reference valid IDs', () => {
    const valid = new Set(Object.keys(REFERENCES));
    for (const calc of CALCULATORS) {
      if (calc.sources) {
        for (const src of calc.sources) {
          assert.ok(valid.has(src), `Invalid source "${src}" for: ${calc.id}`);
        }
      }
    }
  });

  it('DOMAIN_CONTENT workflow IDs are valid', () => {
    const valid = new Set(CALCULATORS.map(c => c.id));
    for (const [catId, meta] of Object.entries(DOMAIN_CONTENT)) {
      assert.ok(meta.workflow, `Missing workflow for: ${catId}`);
      for (const id of meta.workflow) {
        assert.ok(valid.has(id), `Invalid ID "${id}" in workflow for: ${catId}`);
      }
    }
  });

  it('manifest.webmanifest references existing icons', () => {
    const manifest = loadJSON(join(ROOT, 'manifest.webmanifest'));
    for (const icon of manifest.icons) {
      assert.ok(existsSync(join(ROOT, icon.src)), `Icon not found: ${icon.src}`);
    }
  });

  it('sw.js CORE references existing files', () => {
    const sw = loadJS(join(ROOT, 'sw.js'));
    const match = sw.match(/const\s+CORE\s*=\s*\[([\s\S]*?)\]/);
    assert.ok(match, 'Could not find CORE array');
    const files = match[1].match(/'([^']+)'/g)?.map(f => f.replace(/'/g, '')) || [];
    for (const file of files) {
      const localFile = file.split('?')[0];
      assert.ok(existsSync(join(ROOT, localFile)), `CORE file not found: ${file}`);
    }
  });

  it('no placeholder text in assets/', () => {
    const files = getAllFiles(join(ROOT, 'assets'), ['.js', '.html', '.css']);
    const pattern = /\b(TODO|FIXME|TBD|LOREM IPSUM|COMING SOON)\b/gi;
    for (const file of files) {
      const matches = loadJS(file).match(pattern);
      if (matches) assert.fail(`Placeholder in ${file}: ${matches.join(', ')}`);
    }
  });

  it('version in config.js matches package.json', () => {
    const pkg = loadJSON(join(ROOT, 'package.json'));
    assert.strictEqual(RELEASE_CONFIG.version, pkg.version);
  });
});
