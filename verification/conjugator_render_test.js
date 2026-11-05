const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
const app=fs.readFileSync('textbook/app.js','utf8');
const dataSrc=fs.readFileSync('textbook/data.js','utf8');
const regSrc=fs.readFileSync('textbook/verified_conjugations.js','utf8');
const ctx={console, window:{}, document:{createElement(){return {className:'',innerHTML:'',addEventListener(){}};}}, normalizeArabic:null};
vm.createContext(ctx);
vm.runInContext(dataSrc+'\nglobalThis.DATA=DATA;',ctx);
vm.runInContext(regSrc,ctx);
ctx.esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
ctx.arabic=(t,cls='ar')=>`<span dir="rtl" lang="ar" class="${cls}">${ctx.esc(t)}</span>`;
ctx.card=(title,body,cls='')=>`<article class="card ${cls}"><h3>${title}</h3>${body}</article>`;
ctx.normalizeArabic=s=>String(s||'').normalize('NFD').replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').trim();
ctx.normalizeForRegistry=s=>ctx.normalizeArabic(s).replace(/[\u0640\u0671]/g,'ا').replace(/ة/g,'ه');
ctx.findVerbRecord=input=>{const n=ctx.normalizeArabic(input); const all=[...(ctx.DATA.verbs||[]),...(ctx.DATA.exercise_entries||[])];return all.find(v=>ctx.normalizeArabic(v.ar)===n)||all.find(v=>ctx.normalizeArabic(v.past_3ms)===n)||all.find(v=>ctx.normalizeArabic(v.present_3ms)===n)||null};
ctx.verifiedLexeme=input=>Object.values(ctx.window.TEXTBOOK_VERIFIED_CONJUGATIONS||{}).find(v=>ctx.normalizeForRegistry(v.canonical)===ctx.normalizeForRegistry(input))||null;
const nodes={};
for(const id of ['#conjugator','#conjInput','#conjWhat','#runConj','#conjResult','#quickVerbInput','#quickWazn','#quickConjRun','#quickConjResult']) nodes[id]={value:'',innerHTML:'',addEventListener(type,fn){if(type==='click')this.onclick=fn;},onclick:null,appendChild(){}};
nodes['#quickWazn'].value='فَعَلَ';
ctx.window.SARF_PROVISIONAL_CONJUGATION_DB=JSON.parse(fs.readFileSync('textbook/conjugation_database.js','utf8').replace(/^window\.SARF_PROVISIONAL_CONJUGATION_DB\s*=\s*/, '').replace(/;\s*$/, ''));

ctx.q=sel=>nodes[sel];
const a=app.indexOf('function miniTable(rows){');
const b=app.indexOf('\n}\n\nconst modes=',a)+2;
assert.ok(a>=0&&b>a,'conjugator helper block found');
vm.runInContext(app.slice(a,b),ctx);
const reg=ctx.window.TEXTBOOK_VERIFIED_CONJUGATIONS;
const modes=['everything','past','present','amr','faail','mafool','passive_past','passive_present','masdar','tafdil','wazn'];
let count=0;
for(const [lemma,record] of Object.entries(reg)){
  assert.ok(ctx.findVerbRecord(lemma),`index lookup finds ${lemma}`);
  for(const mode of modes){
    nodes['#conjInput'].value=lemma;
    nodes['#conjWhat'].value=mode;
    ctx.renderConjugator();
    nodes['#runConj'].onclick();
    const out=nodes['#conjResult'].innerHTML;
    assert.ok(out.includes(lemma),`${lemma}/${mode}: lemma visible`);
    assert.ok(out.includes('Verification status:'),`${lemma}/${mode}: status visible`);
    if(mode==='wazn') assert.ok(out.includes(record.wazn),`${lemma}: wazn mode output`);
    if(mode==='tafdil' && !record.nouns.tafdil) { assert.ok(out.includes('Ism al-Tafdīl') && out.includes(record.nouns.tafdil_note),`${lemma}: missing tafdil explained`); }
    if(mode==='amr' && !(record.active.amr||[]).length) assert.ok(out.includes('intentionally omits'),`${lemma}: missing amr explained`);
    count++;
  }
}
nodes['#quickVerbInput'].value='كَتَبَ';
ctx.renderConjugator();
nodes['#quickConjRun'].onclick();
assert.ok(nodes['#quickConjResult'].innerHTML.includes('كَتَبَ'),'quick conjugator finds كَتَبَ');
assert.ok(nodes['#quickConjResult'].innerHTML.includes('يَكْتُبُ'),'quick conjugator renders muḍāriʿ');
nodes['#quickWazn'].value='فَعِلَ'; nodes['#quickConjRun'].onclick();
assert.ok(nodes['#quickConjResult'].innerHTML.includes('لم يُعثر'),'wrong Form I vowel class is not guessed');
console.log(`PASS: ${count} real renderConjugator executions across ${Object.keys(reg).length} reviewed lemmas × ${modes.length} modes; quick conjugator lookup checks passed.`);
