const bi=(ru,en)=>({ru,en});

// A workflow is deliberately a small, inspectable sequence of existing tools.
// It never substitutes a forecast for a measurement and only carries a result
// into a later field when the units and meaning are identical.
export const WORKFLOWS=[
  {
    id:'nutrition-setup',category:'energy',
    title:bi('Настроить энергию и белок','Set energy and protein'),
    description:bi('От оценки расхода покоя к проверяемому стартовому рациону и диапазону белка.','Move from resting expenditure to a testable starting intake and protein range.'),
    outcome:bi('Стартовый рацион, который можно откалибровать по реальной динамике.','A starting intake you can calibrate against real change.'),
    steps:[
      {calcId:'mifflin',label:bi('Оцените расход покоя','Estimate resting expenditure'),why:bi('Это отправная точка, а не окончательный расход.','It is a starting point, not final expenditure.')},
      {calcId:'tdee',label:bi('Соберите сценарий TDEE','Build a TDEE scenario'),why:bi('Расход покоя переносится автоматически; выберите только реалистичный коэффициент активности.','Resting expenditure is carried over automatically; choose only a realistic activity factor.'),prefill:[{from:'mifflin',to:'resting'}]},
      {calcId:'calorie-target',label:bi('Выберите умеренную корректировку','Choose a moderate adjustment'),why:bi('Сценарий TDEE переносится как поддержание; дальше важна проверка по средней массе.','The TDEE scenario carries over as maintenance; then verify it against average body mass.'),prefill:[{from:'tdee',to:'maintenance'}]},
      {calcId:'protein-range',label:bi('Задайте диапазон белка','Set a protein range'),why:bi('Вес подставляется из профиля, если он сохранён.','Weight prefills from your profile when it is saved.')}
    ]
  },
  {
    id:'body-composition-review',category:'body',
    title:bi('Проверить состав тела','Review body composition'),
    description:bi('Сохранить сопоставимый замер и отделить оценку процента жира от производных показателей.','Save a comparable measurement and separate a body-fat estimate from derived metrics.'),
    outcome:bi('Сопоставимая точка отсчёта, а не ложная точность одного замера.','A comparable baseline, not false precision from one reading.'),
    steps:[
      {calcId:'navy-body-fat',label:bi('Оцените жир по окружностям','Estimate body fat from circumferences'),why:bi('Используйте один и тот же протокол ленты при повторении.','Use the same tape-measure protocol for repeats.')},
      {calcId:'body-composition',label:bi('Разделите массу на жир и FFM','Split body mass into fat and FFM'),why:bi('Процент жира переносится автоматически; итог наследует его погрешность.','Body fat carries over automatically; the result inherits its error.'),prefill:[{from:'navy-body-fat',to:'bodyFat'}]},
      {calcId:'ffmi',label:bi('Сопоставьте FFM с ростом','Compare FFM with height'),why:bi('Тот же процент жира переносится, чтобы сравнение не смешивало методы.','The same body-fat estimate carries over so the comparison does not mix methods.'),prefill:[{from:'navy-body-fat',to:'bodyFat'}]}
    ]
  },
  {
    id:'strength-session',category:'strength',
    title:bi('Спланировать рабочий вес','Plan a working weight'),
    description:bi('Перевести качественный подход в оценку 1ПМ, рабочий вес и проверяемую раскладку штанги.','Turn a quality set into an estimated 1RM, a working load, and a checkable bar setup.'),
    outcome:bi('Рабочий вес для следующей сопоставимой сессии.','A working load for the next comparable session.'),
    steps:[
      {calcId:'e1rm',label:bi('Оцените 1ПМ','Estimate 1RM'),why:bi('Берите технически сопоставимый подход, а не случайный рекорд.','Use a technically comparable set, not a random record.')},
      {calcId:'load-percent',label:bi('Выберите рабочий процент','Choose a working percentage'),why:bi('Оценка 1ПМ переносится автоматически; процент остаётся тренерским решением.','Estimated 1RM carries over automatically; the percentage remains a coaching decision.'),prefill:[{from:'e1rm',to:'oneRm'}]},
      {calcId:'plate-loader',label:bi('Проверьте реальные блины','Check the actual plates'),why:bi('Переносится рассчитанный рабочий вес; инвентарь задаётся явно.','The calculated working weight carries over; inventory is explicit.'),prefill:[{from:'load-percent',to:'target'}]}
    ]
  },
  {
    id:'running-setup',category:'cardio',
    title:bi('Настроить беговой ориентир','Set a running reference'),
    description:bi('Связать скорость, темп и время дистанции без подмены сценария прогнозом.','Connect speed, pace, and distance time without mistaking a scenario for a forecast.'),
    outcome:bi('Понятный темповый ориентир для заданной дистанции.','A clear pace reference for a chosen distance.'),
    steps:[
      {calcId:'pace',label:bi('Переведите скорость в темп','Convert speed to pace'),why:bi('Это точное преобразование единиц.','This is an exact unit conversion.')},
      {calcId:'race-time',label:bi('Посчитайте время дистанции','Calculate distance time'),why:bi('Темп переносится автоматически; расстояние остаётся вашим сценарием.','Pace carries over automatically; distance remains your scenario.'),prefill:[{from:'pace',to:'pace'}]},
      {calcId:'riegel',label:bi('Стресс‑тестируйте другую дистанцию','Stress-test another distance'),why:bi('Время переносится; перенос между далёкими дистанциями остаётся неточным.','Time carries over; transfer across distant distances remains uncertain.'),prefill:[{from:'race-time',to:'time'}]}
    ]
  },
  {
    id:'recovery-review',category:'recovery',
    title:bi('Проверить режим восстановления','Review recovery routine'),
    description:bi('Сначала увидеть фактическое окно сна, затем дефицит и поздний кофеин.','See the actual sleep window first, then the gap and late caffeine.'),
    outcome:bi('Один конкретный ограничитель, который можно изменить и проверить повторно.','One concrete constraint to change and revisit.'),
    steps:[
      {calcId:'sleep-duration',label:bi('Посчитайте фактический сон','Calculate actual sleep'),why:bi('Это длительность интервала, а не измеренное качество сна.','This is interval duration, not measured sleep quality.')},
      {calcId:'sleep-gap',label:bi('Сверьте разрыв с целью','Compare with a target'),why:bi('Длительность переносится автоматически; цель выбирается явно.','Duration carries over automatically; the target is explicit.'),prefill:[{from:'sleep-duration',to:'sleep'}]},
      {calcId:'caffeine-remaining',label:bi('Проверьте остаток кофеина','Check caffeine remaining'),why:bi('Модель показывает сценарий, а не индивидуальный анализ метаболизма.','The model shows a scenario, not an individual metabolism assessment.')}
    ]
  },
  {
    id:'business-runway',category:'money',
    title:bi('Оценить запас бизнеса','Assess business runway'),
    description:bi('От текущего запаса к запасу месяцев и цене решения.','Move from current cash to months of runway and the cost of a decision.'),
    outcome:bi('Проверяемый запас при явно заданных расходах.','A testable runway with explicit expenses.'),
    steps:[
      {calcId:'savings-rate',label:bi('Зафиксируйте текущий запас','Record current saving capacity'),why:bi('Доход и сбережения должны относиться к одному периоду.','Income and savings must use the same period.')},
      {calcId:'runway',label:bi('Посчитайте месяцы резерва','Calculate months of runway'),why:bi('Сценарий предполагает постоянные расходы и не заменяет cash-flow план.','The scenario assumes constant expenses and does not replace a cash-flow plan.')},
      {calcId:'payback',label:bi('Проверьте срок окупаемости','Check payback period'),why:bi('Используйте консервативный прогноз чистого денежного потока.','Use a conservative estimate of net cash flow.')}
    ]
  }
];

export const workflowMap=new Map(WORKFLOWS.map(workflow=>[workflow.id,workflow]));
const KEY='markovlab-active-workflow-v1';

const safeRun=raw=>{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
  const workflow=workflowMap.get(raw.id),index=Number(raw.index);
  if(!workflow||!Number.isInteger(index)||index<0||index>=workflow.steps.length)return null;
  const outputs=raw.outputs&&typeof raw.outputs==='object'&&!Array.isArray(raw.outputs)?raw.outputs:{};
  return {id:workflow.id,index,outputs};
};

export function loadWorkflowRun(){
  try{return safeRun(JSON.parse(sessionStorage.getItem(KEY)||'null'))}catch{return null}
}

export function saveWorkflowRun(run){
  const safe=safeRun(run);
  if(safe)sessionStorage.setItem(KEY,JSON.stringify(safe));
  else sessionStorage.removeItem(KEY);
  return safe;
}

export function startWorkflow(id){return saveWorkflowRun({id,index:0,outputs:{}})}
export function clearWorkflowRun(){sessionStorage.removeItem(KEY)}

export function activeWorkflowStep(calcId){
  const run=loadWorkflowRun(),workflow=workflowMap.get(run?.id);
  if(!workflow||workflow.steps[run.index]?.calcId!==calcId)return null;
  return {run,workflow,step:workflow.steps[run.index],isLast:run.index===workflow.steps.length-1};
}

export function recordWorkflowOutput(calcId,primary){
  const active=activeWorkflowStep(calcId);
  if(!active)return null;
  const numeric=Number(primary);
  if(!Number.isFinite(numeric))return active;
  return saveWorkflowRun({...active.run,outputs:{...active.run.outputs,[calcId]:numeric}})
}

export function advanceWorkflow(calcId){
  const active=activeWorkflowStep(calcId);
  if(!active)return {kind:'none'};
  if(active.isLast){clearWorkflowRun();return {kind:'complete',workflow:active.workflow};}
  const nextIndex=active.run.index+1,next=active.workflow.steps[nextIndex],draft={};
  for(const transfer of next.prefill||[]){
    const value=active.run.outputs[transfer.from];
    if(Number.isFinite(Number(value)))draft[transfer.to]=String(value);
  }
  saveWorkflowRun({...active.run,index:nextIndex});
  return {kind:'next',workflow:active.workflow,next,draft};
}
