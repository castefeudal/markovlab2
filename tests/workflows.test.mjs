import test from 'node:test';
import assert from 'node:assert/strict';
import { WORKFLOWS } from '../assets/js/workflows.js';
import { calculatorMap } from '../assets/js/calculators.js';
import { home, workflowsPage } from '../assets/js/renderers-v3.js';

const state={version:4,lang:'ru',theme:'light',profile:{},favorites:[],recents:[],history:[],snapshots:[],onboardingDismissed:true};

test('decision workflows use registered calculators and only compatible explicit handoffs',()=>{
  assert.equal(WORKFLOWS.length,6);
  assert.equal(new Set(WORKFLOWS.map(workflow=>workflow.id)).size,WORKFLOWS.length);
  for(const workflow of WORKFLOWS){
    assert.ok(workflow.steps.length>=3,`${workflow.id}: needs a meaningful sequence`);
    const completed=new Set();
    for(const step of workflow.steps){
      const calc=calculatorMap.get(step.calcId);
      assert.ok(calc,`${workflow.id}: unknown calculator ${step.calcId}`);
      for(const transfer of step.prefill||[]){
        assert.ok(completed.has(transfer.from),`${workflow.id}: ${transfer.from} must precede its handoff`);
        assert.ok(calc.fields.some(field=>field.id===transfer.to),`${workflow.id}: ${transfer.to} is not an input of ${step.calcId}`);
      }
      completed.add(step.calcId);
    }
  }
});

test('workflows are a first-class route and a visible home entry point',()=>{
  const html=workflowsPage(state);
  assert.match(html,/Пути решения/);
  assert.equal((html.match(/data-action="workflow-start"/g)||[]).length,WORKFLOWS.length);
  assert.match(home(state),/href="#workflows"/);
});
