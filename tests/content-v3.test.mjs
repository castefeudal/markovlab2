import test from 'node:test';
import assert from 'node:assert/strict';
import { access,readFile,stat } from 'node:fs/promises';
import { resolve,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CALCULATORS } from '../assets/js/calculators.js';
import { DOMAIN_CONTENT,WHEN_USEFUL,confidenceFor,fieldHelp,relatedFor,visualizationType } from '../assets/js/content.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');

test('all registered calculators have individualized completion content',()=>{
  assert.equal(CALCULATORS.length,86);
  for(const calc of CALCULATORS){
    assert.ok(WHEN_USEFUL[calc.id]?.ru?.length>35,`${calc.id}: RU when useful`);
    assert.ok(WHEN_USEFUL[calc.id]?.en?.length>35,`${calc.id}: EN when useful`);
    assert.ok(confidenceFor(calc)?.ru&&confidenceFor(calc)?.en,`${calc.id}: confidence`);
    assert.ok(['exact','range','composition','comparison','delta','conversion','scenario'].includes(visualizationType(calc.id)),`${calc.id}: visualization`);
    assert.equal(relatedFor(calc,CALCULATORS).length,4,`${calc.id}: related`);
    for(const field of calc.fields){
      assert.ok(fieldHelp(calc,field,'ru').length>20,`${calc.id}.${field.id}: RU help`);
      assert.ok(fieldHelp(calc,field,'en').length>20,`${calc.id}.${field.id}: EN help`);
    }
  }
});

test('nine laboratories have curated workflows, unique limits and production imagery',async()=>{
  assert.equal(Object.keys(DOMAIN_CONTENT).length,9);
  const limits=new Set;
  for(const [id,meta] of Object.entries(DOMAIN_CONTENT)){
    assert.equal(meta.workflow.length,4,id);
    assert.equal(new Set(meta.workflow).size,4,id);
    for(const calcId of meta.workflow)assert.ok(CALCULATORS.some(c=>c.id===calcId&&c.category===id),`${id}: ${calcId}`);
    limits.add(meta.limit.en);
    const path=resolve(root,meta.asset.replace(/^\.\//,''));
    await access(path);
    assert.ok((await stat(path)).size<250_000,`${id}: image budget`);
  }
  assert.equal(limits.size,9);
});

test('production renderer contains no arbitrary result scale',async()=>{
  const source=await readFile(resolve(root,'assets/js/renderers.js'),'utf8');
  const v3=await readFile(resolve(root,'assets/js/renderers-v3.js'),'utf8');
  assert.doesNotMatch(v3,/%37|primary\s*%|arbitrary percentage/i);
  assert.doesNotMatch(source,/%37|primary\s*%|arbitrary percentage/i);
});

test('required core visual assets exist and remain within budget',async()=>{
  for(const name of ['hero-laboratory.webp','onboarding-local.webp','evidence-method.webp','privacy-device.webp']){
    const path=resolve(root,'assets/images/core',name);await access(path);assert.ok((await stat(path)).size<250_000,name);
  }
});
