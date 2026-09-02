import test from 'node:test';
import assert from 'node:assert/strict';
import { copy,categories,methodLabels,evidenceLabels } from '../assets/js/i18n.js';
test('RU and EN dictionaries expose identical keys',()=>assert.deepEqual(Object.keys(copy.ru).sort(),Object.keys(copy.en).sort()));
test('all category and evidence labels are bilingual',()=>{for(const collection of [categories,methodLabels,evidenceLabels])for(const value of Object.values(collection)){assert.ok(value.ru&&value.en);if(value.desc)assert.ok(value.desc.ru&&value.desc.en);if(value.question)assert.ok(value.question.ru&&value.question.en)}});
