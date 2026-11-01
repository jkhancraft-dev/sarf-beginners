const fs=require('fs');const vm=require('vm');const assert=require('assert');
const data=JSON.parse(fs.readFileSync(__dirname+'/../conjugation_data.json','utf8'));
class El{constructor(id){this.id=id;this.innerHTML='';this.value='';this.textContent='';this.disabled=false;this.className='';this.listeners={};}addEventListener(n,f){this.listeners[n]=f;}querySelectorAll(){return [];}querySelector(){return null;}closest(){return null;}}
const els=new Map();const doc={querySelector(sel){if(!els.has(sel))els.set(sel,new El(sel));return els.get(sel);}};
const ctx={window:{},document:doc,console,fetch:()=>Promise.resolve({ok:true,json:()=>Promise.resolve(data)}),Math,Set,Array,String,Number,Promise};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../conjugation_core.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../conjugation.js','utf8'),ctx);
setTimeout(()=>{
 const category=els.get('#conjCategoryButtons').innerHTML;
 const patterns=els.get('#conjPatternButtons').innerHTML;
 const list=els.get('#conjVerbList').innerHTML;
 assert.equal((category.match(/data-category=/g)||[]).length,4,'four group controls');
 assert(category.includes('Thulāthī')&&category.includes('Rubāʿī')&&category.includes('Khumāsī')&&category.includes('Sudāsī'));
 assert.equal((patterns.match(/data-pattern=/g)||[]).length,4,'all plus three thulathi wazan filters');
 assert.equal((list.match(/data-verb-key=/g)||[]).length,60,'thulathi verb list renders');
 assert(list.includes('فَهِمَ')&&list.includes('كَتَبَ'));
 console.log(JSON.stringify({ui:'PASS',categoryButtons:4,thulathiPatterns:3,thulathiVerbs:60},null,2));
},30);
