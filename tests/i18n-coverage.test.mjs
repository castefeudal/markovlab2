import { describe, it } from 'node:test';
import assert from 'node:assert';
import { copy, categories, l } from '../assets/js/i18n.js';
import { CALCULATORS } from '../assets/js/calculators.js';

describe('i18n Coverage', () => {
  it('ru and en dictionaries have identical key sets', () => {
    const ru = Object.keys(copy.ru).sort();
    const en = Object.keys(copy.en).sort();
    assert.deepStrictEqual(ru, en);
  });

  it('every calculator has RU and EN title', () => {
    for (const calc of CALCULATORS) {
      assert.ok(l(calc.title, 'ru')?.length > 0, `RU title missing for: ${calc.id}`);
      assert.ok(l(calc.title, 'en')?.length > 0, `EN title missing for: ${calc.id}`);
    }
  });

  it('every calculator has RU and EN description', () => {
    for (const calc of CALCULATORS) {
      assert.ok(l(calc.description, 'ru')?.length > 0, `RU desc missing for: ${calc.id}`);
      assert.ok(l(calc.description, 'en')?.length > 0, `EN desc missing for: ${calc.id}`);
    }
  });

  it('every category has both labels', () => {
    for (const [id, cat] of Object.entries(categories)) {
      assert.ok(cat.ru?.length > 0, `RU label missing for: ${id}`);
      assert.ok(cat.en?.length > 0, `EN label missing for: ${id}`);
    }
  });

  it('no placeholder strings in translations', () => {
    const pattern = /^(TODO|FIXME|TBD|PLACEHOLDER|LOREM|COMING SOON)/i;
    for (const lang of ['ru', 'en']) {
      for (const [key, value] of Object.entries(copy[lang])) {
        if (typeof value === 'string') {
          assert.ok(!pattern.test(value), `Placeholder in ${lang}.${key}`);
        }
      }
    }
  });

  it('every calculator field label is bilingual', () => {
    for (const calc of CALCULATORS) {
      for (const field of calc.fields) {
        assert.ok(l(field.label, 'ru')?.length > 0, `RU field label missing: ${calc.id}.${field.id}`);
        assert.ok(l(field.label, 'en')?.length > 0, `EN field label missing: ${calc.id}.${field.id}`);
      }
    }
  });
});
