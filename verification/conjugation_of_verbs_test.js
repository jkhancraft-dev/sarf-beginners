const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const data=JSON.parse(fs.readFileSync(__dirname+'/../conjugation_data.json','utf8'));
const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../conjugation_core.js','utf8'),ctx);
const core=ctx.window.SARF_CONJUGATION_CORE;
assert(data.version==='10.6');
assert(data.categories && data.patterns && data.verbs.length>200);
assert.deepStrictEqual(Object.keys(data.categories).sort(),['khumasi','rubai','sudasi','thulathi']);
const patCounts={};for(const v of data.verbs){assert(data.patterns[v.category].includes(v.wazn),`Pattern group mismatch ${v.key}`);patCounts[v.category]=(patCounts[v.category]||0)+1;}
assert(patCounts.thulathi>0&&patCounts.rubai>0&&patCounts.khumasi>0&&patCounts.sudasi>0);
assert.equal(data.patterns.sudasi.length,6,'Textbook p.19 lists six sudasi patterns');
for(const v of ['اِحْمَارَّ','اِسْمَارَّ','اِخْشَوْشَنَ','اِعْشَوْشَبَ','اِجْلَوَّذَ','اِغْلَوَّطَ','اِحْرَنْجَمَ','اِفْرَنْقَعَ','اِطْمَأَنَّ','اِشْمَأَزَّ']) assert(data.verbs.some(x=>x.canonical===v),`Textbook p.19 example missing: ${v}`);
let forms=0, samples={};
for(const v of data.verbs){
 const own=core.factsForVerb(v,data);
 assert(own.length>=2,`Missing baseline quiz facts for ${v.canonical}`);
 const morph=core.availableFacts(v,data); forms+=morph.length;
 // Exercise repeated random generation, requiring 4 unique choices and exactly one correct.
 for(let i=0;i<30;i++){
  const q=core.createQuestion(v,data);
  assert(q,`No question created for ${v.canonical}`);
  assert.equal(q.options.length,4,`Wrong option count for ${v.canonical}`);
  assert.equal(new Set(q.options).size,4,`Duplicate options for ${v.canonical}`);
  assert(q.options.includes(q.correct),`Correct answer missing for ${v.canonical}`);
  assert(q.question&&q.question.length>0);
  samples[v.category]=q;
 }
}
// Explicit reviewed paradigm coverage and pronoun labels.
const k='كتب|فَعَلَ';
const v=data.verbs.find(x=>x.key===k);assert(v,'كَتَبَ absent');
const fsK=core.factsForVerb(v,data);
for(const t of ['past_active','present_active','amr','past_passive','present_passive','ism_faail_m_sg','ism_faail_f_sg','ism_faail_m_du','ism_faail_f_du','ism_faail_m_pl','ism_faail_f_pl','ism_mafool_m_sg','ism_mafool_f_sg','ism_mafool_m_du','ism_mafool_f_du','ism_mafool_m_pl','ism_mafool_f_pl','masdar']) assert(fsK.some(x=>x.type===t),`كَتَبَ lacks ${t}`);
assert(fsK.some(x=>x.type==='past_active'&&x.promptLabel.includes('لِلْمُؤَنَّثَتَيْنِ')),'Dual feminine past prompt missing');
assert(fsK.some(x=>x.type==='present_passive'&&x.promptLabel.includes('لِلْمُؤَنَّثَتَيْنِ')),'Dual feminine passive present prompt missing');
assert(!fsK.some(x=>x.type==='past_active'&&x.slot==='past:0'),'Do not quiz the selected lemma as its own active-past answer');
console.log(JSON.stringify({catalog:data.verbs.length,facts:data.facts.length,morphologyFacts:forms,categoryCounts:patCounts,optionsTested:data.verbs.length*30,explicit:'Vocalized conjugation + noun gender/number coverage'},null,2));
