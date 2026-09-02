import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CALCULATORS, calculatorMap } from '../assets/js/calculators.js';
import { platePlan, parsePlateInventory } from '../assets/js/formulas.js';
import { calculatorsPage, historySummary, home } from '../assets/js/renderers-v3.js';

const state={version:4,lang:'ru',theme:'light',profile:{},favorites:[],recents:[],history:[],snapshots:[],onboardingDismissed:true};

test('all-library view literally exposes every registered calculator',()=>{
  const html=calculatorsPage(state,'','all');
  assert.match(html,/ВСЯ БИБЛИОТЕКА/);
  assert.equal((html.match(/class="tool-row"/g)||[]).length,CALCULATORS.length);
  for(const calculator of CALCULATORS)assert.match(html,new RegExp(`href="#calc/${calculator.id}"`));
});

test('home editorial routes resolve to registered calculators',()=>{
  const html=home(state);
  for(const [,id] of html.matchAll(/href="#calc\/([a-z0-9-]+)"/g))assert.ok(calculatorMap.has(id),`home route ${id} must exist`);
  assert.doesNotMatch(html,/training-load/);
});

test('plate loader reports exact and nearest possible totals instead of a silent approximation',()=>{
  const inventory=parsePlateInventory('25×1; 20×1; 15×1; 10×1; 5×1; 2.5×1; 1.25×1');
  const plan=platePlan(101,20,inventory);
  assert.equal(plan.exact,false);
  assert.equal(plan.lower.total,100);
  assert.equal(plan.lower.delta,-1);
  assert.equal(plan.upper.total,102.5);
  const calculator=calculatorMap.get('plate-loader');
  const result=calculator.calculate(Object.fromEntries(calculator.fields.map(field=>[field.id,field.default])));
  assert.ok(result.secondary.some(item=>item.label.ru==='Собрано'));
  assert.ok(result.secondary.some(item=>item.label.ru==='Разница'));
});

test('structured history result is formatted for the active locale at render time',()=>{
  const record={calcId:'ml-floz',summary:'16.907 жидк. унц. США',result:{primary:16.907,unit:'US fl oz'}};
  assert.equal(historySummary(record,'ru'),'16,907 жидк. унц. США');
  assert.equal(historySummary(record,'en'),'16.907 US fl oz');
});

test('fresh PWA revision invalidates the previous production entry module',async()=>{
  const [index,sw,app]=await Promise.all(['../index.html','../sw.js','../assets/js/app.js'].map(path=>readFile(new URL(path,import.meta.url),'utf8')));
  assert.match(index,/app\.js\?v=6\.0\.0-r1/);
  assert.match(sw,/markovlab2-v6\.0\.0-r1/);
  assert.match(sw,/app\.js\?v=6\.0\.0-r1/);
  assert.match(sw,/pro\.js\?v=6\.0\.0/);
  assert.match(app,/updateViaCache:'none'/);
  assert.match(app,/closest\('button\[data-theme\]'\)/);
  assert.doesNotMatch(app,/closest\('\[data-theme\]'\)/);
});
