import { readFile, writeFile } from 'node:fs/promises';
import { shell, home, calculatorsPage, calculatorPage } from '../assets/js/renderers-v3.js';
import { calculatorMap } from '../assets/js/calculators.js';

const state={lang:process.argv[2]==='en'?'en':'ru',theme:'light',profile:{height:182,weight:90,age:32,sex:'male'},favorites:[],recents:[],history:[],snapshots:[]};
const view=process.argv[3]||'home';
const result={primary:27.2,unit:'kg/m²',secondary:[],interpretation:{ru:'Значение находится в скрининговом диапазоне избыточной массы тела.',en:'The value is in the screening range commonly labelled overweight.'},confidence:{ru:'Это точный расчёт отношения веса к квадрату роста.',en:'This is an exact calculation of weight divided by height squared.'},limitation:{ru:'ИМТ не различает жировую и безжировую массу и не является диагнозом.',en:'BMI does not distinguish fat from fat-free mass and is not a diagnosis.'},action:{ru:'Сопоставьте результат с окружностью талии и наблюдайте динамику.',en:'Compare the result with waist circumference and track the trend.'},assumptions:[{ru:'ИМТ = вес / рост²',en:'BMI = weight / height²'}]};
const content=view==='library'?calculatorsPage(state):view==='calculator'?calculatorPage(calculatorMap.get('bmi'),state,{weight:'90',height:'182'},result):home(state);
const css=await Promise.all(['styles.css','styles-v3.css','styles-v4.css','styles-v5.css'].map(name=>readFile(new URL(`../assets/css/${name}`,import.meta.url),'utf8')));
const html=`<!doctype html><html lang="${state.lang}" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css.join('\n')}</style></head><body><a class="skip-link" href="#main">Skip</a>${shell(content,state,{page:view==='library'?'calculators':view==='calculator'?'calc':'home'})}</body></html>`;
const output=`/workspace/scratch/markovlab-v5-${view}-${state.lang}.html`;
await writeFile(output,html);
console.log(output);
