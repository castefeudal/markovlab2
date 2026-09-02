import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CALCULATORS, calculatorMap } from '../assets/js/calculators.js';
import { calculatorPage } from '../assets/js/renderers-v3.js';
import { getProConfig } from '../assets/js/pro.js';

const state={lang:'ru',theme:'light',profile:{},favorites:[],recents:[],history:[],snapshots:[]};

test('Pro compares only a calculated baseline with real Scenario B inputs',async()=>{
  const app=await readFile(new URL('../assets/js/app.js',import.meta.url),'utf8');
  assert.match(app,/baselineInputs=new Map\(\)/);
  assert.match(app,/function currentBaseline/);
  assert.match(app,/function runProScenario/);
  assert.match(app,/data-pro-input/);
  assert.match(app,/data-action="pro-compare"/);
  assert.match(app,/validateFields\(calc\.fields,scenario,state\.lang\)/);
  assert.match(app,/function wireProScenarioControls/);
});

test('Pro is intentionally absent where a second mode adds no decision value',()=>{
  for(const calc of CALCULATORS){
    const html=calculatorPage(calc,state,null,null,{});
    if(getProConfig(calc).mode==='none'){
      assert.doesNotMatch(html,/MARKOVLAB PRO/,`${calc.id}: no decorative Pro`);
    }else{
      assert.match(html,/MARKOVLAB PRO/,`${calc.id}: configured Pro`);
      assert.match(html,/data-pro-input/,`${calc.id}: real Scenario B inputs`);
      assert.match(html,/role="status" tabindex="-1" aria-live="polite"/,`${calc.id}: live scenario output`);
    }
  }
});

test('TDEE Scenario B includes both expenditure and activity assumptions',()=>{
  const html=calculatorPage(calculatorMap.get('tdee'),state,null,null,{});
  assert.match(html,/data-pro-input="resting"/);
  assert.match(html,/data-pro-input="factor"/);
});

test('Russian worked examples and print inputs use localized option labels',()=>{
  const calc=calculatorMap.get('fat-gain-surplus');
  const html=calculatorPage(calc,state,null,null,{});
  assert.match(html,/Пол: <b>Мужской<\/b>/);
  assert.match(html,/<dt>Уровень силовой подготовки<\/dt><dd>Средний<\/dd>/);
  assert.match(html,/<dt>Повседневная активность<\/dt><dd>Сидячая<\/dd>/);
  assert.doesNotMatch(html,/<dd>male<\/dd>|<dd>intermediate<\/dd>|<dd>sedentary<\/dd>/);
});

test('theme contract defines distinct safe foreground tokens for inverse surfaces',async()=>{
  const css=await readFile(new URL('../assets/css/styles-v5.css',import.meta.url),'utf8');
  for(const token of ['--surface-page','--surface-recessed','--surface-elevated','--surface-inverse','--text-primary','--text-secondary','--text-tertiary','--text-on-inverse','--border-soft','--border-strong','--accent','--accent-on-dark','--accent-on-light','--focus','--overlay-backdrop','--overlay-shadow'])assert.match(css,new RegExp(token.replaceAll('-','\\-')));
  assert.match(css,/\.author-note \.eyebrow,.about-author \.eyebrow,.trust-system \.eyebrow,.trust-system \.text-action\{color:var\(--accent-on-inverse\)\}/);
});
