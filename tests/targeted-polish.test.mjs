import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CALCULATORS } from '../assets/js/calculators.js';
import { fatGainFromSurplusModel } from '../assets/js/formulas.js';

const base={age:32,weightKg:90,heightCm:182,bodyFatPct:20,sex:'male',trainingLevel:'intermediate',activity:'sedentary',proteinG:180,fatG:100,carbsG:800,glycogenDepleted:false,strengthLast24h:false,deficitKcal:500};

test('fat-gain workbook vectors remain reproducible',()=>{
  const c=CALCULATORS.find(x=>x.id==='fat-gain-surplus');
  assert.ok(c);
  const defaults=Object.fromEntries(c.fields.map(f=>[f.id,f.default]));
  assert.equal(c.fields.find(f=>f.id==='proteinG').unit,'g/day');
  const zero=fatGainFromSurplusModel({...base,proteinG:100,fatG:0,carbsG:0});
  assert.equal(zero.surplusKcal,0);
  assert.equal(Math.round(fatGainFromSurplusModel(base).surplusKcal),2187);
  assert.equal(Math.round(fatGainFromSurplusModel({...base,activity:'active'}).tdeeEstimate),2636);
  assert.equal(Math.round(fatGainFromSurplusModel({...base,glycogenDepleted:true}).glycogenAvailableG),151);
  assert.ok(Number.isFinite(c.calculate(defaults,{}).primary));
});

test('Pro controls use editable Scenario B values rather than percentage presets',async()=>{
  const renderer=await readFile(new URL('../assets/js/renderers-v3.js',import.meta.url),'utf8');
  const app=await readFile(new URL('../assets/js/app.js',import.meta.url),'utf8');
  assert.match(renderer,/data-pro-input/);
  assert.match(renderer,/data-action="pro-compare"/);
  assert.match(renderer,/data-pro-baseline/);
  assert.match(app,/function copyBaselineToScenario/);
  assert.match(app,/function runProScenario/);
  assert.match(app,/changed=calc\.fields/);
});

test('overlay theme contract defines readable surface tokens and focus states',async()=>{
  const css=await readFile(new URL('../assets/css/styles-v5.css',import.meta.url),'utf8');
  for(const token of ['--surface-elevated','--surface-recessed','--text-primary','--text-secondary','--border-strong-v5','--overlay-backdrop','--focus-ring'])assert.match(css,new RegExp(token.replaceAll('-','\\-')));
  assert.match(css,/\.data-popover,\.palette,\.confirm-dialog,\.onboarding/);
  assert.match(css,/\.pro-input-wrap input/);
});
