import test from 'node:test';
import assert from 'node:assert/strict';
import { CALCULATORS } from '../assets/js/calculators.js';
import { searchCalculators } from '../assets/js/search.js';

const cases={
  'сколько калорий мне есть':'calorie-target',
  'процент жира':'navy-body-fat',
  'калории для сушки':'calorie-target',
  'максимум в жиме':'e1rm',
  'темп бега':'pace',
  'доходность с учётом инфляции':'real-return',
  'how many calories should I eat':'calorie-target',
  'body fat':'navy-body-fat',
  'cutting calories':'calorie-target',
  'one rep max':'e1rm',
  'running pace':'pace',
  'inflation adjusted return':'real-return'
};

for(const [query,expected] of Object.entries(cases))test(`natural-language search: ${query}`,()=>assert.equal(searchCalculators(CALCULATORS,query)[0]?.id,expected));
test('search tolerates a meaningful typo',()=>assert.ok(searchCalculators(CALCULATORS,'инфляционая доходность').some(calc=>calc.id==='real-return')));
