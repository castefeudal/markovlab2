import test from 'node:test';
import assert from 'node:assert/strict';
import { CALCULATORS, calculatorMap } from '../assets/js/calculators.js';
import * as F from '../assets/js/formulas.js';

const calc = id => {
  const c = calculatorMap.get(id);
  assert.ok(c, `missing calculator ${id}`);
  return c;
};
const run = (id, values) => calc(id).calculate(values, {});

test('macro-planner secondary rows separate grams from kcal', () => {
  const r = run('macro-planner', { calories: 2200, weight: 80, proteinPerKg: 1.6, fatPerKg: 0.8 });
  const by = label => r.secondary.find(s => s.label.en === label);
  const protein = by('Protein'), fat = by('Fat');
  const pKcal = by('Calories from protein'), fKcal = by('Calories from fat');
  assert.equal(protein.unit, 'g');
  assert.equal(Math.round(protein.value), 128, 'protein grams = 1.6 × 80');
  assert.equal(fat.unit, 'g');
  assert.equal(Math.round(fat.value), 64, 'fat grams = 0.8 × 80');
  assert.equal(pKcal.unit, 'kcal');
  assert.equal(Math.round(pKcal.value), 512, 'protein energy = 128 × 4');
  assert.equal(fKcal.unit, 'kcal');
  assert.equal(Math.round(fKcal.value), 576, 'fat energy = 64 × 9');
  const invariant = protein.value * 4 + fat.value * 9 + r.primary * 4;
  assert.ok(Math.abs(invariant - 2200) < 12, `p×4 + f×9 + carbs×4 ≈ target, got ${invariant}`);
});

test('e1rm secondary labels match their own formula values', () => {
  const r = run('e1rm', { load: 100, reps: 5 });
  const by = label => r.secondary.find(s => s.label.en === label);
  assert.equal(by('Epley').value, F.round(F.epley(100, 5), 1), 'Epley label must equal Epley formula');
  assert.equal(by('Brzycki').value, F.round(F.brzycki(100, 5), 1));
  assert.equal(by('Lombardi').value, F.round(F.lombardi(100, 5), 1));
  assert.equal(by("O'Conner").value, F.round(F.oconner(100, 5), 1));
  const vals = [F.epley(100, 5), F.brzycki(100, 5), F.lombardi(100, 5), F.oconner(100, 5)].sort((a, b) => a - b);
  assert.match(String(by('Range').value), new RegExp(`${F.round(vals[0], 1)}–${F.round(vals[3], 1)}`));
});

test('warm-up ramp steps use the working-set repetitions', () => {
  const r = run('warmup-planner', { workingWeight: 101, workingReps: 5, barWeight: 20 });
  assert.ok(r.secondary.every(s => /× 5|× 3|× 2|× 1/.test(s.label.en)), 'step labels carry rep counts');
});

test('rmr-comparison computes lean-mass method only when body fat is provided', () => {
  const withBf = run('rmr-comparison', { sex: 'male', weight: 80, height: 175, age: 35, bodyFat: 20 });
  const kRow = withBf.secondary.find(s => s.label.en === 'Katch–McArdle (Cunningham, 1991)');
  assert.ok(kRow, 'body-fat row present when body fat known');
  assert.equal(Math.round(kRow.value), Math.round(F.katchMcardle(80 * 0.8)), 'row value = 370 + 21.6 × LBM');
  const withoutBf = calc('rmr-comparison').calculate({ sex: 'male', weight: 80, height: 175, age: 35, bodyFat: '' }, {});
  assert.ok(!withoutBf.secondary.some(s => s.label.en === 'Katch–McArdle'), 'no hidden default body fat');
  const methods = withoutBf.secondary.filter(s => /Mifflin|Harris/.test(s.label.en));
  assert.equal(methods.length, 2, 'two weight-based methods remain');
});

test('katch–mcardle sensitivity explanation matches the math', () => {
  const r = run('katch-mcardle', { weight: 80, bodyFat: 20 });
  const sens = r.secondary.find(s => /Sensitivity/i.test(s.label.en));
  assert.ok(sens, 'sensitivity row exists');
  assert.ok(String(sens.value).includes('86'), '±5% of 80 kg → ±86 kcal (21.6 × 80 × 0.05)');
});

test('cunningham uses the 1980 coefficients and stays distinct from katch–mcardle', () => {
  assert.equal(F.cunningham1980(64), 500 + 22 * 64);
  assert.notEqual(F.cunningham1980(64), F.katchMcardle(64));
  const r = run('cunningham', { ffm: 64 });
  assert.equal(r.primary, Math.round(F.cunningham1980(64)));
});

test('every calculator: no NaN in primary or secondary defaults', () => {
  for (const c of CALCULATORS) {
    const values = Object.fromEntries(c.fields.map(f => [f.id, f.default]));
    const r = c.calculate(values, {});
    assert.ok(!/NaN|Infinity|undefined/.test(String(r.primary)), `${c.id}: primary clean`);
    for (const s of r.secondary || []) {
      assert.ok(!/NaN|Infinity|undefined|object Object/.test(String(s.value)), `${c.id}: secondary "${s.label.en}" clean`);
    }
  }
});
