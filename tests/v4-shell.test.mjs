import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

test('theme and locale apply from current state before the stylesheet to prevent FOUC',async()=>{const html=await readFile(new URL('../index.html',import.meta.url),'utf8'),script=html.indexOf("markovlab2-state-v4"),css=html.indexOf('styles.css');assert.ok(script>0&&script<css)});
test('early theme bootstrap is valid JavaScript',async()=>{const html=await readFile(new URL('../index.html',import.meta.url),'utf8'),[bootstrap]=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.ok(bootstrap?.[1]);assert.doesNotThrow(()=>new vm.Script(bootstrap[1]))});
test('both localized manifests are shipped and cached',async()=>{const [en,sw]=await Promise.all([readFile(new URL('../manifest-en.webmanifest',import.meta.url),'utf8'),readFile(new URL('../sw.js',import.meta.url),'utf8')]);assert.equal(JSON.parse(en).lang,'en');assert.match(sw,/manifest-en\.webmanifest/)});
test('standalone 404 localizes without mixed-language copy',async()=>{const html=await readFile(new URL('../404.html',import.meta.url),'utf8');assert.match(html,/navigator\.language/);assert.doesNotMatch(html,/Страница не найдена\.\s*\/\s*Page not found/)});
test('runtime modules and styles are cache-busted for existing PWA clients',async()=>{const [html,app,renderer]=await Promise.all([readFile(new URL('../index.html',import.meta.url),'utf8'),readFile(new URL('../assets/js/app.js',import.meta.url),'utf8'),readFile(new URL('../assets/js/renderers-v3.js',import.meta.url),'utf8')]);assert.match(html,/styles-v5\.css\?v=\d+\.\d+\.\d+-r\d+/);assert.match(html,/app\.js\?v=\d+\.\d+\.\d+-r\d+/);assert.doesNotMatch(app,/from ['"]\.\/[^'"]+\.js['"]/);assert.doesNotMatch(renderer,/from ['"]\.\/[^'"]+\.js['"]/) });
