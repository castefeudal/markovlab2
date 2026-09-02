import { normalizeImport } from './validators.js?v=6.0.0-r1';

const KEY = 'markovlab2-state-v4';
const LEGACY_KEYS = [];
export const THEME_PREFERENCES = Object.freeze(['system','light','paper','dark','midnight']);
const THEMES = new Set(THEME_PREFERENCES);
const uid = () => globalThis.crypto?.randomUUID?.() || `ml-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;

export const DEFAULT_STATE = Object.freeze({version:4,lang:'en',theme:'system',profile:{},favorites:[],history:[],snapshots:[],recents:[],onboardingDismissed:false});
const preferredLanguage=()=>typeof navigator!=='undefined'&&String(navigator.language||'').toLowerCase().startsWith('ru')?'ru':'en';
const fresh = () => ({...structuredClone(DEFAULT_STATE),lang:preferredLanguage()});
export const normalizeTheme=theme=>THEMES.has(theme)?theme:'system';

export function migrateState(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || Number(raw.version || 1) > 4) return fresh();
  const history=Array.isArray(raw.history)?raw.history.map(item=>({
    ...item,
    summary:typeof item?.summary==='string'?item.summary:'',
    result:item?.result&&typeof item.result==='object'?item.result:undefined
  })):[];
  return {...fresh(),...raw,version:4,lang:raw.lang==='ru'?'ru':'en',theme:normalizeTheme(raw.theme),profile:raw.profile&&typeof raw.profile==='object'?raw.profile:{},favorites:Array.isArray(raw.favorites)?raw.favorites:[],history,snapshots:Array.isArray(raw.snapshots)?raw.snapshots:[],recents:Array.isArray(raw.recents)?raw.recents:[],onboardingDismissed:Boolean(raw.onboardingDismissed)};
}
const readStoredState=key=>{try{const text=localStorage.getItem(key);return text?JSON.parse(text):null}catch{return null}};
export function loadState(){
  const entries=[KEY,...LEGACY_KEYS].map(key=>({key,raw:readStoredState(key)})).filter(entry=>entry.raw&&typeof entry.raw==='object'&&!Array.isArray(entry.raw));
  const selected=entries[0];
  const state=migrateState(selected?.raw);
  if(selected&&selected.key!==KEY)saveState(state);
  return state;
}
export function saveState(state){localStorage.setItem(KEY,JSON.stringify({...state,version:4}))}
export function exportState(state){return JSON.stringify({...state,version:4,exportedAt:new Date().toISOString(),product:'MARKOVLAB',app:'markovlab2'},null,2)}
export function importState(text,ids){if(typeof text!=='string'||text.length>2_000_000)throw new Error('Import too large');return normalizeImport(JSON.parse(text),ids)}
export function clearState(){localStorage.removeItem(KEY);for(const key of LEGACY_KEYS)localStorage.removeItem(key)}
export function addHistory(state,record){state.history=[...state.history,{...record,id:uid(),at:new Date().toISOString()}].slice(-200);saveState(state)}
export function addSnapshot(state){state.snapshots=[...state.snapshots,{id:uid(),at:new Date().toISOString(),profile:{...state.profile}}].slice(-200);saveState(state)}
export function touchRecent(state,calcId){state.recents=[calcId,...state.recents.filter(id=>id!==calcId)].slice(0,8);saveState(state)}
