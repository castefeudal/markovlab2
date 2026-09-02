import test from 'node:test';
import assert from 'node:assert/strict';
import { CALCULATORS } from '../assets/js/calculators.js';
import { home,calculatorsPage,categoryPage,calculatorPage,profilePage,insightsPage,evidencePage,aboutPage,notFoundPage,paletteHtml } from '../assets/js/renderers-v3.js';
const base={version:2,lang:'ru',theme:'light',profile:{weight:80,height:180,waist:90,sleepHours:7,steps:8000},favorites:[],history:[],snapshots:[],recents:[],onboardingDismissed:true};
test('all primary pages render without broken values',()=>{for(const lang of ['ru','en']){const s={...base,lang};const pages=[home(s),calculatorsPage(s),profilePage(s),insightsPage(s),evidencePage(s),aboutPage(s),notFoundPage(s),paletteHtml(s)];for(const id of ['body','energy','nutrition','strength','cardio','recovery','mind','money','utility'])pages.push(categoryPage(s,id));for(const html of pages){assert.ok(html.length>100);assert.doesNotMatch(html,/\b(?:undefined|NaN)\b/)}}});
test('every calculator page renders empty and result states',()=>{for(const c of CALCULATORS){const values=Object.fromEntries(c.fields.map(f=>[f.id,f.default]));const result=c.calculate(values,{profile:{}});for(const html of [calculatorPage(c,base,null,null,{}),calculatorPage(c,base,values,result,{})]){assert.match(html,new RegExp(c.id));assert.doesNotMatch(html,/\b(?:undefined|NaN)\b/)}}});
