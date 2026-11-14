export type Saved = {version:1;mastered:string[];regionNote?:string;completed:string[];known:string[];scores:Record<string,number>;lastTopic:string;exam?:Attempt};
export type Attempt = {ids:string[];answers:Record<string,number>;deadline:number;finished:boolean;index:number};
export const KEY='knm-study-v1';
export const fresh=():Saved=>({version:1,mastered:[],completed:[],known:[],scores:{},lastTopic:'housing'});
export function readSaved(storage:Pick<Storage,'getItem'>):Saved {
 try {const s=JSON.parse(storage.getItem(KEY)||'null');if(s?.version!==1)return fresh();return {...fresh(),...s,mastered:Array.isArray(s.mastered)?s.mastered.filter((x:unknown)=>typeof x==='string'):[],completed:Array.isArray(s.completed)?s.completed.filter((x:unknown)=>typeof x==='string'):[],known:Array.isArray(s.known)?s.known.filter((x:unknown)=>typeof x==='string'):[],scores:s.scores&&typeof s.scores==='object'?s.scores:{},exam:isAttempt(s.exam)?s.exam:undefined};}catch{return fresh();}
}
function isAttempt(x:unknown):x is Attempt {const a=x as Attempt;return !!a&&Array.isArray(a.ids)&&a.ids.length>0&&a.ids.every(i=>typeof i==='string')&&typeof a.deadline==='number'&&Number.isFinite(a.deadline)&&typeof a.finished==='boolean'&&Number.isInteger(a.index)&&a.index>=0&&a.index<a.ids.length&&!!a.answers&&typeof a.answers==='object'&&Object.values(a.answers).every(v=>Number.isInteger(v)&&v>=0&&v<3);}
export function shuffle<T>(items:T[]):T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export const secondsLeft=(deadline:number,now=Date.now())=>Math.max(0,Math.ceil((deadline-now)/1000));
export const formatTime=(seconds:number)=>`${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;
