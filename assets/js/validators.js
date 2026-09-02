export function validateFields(fields,values,lang='ru'){const errors={};for(const f of fields){const raw=values[f.id];if((raw===''||raw==null)&&f.required!==false){errors[f.id]=lang==='ru'?'Заполните поле':'Required field';continue}if(raw===''||raw==null)continue;if(f.type==='number'||f.type==='range'){const n=Number(raw);if(!Number.isFinite(n))errors[f.id]=lang==='ru'?'Введите число':'Enter a number';else if(f.min!=null&&n<f.min)errors[f.id]=`${lang==='ru'?'Минимум':'Minimum'}: ${f.min}`;else if(f.max!=null&&n>f.max)errors[f.id]=`${lang==='ru'?'Максимум':'Maximum'}: ${f.max}`}}return errors}

const allowedProfile=new Set(['age','sex','height','weight','waist','hip','neck','bodyFat','restingHR','steps','moderateMinutes','vigorousMinutes','strengthDays','sleepHours','caffeineDaily','subjectiveStress','primaryGoal','income','savings','expenses','emergencyCash']);
const allowedThemes=new Set(['system','light','paper','dark','midnight']);
const uid=()=>globalThis.crypto?.randomUUID?.()||`ml-${Date.now().toString(36)}`;
const safeDate=v=>Number.isFinite(Date.parse(v))?new Date(v).toISOString():new Date().toISOString();

export function normalizeImport(raw,validIds){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Invalid payload');
 if(Number(raw.version||1)>4)throw new Error('Unsupported version');
 const out={version:4,lang:raw.lang==='ru'?'ru':'en',theme:allowedThemes.has(raw.theme)?raw.theme:'system',profile:{},favorites:[],history:[],snapshots:[],recents:[],onboardingDismissed:Boolean(raw.onboardingDismissed)};
 if(raw.profile&&typeof raw.profile==='object'&&!Array.isArray(raw.profile))for(const[k,v]of Object.entries(raw.profile)){if(!allowedProfile.has(k))continue;if(k==='sex'){if(['male','female'].includes(v))out.profile[k]=v}else if(k==='primaryGoal'){if(['health','fat-loss','muscle','performance','finance'].includes(v))out.profile[k]=v}else if(Number.isFinite(Number(v)))out.profile[k]=Number(v)}
 if(Array.isArray(raw.favorites))out.favorites=[...new Set(raw.favorites.filter(x=>typeof x==='string'&&validIds.has(x)))].slice(0,200);
 if(Array.isArray(raw.recents))out.recents=[...new Set(raw.recents.filter(x=>typeof x==='string'&&validIds.has(x)))].slice(0,8);
 if(Array.isArray(raw.history))out.history=raw.history.filter(x=>x&&typeof x==='object'&&validIds.has(x.calcId)).slice(-200).map(x=>({id:String(x.id||uid()).slice(0,100),calcId:x.calcId,at:safeDate(x.at),summary:String(x.summary||'').slice(0,300),inputs:sanitizeInputs(x.inputs),result:sanitizeResult(x.result)}));
 if(Array.isArray(raw.snapshots))out.snapshots=raw.snapshots.filter(x=>x&&typeof x==='object').slice(-200).map(x=>({id:String(x.id||uid()).slice(0,100),at:safeDate(x.at),profile:sanitizeProfile(x.profile)}));
 return out;
}
function sanitizeInputs(obj){const out={};if(!obj||typeof obj!=='object'||Array.isArray(obj))return out;for(const[k,v]of Object.entries(obj).slice(0,80))if(/^[a-zA-Z0-9_-]{1,40}$/.test(k)&&(typeof v==='string'||Number.isFinite(v)))out[k]=typeof v==='string'?v.slice(0,80):v;return out}
function sanitizeProfile(obj){const out={};if(!obj||typeof obj!=='object'||Array.isArray(obj))return out;for(const[k,v]of Object.entries(obj))if(allowedProfile.has(k)&&(typeof v==='string'||Number.isFinite(v)))out[k]=typeof v==='string'?v.slice(0,40):v;return out}
function sanitizeResult(obj){if(!obj||typeof obj!=='object'||Array.isArray(obj))return undefined;const primary=typeof obj.primary==='string'?obj.primary.slice(0,120):Number.isFinite(obj.primary)?obj.primary:undefined;if(primary===undefined)return undefined;return{primary,unit:typeof obj.unit==='string'?obj.unit.slice(0,30):'',secondary:Array.isArray(obj.secondary)?obj.secondary.slice(0,12).map(x=>({label:{ru:String(x?.label?.ru||'').slice(0,100),en:String(x?.label?.en||'').slice(0,100)},value:typeof x?.value==='string'?x.value.slice(0,80):Number(x?.value),unit:String(x?.unit||'').slice(0,30)})):[]}}
export const profileKeys=[...allowedProfile];
