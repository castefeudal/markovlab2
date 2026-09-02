const bi=(ru,en)=>({ru,en});

// Pro is deliberately opt-in per calculation. A unit converter or a one-step
// arithmetic check gains nothing from a second tab, while planning tools gain
// a real comparison surface with explicit alternate inputs.
const OVERRIDES={
  tdee:{mode:'compare',inputs:['resting','factor'],title:bi('Сравните два сценария расхода','Compare two expenditure scenarios'),description:bi('Измените расход покоя или коэффициент активности во втором сценарии. Это сравнение допущений, а не прогноз веса.','Change resting expenditure or activity factor in Scenario B. This compares assumptions; it does not predict body-weight change.'),limitation:bi('Коэффициент активности остаётся грубой гипотезой и требует калибровки по реальной динамике.','The activity factor remains a coarse hypothesis and should be calibrated against real change.')},
  'calorie-target':{mode:'compare',inputs:['maintenance','adjustment'],title:bi('Сравните два плана калорий','Compare two calorie plans'),description:bi('Измените поддержку или выбранную поправку и посмотрите практическую разницу в стартовом ориентире.','Change maintenance or the selected adjustment and see the practical difference in the starting reference.'),limitation:bi('Разница между сценариями не гарантирует пропорциональное изменение массы.','The difference between scenarios does not guarantee proportional body-mass change.')},
  mifflin:{mode:'compare',inputs:['age','weight','height'],title:bi('Проверьте устойчивость оценки покоя','Stress-test the resting estimate'),description:bi('Сравните два набора антропометрии и проверьте, меняет ли разница практический ориентир.','Compare two anthropometric input sets and check whether the difference changes the practical reference.'),limitation:bi('Оба результата остаются оценками, а не измерением расхода в покое.','Both outputs remain estimates, not a resting-expenditure measurement.')},
  e1rm:{mode:'compare',inputs:['load','reps'],title:bi('Сравните рабочие подходы','Compare working sets'),description:bi('Проверьте, как другой качественный подход меняет оценку 1ПМ. Формула не компенсирует разницу в технике, глубине или RIR.','Check how a different quality set changes estimated 1RM. The formula cannot compensate for technique, depth, or RIR differences.'),limitation:bi('Сравнивайте только технически сопоставимые подходы.','Compare only technically comparable sets.')},
  runway:{mode:'timeline',inputs:['cash','expenses'],title:bi('Стресс-тест запаса','Stress-test runway'),description:bi('Во втором сценарии задайте более консервативный резерв или расходы. Результат показывает месяцы покрытия, а не прогноз выручки.','Set a more conservative reserve or expense level in Scenario B. The result shows months covered, not a revenue forecast.'),limitation:bi('Модель не учитывает будущую выручку, налоги, долги и изменение расходов.','The model excludes future revenue, tax, debt, and changing expenses.')},
  'compound-interest':{mode:'timeline',inputs:['principal','rate','years','contribution'],title:bi('Сравните финансовые допущения','Compare financial assumptions'),description:bi('Измените ставку, срок или регулярный взнос и сравните сценарии без притворной точности прогноза.','Change rate, horizon, or recurring contribution and compare scenarios without pretending to forecast precisely.'),limitation:bi('Постоянная доходность — математическое допущение, не обещание рынка.','Constant return is a mathematical assumption, not a market promise.')},
  'loan-payment':{mode:'timeline',inputs:['principal','rate','months'],title:bi('Сравните условия кредита','Compare loan terms'),description:bi('Измените ставку или срок во втором сценарии, чтобы увидеть цену условия до решения.','Change rate or term in Scenario B to see the cost of a term before deciding.'),limitation:bi('Комиссии, страховка и плавающая ставка могут изменить фактический платёж.','Fees, insurance, and variable rates can change the actual payment.')}
};

const CATEGORY_DEFAULTS={
  body:'compare',energy:'compare',nutrition:'compare',strength:'compare',cardio:'compare',recovery:'compare',mind:'compare',money:'compare',utility:'none'
};

export function getProConfig(calc){
  const scenarioFields=calc.fields.filter(field=>['number','select'].includes(field.type));
  const override=OVERRIDES[calc.id];
  const mode=override?.mode||(!scenarioFields.length?'none':CATEGORY_DEFAULTS[calc.category]||'compare');
  if(mode==='none')return {mode:'none',inputs:[]};
  const allowed=(override?.inputs||scenarioFields.map(field=>field.id)).map(id=>scenarioFields.find(field=>field.id===id)).filter(Boolean);
  if(!allowed.length)return {mode:'none',inputs:[]};
  return {
    mode,
    inputs:allowed,
    title:override?.title||bi('Сравните два сценария','Compare two scenarios'),
    description:override?.description||bi('Измените только те входы, которые действительно могут поменять решение.','Change only the inputs that could genuinely change the decision.'),
    limitation:override?.limitation||bi('Сценарий показывает следствие введённых допущений, а не прогноз будущего.','A scenario shows the consequence of entered assumptions, not a forecast of the future.')
  };
}

export const proModes=new Set(['none','compare','alternatives','timeline']);
