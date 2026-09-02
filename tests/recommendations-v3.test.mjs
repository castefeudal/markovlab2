import test from 'node:test';
import assert from 'node:assert/strict';
import { getRecommendations } from '../assets/js/recommendations.js';

test('activity insight requires an entered activity duration',()=>{
  assert.equal(getRecommendations({steps:7600}).some(x=>x.id==='activity'),false);
  assert.equal(getRecommendations({moderateMinutes:0}).some(x=>x.id==='activity'),true);
});
