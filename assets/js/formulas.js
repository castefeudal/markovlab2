const finite = (...xs) => xs.every(Number.isFinite);
export const round = (n, d = 1) => Number(Number(n).toFixed(d));
export const pct = (part, whole) => finite(part, whole) && whole !== 0 ? part / whole * 100 : NaN;
export const bmi = (weightKg, heightCm) => finite(weightKg, heightCm) && heightCm > 0 ? weightKg / (heightCm / 100) ** 2 : NaN;
export const bmiWeightRange = (heightCm, low = 18.5, high = 24.9) => finite(heightCm, low, high) && heightCm > 0 ? [low * (heightCm / 100) ** 2, high * (heightCm / 100) ** 2] : [NaN, NaN];
export const whtr = (waistCm, heightCm) => finite(waistCm, heightCm) && heightCm > 0 ? waistCm / heightCm : NaN;
export const whr = (waistCm, hipCm) => finite(waistCm, hipCm) && hipCm > 0 ? waistCm / hipCm : NaN;
export const navyBodyFat = (sex, heightCm, waistCm, neckCm, hipCm = 0) => {
  if (!finite(heightCm, waistCm, neckCm, hipCm) || heightCm <= 0 || waistCm <= neckCm) return NaN;
  const cmToIn = 1 / 2.54;
  const h = heightCm * cmToIn, w = waistCm * cmToIn, n = neckCm * cmToIn, hip = hipCm * cmToIn;
  if (sex === 'female') {
    if (hip <= 0 || w + hip <= n) return NaN;
    return 163.205 * Math.log10(w + hip - n) - 97.684 * Math.log10(h) - 78.387;
  }
  return 86.01 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
};
export const rfm = (sex, heightCm, waistCm) => finite(heightCm, waistCm) && waistCm > 0 ? 64 - 20 * heightCm / waistCm + (sex === 'female' ? 12 : 0) : NaN;
export const deurenberg = (sex, age, weightKg, heightCm) => {
  const b = bmi(weightKg, heightCm);
  return finite(b, age) ? 1.2 * b + 0.23 * age - 10.8 * (sex === 'male' ? 1 : 0) - 5.4 : NaN;
};
export const bodyComposition = (weightKg, bodyFatPct) => finite(weightKg, bodyFatPct) ? { fat: weightKg * bodyFatPct / 100, ffm: weightKg * (1 - bodyFatPct / 100) } : { fat: NaN, ffm: NaN };
export const ffmi = (weightKg, bodyFatPct, heightCm) => {
  const { ffm } = bodyComposition(weightKg, bodyFatPct);
  const h = heightCm / 100;
  return finite(ffm, h) && h > 0 ? ffm / h ** 2 : NaN;
};
export const normalizedFfmi = (weightKg, bodyFatPct, heightCm) => ffmi(weightKg, bodyFatPct, heightCm) + 6.1 * (1.8 - heightCm / 100);
export const mostellerBsa = (weightKg, heightCm) => finite(weightKg, heightCm) && weightKg > 0 && heightCm > 0 ? Math.sqrt(weightKg * heightCm / 3600) : NaN;
export const percentChange = (start, end) => finite(start, end) && start !== 0 ? (end - start) / start * 100 : NaN;
export const weeklyTrend = (start, end, days) => finite(start, end, days) && days > 0 ? (end - start) / days * 7 : NaN;
export const targetWaist = (heightCm, ratio) => finite(heightCm, ratio) ? heightCm * ratio : NaN;

export const mifflin = (sex, weightKg, heightCm, age) => finite(weightKg, heightCm, age) ? 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161) : NaN;
export const cunningham = (ffmKg) => finite(ffmKg) ? 370 + 21.6 * ffmKg : NaN;
export const tdee = (resting, factor) => finite(resting, factor) ? resting * factor : NaN;
export const observedTdee = (dailyIntake, weightChangeKg, days, kcalPerKg = 7700) => finite(dailyIntake, weightChangeKg, days, kcalPerKg) && days > 0 ? dailyIntake - weightChangeKg * kcalPerKg / days : NaN;
export const calorieTarget = (maintenance, changePct) => finite(maintenance, changePct) ? maintenance * (1 + changePct / 100) : NaN;
export const energyEquivalent = (kcal) => finite(kcal) ? kcal / 7700 : NaN;

// Source model: user-provided workbook "Калькулятор". The web version keeps
// the workbook's arithmetic intact, while naming every input explicitly in
// grams/day, kcal/day or a boolean flag. It is an estimate of fat-equivalent
// energy surplus, not a measurement of body-composition change.
export const fatGainFromSurplusModel = ({age, weightKg, heightCm, bodyFatPct, sex = 'male', trainingLevel = 'beginner', activity = 'sedentary', proteinG, fatG, carbsG, glycogenDepleted = false, strengthLast24h = false, deficitKcal = 500}) => {
  const activityFactor = {minimal:1.1, sedentary:1.2, active:1.4}[activity];
  const trainingFactor = {beginner:.30, intermediate:.35, athlete:.45}[trainingLevel];
  const glycogenFactor = glycogenDepleted ? .25 : (strengthLast24h ? .8 : 1);
  if(!finite(age,weightKg,heightCm,bodyFatPct,proteinG,fatG,carbsG,deficitKcal,activityFactor,trainingFactor) || weightKg<=0 || heightCm<=0 || age<0 || bodyFatPct<0 || bodyFatPct>100 || proteinG<0 || fatG<0 || carbsG<0) return {fatKg:NaN};
  const resting = 10*weightKg + 6.25*heightCm - 5*age + (sex==='female' ? -161 : 5);
  const tdeeEstimate = resting * activityFactor;
  const fatFreeMass = weightKg * (1-bodyFatPct/100);
  const muscleKg = fatFreeMass * trainingFactor * (sex==='female' ? .8 : 1);
  const glycogenCapacityG = muscleKg * ({beginner:12.5, intermediate:20, athlete:30}[trainingLevel]) + 100;
  const glycogenAvailableG = glycogenCapacityG * glycogenFactor;
  const pRatio = 10.4 / (10.4 + (weightKg * bodyFatPct / 100));
  const proteinKcal = proteinG * 4, fatKcal = fatG * 9, carbsKcal = carbsG * 4;
  const proteinTef = proteinKcal * .25, fatTef = fatKcal * .02, carbsTef = carbsKcal * .1;
  const requiredProteinG = weightKg * 2, requiredProteinKcal = requiredProteinG * 4;
  const proteinRemainder = ((proteinKcal-proteinTef)-requiredProteinKcal)*.2;
  const fatRemainder = fatKcal-fatTef;
  const carbsRemainder = Math.max(0, carbsKcal-carbsTef-((glycogenCapacityG-glycogenAvailableG)*4));
  const surplusKcal = Math.max(0, proteinRemainder+fatRemainder+carbsRemainder-(tdeeEstimate-requiredProteinKcal));
  const fatKg = surplusKcal/7700;
  return {tdeeEstimate,muscleKg,glycogenCapacityG,glycogenAvailableG,pRatio,requiredProteinG,proteinKcal,fatKcal,carbsKcal,proteinTef,fatTef,carbsTef,proteinRemainder,fatRemainder,carbsRemainder,surplusKcal,fatKg,days:deficitKcal>0?fatKg*7700/deficitKcal:NaN};
};

export const proteinRange = (weightKg, low, high) => finite(weightKg, low, high) ? [weightKg * low, weightKg * high] : [NaN, NaN];
export const proteinPerMeal = (dailyGrams, meals) => finite(dailyGrams, meals) && meals > 0 ? dailyGrams / meals : NaN;
export const macroCalories = (proteinG, carbG, fatG, alcoholG = 0) => finite(proteinG, carbG, fatG, alcoholG) ? proteinG * 4 + carbG * 4 + fatG * 9 + alcoholG * 7 : NaN;
export const carbRemainder = (calories, proteinG, fatG) => finite(calories, proteinG, fatG) ? (calories - proteinG * 4 - fatG * 9) / 4 : NaN;
export const fatRange = (calories, lowPct, highPct) => finite(calories, lowPct, highPct) ? [calories * lowPct / 100 / 9, calories * highPct / 100 / 9] : [NaN, NaN];
export const fiberReference = (calories, gramsPer1000 = 14) => finite(calories, gramsPer1000) ? calories / 1000 * gramsPer1000 : NaN;
export const hydrationHeuristic = (weightKg, mlPerKg) => finite(weightKg, mlPerKg) ? weightKg * mlPerKg : NaN;
export const caffeineDose = (mg, weightKg) => finite(mg, weightKg) && weightKg > 0 ? mg / weightKg : NaN;
export const tefRange = (calories, lowPct = 8, highPct = 12) => finite(calories, lowPct, highPct) ? [calories * lowPct / 100, calories * highPct / 100] : [NaN, NaN];
export const calorieDensity = (calories, grams) => finite(calories, grams) && grams > 0 ? calories / grams * 100 : NaN;
export const proteinPrice = (price, proteinG) => finite(price, proteinG) && proteinG > 0 ? price / proteinG * 100 : NaN;

export const epley = (load, reps) => finite(load, reps) ? load * (1 + reps / 30) : NaN;
export const brzycki = (load, reps) => finite(load, reps) && reps < 37 ? load * 36 / (37 - reps) : NaN;
export const loadFromPercent = (oneRm, percentage) => finite(oneRm, percentage) ? oneRm * percentage / 100 : NaN;
export const relativeStrength = (load, bodyWeight) => finite(load, bodyWeight) && bodyWeight > 0 ? load / bodyWeight : NaN;
export const volumeLoad = (load, reps, sets) => finite(load, reps, sets) ? load * reps * sets : NaN;
export const weeklyTonnage = (load, reps, sets, sessions) => finite(load, reps, sets, sessions) ? load * reps * sets * sessions : NaN;
export const strengthDensity = (volume, minutes) => finite(volume, minutes) && minutes > 0 ? volume / minutes : NaN;
export const rirAdjustedReps = (reps, rir) => finite(reps, rir) ? reps + rir : NaN;
export const parsePlateInventory = value => {
  if(typeof value!=='string')return [];
  return value.split(';').map(part=>part.trim()).filter(Boolean).map(part=>{
    const match=part.match(/^(\d+(?:[.,]\d+)?)\s*(?:x|×)\s*(\d+)$/i);
    if(!match)return null;
    return {mass:Number(match[1].replace(',','.')),pairs:Number(match[2])};
  }).filter(item=>Number.isFinite(item?.mass)&&item.mass>0&&Number.isInteger(item.pairs)&&item.pairs>0&&item.pairs<=50);
};

export const platePlan = (target, bar, inventory) => {
  if (!finite(target, bar) || target < bar || !Array.isArray(inventory)) return null;
  const pairs=inventory.map(item=>typeof item==='number'?{mass:item,pairs:1}:item).filter(item=>finite(item?.mass,item?.pairs)&&item.mass>0&&Number.isInteger(item.pairs)&&item.pairs>0);
  if(!pairs.length)return null;
  const scale=100, targetSide=Math.round((target-bar)*scale/2), plans=new Map([[0,[]]]);
  for(const pair of pairs.sort((a,b)=>b.mass-a.mass)){
    const mass=Math.round(pair.mass*scale),existing=[...plans.entries()];
    for(const [sum,stack] of existing)for(let count=1;count<=pair.pairs;count++){
      const next=sum+mass*count,current=plans.get(next),nextStack=[...stack,...Array(count).fill(pair.mass)];
      if(!current||nextStack.length<current.length)plans.set(next,nextStack);
    }
  }
  const sums=[...plans.keys()].sort((a,b)=>a-b),lower=[...sums].reverse().find(sum=>sum<=targetSide),upper=sums.find(sum=>sum>=targetSide);
  const toPlan=sum=>sum===undefined?null:{plates:[...plans.get(sum)].sort((a,b)=>b-a),side:sum/scale,total:bar+sum/scale*2,delta:bar+sum/scale*2-target};
  return {target,targetSide:targetSide/scale,exact:plans.has(targetSide),lower:toPlan(lower),upper:toPlan(upper)};
};

export const plateLoad = (target, bar, plates) => {
  const plan=platePlan(target,bar,Array.isArray(plates)?plates:[]);
  const selected=plan?.lower;
  return selected?{plates:selected.plates,remainder:Math.max(0,(target-selected.total)/2),achieved:selected.total,delta:selected.delta,exact:plan.exact,lower:plan.lower,upper:plan.upper}:{plates:[],remainder:NaN,achieved:NaN,delta:NaN,exact:false,lower:null,upper:null};
};

export const paceFromSpeed = speedKmh => finite(speedKmh) && speedKmh > 0 ? 60 / speedKmh : NaN;
export const speedFromPace = paceMinKm => finite(paceMinKm) && paceMinKm > 0 ? 60 / paceMinKm : NaN;
export const raceTime = (distanceKm, paceMinKm) => finite(distanceKm, paceMinKm) ? distanceKm * paceMinKm : NaN;
export const riegel = (timeMin, distance1, distance2, exponent = 1.06) => finite(timeMin, distance1, distance2, exponent) && distance1 > 0 ? timeMin * (distance2 / distance1) ** exponent : NaN;
export const cooperVo2 = distanceM => finite(distanceM) ? (distanceM - 504.9) / 44.73 : NaN;
export const rockportVo2 = (sex, age, weightKg, timeMin, hr) => finite(age, weightKg, timeMin, hr) ? 132.853 - 0.0769 * weightKg * 2.20462 - 0.3877 * age + 6.315 * (sex === 'male' ? 1 : 0) - 3.2649 * timeMin - 0.1565 * hr : NaN;
export const hrMax = age => finite(age) ? 208 - 0.7 * age : NaN;
export const hrrZone = (maxHr, restHr, lowPct, highPct) => finite(maxHr, restHr, lowPct, highPct) ? [restHr + (maxHr - restHr) * lowPct / 100, restHr + (maxHr - restHr) * highPct / 100] : [NaN, NaN];
export const metCalories = (met, weightKg, minutes) => finite(met, weightKg, minutes) ? met * 3.5 * weightKg / 200 * minutes : NaN;
export const stepsDistance = (steps, strideCm) => finite(steps, strideCm) ? steps * strideCm / 100000 : NaN;
export const cadenceSpeed = (cadenceSpm, strideM) => finite(cadenceSpm, strideM) ? cadenceSpm * strideM * 60 / 1000 : NaN;
export const wattsPerKg = (watts, weightKg) => finite(watts, weightKg) && weightKg > 0 ? watts / weightKg : NaN;
export const aerobicEquivalent = (moderateMin, vigorousMin) => finite(moderateMin, vigorousMin) ? moderateMin + vigorousMin * 2 : NaN;

const timeToMin = value => { const [h,m] = String(value).split(':').map(Number); return h * 60 + m; };
export const sleepDuration = (bed, wake) => { let d = timeToMin(wake) - timeToMin(bed); if (d < 0) d += 1440; return d / 60; };
export const sleepMidpoint = (bed, wake) => (timeToMin(bed) + sleepDuration(bed, wake) * 30) % 1440;
export const socialJetlag = (weekdayMid, weekendMid) => { let d = Math.abs(weekdayMid - weekendMid); return Math.min(d, 1440 - d) / 60; };
export const sleepEfficiency = (sleepHours, bedHours) => finite(sleepHours, bedHours) && bedHours > 0 ? sleepHours / bedHours * 100 : NaN;
export const variability = values => Array.isArray(values) && values.length > 1 ? Math.sqrt(values.reduce((s,x)=>s+(x-values.reduce((a,b)=>a+b,0)/values.length)**2,0)/(values.length-1)) : NaN;
export const caffeineRemaining = (dose, hours, halfLife = 5) => finite(dose, hours, halfLife) && halfLife > 0 ? dose * 0.5 ** (hours / halfLife) : NaN;
export const readiness = (sleep, soreness, stress, motivation) => finite(sleep, soreness, stress, motivation) ? Math.max(0, Math.min(100, sleep * 10 + motivation * 10 - soreness * 5 - stress * 5 + 25)) : NaN;

export const ratioPercent = (a,b) => pct(a,b);
export const balanceIndex = values => {
  if (!Array.isArray(values) || !values.length || values.some(v=>!Number.isFinite(v))) return NaN;
  const mean = values.reduce((a,b)=>a+b,0)/values.length;
  return Math.max(0, 100 - Math.sqrt(values.reduce((s,x)=>s+(x-mean)**2,0)/values.length)*10);
};
export const decisionScore = (impact, confidence, effort, risk = 1) => finite(impact, confidence, effort, risk) && effort + risk > 0 ? impact * confidence / (effort + risk) : NaN;

export const compoundInterest = (principal, annualRatePct, years, contributions = 0, periods = 12) => {
  if (!finite(principal, annualRatePct, years, contributions, periods) || periods <= 0) return NaN;
  const n = Math.round(years * periods), r = annualRatePct / 100 / periods;
  if (r === 0) return principal + contributions * n;
  return principal * (1 + r) ** n + contributions * ((1 + r) ** n - 1) / r;
};
export const savingsRate = (income, savings) => pct(savings, income);
export const runway = (cash, monthlyExpenses) => finite(cash, monthlyExpenses) && monthlyExpenses > 0 ? cash / monthlyExpenses : NaN;
export const netWorth = (assets, liabilities) => finite(assets, liabilities) ? assets - liabilities : NaN;
export const hourlyValue = (income, hours) => finite(income, hours) && hours > 0 ? income / hours : NaN;
export const roi = (gain, cost) => finite(gain, cost) && cost !== 0 ? (gain - cost) / cost * 100 : NaN;
export const payback = (cost, monthlyCashflow) => finite(cost, monthlyCashflow) && monthlyCashflow > 0 ? cost / monthlyCashflow : NaN;
export const cagr = (start, end, years) => finite(start, end, years) && start > 0 && end >= 0 && years > 0 ? (end / start) ** (1 / years) * 100 - 100 : NaN;
export const realReturn = (nominalPct, inflationPct) => finite(nominalPct, inflationPct) ? ((1 + nominalPct / 100) / (1 + inflationPct / 100) - 1) * 100 : NaN;
export const margin = (price, cost) => finite(price, cost) && price !== 0 ? (price - cost) / price * 100 : NaN;
export const markup = (price, cost) => finite(price, cost) && cost !== 0 ? (price - cost) / cost * 100 : NaN;
export const loanPayment = (principal, annualRatePct, months) => {
  if (!finite(principal, annualRatePct, months) || months <= 0) return NaN;
  const r = annualRatePct / 100 / 12;
  return r === 0 ? principal / months : principal * r * (1 + r) ** months / ((1 + r) ** months - 1);
};
export const debtPayoffMonths = (balance, annualRatePct, payment) => {
  if (!finite(balance, annualRatePct, payment) || payment <= 0) return NaN;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return Math.ceil(balance / payment);
  if (payment <= balance * r) return Infinity;
  return Math.ceil(-Math.log(1 - r * balance / payment) / Math.log(1 + r));
};
export const fireTarget = (annualExpenses, withdrawalPct) => finite(annualExpenses, withdrawalPct) && withdrawalPct > 0 ? annualExpenses / (withdrawalPct / 100) : NaN;

export const harrisBenedictRevised = (sex, weightKg, heightCm, ageYears) => {
  if (!finite(weightKg, heightCm, ageYears)) return NaN;
  return sex === 'female'
    ? 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * ageYears
    : 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears;
};
export const katchMcardle = leanMassKg => finite(leanMassKg) && leanMassKg > 0 ? 370 + 21.6 * leanMassKg : NaN;
// Cunningham (1980): RMR = 500 + 22 x LBM. Distinct from the Katch-McArdle /
// Cunningham-1991 form (370 + 21.6 x LBM); provenance kept separate on purpose.
export const cunningham1980 = ffmKg => finite(ffmKg) && ffmKg > 0 ? 500 + 22 * ffmKg : NaN;

export const lombardi = (loadKg, reps) => finite(loadKg, reps) && reps > 0 ? loadKg * reps ** 0.10 : NaN;
export const oconner = (loadKg, reps) => finite(loadKg, reps) && reps > 0 ? loadKg * (1 + 0.025 * reps) : NaN;
export const macroSplit = (calories, weightKg, proteinPerKg, fatPerKg) => {
  if (!finite(calories, weightKg, proteinPerKg, fatPerKg) || weightKg <= 0) return NaN;
  const proteinG = proteinPerKg * weightKg, fatG = fatPerKg * weightKg;
  const remaining = calories - proteinG * 4 - fatG * 9;
  return { proteinG, fatG, carbsG: Math.max(remaining, 0) / 4, remaining, feasible: remaining >= 0 };
};
export const npv = (initialInvestment, ratePct, flows) => {
  if (!finite(initialInvestment, ratePct) || !Array.isArray(flows) || !flows.length || initialInvestment < 0) return NaN;
  const r = ratePct / 100;
  return flows.reduce((s, cf, i) => s + cf / (1 + r) ** (i + 1), 0) - initialInvestment;
};
export const irrRates = flows => {
  if (!Array.isArray(flows) || flows.length < 2 || flows.every(x => x >= 0) || flows.every(x => x <= 0)) return [];
  const npvAt = r => flows.reduce((s, cf, i) => s + cf / (1 + r) ** i, 0);
  const roots = [];
  let prevR = -0.95, prevV = npvAt(prevR);
  for (let r = -0.945; r <= 10; r += 0.005) {
    const v = npvAt(r);
    if (Number.isFinite(prevV) && Number.isFinite(v) && prevV * v < 0) {
      let lo = prevR, hi = r;
      for (let k = 0; k < 80; k++) { const mid = (lo + hi) / 2; if (npvAt(lo) * npvAt(mid) <= 0) hi = mid; else lo = mid; }
      const root = (lo + hi) / 2;
      if (!roots.some(x => Math.abs(x - root) < 1e-4)) roots.push(root);
    }
    prevR = r; prevV = v;
  }
  return roots.map(x => x * 100).sort((a, b) => a - b);
};
export const breakEven = (fixedCosts, price, variableCost) => {
  if (!finite(fixedCosts, price, variableCost) || fixedCosts < 0 || price <= 0 || variableCost < 0) return NaN;
  const contribution = price - variableCost;
  if (contribution <= 0) return { contribution, marginPct: NaN, units: NaN, revenue: NaN, feasible: false };
  return { contribution, marginPct: contribution / price * 100, units: fixedCosts / contribution, revenue: fixedCosts / contribution * price, feasible: true };
};
export const purchasingPower = (amount, inflationPct, years) => {
  if (!finite(amount, inflationPct, years) || amount < 0 || years < 0) return NaN;
  const factor = (1 + inflationPct / 100) ** years;
  return { realValue: amount / factor, nominalEquivalent: amount * factor, lostPct: (1 - 1 / factor) * 100 };
};
export const amortization = (principal, annualRatePct, months) => {
  if (!finite(principal, annualRatePct, months) || principal <= 0 || months < 1) return NaN;
  const payment = loanPayment(principal, annualRatePct, months);
  const totalPaid = payment * months;
  return { payment, totalPaid, totalInterest: totalPaid - principal };
};
export const kgToLb = kg => kg * 2.2046226218;
export const lbToKg = lb => lb / 2.2046226218;
export const cmToIn = cm => cm / 2.54;
export const inToCm = inch => inch * 2.54;
export const kmToMi = km => km / 1.609344;
export const miToKm = mi => mi * 1.609344;
export const kcalToKj = kcal => kcal * 4.184;
export const kjToKcal = kj => kj / 4.184;
export const mlToFloz = ml => ml / 29.5735295625;
export const flozToMl = oz => oz * 29.5735295625;
