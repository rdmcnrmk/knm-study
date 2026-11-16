export const LEARNING_KEY='dutch-study-learning-v1';
export const emptyLearning=()=>({version:1,words:{},grammar:[]});
export function parseLearning(raw,wordIds,lessonIds){
 const value=JSON.parse(raw);if(value?.version!==1||!value.words||typeof value.words!=='object'||!Array.isArray(value.grammar))throw new Error('Invalid study backup');
 const words={};for(const [id,v] of Object.entries(value.words)){if(!wordIds.has(id)||!v||!['learning','known'].includes(v.status))continue;if(!Number.isFinite(v.due)||!Number.isInteger(v.streak)||v.streak<0||v.streak>100)continue;words[id]={status:v.status,due:v.due,streak:v.streak};}
 return {version:1,words,grammar:[...new Set(value.grammar.filter(id=>lessonIds.has(id)))]};
}
export function rateWord(previous,rating,now=Date.now()){
 if(rating==='again')return {status:'learning',streak:0,due:now+10*60*1000};
 const streak=Math.min((previous?.streak||0)+1,100);
 const days=rating==='easy'?Math.min(60,4*Math.pow(2,Math.min(streak-1,4))):Math.min(30,Math.pow(2,Math.min(streak-1,5)));
 return {status:rating==='easy'||streak>=3?'known':'learning',streak,due:now+days*86400000};
}
export function matchesWord(word,query){return [word.nl,...word.meanings,...word.examples].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());}
