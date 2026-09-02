import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CALCULATORS } from '../assets/js/calculators.js';
import { applyResultGuidance } from '../assets/js/content.js';
import { RELEASE_CONFIG } from '../assets/js/config.js';
import { formatUnit, t } from '../assets/js/i18n.js';
import { calculatorPage } from '../assets/js/renderers-v3.js';
import { DEFAULT_STATE } from '../assets/js/storage.js';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Russian release metadata and PWA shortcuts contain no known English leakage',()=>{
  const surface=[read('index.html'),read('manifest.webmanifest')].join('\n');
  for(const leak of ['evidence layer','Offline-first personal','Open laboratory','Personal profile','Skip to content','JavaScript is required']){
    assert.equal(surface.includes(leak),false,`visible leak: ${leak}`);
  }
});

test('release version is consistent across runtime entry points',()=>{
  assert.equal(RELEASE_CONFIG.version,'6.0.0');
  assert.equal(JSON.parse(read('package.json')).version,RELEASE_CONFIG.version);
  assert.equal(t('version','ru'),`Версия ${RELEASE_CONFIG.version}`);
  assert.match(read('sw.js'),/markovlab2-v6\.0\.0-/);
});

test('generic result boilerplate is replaced for every calculator default result',()=>{
  const forbidden=[
    'Используйте как контекст и отслеживайте динамику, а не одиночное число.',
    'Результат точен в рамках введённых данных и выбранной арифметики.',
    'Сценарий не предсказывает индивидуальный результат и зависит от допущений.'
  ];
  for(const calc of CALCULATORS){
    const values=Object.fromEntries(calc.fields.map(field=>[field.id,field.default]));
    const result=applyResultGuidance(calc,calc.calculate(values,{}));
    assert.equal(forbidden.includes(result.action.ru),false,`${calc.id}: generic action`);
    assert.equal(forbidden.includes(result.limitation.ru),false,`${calc.id}: generic limitation`);
  }
});

test('calculator completeness matrix contains every stable calculator ID',()=>{
  const matrix=read('docs/CALCULATOR_COMPLETENESS_MATRIX.md');
  for(const calc of CALCULATORS)assert.equal(matrix.includes(`| \`${calc.id}\` |`),true,`${calc.id}: missing matrix row`);
  assert.match(matrix,/Итого: \*\*86 калькуляторов из 86\*\*/);
});

test('internal result units have a Russian release label',()=>{
  for(const unit of ['years','days','months','currency','currency/month','priority','score','US fl oz']){
    assert.notEqual(formatUnit(unit,'ru'),unit,`untranslated unit: ${unit}`);
  }
  const state={...DEFAULT_STATE,lang:'ru'};
  const forbidden=['US fl oz','currency/month','currency/hour','currency/100g','minutes after midnight','potential reps'];
  for(const calc of CALCULATORS){
    const values=Object.fromEntries(calc.fields.map(field=>[field.id,field.default]));
    const html=calculatorPage(calc,state,values,calc.calculate(values,{}));
    for(const token of forbidden)assert.equal(html.includes(token),false,`${calc.id}: visible internal unit ${token}`);
  }
});
