import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RELEASE_CONFIG } from '../assets/js/config.js';

const ROOT = join(import.meta.dirname, '..');

describe('Version Consistency', () => {
  let configVersion, packageVersion, swVersion;

  it('setup: extract versions', () => {
    configVersion = RELEASE_CONFIG.version;
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
    packageVersion = pkg.version;
    const sw = readFileSync(join(ROOT, 'sw.js'), 'utf-8');
    const match = sw.match(/const\s+CACHE\s*='([^']+)'/);
    assert.ok(match, 'CACHE constant not found');
    const vMatch = match[1].match(/v(\d+\.\d+\.\d+)/);
    assert.ok(vMatch, `Version not found in CACHE: ${match[1]}`);
    swVersion = vMatch[1];
  });

  it('config.js matches package.json', () => {
    assert.strictEqual(configVersion, packageVersion);
  });

  it('package.json matches sw.js', () => {
    assert.strictEqual(packageVersion, swVersion);
  });

  it('all three are identical', () => {
    assert.strictEqual(configVersion, packageVersion);
    assert.strictEqual(packageVersion, swVersion);
  });

  it('valid semver format', () => {
    const semver = /^\d+\.\d+\.\d+$/;
    assert.ok(semver.test(configVersion));
    assert.ok(semver.test(packageVersion));
    assert.ok(semver.test(swVersion));
  });

  it('not placeholder', () => {
    const placeholder = /^(0\.0\.0|TODO|FIXME|TBD|PLACEHOLDER)$/i;
    assert.ok(!placeholder.test(configVersion));
    assert.ok(!placeholder.test(packageVersion));
    assert.ok(!placeholder.test(swVersion));
  });
});
