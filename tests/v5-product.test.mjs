import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { shell, home, calculatorsPage, calculatorPage, categoryPage } from '../assets/js/renderers-v3.js';
import { CALCULATORS } from '../assets/js/calculators.js';
import { getProConfig } from '../assets/js/pro.js';

const state={lang:'ru',theme:'light',profile:{},favorites:[],recents:[],history:[],snapshots:[]};

test('v5 shell removes the permanent admin sidebar and prioritizes four mobile actions',()=>{
  const html=shell('<p>content</p>',state,{page:'home'});
  assert.doesNotMatch(html,/class="sidebar"/);
  assert.match(html,/class="topbar topbar-v5"/);
  assert.equal((html.match(/mobile-nav-v5[\s\S]*?<\/nav>/)?.[0].match(/<(?:a|button)\b/g)||[]).length,4);
});

test('first visit is search-first and exposes product meaning without a profile gate',()=>{
  const html=home(state);
  assert.match(html,/data-action="palette"/);
  assert.match(html,/Данные остаются в браузере/);
  assert.match(html,/число → смысл → граница → действие/i);
  assert.doesNotMatch(html,/fillProfile/);
});

test('library renders real entry points and all nine laboratory links',()=>{
  const html=calculatorsPage(state);
  assert.match(html,/97 ИНСТРУМЕНТОВ/);
  assert.equal((html.match(/href="#category\//g)||[]).length,9);
  for(const id of ['bmi','tdee','navy-body-fat','e1rm','pace','real-return'])assert.match(html,new RegExp(`#calc/${id}`));
});

test('natural-language library results stay focused',()=>{
  const html=calculatorsPage(state,'сколько калорий мне есть');
  assert.match(html,/#calc\/(?:calorie-target|tdee)/);
  assert.ok((html.match(/class="tool-row"/g)||[]).length<=12);
});

test('v5 density overrides remove the old tall empty result and dark result tower',async()=>{
  const css=await readFile(new URL('../assets/css/styles-v5.css',import.meta.url),'utf8');
  assert.match(css,/result-panel\.empty-result\{[^}]*min-height:0/);
  assert.match(css,/background:var\(--v5-paper\)/);
  assert.match(css,/result-sections\{grid-template-columns:1fr 1fr/);
  assert.match(css,/data-route="insights"[^}]*empty-state\{min-height:138px/);
});

test('first launch does not open blocking onboarding automatically',async()=>{
  const app=await readFile(new URL('../assets/js/app.js',import.meta.url),'utf8');
  assert.doesNotMatch(app,/setTimeout\(showOnboarding/);
  assert.match(app,/action==='onboarding'/);
});

test('shortcut label is platform-aware',async()=>{
  const renderer=await readFile(new URL('../assets/js/renderers-v3.js',import.meta.url),'utf8');
  assert.match(renderer,/Mac\|iPhone\|iPad/);
  assert.match(renderer,/'Ctrl K'/);
});

test('language switching localizes the static skip link and clears stale live text',async()=>{
  const app=await readFile(new URL('../assets/js/app.js',import.meta.url),'utf8');
  assert.match(app,/querySelector\('\.skip-link'\).*t\('skip',state\.lang\)/);
  assert.match(app,/function changeLanguage\(lang\)[\s\S]*toast\.textContent=''[\s\S]*toast\.classList\.remove\('show'\)/);
});

test('home product preview uses locale-aware numeric formatting',async()=>{
  const renderer=await readFile(new URL('../assets/js/renderers-v3.js',import.meta.url),'utf8');
  assert.match(renderer,/formatNumber\(24\.7,lang,1\)/);
  assert.doesNotMatch(renderer,/<strong>24,7<\/strong>/);
});


test('page rhythm never inflates nested result or evidence sections',async()=>{
  const css=await readFile(new URL('../assets/css/styles-v5.css',import.meta.url),'utf8');
  assert.match(css,/\.main-v5 :where\(section\+section\)\{margin-top:0\}/);
  assert.match(css,/\.main-v5>section\+section\{margin-top:clamp\(/);
});

test('home and laboratories connect photography to practical use',()=>{
  const html=home(state);
  for(const asset of ['body-measurement.webp','nutrition-planning.webp','training-review.webp','decision-scenarios.webp'])assert.match(html,new RegExp(asset));
  assert.match(html,/Павел Марков/);
  const category=categoryPage(state,'body');
  assert.match(category,/category-practice/);
  assert.match(category,/одинаковый протокол измерения/i);
});

test('all nine laboratories have distinct purpose-built editorial photography',()=>{
  const assets=new Set();
  for(const id of ['body','energy','nutrition','strength','cardio','recovery','mind','money','utility']){
    const html=categoryPage(state,id);
    const asset=html.match(/assets\/images\/editorial\/([^"']+\.webp)/)?.[1];
    assert.ok(asset,`${id}: missing editorial asset`);
    assets.add(asset);
  }
  assert.equal(assets.size,9);
});

test('only calculators with a decision-useful Pro mode expose it',()=>{
  for(const calc of CALCULATORS){
    const html=calculatorPage(calc,state,null,null,{});
    if(getProConfig(calc).mode==='none'){
      assert.doesNotMatch(html,/data-action="calc-mode" data-mode="pro"/,`${calc.id}: decorative Pro is absent`);
    }else{
      assert.match(html,/MARKOVLAB PRO/,`${calc.id}: missing configured Pro`);
      assert.match(html,/data-action="calc-mode" data-mode="pro"/,`${calc.id}: missing Pro tab`);
      assert.match(html,/полный протокол|Точный протокол/i,`${calc.id}: missing protocol`);
    }
  }
});

test('numeric fields accept decimal comma before application normalization',()=>{
  const html=calculatorPage(CALCULATORS.find(calc=>calc.id==='tdee'),state,null,null,{});
  assert.match(html,/type="text"[^>]*inputmode="decimal"/);
  assert.doesNotMatch(html,/type="number"/);
});

test('calculator Pro mode survives result rerenders',async()=>{
  const app=await readFile(new URL('../assets/js/app.js',import.meta.url),'utf8');
  const renderer=await readFile(new URL('../assets/js/renderers-v3.js',import.meta.url),'utf8');
  assert.match(app,/calcModes=new Map\(\)/);
  assert.match(app,/proScenarios=new Map\(\)/);
  assert.match(app,/baselineInputs=new Map\(\)/);
  assert.match(app,/proScenarios\.set\(form\.dataset\.calc,\{values:/);
  assert.match(app,/new MutationObserver\([\s\S]*syncCalcMode/);
  assert.match(app,/calcModes\.set\(form\.dataset\.calc,mode\)/);
  assert.match(app,/restoreProScenario\(\)/);
  assert.match(app,/function currentBaseline/);
  assert.match(app,/function runProScenario/);
  assert.match(app,/wireProScenarioControls\(form\)/);
  assert.match(renderer,/data-pro-input/);
  assert.match(renderer,/data-pro-baseline/);
});

test('theme menu has four distinct palettes plus explicit system behavior',()=>{
  const html=shell('<p>content</p>',state,{page:'home'});
  for(const theme of ['light','paper','dark','midnight','system'])assert.match(html,new RegExp(`data-theme="${theme}"`));
  assert.match(html,/Системная[\s\S]*Автоматически/);
});
