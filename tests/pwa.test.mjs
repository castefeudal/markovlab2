import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,access } from 'node:fs/promises';
import { resolve,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
test('manifest uses raster any and maskable icons',async()=>{const m=JSON.parse(await readFile(resolve(root,'manifest.webmanifest'),'utf8'));assert.ok(m.icons.some(x=>x.purpose==='maskable'&&x.type==='image/png'));for(const x of m.icons)await access(resolve(root,x.src.replace(/^\.\//,'')))});
test('service worker limits interception and has explicit update flow',async()=>{const sw=await readFile(resolve(root,'sw.js'),'utf8');assert.match(sw,/url\.origin!==self\.location\.origin/);assert.match(sw,/request\.mode==='navigate'/);assert.match(sw,/SKIP_WAITING/);assert.doesNotMatch(sw,/catch\(\)=>caches\.match\(request\).*index\.html/)});
test('brand assets exist',async()=>{for(const p of ['assets/brand/favicon.svg','assets/brand/logo-horizontal-dark.svg','assets/brand/logo-horizontal-light.svg','assets/brand/logo-monochrome.svg','assets/brand/og-markovlab-1200x630.png','assets/icons/apple-touch-icon.png'])await access(resolve(root,p))});
