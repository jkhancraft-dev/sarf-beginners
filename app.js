let DATA=[], filtered=[], meaningQ=null, practiceQ=null, meaningScore=[0,0], practiceScore=[0,0];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const fields=[['past','ماضٍ معلوم'],['present','مضارع معلوم'],['amr','أمر'],['active','اسم فاعل'],['passive','اسم مفعول'],['masdar','مصدر']];
const practiceFields=[
  {key:'past', label:'الماضي المعلوم', get:x=>x.forms.past.finalForm, activePast:true},
  {key:'present', label:'المضارع المعلوم', get:x=>x.forms.present.finalForm},
  {key:'amr', label:'الأمر', get:x=>x.forms.amr.finalForm},
  {key:'passivePast', label:'الماضي المبني للمجهول', get:x=>x.passiveVerbForms?.past?.finalForm, passivePast:true},
  {key:'passivePresent', label:'المضارع المبني للمجهول', get:x=>x.passiveVerbForms?.present?.finalForm}
];
const stripHarakat=s=>(s||'').normalize('NFKC').replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g,'');
function match(hay,needle){return ($('#ignoreHarakat').checked?stripHarakat(hay):hay).toLocaleLowerCase().includes(($('#ignoreHarakat').checked?stripHarakat(needle):needle).toLocaleLowerCase())}
function safeFiniteForm(s){return typeof s==='string' && !!s.trim() && s===s.trim() && !/[\s،,\/؛;—–-]/u.test(s) && /[\u0621-\u064A\u0671-\u06D3]/u.test(s)}
function passiveText(x,which){const f=x.passiveVerbForms?.[which];return f?.finalForm||'لا يُبنى للمجهول عادةً'}
function card(x){return `<article class="verb" data-n="${x.sourceNumber}"><div class="verbtop"><span>#${x.sourceNumber} • ${x.symbol}</span><span>${x.occurrenceCount}×</span></div><div class="arabic">${x.forms.past.finalForm||x.forms.past.source}</div><div class="root">${x.root}</div><div class="meaning">${x.meaning||'—'}</div><div class="passive-preview" dir="rtl"><span>ماضٍ مجهول:</span> ${passiveText(x,'past')}<br><span>مضارع مجهول:</span> ${passiveText(x,'present')}</div><div class="mini">${x.rootType} • page ${x.sourcePage}</div></article>`}
function searchableForms(x){return [...fields.map(([k])=>x.forms[k].finalForm||''),x.passiveVerbForms?.past?.finalForm||'',x.passiveVerbForms?.present?.finalForm||'']}
function render(){let q=$('#search').value.trim(), form=$('#form').value; filtered=DATA.filter(x=>(!form||x.symbol===form)&&(!q||match(String(x.sourceNumber),q)||match(x.root,q)||match(x.meaning||'',q)||searchableForms(x).some(s=>match(s,q)))); $('#resultInfo').textContent=`${filtered.length} result${filtered.length===1?'':'s'}`; $('#list').innerHTML=filtered.slice(0,300).map(card).join(''); $$('#list .verb').forEach(e=>e.onclick=()=>openDetail(+e.dataset.n));}
function openDetail(n){let x=DATA.find(v=>v.sourceNumber===n); if(!x)return; let rows=fields.map(([k,l])=>`<div class="label">${l}</div><div class="ar" dir="rtl">${x.forms[k].finalForm||'—'}${x.forms[k].complement?` <span class="mini">${x.forms[k].complement}</span>`:''}</div>`).join(''); const p=x.passiveVerbForms||{}; const passiveRows=`<div class="passive-heading"><h3>الفعل المبني للمجهول — Passive finite forms</h3><p class="mini">Third-person masculine singular. These two forms are generated from the standard pattern, not transcribed from the source PDF. Actual passive use may be lexically restricted.</p></div><div class="label">الماضي المبني للمجهول</div><div class="ar" dir="rtl">${p.past?.finalForm||'لا يُبنى للمجهول عادةً'}</div><div class="label">المضارع المبني للمجهول</div><div class="ar" dir="rtl">${p.present?.finalForm||'لا يُبنى للمجهول عادةً'}</div>`; $('#detail').innerHTML=`<div class="verbtop">#${x.sourceNumber} • ${x.symbol} • ${x.occurrenceCount}×</div><div class="arabic">${x.forms.past.finalForm||''}</div><div class="root">الجذر: ${x.root}</div><p><b>${x.meaning||'—'}</b></p><h3>Core source paradigm</h3><div class="forms">${rows}</div><div class="forms passive-forms">${passiveRows}</div><p class="mini">Source example: <span dir="rtl">${x.example?.source||'—'}</span></p>`; $('#modal').classList.remove('hidden')}
function randomFrom(arr){return arr[Math.floor(Math.random()*arr.length)]}
function shuffled(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function randomOther(x){let pool=DATA.filter(v=>v.sourceNumber!==x.sourceNumber); return randomFrom(pool)}
function newMeaning(){let x=randomFrom(DATA), opts=[x];while(opts.length<4){let y=randomOther(x);if(!opts.some(z=>z.sourceNumber===y.sourceNumber))opts.push(y)}opts=shuffled(opts); meaningQ=x; $('#meaningPrompt').innerHTML=`<div class="prompt"><div class="big" dir="rtl">${x.forms.past.finalForm}</div><div class="mini">${x.root} • ${x.symbol}</div></div>`; $('#meaningChoices').innerHTML=opts.map(o=>`<button class="choice" data-n="${o.sourceNumber}">${o.meaning||'—'}</button>`).join(''); $$('#meaningChoices .choice').forEach(b=>b.onclick=()=>answerMeaning(b,+b.dataset.n));}
function answerMeaning(btn,n){let ok=n===meaningQ.sourceNumber;$$('#meaningChoices .choice').forEach(b=>{b.disabled=true;if(+b.dataset.n===meaningQ.sourceNumber)b.classList.add('correct')});if(!ok)btn.classList.add('wrong');meaningScore[1]++;if(ok)meaningScore[0]++;$('#meaningScore').textContent=`${meaningScore[0]} / ${meaningScore[1]}`}
function newPractice(){
  const viable=practiceFields.map(meta=>({meta, pool:DATA.filter(x=>safeFiniteForm(meta.get(x)))})).filter(z=>z.pool.length>=4 && new Set(z.pool.map(x=>z.meta.get(x))).size>=4);
  if(!viable.length){$('#practicePrompt').textContent='No verified finite-form questions are available.';$('#practiceChoices').innerHTML='';return}
  const {meta,pool}=randomFrom(viable), x=randomFrom(pool), ans=meta.get(x);
  const distractors=shuffled([...new Set(pool.map(v=>meta.get(v)).filter(s=>s!==ans))]).slice(0,3);
  if(distractors.length<3){return newPractice()}
  const opts=shuffled([ans,...distractors]); practiceQ={x,meta,ans,opts};
  const showRoot=meta.activePast||meta.passivePast;
  const clue=showRoot?`<div class="root">الجذر: ${x.root}</div><div class="mini">${x.meaning||'—'} • ${x.symbol}</div>`:`<div class="big" dir="rtl">${x.forms.past.finalForm}</div><div class="mini">root: ${x.root} • ${x.symbol}</div>`;
  $('#practicePrompt').innerHTML=`<div class="prompt"><div class="mini">Choose: ${meta.label}</div>${clue}</div>`;
  $('#practiceChoices').innerHTML=opts.map((o,i)=>`<button class="choice" data-i="${i}" dir="rtl">${o}</button>`).join('');
  $$('#practiceChoices .choice').forEach(b=>b.onclick=()=>answerPractice(b,practiceQ.opts[+b.dataset.i]));
}
function answerPractice(btn,a){let ok=a===practiceQ.ans;$$('#practiceChoices .choice').forEach(b=>{b.disabled=true;if(practiceQ.opts[+b.dataset.i]===practiceQ.ans)b.classList.add('correct')});if(!ok)btn.classList.add('wrong');practiceScore[1]++;if(ok)practiceScore[0]++;$('#practiceScore').textContent=`${practiceScore[0]} / ${practiceScore[1]}`}
function switchTab(mode){$$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));['browse','meaning','practice'].forEach(id=>$('#'+id).classList.toggle('hidden',id!==mode));if(mode==='meaning')newMeaning();if(mode==='practice')newPractice()}
$('#search').oninput=render;$('#form').onchange=render;$('#ignoreHarakat').onchange=render;$('#close').onclick=()=>$('#modal').classList.add('hidden');$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').classList.add('hidden')};$$('.tab').forEach(b=>b.onclick=()=>switchTab(b.dataset.mode));$('#nextMeaning').onclick=newMeaning;$('#nextPractice').onclick=newPractice;
fetch('data/verbs.json').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(obj=>{DATA=obj.verbs;$('#count').textContent=DATA.length;render()}).catch(e=>{$('#count').textContent='!';$('#list').innerHTML=`<p class="error">Could not load data/verbs.json. Check that the data folder is at the repository root.</p>`;console.error(e)});
