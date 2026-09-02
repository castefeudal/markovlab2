import * as legacy from './renderers.js?v=6.0.0-r1';
import { CALCULATORS, calculatorMap } from './calculators.js?v=6.0.0-r1';
import { REFERENCES } from './references.js?v=6.0.0-r1';
import { categories, evidenceLabels, methodLabels, l, t, formatNumber, formatUnit } from './i18n.js?v=6.0.0-r1';
import { icon, logo } from './icons.js?v=6.0.0-r1';
import { DOMAIN_CONTENT, WHEN_USEFUL, applyResultGuidance, confidenceFor, fieldHelp, relatedFor, visualizationType } from './content.js?v=6.0.0-r1';
import { searchCalculators as legacySearchFn } from './search.js?v=6.0.0-r1';
import { RELEASE_CONFIG } from './config.js?v=6.0.0-r1';
import { WORKFLOWS, activeWorkflowStep, loadWorkflowRun, workflowMap } from './workflows.js?v=6.0.0-r1';
import { getProConfig } from './pro.js?v=6.0.0-r1';

const bi=(ru,en,lang)=>lang==='ru'?ru:en;
const esc=legacy.esc;
const platformShortcut=()=>typeof navigator!=='undefined'&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent)?'⌘K':'Ctrl K';
const badge=(calc,lang)=>`<span class="badge method">${esc(l(methodLabels[calc.methodType],lang))}</span><span class="badge evidence-${calc.evidenceStrength}">${esc(l(evidenceLabels[calc.evidenceStrength],lang))}</span>`;
const sectionHead=(eyebrow,title,text='')=>`<header class="section-head"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2></div>${text?`<p>${text}</p>`:''}</header>`;
const formatFieldValue=(field,value,lang)=>{
  if(field?.type!=='select')return value;
  return l(field.options?.find(option=>String(option.value)===String(value))?.label,lang)||value;
};

const count=id=>CALCULATORS.filter(calc=>calc.category===id).length;

const EDITORIAL_USE_CASES=[
  {asset:'./assets/images/editorial/body-measurement.webp',calc:'navy-body-fat',kicker:{ru:'ТЕЛО · ДИНАМИКА',en:'BODY · TREND'},title:{ru:'Не «какой у меня процент», а меняется ли форма?',en:'Not “what is my percentage,” but is the trend changing?'},text:{ru:'Измерьте окружности по одному протоколу, сохраните результат и повторите в сопоставимых условиях. Решение принимает динамика, а не один замер.',en:'Measure circumferences with one protocol, save the result, and repeat under comparable conditions. The trend—not one reading—drives the decision.'}},
  {asset:'./assets/images/editorial/nutrition-planning.webp',calc:'calorie-target',kicker:{ru:'ПИТАНИЕ · ПЛАН',en:'NUTRITION · PLAN'},title:{ru:'Переведите цель в проверяемый рацион.',en:'Turn a goal into a testable intake plan.'},text:{ru:'Сначала оцените поддержку, затем задайте умеренный сценарий и калибруйте его по средней массе за несколько недель.',en:'Estimate maintenance first, choose a moderate scenario, then calibrate it against multi-week average body mass.'}},
  {asset:'./assets/images/editorial/training-review.webp',calc:'volume-load',kicker:{ru:'ТРЕНИРОВКА · ОБРАТНАЯ СВЯЗЬ',en:'TRAINING · FEEDBACK'},title:{ru:'Сравнивайте только сопоставимые сессии.',en:'Compare sessions that are actually comparable.'},text:{ru:'Фиксируйте упражнение, технику, объём и субъективную трудность. Число становится полезным, когда помогает скорректировать следующую тренировку.',en:'Record exercise, technique, volume, and perceived effort. A metric becomes useful when it changes the next session.'}},
  {asset:'./assets/images/editorial/decision-scenarios.webp',calc:'priority-score',kicker:{ru:'РЕШЕНИЕ · СЦЕНАРИИ',en:'DECISION · SCENARIOS'},title:{ru:'Проверьте, какой параметр действительно меняет вывод.',en:'Test which parameter actually changes the conclusion.'},text:{ru:'Сравните базовый сценарий с альтернативой, найдите главный драйвер и действуйте только там, где разница практически значима.',en:'Compare a baseline with an alternative, identify the main driver, and act only where the difference is practically meaningful.'}}
];

const DOMAIN_PRACTICE={
  body:{asset:EDITORIAL_USE_CASES[0].asset,title:{ru:'Используйте одинаковый протокол измерения',en:'Use the same measurement protocol'},text:{ru:'Талия утром и вечером — не одна точка данных. Повторяйте измерение в одинаковое время и смотрите на несколько наблюдений.',en:'A morning and evening waist reading are not the same data point. Repeat under consistent conditions and use several observations.'}},
  energy:{asset:'./assets/images/editorial/energy-calibration.webp',title:{ru:'Калибруйте оценку по реальной динамике',en:'Calibrate estimates against real change'},text:{ru:'Расчёт TDEE — стартовая гипотеза. Средний рацион и тренд массы за 2–4 недели дают более полезную обратную связь.',en:'A TDEE calculation is a starting hypothesis. Average intake and a 2–4 week weight trend provide better feedback.'}},
  nutrition:{asset:EDITORIAL_USE_CASES[1].asset,title:{ru:'Превратите диапазон в простой план',en:'Turn a range into a simple plan'},text:{ru:'Выберите ориентир, соберите несколько повторяемых приёмов пищи и проверяйте соблюдаемость до микротюнинга процентов.',en:'Choose a reference, build a few repeatable meals, and verify adherence before micro-tuning percentages.'}},
  strength:{asset:EDITORIAL_USE_CASES[2].asset,title:{ru:'Число должно менять следующую сессию',en:'The number should change the next session'},text:{ru:'Используйте оценку 1ПМ, объём и плотность для планирования нагрузки — не как доказательство силы вне конкретного протокола.',en:'Use estimated 1RM, volume, and density to plan load—not as proof of strength outside the protocol.'}},
  cardio:{asset:'./assets/images/editorial/cardio-pace.webp',title:{ru:'Сохраняйте условия рядом с результатом',en:'Store conditions with the result'},text:{ru:'Темп без рельефа, погоды и длительности неполон. Сравнивайте одинаковые маршруты или стандартизированные тесты.',en:'Pace without terrain, weather, and duration is incomplete. Compare matched routes or standardized tests.'}},
  recovery:{asset:'./assets/images/editorial/recovery-sleep.webp',title:{ru:'Ищите повторяемый ограничитель',en:'Look for the recurring constraint'},text:{ru:'Одна плохая ночь — событие. Повторяющийся дефицит сна, поздний кофеин или сдвиг режима — уже управляемая закономерность.',en:'One poor night is an event. Repeated sleep debt, late caffeine, or schedule drift is a manageable pattern.'}},
  mind:{asset:'./assets/images/editorial/focus-priority.webp',title:{ru:'Считайте только то, что меняет приоритет',en:'Measure only what changes priority'},text:{ru:'Оцените эффект, уверенность и усилие, затем проверьте чувствительность вывода. Если порядок меняется от одного балла — решение хрупкое.',en:'Rate impact, confidence, and effort, then test sensitivity. If one point reverses the order, the decision is fragile.'}},
  money:{asset:'./assets/images/editorial/finance-scenarios.webp',title:{ru:'Стресс-тест важнее красивого прогноза',en:'A stress test beats a pretty forecast'},text:{ru:'Сравните несколько ставок, расходов и горизонтов. Если решение работает только в оптимистичном сценарии, запас прочности слабый.',en:'Compare several rates, expense levels, and horizons. If the decision works only in the optimistic case, its margin of safety is weak.'}},
  utility:{asset:'./assets/images/editorial/converter-precision.webp',title:{ru:'Сохраняйте исходную единицу и точность',en:'Keep the source unit and precision'},text:{ru:'Конвертация точна, но преждевременное округление на цепочке расчётов накапливает ошибку.',en:'Conversion is exact, but premature rounding across a calculation chain accumulates error.'}}
};

export function shell(content,state,r){
  const lang=state.lang;
  const nav=[['home','home','overview'],['calculators','calculators','calculators'],['workflows','workflows','workflowNav'],['insights','insights','insights'],['profile','profile','profile']];
  const secondary=[['evidence','evidence','evidence'],['about','about','about']];
  const active=page=>r.page===page?'active':'';
  const shortcut=platformShortcut();
  return `<div class="shell shell-v5" data-route="${esc(r.page)}">
  <header class="topbar topbar-v5">
    <a class="brand brand-v5" href="#home" aria-label="MARKOVLAB">${logo(false,bi('ИЗМЕРИМЫЙ ПРОГРЕСС','MEASURABLE PROGRESS',lang))}</a>
    <nav class="nav nav-v5" aria-label="${bi('Основная навигация','Primary navigation',lang)}">${nav.map(([page,name,key])=>`<a class="${active(page)}" href="#${page}" ${r.page===page?'aria-current="page"':''}>${icon(name)}<span>${t(key,lang)}</span></a>`).join('')}</nav>
    <div class="connection" id="connection" hidden>${t('offline',lang)}</div>
    <div class="top-actions">
      <button class="search-trigger btn" data-action="palette" aria-label="${t('search',lang)}">${icon('search')}<span>${t('search',lang)}</span><kbd>${shortcut}</kbd></button>
      <div class="locale-switcher" role="group" aria-label="${t('language',lang)}"><button data-lang="ru" aria-pressed="${lang==='ru'}">RU</button><span aria-hidden="true">/</span><button data-lang="en" aria-pressed="${lang==='en'}">EN</button></div>
      <div class="settings-menu"><button class="icon-btn" data-action="settings-menu" aria-expanded="false" aria-controls="settings-popover" aria-label="${t('theme',lang)}">${icon('theme')}</button><div class="data-popover settings-popover" id="settings-popover"><div class="popover-copy"><strong>${t('theme',lang)}</strong><span>${bi('Четыре разные палитры. «Системная» следует настройке устройства.','Four distinct palettes. System follows your device setting.',lang)}</span></div>${[['system','system'],['light','light'],['paper','paper'],['dark','dark'],['midnight','midnight']].map(([value,key])=>`<button class="theme-choice theme-${value}" data-theme="${value}" aria-pressed="${state.theme===value}"><i aria-hidden="true"></i><span>${t(key,lang)}${value==='system'?`<small>${bi('Автоматически','Automatic',lang)}</small>`:''}</span>${state.theme===value?icon('check'):''}</button>`).join('')}</div></div>
      <div class="data-menu"><button class="icon-btn" data-action="data-menu" aria-expanded="false" aria-controls="data-popover" aria-label="${t('data',lang)}">${icon('data')}</button><div class="data-popover" id="data-popover"><div class="popover-copy"><strong>${t('data',lang)}</strong><span>${t('privacyNote',lang)}</span></div>${secondary.map(([page,name,key])=>`<a href="#${page}">${icon(name)} ${t(key,lang)}</a>`).join('')}<button data-action="export">${icon('data')} ${t('export',lang)}</button><button data-action="import">${icon('calculators')} ${t('import',lang)}</button><button data-action="print">${icon('print')} ${t('print',lang)}</button><button class="danger" data-action="clear-data">${icon('close')} ${t('clear',lang)}</button></div></div>
    </div>
  </header>
  <main class="main main-v5" id="main" tabindex="-1">${content}</main>
  <nav class="mobile-nav mobile-nav-v5" aria-label="${bi('Мобильная навигация','Mobile navigation',lang)}">${nav.filter(([page])=>page!=='workflows').slice(0,3).map(([page,name,key])=>`<a class="${active(page)}" href="#${page}" ${r.page===page?'aria-current="page"':''}>${icon(name)}<span>${t(key,lang)}</span></a>`).join('')}<button data-action="data-menu" aria-label="${bi('Ещё','More',lang)}">${icon('data')}<span>${bi('Ещё','More',lang)}</span></button></nav>
  </div>`;
}

export function calculatorsPage(state,query='',view='recommended'){
  const lang=state.lang,q=query.trim(),favoritesOnly=view==='favorites',allTools=view==='all',favoriteSet=favoritesOnly?new Set(state.favorites):null,list=legacySearch(query,favoriteSet).slice(0,q?12:CALCULATORS.length);
  const recent=state.recents.map(id=>calculatorMap.get(id)).filter(Boolean).slice(0,4);
  const essentials=['bmi','tdee','navy-body-fat','e1rm','pace','real-return'].map(id=>calculatorMap.get(id)).filter(Boolean);
  const results=q||favoritesOnly?list:allTools?[...CALCULATORS]:essentials;
  return `<header class="library-intro"><div><span class="eyebrow">${bi(`${CALCULATORS.length} ИНСТРУМЕНТОВ · 9 ЛАБОРАТОРИЙ`,`${CALCULATORS.length} TOOLS · 9 LABORATORIES`,lang)}</span><h1>${bi('Что вы хотите узнать?','What do you want to find out?',lang)}</h1><p>${bi('Опишите задачу своими словами. Название формулы знать не нужно.','Describe the outcome in your own words. You do not need the formula name.',lang)}</p></div><div class="library-count"><strong>${CALCULATORS.length}</strong><span>${t('tools',lang)}</span></div></header>
  <div class="search-panel search-panel-v5">${icon('search')}<input class="library-search" id="library-search" type="search" value="${esc(query)}" placeholder="${t('searchPlaceholder',lang)}" aria-label="${t('search',lang)}"><kbd>${platformShortcut()}</kbd><button class="icon-btn" data-action="clear-library-search" aria-label="${t('clearSearch',lang)}">${icon('close')}</button></div>
  <div class="intent-examples" aria-label="${bi('Примеры запросов','Example searches',lang)}">${(lang==='ru'?['сколько калорий мне есть','процент жира','максимум в жиме','темп бега']:['how many calories should I eat','body fat','one rep max','running pace']).map(value=>`<button data-action="intent-search" data-search-query="${esc(value)}">${esc(value)}</button>`).join('')}</div>
  <div class="library-layout"><aside class="lab-index"><div class="lab-index-head"><strong>${bi('Лаборатории','Laboratories',lang)}</strong><button class="text-action ${view==='recommended'?'active':''}" data-library-view="recommended">${bi('Рекомендуемые','Recommended',lang)} · ${essentials.length}</button><button class="text-action ${allTools?'active':''}" data-library-view="all">${bi(`Все ${CALCULATORS.length}`,`All ${CALCULATORS.length}`,lang)}</button><button class="text-action ${favoritesOnly?'active':''}" data-library-view="favorites">${icon('star')} ${t('favorites',lang)} · ${state.favorites.length}</button></div>${Object.entries(categories).map(([id,category])=>`<a href="#category/${id}"><span>${icon(id)}</span><div><strong>${esc(l(category,lang))}</strong><small>${esc(l(category.question,lang))}</small></div><b>${count(id)}</b></a>`).join('')}</aside><section class="library-results-v5" id="library-results"><header><div><span class="eyebrow">${q?bi('РЕЗУЛЬТАТЫ ПОИСКА','SEARCH RESULTS',lang):favoritesOnly?bi('СОХРАНЕНО','SAVED',lang):allTools?bi('ВСЯ БИБЛИОТЕКА','FULL LIBRARY',lang):bi('РЕКОМЕНДУЕМЫЕ','RECOMMENDED',lang)}</span><h2>${q?`${list.length} ${bi('подходящих инструментов','matching tools',lang)}`:favoritesOnly?t('favorites',lang):allTools?`${CALCULATORS.length} ${t('tools',lang)}`:bi('Полезные отправные точки','Useful starting points',lang)}</h2></div>${recent.length&&!q&&!favoritesOnly&&!allTools?`<span class="recent-note">${bi('Недавние доступны в поиске','Recents are available in search',lang)}</span>`:''}</header>${results.length?`<div class="tool-list">${results.map(calc=>toolRow(calc,state)).join('')}</div>`:`<div class="empty-state"><h2>${favoritesOnly?t('noFavorites',lang):t('noResults',lang)}</h2><p>${bi('Попробуйте описать цель иначе или откройте все инструменты.','Try describing the outcome differently or open all tools.',lang)}</p><button class="btn" data-library-view="all">${bi(`Все ${CALCULATORS.length} инструментов`,`All ${CALCULATORS.length} tools`,lang)}</button></div>`}</section></div>`;
}

export function workflowsPage(state){
  const lang=state.lang,run=loadWorkflowRun(),active=workflowMap.get(run?.id),activeStep=active?.steps[run.index];
  const heading=bi('Пути решения','Decision workflows',lang),intro=bi('Не коллекция формул, а короткие последовательности для одного реального вопроса. MARKOVLAB переносит только те результаты, чьи единицы и смысл совпадают; остальные вводы остаются явными.','Not a collection of formulas, but short sequences for one real question. MARKOVLAB carries only results whose units and meaning match; every other input stays explicit.',lang);
  return `<header class="workflow-page-hero"><div><span class="eyebrow">${bi('MARKOVLAB · ПУТИ РЕШЕНИЯ','MARKOVLAB · DECISION WORKFLOWS',lang)}</span><h1>${heading}</h1><p>${intro}</p><div class="workflow-principles"><span>${icon('lock')} ${bi('Только внутри браузера','Browser-local only',lang)}</span><span>${icon('evidence')} ${bi('Без скрытых предположений','No hidden assumptions',lang)}</span><span>${icon('check')} ${bi('Можно остановиться на любом шаге','Stop at any step',lang)}</span></div></div><div class="workflow-page-measure"><span>${bi('6 путей','6 workflows',lang)}</span><strong>${bi('Вопрос → решение','Question → decision',lang)}</strong><small>${bi('Результат передаётся только при совпадении единиц и смысла.','A result moves forward only when its unit and meaning match.',lang)}</small></div></header>
  ${active&&activeStep?`<section class="workflow-continue"><div><span class="eyebrow">${bi('ПРОДОЛЖИТЬ ПУТЬ','CONTINUE WORKFLOW',lang)}</span><h2>${esc(l(active.title,lang))}</h2><p>${bi(`Сейчас шаг ${run.index+1} из ${active.steps.length}: `,`Now step ${run.index+1} of ${active.steps.length}: `,lang)}<strong>${esc(l(activeStep.label,lang))}</strong></p></div><a class="btn primary" href="#calc/${activeStep.calcId}">${bi('Продолжить','Continue',lang)} ${icon('arrow')}</a></section>`:''}
  <section class="workflow-grid" aria-label="${heading}">${WORKFLOWS.map((workflow,index)=>workflowCard(workflow,state,index,run)).join('')}</section>
  <aside class="workflow-boundary"><span>${icon('about')}</span><div><span class="eyebrow">${bi('ГРАНИЦА МЕТОДА','METHOD BOUNDARY',lang)}</span><h2>${bi('Путь не делает оценку прогнозом.','A workflow does not turn an estimate into a prediction.',lang)}</h2><p>${bi('Каждый шаг сохраняет исходное ограничение и источник. Когда следующий расчёт требует нового допущения, MARKOVLAB просит ввести его явно — вместо того чтобы угадывать.','Each step retains its original limitation and source. When the next calculation needs a new assumption, MARKOVLAB asks you to enter it explicitly instead of guessing.',lang)}</p></div></aside>`;
}

function workflowCard(workflow,state,index,run){
  const lang=state.lang,active=run?.id===workflow.id,current=active?run.index:-1,first=workflow.steps[0];
  return `<article class="workflow-card ${active?'is-active':''}"><header><span class="workflow-card-index">${String(index+1).padStart(2,'0')}</span>${icon(workflow.category)}<small>${esc(l(categories[workflow.category],lang))}</small></header><div><h2>${esc(l(workflow.title,lang))}</h2><p>${esc(l(workflow.description,lang))}</p></div><ol>${workflow.steps.map((step,stepIndex)=>`<li class="${active&&stepIndex<current?'done':''} ${active&&stepIndex===current?'current':''}"><b>${stepIndex<current?icon('check'):String(stepIndex+1).padStart(2,'0')}</b><span>${esc(l(step.label,lang))}</span></li>`).join('')}</ol><footer><span>${bi('Итог: ','Outcome: ',lang)}${esc(l(workflow.outcome,lang))}</span><button class="btn ${active?'primary':''}" data-action="workflow-start" data-workflow-id="${workflow.id}">${active?bi('Продолжить','Continue',lang):bi('Начать путь','Start workflow',lang)} ${icon('arrow')}</button></footer></article>`;
}

function legacySearch(query,favoriteSet){return legacySearchFn(CALCULATORS,query,{favorites:favoriteSet})}
function toolRow(calc,state){const lang=state.lang,favorite=state.favorites.includes(calc.id);return `<article class="tool-row"><a href="#calc/${calc.id}"><span class="tool-row-icon">${icon(calc.category)}</span><span class="tool-row-copy"><small>${esc(l(categories[calc.category],lang))}</small><strong>${esc(l(calc.title,lang))}</strong><p>${esc(l(WHEN_USEFUL[calc.id]||calc.description,lang))}</p></span><span class="tool-row-meta">${esc(l(methodLabels[calc.methodType],lang))}${icon('arrow')}</span></a><button class="fav-btn ${favorite?'active':''}" data-favorite="${calc.id}" aria-label="${t('favorite',lang)}" aria-pressed="${favorite}">${icon('star')}</button></article>`}
export const notFoundPage=legacy.notFoundPage;
export const paletteHtml=legacy.paletteHtml;
export const toolCard=legacy.toolCard;

export function evidencePage(state,query=''){
  const lang=state.lang;
  return legacy.evidencePage(state,query).replace(/<\/header><div class="evidence-axis">/,`</header><figure class="evidence-hero-visual evidence-interval-v5"><img src="./assets/images/core/evidence-interval-v5.webp" width="1400" height="1050" loading="eager" alt=""><figcaption><span class="eyebrow">${bi('ДИАПАЗОН, НЕ ОБЕЩАНИЕ','A RANGE, NOT A PROMISE',lang)}</span><strong>${bi('Основание задаёт границы уверенности. Оно не превращает оценку в точное личное измерение.','Evidence defines the bounds of confidence. It does not turn an estimate into an exact personal measurement.',lang)}</strong><small>${bi('Тип метода и сила основания остаются двумя независимыми осями.','Method type and evidence strength remain two independent axes.',lang)}</small></figcaption></figure><div class="evidence-axis">`);
}

export function onboarding(state){
  const lang=state.lang;
  return legacy.onboarding(state).replace(/<div class="onboarding-visual">[\s\S]*?<\/div>/,`<figure class="onboarding-visual onboarding-image"><img src="./assets/images/core/onboarding-local.webp" width="1400" height="1050" alt=""><figcaption>${bi('Профиль остаётся внутри этого браузера; расчёты и основания видимы.','The profile stays inside this browser; calculations and evidence remain visible.',lang)}</figcaption></figure>`);
}

export function home(state){
  const lang=state.lang;
  const recent=state.recents.map(id=>calculatorMap.get(id)).filter(Boolean).slice(0,3);
  const latest=state.history.at(-1);
  const starts=['tdee','navy-body-fat','e1rm','pace','real-return'].map(id=>calculatorMap.get(id)).filter(Boolean);
  return `<section class="home-hero-v5">
    <div class="home-hero-copy"><span class="eyebrow">${bi('ПЕРСОНАЛЬНАЯ ЛАБОРАТОРИЯ','PERSONAL MEASUREMENT LAB',lang)}</span><h1>${bi('Измерение, которое приводит к решению.','A measurement that leads to a decision.',lang)}</h1><p>${bi('Найдите нужный расчёт обычными словами, получите понятный результат и сразу увидьте основание, ограничение и следующий шаг.','Find the right calculation in plain language, get a clear result, and immediately see its evidence, limitation and next step.',lang)}</p><button class="home-search" data-action="palette">${icon('search')}<span><strong>${bi('Что вы хотите измерить?','What do you want to measure?',lang)}</strong><small>${bi('Например: сколько калорий мне есть','For example: how many calories should I eat',lang)}</small></span><kbd>${platformShortcut()}</kbd></button><div class="hero-quick">${starts.slice(0,4).map(calc=>`<a href="#calc/${calc.id}">${esc(l(calc.title,lang))}${icon('arrow')}</a>`).join('')}</div><div class="hero-trust"><span>${icon('lock')} ${bi('Данные остаются в браузере','Data stays in your browser',lang)}</span><span>${icon('evidence')} ${bi('Формулы и ограничения открыты','Open formulas and limitations',lang)}</span><span>${CALCULATORS.length} ${t('tools',lang)}</span></div></div>
    <figure class="measure-preview" aria-label="${bi('Пример пути от исходных данных к результату и действию','Example path from inputs to result and action',lang)}"><div class="preview-rail"><span>01 ${bi('ДАННЫЕ','INPUT',lang)}</span><span class="active">02 ${bi('РЕЗУЛЬТАТ','RESULT',lang)}</span><span>03 ${bi('ДЕЙСТВИЕ','ACTION',lang)}</span></div><div class="preview-question"><small>${bi('ПРИМЕР · ИНДЕКС МАССЫ ТЕЛА','EXAMPLE · BODY MASS INDEX',lang)}</small><strong>${bi('Как соотносятся вес и рост?','How do weight and height relate?',lang)}</strong></div><div class="preview-metric"><strong>${formatNumber(24.7,lang,1)}</strong><span>kg/m²</span><i></i></div><div class="preview-decision"><div><small>${bi('СМЫСЛ','MEANING',lang)}</small><p>${bi('Ориентир для скрининга, а не диагноз.','A screening reference, not a diagnosis.',lang)}</p></div><div><small>${bi('СЛЕДУЮЩИЙ ШАГ','NEXT STEP',lang)}</small><p>${bi('Сопоставьте с окружностью талии.','Compare with waist circumference.',lang)}</p></div></div><figcaption>${bi('Реальная структура результата MARKOVLAB: число → смысл → граница → действие.','The actual MARKOVLAB result structure: metric → meaning → boundary → action.',lang)}</figcaption></figure>
  </section>
  ${recent.length||latest?`<section class="continue-strip"><div><span class="eyebrow">${bi('ПРОДОЛЖИТЬ','CONTINUE',lang)}</span><h2>${bi('Ваше рабочее пространство','Your workspace',lang)}</h2></div>${latest?`<a class="continue-result" href="#calc/${esc(latest.calcId)}"><small>${bi('Последний результат','Latest result',lang)}</small><strong>${esc(historySummary(latest,lang))}</strong><span>${esc(l(calculatorMap.get(latest.calcId)?.title,lang))}</span></a>`:''}<div class="continue-links">${recent.map(calc=>`<a href="#calc/${calc.id}">${icon(calc.category)}<span>${esc(l(calc.title,lang))}</span></a>`).join('')}</div><a class="text-action" href="#insights">${bi('История и динамика','History and progress',lang)} ${icon('arrow')}</a></section>`:''}
  <section class="home-section-v5"><header class="section-head"><div><span class="eyebrow">${bi('БЫСТРЫЙ СТАРТ','QUICK START',lang)}</span><h2>${bi('Начните с практического вопроса','Start with a practical question',lang)}</h2></div><p>${bi('Профиль не нужен. Значения можно сохранить после расчёта.','No profile required. Save values after the calculation if useful.',lang)}</p></header><div class="question-list">${starts.map((calc,index)=>`<a href="#calc/${calc.id}"><b>${String(index+1).padStart(2,'0')}</b><span><strong>${esc(l(calc.title,lang))}</strong><small>${esc(l(WHEN_USEFUL[calc.id]||calc.description,lang))}</small></span>${icon('arrow')}</a>`).join('')}</div></section>
  <section class="home-section-v5 workflow-launch"><header class="section-head"><div><span class="eyebrow">${bi('НЕ ОДНА ФОРМУЛА','MORE THAN ONE FORMULA',lang)}</span><h2>${bi('Решите задачу по шагам','Work through the decision',lang)}</h2></div><a class="text-action" href="#workflows">${bi('Все пути решения','All decision workflows',lang)} ${icon('arrow')}</a></header><div>${WORKFLOWS.slice(0,3).map((workflow,index)=>`<a href="#workflows" class="workflow-launch-item"><b>${String(index+1).padStart(2,'0')}</b><span>${icon(workflow.category)}<strong>${esc(l(workflow.title,lang))}</strong><small>${workflow.steps.length} ${bi('шага с передачей совместимых результатов','steps with compatible-result handoff',lang)}</small></span>${icon('arrow')}</a>`).join('')}</div></section>
  <section class="home-section-v5 practice-section"><header class="section-head"><div><span class="eyebrow">${bi('ИЗ ЧИСЛА — В ДЕЙСТВИЕ','FROM NUMBER TO ACTION',lang)}</span><h2>${bi('Где MARKOVLAB полезен в реальной жизни','Where MARKOVLAB fits real life',lang)}</h2></div><p>${bi('Каждый сценарий связывает измерение с конкретным решением, повторной проверкой и следующим шагом.','Each scenario connects a measurement to a decision, a repeat check, and a next step.',lang)}</p></header><div class="practice-grid">${EDITORIAL_USE_CASES.map((item,index)=>`<article class="practice-story ${index===0?'featured':''}"><a href="#calc/${item.calc}" aria-label="${esc(l(item.title,lang))}"><figure><img src="${item.asset}" width="1200" height="900" loading="${index===0?'eager':'lazy'}" alt=""><figcaption>${esc(l(item.kicker,lang))}</figcaption></figure><div><span class="story-number">0${index+1}</span><h3>${esc(l(item.title,lang))}</h3><p>${esc(l(item.text,lang))}</p><strong>${bi('Открыть инструмент','Open tool',lang)} ${icon('arrow')}</strong></div></a></article>`).join('')}</div></section>
  <aside class="author-note"><div class="author-mark">PM</div><blockquote><span class="eyebrow">${bi('ОТ АВТОРА','FROM THE AUTHOR',lang)}</span><p>${bi('«Я создавал MARKOVLAB не ради коллекции формул. Мне нужен был инструмент, который заставляет остановиться после числа и задать главный вопрос: что именно я теперь изменю?»','“I did not build MARKOVLAB as a collection of formulas. I needed a tool that makes you pause after the number and ask the only question that matters: what will I change now?”',lang)}</p><footer><strong>${bi('Павел Марков','Pavel Markov',lang)}</strong><span>${bi('автор MARKOVLAB','creator of MARKOVLAB',lang)}</span></footer></blockquote><a class="btn" href="#about">${bi('Принципы продукта','Product principles',lang)} ${icon('arrow')}</a></aside>
  <section class="home-section-v5 lab-atlas"><header class="section-head"><div><span class="eyebrow">${bi('9 ЛАБОРАТОРИЙ','9 LABORATORIES',lang)}</span><h2>${bi('Одна система, разные решения','One system, different decisions',lang)}</h2></div><a class="text-action" href="#calculators">${bi('Все 86 инструментов','All 86 tools',lang)} ${icon('arrow')}</a></header><div class="lab-atlas-grid">${Object.entries(categories).map(([id,category])=>`<a href="#category/${id}" class="domain-${id}"><img src="${DOMAIN_CONTENT[id].asset}" width="1200" height="900" loading="lazy" alt=""><span>${icon(id)}</span><div><strong>${esc(l(category,lang))}</strong><small>${esc(l(category.question,lang))}</small></div><b>${count(id)}</b></a>`).join('')}</div></section>
  <section class="trust-system"><div><span class="eyebrow">${bi('ДОВЕРИЕ БЕЗ АККАУНТА','TRUST WITHOUT AN ACCOUNT',lang)}</span><h2>${bi('Прозрачность встроена в результат.','Transparency is built into every result.',lang)}</h2><p>${bi('Метод и сила основания показаны отдельно. Данные не отправляются на backend: профиль и история находятся только в этом браузере.','Method type and evidence strength are shown separately. No data is sent to a backend: profile and history stay in this browser.',lang)}</p><div class="trust-actions"><a class="btn" href="#evidence">${t('evidence',lang)} ${icon('arrow')}</a><a class="text-action" href="#about">${bi('Как устроена приватность','How privacy works',lang)}</a></div></div><div class="local-diagram" role="img" aria-label="${bi('Браузер хранит данные локально и экспортирует файл; сервер MARKOVLAB не получает данные','Browser stores data locally and exports a file; MARKOVLAB server receives no data',lang)}"><span>${icon('profile')}<b>${bi('Браузер','Browser',lang)}</b></span>${icon('arrow')}<span>${icon('lock')}<b>localStorage</b></span>${icon('arrow')}<span>${icon('data')}<b>${bi('Файл экспорта','Export file',lang)}</b></span><em>${bi('Нет передачи на сервер','No backend upload',lang)}</em></div></section>`;
}

export function categoryPage(state,id){
  const lang=state.lang,c=categories[id],meta=DOMAIN_CONTENT[id],practice=DOMAIN_PRACTICE[id];
  if(!c||!meta)return notFoundPage(state);
  const list=CALCULATORS.filter(x=>x.category===id);
  const workflow=meta.workflow.map(x=>calculatorMap.get(x)).filter(Boolean);
  const others=list.filter(x=>!workflow.includes(x));
  return `<header class="category-hero domain-${id}"><div><a class="back-link" href="#calculators">${icon('arrow')} ${t('calculators',lang)}</a><span class="category-symbol">${icon(id)}</span><span class="eyebrow">${list.length} ${t('tools',lang)}</span><h1>${esc(l(c,lang))}</h1><p>${esc(l(c.intro,lang))}</p></div><figure class="category-illustration"><img src="${meta.asset}" width="1200" height="900" alt=""><figcaption>${esc(l(c.question,lang))}</figcaption></figure></header>
  <section class="category-info"><article><span class="eyebrow">${t('categoryWhat',lang)}</span><h2>${esc(l(c.question,lang))}</h2><p>${esc(l(meta.workflowNote,lang))}</p></article><article><span class="eyebrow">${t('limitations',lang)}</span><h2>${bi('Главная граница метода','The method boundary',lang)}</h2><p>${esc(l(meta.limit,lang))}</p></article></section>
  <section class="category-practice"><figure><img src="${practice.asset}" width="1200" height="900" loading="lazy" alt=""></figure><div><span class="eyebrow">${bi('ПРАКТИКА','IN PRACTICE',lang)}</span><h2>${esc(l(practice.title,lang))}</h2><p>${esc(l(practice.text,lang))}</p><ol><li>${bi('Зафиксируйте условия и исходные данные.','Record conditions and inputs.',lang)}</li><li>${bi('Получите результат и прочитайте ограничение.','Calculate and read the limitation.',lang)}</li><li>${bi('Измените одно решение и повторите измерение.','Change one decision and repeat the measurement.',lang)}</li></ol></div></section>
  <section>${sectionHead(bi('СЕМАНТИЧЕСКИЙ ПУТЬ','CURATED WORKFLOW',lang),t('workflows',lang),esc(l(meta.workflowNote,lang)))}<div class="workflow-row">${workflow.map((x,i)=>`<a href="#calc/${x.id}"><b>${String(i+1).padStart(2,'0')}</b><span>${esc(l(x.title,lang))}</span>${icon('arrow')}</a>`).join('')}</div></section>
  <section>${sectionHead(bi('ВСЕ ИНСТРУМЕНТЫ','ALL TOOLS',lang),t('categoryTools',lang),`${list.length} ${t('tools',lang)}`)}<div class="tools-grid">${others.map(x=>toolCard(x,state,WHEN_USEFUL[x.id]?.[lang])).join('')}</div></section>
  <div class="related-domains">${Object.entries(categories).filter(([key])=>key!==id).slice(0,4).map(([key,x])=>`<a href="#category/${key}">${icon(key)}<span>${esc(l(x,lang))}</span></a>`).join('')}</div>`;
}

export function calculatorPage(calc,state,session,resultData,errors={}){
  if(!calc)return notFoundPage(state);
  const lang=state.lang;
  const localizeResult=result=>result&&lang==='ru'?{...result,unit:formatUnit(result.unit,lang),secondary:result.secondary?.map(item=>({...item,unit:formatUnit(item.unit,lang)}))||[]}:result;
  resultData=resultData?localizeResult(applyResultGuidance(calc,resultData)):resultData;
  const displayCalc=lang==='ru'?{...calc,fields:calc.fields.map(field=>({...field,unit:formatUnit(field.unit,lang)})),calculate:(...args)=>localizeResult(applyResultGuidance(calc,calc.calculate(...args)))}:calc;
  let html=legacy.calculatorPage(displayCalc,state,session,resultData,errors);
  const practice=DOMAIN_PRACTICE[calc.category];
  html=html
    .replace('<form class="panel form-panel"',`<form class="panel form-panel" data-mode="basic"`)
    .replace('<div class="form-intro">',`${proWorkbench(displayCalc,state,session,resultData,lang)}<div class="form-intro">`)
    .replace('<div class="calc-grid">',`<aside class="calc-practical-note">${icon('check')}<div><span class="eyebrow">${bi('ГДЕ ПРИМЕНИТЬ','WHERE TO USE IT',lang)}</span><strong>${esc(l(practice.title,lang))}</strong><p>${esc(l(WHEN_USEFUL[calc.id]||practice.text,lang))}</p></div></aside><div class="calc-grid">`);
  const activeWorkflow=activeWorkflowStep(calc.id);
  if(activeWorkflow)html=html.replace('<div class="calc-grid">',`${workflowRail(activeWorkflow,lang,Boolean(resultData))}<div class="calc-grid">`);
  const printDate=new Intl.DateTimeFormat(lang==='ru'?'ru-RU':'en-US',{dateStyle:'long',timeStyle:'short'}).format(new Date());
  const printInputs=displayCalc.fields.map(field=>{const value=session?.[field.id]??(field.profileKey?state.profile[field.profileKey]:undefined)??field.default;return `<div><dt>${esc(l(field.label,lang))}</dt><dd>${esc(formatFieldValue(field,value,lang))}${field.unit?`&nbsp;${esc(field.unit)}`:''}</dd></div>`}).join('');
  html=`<header class="print-brand"><img src="./assets/brand/logo-horizontal-dark.svg" width="220" height="48" alt="MARKOVLAB"><span>${esc(printDate)}</span></header>${html.replace('<div class="calc-grid">',`<section class="print-inputs"><h2>${bi('Исходные данные','Inputs',lang)}</h2><dl>${printInputs}</dl></section><div class="calc-grid">`)}`;
  html=html.replace('<aside class="panel result-panel" aria-live="polite">','<aside class="panel result-panel" tabindex="-1" aria-live="polite">');
  const generic=bi('Когда число способно уточнить решение или задать точку отсчёта для динамики.','When a number can clarify a decision or create a baseline for a trend.',lang);
  html=html.replace(esc(generic),esc(l(WHEN_USEFUL[calc.id],lang)));
  for(const field of displayCalc.fields){
    const id=`hint-${field.id}`;
    const re=new RegExp(`(<small class="field-hint" id="${id}">)[\\s\\S]*?(<\\/small>)`);
    const prefilled=session?.[field.id]===undefined&&field.profileKey&&state.profile[field.profileKey]!==undefined;
    const prefix=prefilled?`${t('profileOverride',lang)} `:'';
    html=html.replace(re,`$1${esc(prefix+fieldHelp(displayCalc,field,lang))}$2`);
  }
  html=html.replace(/<div class="result-viz"[\s\S]*?<\/small><\/div>/,'');
  if(resultData){
    const oldConfidence=lang==='ru'?'Смотрите тип метода и силу основания выше.':'See method type and evidence strength above.';
    html=html.replace(esc(oldConfidence),esc(l(confidenceFor(calc),lang)));
    const viz=semanticViz(calc,resultData,lang);
    if(viz)html=html.replace('<div class="result-sections">',`${viz}<div class="result-sections">`);
    const sources=sourceList(calc,lang);
    if(sources)html=html.replace(/<div class="source-list">[\s\S]*?<\/div>/,sources);
  }
  const related=relatedFor(calc,CALCULATORS).map(id=>calculatorMap.get(id)).filter(Boolean);
  html=html.replace(/<div class="tools-grid compact">[\s\S]*?<\/div><\/section>$/,`<div class="tools-grid compact">${related.map(c=>toolCard(c,state,WHEN_USEFUL[c.id]?.[lang])).join('')}</div></section>`);
  return html.replaceAll('type="number"','type="text"');
}

function workflowRail(active,lang,hasResult){
  const {workflow,run,step,isLast}=active;
  return `<section class="workflow-rail" aria-label="${bi('Активный путь решения','Active decision workflow',lang)}"><div class="workflow-rail-meta"><a href="#workflows">${icon('workflows')} ${bi('Путь решения','Decision workflow',lang)}</a><span>${run.index+1} / ${workflow.steps.length}</span></div><div><span class="eyebrow">${esc(l(workflow.title,lang))}</span><strong>${esc(l(step.label,lang))}</strong><p>${esc(l(step.why,lang))}</p></div><ol>${workflow.steps.map((item,index)=>`<li class="${index<run.index?'done':''} ${index===run.index?'current':''}" ${index===run.index?'aria-current="step"':''}><b>${index<run.index?icon('check'):String(index+1).padStart(2,'0')}</b><span>${esc(l(item.label,lang))}</span></li>`).join('')}</ol><div class="workflow-rail-actions">${hasResult?`<button class="btn primary" data-action="workflow-next">${isLast?bi('Завершить путь','Finish workflow',lang):bi('Следующий шаг','Next step',lang)} ${icon('arrow')}</button>`:`<span>${bi('Рассчитайте этот шаг, чтобы открыть следующий.','Calculate this step to unlock the next one.',lang)}</span>`}<button class="text-action" data-action="workflow-cancel">${bi('Выйти из пути','Leave workflow',lang)}</button></div></section>`;
}

function proValue(field,state,session){
  if(session?.[field.id]!==undefined)return session[field.id];
  if(field.profileKey&&state.profile[field.profileKey]!==undefined)return state.profile[field.profileKey];
  return field.default??'';
}

function proWorkbench(calc,state,session,resultData,lang){
  const config=getProConfig(calc);
  if(config.mode==='none')return `<div class="calc-mode-switch calc-mode-basic-only"><button type="button" role="tab" aria-selected="true" data-action="calc-mode" data-mode="basic">${bi('Основной','Basic',lang)}<small>${bi('быстрый расчёт','quick calculation',lang)}</small></button></div>`;
  const fieldProtocol=calc.fields.map(field=>`<li><strong>${esc(l(field.label,lang))}</strong><span>${esc(fieldHelp(calc,field,lang))}</span></li>`).join('');
  const hasBaseline=Boolean(resultData);
  const inputs=config.inputs.map(field=>{const value=proValue(field,state,session),control=field.type==='select'?`<select data-pro-input="${esc(field.id)}" ${hasBaseline?'':'disabled'} aria-label="${esc(l(field.label,lang))} — ${bi('сценарий B','Scenario B',lang)}">${field.options.map(option=>`<option value="${esc(option.value)}" ${String(option.value)===String(value)?'selected':''}>${esc(l(option.label,lang))}</option>`).join('')}</select>`:`<input type="text" inputmode="decimal" data-pro-input="${esc(field.id)}" value="${esc(value)}" ${hasBaseline?'':'disabled'} aria-label="${esc(l(field.label,lang))} — ${bi('сценарий B','Scenario B',lang)}">`;return `<label class="pro-scenario-field"><span>${esc(l(field.label,lang))}</span><span class="pro-input-wrap">${control}${field.unit?`<em>${esc(field.unit)}</em>`:''}</span></label>`}).join('');
  const modeLabel={compare:bi('Сценарий A / B','Scenario A / B',lang),alternatives:bi('Альтернативный вариант','Alternative setup',lang),timeline:bi('Стресс-сценарий','Stress scenario',lang)}[config.mode];
  const initial=hasBaseline
    ?bi('Измените один или несколько входов сценария B. MARKOVLAB покажет разницу с последним рассчитанным базовым сценарием.','Change one or more Scenario B inputs. MARKOVLAB will show the difference from the most recently calculated baseline.',lang)
    :bi('Сначала рассчитайте базовый сценарий ниже. После этого здесь можно будет сравнить его с альтернативой.','Calculate the baseline below first. You will then be able to compare it with an alternative here.',lang);
  return `<div class="calc-mode-switch" role="tablist" aria-label="${bi('Режим калькулятора','Calculator mode',lang)}"><button type="button" role="tab" aria-selected="true" data-action="calc-mode" data-mode="basic">${bi('Основной','Basic',lang)}<small>${bi('быстрый расчёт','quick calculation',lang)}</small></button><button type="button" role="tab" aria-selected="false" data-action="calc-mode" data-mode="pro"><b>PRO</b><small>${modeLabel}</small></button></div><section class="pro-workbench" role="tabpanel" data-pro-mode="${config.mode}" data-pro-baseline="${hasBaseline?'ready':'required'}"><header><div><span class="eyebrow">MARKOVLAB PRO · ${modeLabel}</span><h2>${esc(l(config.title,lang))}</h2></div><span class="badge method">${esc(l(methodLabels[calc.methodType],lang))}</span></header><p>${esc(l(config.description,lang))}</p><section class="pro-scenario" aria-labelledby="pro-scenario-title"><header><div><span class="eyebrow">${bi('СЦЕНАРИЙ B','SCENARIO B',lang)}</span><h3 id="pro-scenario-title">${bi('Измените реальные входные данные','Change real input values',lang)}</h3></div><button type="button" class="text-action" data-action="pro-copy-baseline" ${hasBaseline?'':'disabled'}>${bi('Вернуть базовые значения','Restore baseline values',lang)}</button></header><div class="pro-scenario-fields">${inputs}</div><div class="pro-scenario-actions"><button type="button" class="btn primary" data-action="pro-compare" ${hasBaseline?'':'disabled'}>${bi('Сравнить с базой','Compare with baseline',lang)} ${icon('arrow')}</button><span>${bi('Изменяются только поля сценария B. Базовый расчёт не перезаписывается.','Only Scenario B fields change. The baseline calculation is never overwritten.',lang)}</span></div><div class="pro-scenario-output" role="status" tabindex="-1" aria-live="polite"><p>${initial}</p></div></section><aside class="pro-boundary"><strong>${bi('Граница модели','Model boundary',lang)}</strong><p>${esc(l(config.limitation,lang))}</p></aside><details><summary>${bi('Точный протокол всех входов','Full input protocol',lang)}</summary><ul>${fieldProtocol}</ul></details></section>`;
}

function sourceList(calc,lang){
  const sources=calc.sources.map(id=>REFERENCES[id]).filter(Boolean);
  if(!sources.length)return'';
  return `<div class="source-list">${sources.map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer"><span><b>${esc(l(source.title,lang))}</b><small>${esc(l(source.note,lang))}</small></span>${icon('external')}</a>`).join('')}</div>`;
}

function semanticViz(calc,r,lang){
  const type=visualizationType(calc.id);
  if(type==='exact')return'';
  const labels={range:['Диапазон результата','Result interval'],composition:['Состав результата','Result composition'],comparison:['Сравнение методов','Method comparison'],delta:['Изменение относительно нуля','Change from zero'],conversion:['Преобразование единиц','Unit conversion'],scenario:['Сценарный результат','Scenario output']};
  const label=bi(...labels[type],lang);
  if(type==='range'&&typeof r.primary==='string')return `<div class="semantic-viz range-viz" role="img" aria-label="${esc(label)}"><span></span><b>${esc(r.primary)} ${esc(r.unit||'')}</b></div>`;
  if(type==='composition'&&r.secondary?.length){const values=[Number(r.primary),...r.secondary.map(x=>Number(x.value))].filter(Number.isFinite),sum=values.reduce((a,b)=>a+b,0)||1;return `<div class="semantic-viz composition-viz" role="img" aria-label="${esc(label)}">${values.map((x,i)=>`<i style="--share:${x/sum*100}" data-index="${i}"></i>`).join('')}</div>`}
  if(type==='comparison'&&r.secondary?.length){const values=[Number(r.primary),...r.secondary.map(x=>Number(x.value))].filter(Number.isFinite),max=Math.max(...values,1);return `<div class="semantic-viz comparison-viz" role="img" aria-label="${esc(label)}">${values.map(x=>`<i style="--share:${x/max*100}"></i>`).join('')}</div>`}
  if(type==='delta'&&typeof r.primary==='number')return `<div class="semantic-viz delta-viz ${r.primary<0?'negative':'positive'}" role="img" aria-label="${esc(label)}"><span></span><b>${r.primary>0?'+':''}${esc(formatNumber(r.primary,lang,2))}</b></div>`;
  return `<div class="semantic-viz relation-viz" role="img" aria-label="${esc(label)}">${icon(type==='conversion'?'utility':'chart')}<span>${esc(label)}</span>${icon('arrow')}</div>`;
}

export function profilePage(state){
  const lang=state.lang;
  return legacy.profilePage(state)
    .replace(/<div class="profile-progress">[\s\S]*?<\/div><\/div><\/header>/,`<aside class="profile-payoff"><strong>${bi('Введите один раз — используйте в связанных расчётах','Enter once — reuse across related calculations',lang)}</strong><span>${bi('Заполняйте только то, что действительно сократит повторный ввод.','Only add data that meaningfully reduces repeated entry.',lang)}</span></aside></header>`)
    .replace(/<div class="privacy-callout">/,`<figure class="profile-page-visual"><img src="./assets/images/core/profile-once.webp" width="720" height="540" loading="eager" alt=""><figcaption>${bi('Заполняйте только те поля, которые хотите повторно использовать. Полный профиль не требуется.','Fill only the fields you want to reuse. A complete profile is never required.',lang)}</figcaption></figure><div class="privacy-callout">`)
    .replaceAll('type="number"','type="text"');
}

export function insightsPage(state,historyQuery='',sort='newest'){
  const lang=state.lang;
  const renderedState={...state,history:state.history.map(item=>({...item,summary:historySummary(item,lang)}))};
  return legacy.insightsPage(renderedState,historyQuery,sort)
    .replace(/ · P\d/g,'')
    .replace(/<section><header class="section-head"><div><span class="eyebrow">ДИНАМИКА|<section><header class="section-head"><div><span class="eyebrow">TRENDS/,match=>`<figure class="progress-page-visual"><img src="./assets/images/core/progress-honest-v4.webp" width="1448" height="1086" loading="lazy" alt=""></figure>${match}`);
}

export function historySummary(item,lang='ru'){
  const result=item?.result;
  if(result?.primary!==undefined&&result?.primary!==null){
    const value=typeof result.primary==='number'?formatNumber(result.primary,lang,3):String(result.primary);
    const unit=formatUnit(result.unit||'',lang);
    return `${value}${unit?` ${unit}`:''}`;
  }
  return item?.summary||'';
}

export function aboutPage(state){
  const lang=state.lang;
  return legacy.aboutPage(state)
    .replace(/MARKOVLAB \/ 2\.0\.0/g,`MARKOVLAB / ${RELEASE_CONFIG.version}`)
    .replace('</header><div class="about-grid">',`</header><aside class="about-author"><div class="author-mark">PM</div><div><span class="eyebrow">${bi('ПОЗИЦИЯ АВТОРА','AUTHOR PRINCIPLE',lang)}</span><blockquote>${bi('«Не доверяйте числу только потому, что оно выглядит точным. Сначала поймите метод, затем ограничение — и только после этого принимайте решение.»','“Do not trust a number merely because it looks precise. Understand the method, then its limitation, and only then make a decision.”',lang)}</blockquote><strong>${bi('Павел Марков · автор MARKOVLAB','Pavel Markov · creator of MARKOVLAB',lang)}</strong></div></aside><div class="about-grid">`)
    .replace(/<p><strong>2\.0\.0<\/strong>/,`<p><strong>${RELEASE_CONFIG.version}</strong> — ${bi('исправлены маршруты, полный каталог, честный подбор блинов, locale-independent history и PWA-обновление Pro.','routes, full catalogue, honest plate loading, locale-independent history and the Pro PWA update were corrected.',lang)}</p><p><strong>5.2.0</strong> — ${bi('исправлены тематические поверхности и Pro-контролы, добавлена проверенная модель жирового эквивалента и усилена редактура.','theme surfaces and Pro controls corrected, a provenance-backed fat-equivalent model added, and copy tightened.',lang)}</p><p><strong>5.1.0</strong> — ${bi('повышенная читаемость, четыре визуально разные палитры плюс System, практические сценарии, авторский слой и Pro-анализ.','higher readability, distinct palettes plus System, practical scenarios, author voice and Pro analysis.',lang)}</p><p><strong>5.0.0</strong> — ${bi('search-first оболочка без постоянного sidebar, рабочая Home, компактная система результатов, новая измерительная айдентика и смысловая evidence-визуализация.','search-first shell without a permanent sidebar, useful Home workspace, new measurement identity and meaningful evidence visual.',lang)}</p><p><strong>4.0.0</strong> — ${bi('natural-language поиск, персональная главная, RU/EN, четыре темы и release-контур.','natural-language search, personalized home, RU/EN, four themes and release quality gates.',lang)}</p><p><strong>3.1.0</strong> — ${bi('индивидуальные пояснения результата и проверяемая матрица инструментов.','individual result guidance and a verifiable content matrix.',lang)}</p><p><strong>3.0.0</strong> — ${bi('единая визуальная система и семантически честные визуализации.','unified visual system and semantically honest visualizations.',lang)}</p><p><strong>2.0.0</strong>`);
}
