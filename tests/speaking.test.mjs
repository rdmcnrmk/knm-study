import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const bank=JSON.parse(readFileSync(new URL('../src/speaking-data.json',import.meta.url),'utf8'));
test('all five Notion sets are complete with stable IDs and two translated answers',()=>{
 assert.equal(new Set(bank.map(q=>q.id)).size,44);
 for(const [group,count] of Object.entries({'wat-hoe-waar':8,waarom:8,one:7,two:11,three:10})){
  const rows=bank.filter(q=>q.group===group);assert.equal(rows.length,count);
  assert.deepEqual(rows.map(q=>q.number),Array.from({length:count},(_,i)=>i+1));
 }
 for(const q of bank){assert.ok(q.nl.trim()&&q.en.trim());assert.equal(q.answers.length,2);for(const a of q.answers)assert.ok(a.nl.trim()&&a.en.trim());}
});
test('picture prompts ship their illustrations locally under the repository base',()=>{
 for(const q of bank){assert.equal(q.images.length,['one','two','three'].includes(q.group)?1:0);for(const path of q.images){assert.match(path,/^speaking\/[a-z0-9-]+\.(png|jpg)$/);const file=new URL('../public/'+path,import.meta.url);assert.ok(existsSync(file));assert.ok(readFileSync(file).length>1000);}}
});
