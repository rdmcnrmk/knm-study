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
test('every question and both example answers have distinct prerecorded audio with attribution',()=>{
 const paths=bank.flatMap(q=>[q.id+'-question',...q.answers.map((_,i)=>q.id+'-answer-'+(i+1))]);
 assert.equal(paths.length,132);
 const seen=new Set();
 for(const id of paths){const bytes=readFileSync(new URL('../public/speaking/audio/'+id+'.mp3',import.meta.url));assert.ok(bytes.length>1500);assert.equal(bytes.subarray(0,3).toString(),'ID3');assert.ok(bytes.includes(Buffer.from('elevenlabs.io','utf16le')));const size=[...bytes.subarray(6,10)].reduce((n,b)=>(n<<7)|(b&127),0);const audio=bytes.subarray(10+size).toString('base64');assert.ok(!seen.has(audio),id+' has duplicate audio');seen.add(audio);}
});
