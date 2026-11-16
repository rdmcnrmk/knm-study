import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rateWord,parseLearning,matchesWord} from '../src/learning-engine.mjs';
const words=JSON.parse(readFileSync(new URL('../src/word-data.json',import.meta.url)));
const lessons=JSON.parse(readFileSync(new URL('../src/grammar-data.json',import.meta.url)));
test('supplied decks are merged without losing meanings or examples',()=>{
 assert.equal(words.length,715);assert.equal(new Set(words.map(w=>w.id)).size,715);
 for(const w of words){assert.ok(w.nl&&w.meanings.length&&w.examples.length&&w.decks.length);assert.equal(new Set(w.examples).size,w.examples.length);}
 assert.equal(words.filter(w=>w.decks.includes('Core 5')).length,85);
 assert.equal(words.filter(w=>w.decks.includes('Medium 1')).length,85);
 const bodem=words.find(w=>w.nl==='bodem');assert.equal(bodem.examples.length,2);
});
test('each grammar lesson has a valid table and answer key',()=>{
 assert.equal(lessons.length,11);
 for(const l of lessons){assert.ok(l.sections.length&&l.examples.length);for(const r of l.rows)assert.equal(r.length,l.headers.length);for(const q of l.quiz)assert.ok(q.options[q.correct]&&q.explanation);}
});
test('recall intervals grow, easy marks known, again resets recall',()=>{
 const now=1000;let p=rateWord(undefined,'good',now);assert.equal(p.status,'learning');assert.equal(p.due,now+86400000);
 p=rateWord(p,'good',now);assert.equal(p.due,now+2*86400000);
 p=rateWord(p,'good',now);assert.equal(p.status,'known');
 p=rateWord(p,'again',now);assert.deepEqual(p,{status:'learning',streak:0,due:now+600000});
 assert.equal(rateWord(undefined,'easy',now).status,'known');
 assert.ok(Number.isFinite(rateWord({streak:100},'easy',now).due));
});
test('backup rejects invalid formats and strips unknown ids or invalid records',()=>{
 assert.throws(()=>parseLearning('{"version":7}',new Set(),new Set()));
 const value={version:1,words:{a:{status:'known',streak:3,due:123},b:{status:'known',streak:-1,due:123},x:{status:'known',streak:3,due:123}},grammar:['one','one','unknown']};
 assert.deepEqual(parseLearning(JSON.stringify(value),new Set(['a','b']),new Set(['one'])),{version:1,words:{a:{status:'known',streak:3,due:123}},grammar:['one']});
});
test('vocabulary search matches both languages and examples',()=>{
 const w={nl:'de boom',meanings:['tree'],examples:['De vogel zit in de boom.']};assert.ok(matchesWord(w,' TREE '));assert.ok(matchesWord(w,'vogel'));assert.ok(matchesWord(w,'boom'));assert.equal(matchesWord(w,'chair'),false);
});
