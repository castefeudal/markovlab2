import { categories, l } from './i18n.js?v=6.0.0-r2';

const STOPWORDS = new Set([
  'а','в','во','для','до','и','из','как','к','мне','мой','на','по','с','со','сколько','у','учетом','учётом','хочу','есть',
  'a','an','and','for','from','how','i','in','is','many','me','my','of','on','should','the','to','with'
]);

export const INTENT_ALIASES = {
  'navy-body-fat':['процент жира','жир по замерам','body fat percentage','body fat calculator'],
  rfm:['относительная жировая масса','процент жира по росту и талии','relative fat mass'],
  deurenberg:['процент жира по bmi','body fat from bmi'],
  'body-composition':['жировая масса','безжировая масса','состав тела','fat mass','lean mass','body composition'],
  tdee:['суточный расход калорий','поддержание калорий','сколько калорий трачу','daily calorie expenditure','maintenance calories'],
  'calorie-target':['сколько калорий мне есть','калории для сушки','дефицит калорий','набор калорий','how many calories should i eat','cutting calories','bulking calories','calorie deficit'],
  mifflin:['основной обмен','калории в покое','bmr','resting calories'],
  'protein-range':['сколько белка','белок для набора','белок на сушке','protein target','how much protein'],
  e1rm:['максимум в жиме','одноповторный максимум','максимальный вес','one rep max','1 rep max','bench press max'],
  pace:['темп бега','минут на километр','running pace','pace from speed'],
  speed:['скорость бега','километров в час','running speed','speed from pace'],
  'race-time':['время забега','прогноз времени бега','race time prediction'],
  'real-return':['доходность с учетом инфляции','доходность с учётом инфляции','реальная доходность','inflation adjusted return','real investment return'],
  'compound-interest':['сложный процент','рост инвестиций','compound interest','investment growth'],
  'loan-payment':['платеж по кредиту','платёж по кредиту','loan payment','monthly payment'],
  'sleep-gap':['сколько мне не хватает сна','дефицит сна','sleep debt','sleep gap'],
  'caffeine-half-life':['когда выйдет кофеин','остаток кофеина','caffeine half life','caffeine remaining']
};

export const normalizeSearch = value => String(value || '')
  .toLocaleLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ё/g, 'е')
  .replace(/[^a-zа-я0-9%]+/gi, ' ')
  .trim();

const searchableText = calc => normalizeSearch([
  calc.id,
  l(calc.title,'ru'), l(calc.title,'en'),
  l(calc.description,'ru'), l(calc.description,'en'),
  l(categories[calc.category],'ru'), l(categories[calc.category],'en'),
  l(categories[calc.category].question,'ru'), l(categories[calc.category].question,'en'),
  ...(calc.keywords || []), ...(INTENT_ALIASES[calc.id] || [])
].join(' '));

const bigrams = text => {
  const compact=text.replace(/\s+/g,' '), out=new Set();
  for(let i=0;i<compact.length-1;i++)out.add(compact.slice(i,i+2));
  return out;
};

export function searchScore(calc, query) {
  const q=normalizeSearch(query);
  if(!q)return 1;
  const hay=searchableText(calc), phraseAliases=(INTENT_ALIASES[calc.id]||[]).map(normalizeSearch);
  if(phraseAliases.some(alias=>alias===q))return 170;
  if(phraseAliases.some(alias=>alias.includes(q)||q.includes(alias)))return 145;
  if(hay.includes(q))return 120 + Math.max(0,30-q.length);
  const tokens=q.split(' ').filter(token=>token.length>1&&!STOPWORDS.has(token));
  if(!tokens.length)return 0;
  let matched=0;
  for(const token of tokens){
    if(hay.includes(token))matched+=1;
    else if(token.length>=4){
      const target=bigrams(token), source=bigrams(hay), overlap=[...target].filter(x=>source.has(x)).length;
      if(overlap/Math.max(target.size,1)>=.72)matched+=.72;
    }
  }
  const coverage=matched/tokens.length;
  return coverage>=.5 ? Math.round(coverage*80 + matched*4) : 0;
}

export function searchCalculators(calculators, query, {favorites=null}={}) {
  return calculators
    .filter(calc=>!favorites||favorites.has(calc.id))
    .map((calc,index)=>({calc,index,score:searchScore(calc,query)}))
    .filter(item=>item.score>0)
    .sort((a,b)=>b.score-a.score||Number(Boolean(b.calc.featured))-Number(Boolean(a.calc.featured))||a.index-b.index)
    .map(item=>item.calc);
}
