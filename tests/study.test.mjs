import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
async function loadTS(path,transform=s=>s){const code=transform(fs.readFileSync(new URL(path,import.meta.url),'utf8'));const js=ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));}
const engine=await loadTS('../src/engine.ts');
const supplements=JSON.parse(fs.readFileSync(new URL('../src/supplements.json',import.meta.url),'utf8'));
const book=JSON.parse(fs.readFileSync(new URL('../src/book.json',import.meta.url),'utf8'));
const assessment=JSON.parse(fs.readFileSync(new URL('../src/assessment-review.json',import.meta.url),'utf8'));
const {distractors}=await loadTS('../src/distractors.ts');
const data=await loadTS('../src/data.ts',s=>s.replace("import book from './book.json';",`const book=${JSON.stringify(book)};`).replace("import supplements from './supplements.json';",`const supplements=${JSON.stringify(supplements)};`).replace("import assessment from './assessment-review.json';",`const assessment=${JSON.stringify(assessment)};`).replace("import {distractors} from './distractors';",`const distractors=${JSON.stringify(distractors)};`));
test('all eight topics have full bilingual lessons, source pages and six or more questions',()=>{assert.equal(data.topics.length,8);assert.equal(data.topics.reduce((n,t)=>n+t.lessons.length,0),74);for(const t of data.topics){assert.ok(t.lessons.length>=5);for(const l of t.lessons){assert.ok(l.nl.length>150);assert.ok(l.en.length>150);assert.ok(l.page>=0&&l.page<=35);}assert.ok(data.questions.filter(q=>q.topic===t.id).length>=6);}});
test('practice bank has unique questions, valid distinct options and translations',()=>{assert.equal(data.questions.length,122);assert.equal(new Set(data.questions.map(q=>q.id)).size,122);for(const q of data.questions){assert.ok(q.nl&&q.en);assert.equal(q.options.length,3);assert.equal(new Set(q.options.map(o=>o.nl)).size,3);assert.deepEqual(q.options[q.correct],q.answer);assert.ok(q.source);}});
test('mock selection includes exactly five per topic and 40 unique questions',()=>{const selected=data.topics.flatMap(t=>engine.shuffle(data.questions.filter(q=>q.topic===t.id)).slice(0,5));assert.equal(selected.length,40);assert.equal(new Set(selected.map(q=>q.id)).size,40);for(const t of data.topics)assert.equal(selected.filter(q=>q.topic===t.id).length,5);});
test('vocabulary is complete and linked to real topics',()=>{assert.equal(data.vocabulary.length,80);for(const v of data.vocabulary){assert.ok(data.topics.some(t=>t.id===v.topic));assert.ok(v.nl&&v.en&&v.context);}});
test('malformed or blocked local storage never crashes the app',()=>{for(const value of ['', 'bad json','{}','null','{"version":2}','{"version":1,"completed":3,"known":false,"exam":{}}']){const s=engine.readSaved({getItem:()=>value});assert.ok(Array.isArray(s.completed));assert.ok(Array.isArray(s.known));assert.equal(s.exam,undefined);}assert.deepEqual(engine.readSaved({getItem:()=>{throw Error('blocked')}}),engine.fresh());});
test('saved progress and an active exam survive a reload',()=>{const s=engine.fresh();s.completed=['housing-0'];s.known=['housing-v0'];s.exam={ids:['housing-0'],answers:{'housing-0':1},deadline:10000,finished:false,index:0};assert.deepEqual(engine.readSaved({getItem:()=>JSON.stringify(s)}),s);});
test('absolute timer does not pause when a tab is closed',()=>{assert.equal(engine.secondsLeft(2700000,0),2700);assert.equal(engine.secondsLeft(2700000,2699000),1);assert.equal(engine.secondsLeft(2700000,2800000),0);assert.equal(engine.formatTime(2700),'45:00');});

const {curriculum,provinces}=await loadTS('../src/curriculum.ts',s=>s.replace("import {topics} from './data';",`const topics=${JSON.stringify(data.topics)};`));
test('all 78 numbered targets have valid navigable study mappings',()=>{assert.equal(curriculum.length,78);assert.equal(new Set(curriculum.map(t=>t.id)).size,78);for(const t of curriculum){assert.ok(t.lessons.length>0,t.id+' lacks a lesson');for(const l of t.lessons)assert.ok(data.topics.find(x=>x.id===l.topic)?.lessons.some(x=>x.id===l.lessonId),t.id+' invalid lesson');}});
test('original completion IDs stay stable after adding lessons',()=>{for(const t of data.topics){const originalCount=t.id==='government'||t.id==='history'?6:5;for(let i=0;i<originalCount;i++)assert.equal(t.lessons[i].id,`${t.id}-${i}`);}const s=engine.readSaved({getItem:()=>JSON.stringify({version:1,completed:['housing-0'],known:[],scores:{},lastTopic:'housing'})});assert.deepEqual(s.completed,['housing-0']);assert.deepEqual(s.mastered,[]);});
test('new explanations, sources and province guide are complete',()=>{assert.equal(supplements.lessons.length,32);assert.equal(supplements.questions.length,32);for(const l of supplements.lessons){assert.ok(l.targets.length>0);assert.ok(l.refs.length>0);assert.equal(l.checked,assessment.updatedLessons.includes(l.id)?'2026-11-15':'2026-11-14');for(const url of l.refs)assert.equal(new URL(url).protocol,'https:');}for(const q of supplements.questions){assert.ok(q.explanation.nl&&q.explanation.en);assert.ok(supplements.lessons.some(l=>l.id===q.lessonId));}assert.equal(provinces.length,12);assert.equal(new Set(provinces.map(p=>`${p.x},${p.y}`)).size,12);});


test('all 40 PDF items map to one canonical fact without duplicating eight existing questions',()=>{
 assert.equal(data.assessmentQuestions.length,40);
 assert.deepEqual(assessment.questions.map(q=>q.pdfNumber),Array.from({length:40},(_,i)=>i+1));
 assert.equal(assessment.questions.filter(q=>q.canonicalId!==q.id).length,8);
 for(const q of assessment.questions){assert.ok(data.questions.some(c=>c.id===q.canonicalId),q.id);assert.ok(q.pdfPages.length);assert.ok(q.pdfPages.every(p=>p>=1&&p<=30));assert.ok(data.questionById[q.id]);assert.equal(data.questions.some(c=>c.id===q.id),q.canonicalId===q.id);}
});
test('new practice has valid bilingual explanations, unique options and real lesson links',()=>{
 const additions=[...data.assessmentQuestions,...assessment.extraQuestions];
 assert.equal(assessment.extraQuestions.length,8);assert.equal(assessment.updatedLessons.length,16);
 for(const q of additions){assert.ok(q.explanation.nl.length>30&&q.explanation.en.length>30);assert.equal(q.options.length,3);assert.equal(new Set(q.options.map(o=>o.nl)).size,3);assert.equal(new Set(q.options.map(o=>o.en)).size,3);assert.deepEqual(q.answer,q.options[q.correct]);assert.ok(data.topics.some(t=>t.lessons.some(l=>l.id===q.lessonId)),q.id);}
 assert.equal(new Set(data.questions.map(q=>q.nl.trim().toLowerCase())).size,data.questions.length);
});
test('date and legal nuances are corrected rather than copying a misleading simplified answer',()=>{
 const ww=assessment.questions.find(q=>q.pdfNumber===17);assert.ok(ww.adaptation);assert.match(ww.answer.nl,/eerste werkloosheidsdag/);
 const court=assessment.questions.find(q=>q.pdfNumber===13);assert.match(court.nl,/strafrechter/);assert.match(court.explanation.nl,/strafbeschikking/);
 const funding=assessment.questions.find(q=>q.pdfNumber===24);assert.match(funding.explanation.nl,/premies/);
});

test('PDF answer key matches the independently reviewed source sequence',()=>{
 const key=[2,3,1,3,3,3,2,1,1,3,1,3,3,1,2,1,1,1,3,2,3,3,1,1,1,1,2,1,2,3,2,1,2,1,1,2,1,3,1,2];
 assert.deepEqual(assessment.questions.map(q=>q.correct+1),key);
});
