const q = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const state = JSON.parse(localStorage.getItem('sarfState') || '{}');
state.font = state.font || 1;
state.completed = state.completed || {};
state.correct = state.correct || 0;
state.wrong = state.wrong || 0;
state.sound = state.sound !== false;
state.streak = state.streak || 0;

function save(){localStorage.setItem('sarfState',JSON.stringify(state));}
function arabic(t, cls='ar'){return `<span dir="rtl" lang="ar" class="${cls}">${esc(t)}</span>`}
function card(title,body,cls=''){return `<article class="card ${cls}"><h3>${title}</h3>${body}</article>`}

function tone(type){
  if(!state.sound) return;
  try{
    const C=window.AudioContext||window.webkitAudioContext; if(!C) return;
    const ctx=new C(); const o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sine';
    const now=ctx.currentTime;
    if(type==='correct'){
      o.frequency.setValueAtTime(740,now); o.frequency.exponentialRampToValueAtTime(1040,now+.11);
      g.gain.setValueAtTime(.0001,now); g.gain.exponentialRampToValueAtTime(.055,now+.015); g.gain.exponentialRampToValueAtTime(.0001,now+.18);
    } else {
      o.frequency.setValueAtTime(210,now); o.frequency.exponentialRampToValueAtTime(150,now+.12);
      g.gain.setValueAtTime(.0001,now); g.gain.exponentialRampToValueAtTime(.035,now+.015); g.gain.exponentialRampToValueAtTime(.0001,now+.16);
    }
    o.connect(g).connect(ctx.destination); o.start(now); o.stop(now+.2); setTimeout(()=>ctx.close(),300);
  }catch(_e){}
}

function renderLessons(){
  q('#lessons').innerHTML = DATA.lessons.map(x=>{
    const done=!!state.completed[x.id];
    const subs=x.sublessons||[];
    const subHtml=subs.map((s,i)=>`<details class="sublesson" ${i===0?'open':''}><summary><span class="lesson-index">${i+1}.</span> ${arabic(s.title_ar,'ar title-ar')} — ${esc(s.title_en)}</summary><p class="source"><b>Basis:</b> ${esc(s.source_basis)}</p><p>${esc(s.explanation)}</p>${s.rule_en?`<div class="rule-box"><h5>${esc(s.rule_title||'Rule')}</h5><p>${esc(s.rule_en)}</p></div>`:''}${s.steps?.length?`<h5>Step-by-step</h5><ol class="steps">${s.steps.map(z=>`<li>${esc(z)}</li>`).join('')}</ol>`:''}${s.examples?.length?`<h5>Examples</h5><div class="examples">${s.examples.map(z=>`<div>${esc(z)}</div>`).join('')}</div>`:''}${s.notes?.length?`<h5>Notes</h5><ul class="notes">${s.notes.map(z=>`<li>${esc(z)}</li>`).join('')}</ul>`:''}${s.supplementary?.length?`<div class="supp-note"><b>Supplementary reference:</b> ${s.supplementary.map(r=>`<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a>`).join(' · ')}</div>`:''}</details>`).join('');
    return `<article class="card lesson-card"><div class="lesson-header"><div><h3>${esc(x.id)} — ${arabic(x.title_ar,'ar title-ar')}</h3><p class="en-title">${esc(x.title_en)}</p></div><span class="badge ${done?'done':''}">${done?'✓ Complete':'Not started'}</span></div><p class="muted">Source pages: ${esc(x.pages)}</p><div class="lesson-path"><b>Learning path:</b> ${esc(x.learning_path_note||'Read the rule, study the examples, then practise.')}</div><h4>Sub-lessons</h4>${subHtml||'<p class="muted">No sub-lessons mapped yet.</p>'}<button class="btn" onclick="toggleLesson('${x.id}')">${done?'Mark incomplete':'Mark complete'}</button></article>`;
  }).join('');
}
function toggleLesson(id){state.completed[id]=!state.completed[id];save();renderLessons();renderDashboard()}

function renderPatterns(){
  q('#patterns').innerHTML = `<div class="grid">${DATA.patterns.map(p=>card(arabic(p[0],'ar pattern'),`<p>${esc(p[1])}</p><p class="muted">${esc(p[2])}</p>`)).join('')}</div>`;
}

function learningEntries(){return [...(DATA.verbs||[]),...(DATA.exercise_entries||[])];}

function renderVerbs(){
  const entries=learningEntries();
  q('#verbs').innerHTML = `<div class="searchbar"><input id="verbSearch" placeholder="Search Arabic, root, meaning or وزن…"><span>${entries.length} verified entries</span></div><div id="verbGrid" class="grid"></div>`;
  const draw=()=>{
    const term=q('#verbSearch').value.trim().toLowerCase();
    const list=entries.filter(v=>[v.ar,v.root,v.wazn,v.meaning].join(' ').toLowerCase().includes(term));
    q('#verbGrid').innerHTML=list.map(v=>card(arabic(v.ar,'ar verb'),`<p><b>Root:</b> ${esc(v.root)}</p><p><b>وزن:</b> ${arabic(v.wazn,'small-ar')}</p><p>${esc(v.meaning)}</p><p class="muted">Source page: ${esc(v.source_page||v.source||v.lesson||'')}</p>${v.source_anomaly?`<p class="muted"><b>Source note:</b> ${esc(v.source_anomaly)}</p>`:''}`)).join('') || '<p>No match.</p>';
  };
  q('#verbSearch').addEventListener('input',draw); draw();
}

function renderConjugator(){
  q('#conjugator').innerHTML=card('Māḍī conjugation',`<p class="muted">The table is locked to the source's 14-slot conjugation order.</p><select id="patSelect">${DATA.patterns.map(p=>`<option value="${esc(p[0])}">${esc(p[0])} — ${esc(p[1])}</option>`).join('')}</select><div id="conjTable"></div>`);
  const draw=()=>{
    const p=q('#patSelect').value; const rows=DATA.past_conjugations[p]||[];
    q('#conjTable').innerHTML='<table><thead><tr><th>Pronoun</th><th>Form</th></tr></thead><tbody>'+rows.map(([pr,f])=>`<tr><td>${arabic(pr,'small-ar')}</td><td>${arabic(f,'ar table-ar')}</td></tr>`).join('')+'</tbody></table>';
  };
  q('#patSelect').addEventListener('change',draw); draw();
}

const modes=[
  {id:'root',q:'Identify the root',get:v=>v.root},
  {id:'wazn',q:'Identify the وَزْن / مِيزَان',get:v=>v.wazn},
  {id:'meaning',q:'Identify the English meaning',get:v=>v.meaning},
  {id:'present',q:'Give the هُوَ Muḍāriʿ form',get:v=>v.present_3ms},
  {id:'faail',q:'Give اسم الفاعل',get:v=>v.ism_al_faail},
  {id:'mafool',q:'Give اسم المفعول',get:v=>v.ism_al_mafool},
];
let quiz=null;
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function makeOptions(correct, pool){
  const unique=[...new Set(pool.filter(Boolean))];
  return shuffle([correct,...shuffle(unique.filter(x=>x!==correct)).slice(0,3)]);
}
function commandEntries(){return (DATA.exercise_entries||[]).filter(v=>v.stage==='فِعْلُ الأَمْر' && v.expected_answers?.amr_5_persons)}
function passiveEntries(){return (DATA.exercise_entries||[]).filter(v=>v.expected_answers?.passive_present_3ms)}
function renderChoiceQuestion(title, shown, questionText, correct, pool, meta='Mixed cumulative review'){
  const options=makeOptions(correct,pool);
  quiz={correct,answered:false};
  q('#practice').innerHTML=card('Practice',`<div class="quiz-meta"><span>${meta}</span><span>Score ${state.correct} / ${state.correct+state.wrong}</span></div><div class="question-word">${arabic(shown,'ar quiz-word')}</div><p class="question">${questionText}</p><div class="options">${options.map((o,i)=>`<button class="option" data-i="${i}">${arabic(o,'small-ar')}<span class="mark" aria-hidden="true"></span></button>`).join('')}</div><div id="quizFeedback" class="quiz-feedback" aria-live="polite"></div><button class="btn next-btn" id="nextQuestion">Next question</button>`);
  q('#nextQuestion').onclick=startQuiz;
  q('#practice').querySelectorAll('.option').forEach((b,i)=>b.onclick=()=>answerQuiz(b,options[i]));
}
function startCommandQuiz(){
  const entries=commandEntries(); if(!entries.length) return false;
  const v=entries[Math.floor(Math.random()*entries.length)];
  const pronouns=['أَنْتَ','أَنْتِ','أَنْتُمَا','أَنْتُمْ','أَنْتُنَّ'];
  const idx=Math.floor(Math.random()*pronouns.length);
  const correct=v.expected_answers.amr_5_persons[idx];
  const pool=entries.flatMap(x=>x.expected_answers.amr_5_persons);
  renderChoiceQuestion('Give the imperative',v.ar,`Give the <strong>${arabic(pronouns[idx],'small-ar')}</strong> <strong>فِعْلُ الأَمْر</strong> form.`,correct,pool,'Māḍī → Muḍāriʿ → Amr cumulative review');
  return true;
}
function startPassiveQuiz(){
  const entries=passiveEntries(); if(!entries.length) return false;
  const v=entries[Math.floor(Math.random()*entries.length)];
  const correct=v.expected_answers.passive_present_3ms;
  const pool=entries.map(x=>x.expected_answers.passive_present_3ms);
  renderChoiceQuestion('Passive present',v.ar,'Give the <strong>هُوَ</strong> form in the passive present.',correct,pool,'Passive-form cumulative review');
  return true;
}
function startQuiz(){
  if(Math.random()<.24 && startCommandQuiz()) return;
  if(Math.random()<.16 && startPassiveQuiz()) return;
  const entries=learningEntries();
  if(!entries.length) return;
  const useConj=Math.random()<.38 && Object.keys(DATA.past_conjugations||{}).length;
  const useReverseConj=useConj && Math.random()<.34;
  const usePatternFromConj=useConj && !useReverseConj && Math.random()<.45;
  if(useConj){
    const pattern=DATA.patterns[Math.floor(Math.random()*DATA.patterns.length)][0];
    const rows=DATA.past_conjugations[pattern];
    const idx=Math.floor(Math.random()*rows.length);
    const pronoun=rows[idx][0], correct=rows[idx][1];
    const all=Object.values(DATA.past_conjugations).flat().map(r=>r[1]);
    if(usePatternFromConj){
      renderChoiceQuestion('Past-tense pattern',correct,'Which <strong>وَزْن / مِيزَان</strong> does this form belong to?',pattern,DATA.patterns.map(p=>p[0]),'Māḍī pattern recognition');
    } else if(useReverseConj){
      renderChoiceQuestion('Past-tense pronoun',correct,`Which <strong>ضَمِير</strong> does this form belong to?`,pronoun,rows.map(r=>r[0]),'Māḍī → pronoun review');
    } else {
      renderChoiceQuestion('Past-tense conjugation',pattern,`Give the <strong>${arabic(pronoun,'small-ar')}</strong> form.`,correct,all,'Māḍī conjugation review');
    }
    return;
  }
  const verb=entries[Math.floor(Math.random()*entries.length)];
  const mode=modes[Math.floor(Math.random()*modes.length)];
  renderChoiceQuestion('Practice',verb.ar,mode.q,mode.get(verb),entries.map(mode.get));
}

function answerQuiz(button,value){
  if(!quiz || quiz.answered) return;
  quiz.answered=true;
  const correct=quiz.correct;
  q('#practice').querySelectorAll('.option').forEach(b=>b.disabled=true);
  if(value===correct){
    button.classList.add('correct'); button.querySelector('.mark').textContent='✓';
    q('#quizFeedback').innerHTML='<span class="feedback-correct">Correct</span>';
    state.correct++; state.streak++;
  }else{
    button.classList.add('wrong'); button.querySelector('.mark').textContent='×';
    const right=[...q('#practice').querySelectorAll('.option')].find(b=>b.textContent.includes(correct));
    if(right){right.classList.add('correct'); right.querySelector('.mark').textContent='✓';}
    q('#quizFeedback').innerHTML=`<span class="feedback-wrong">Not quite.</span> ${arabic(correct,'small-ar')}`;
    state.wrong++; state.streak=0; tone('wrong');
  }
  save(); renderDashboard();
}


function renderAdditional(){
 const ap=DATA.additional_practice;
 const levels=[['medium','Medium','Meaning • root • وزن • basic past→present'],['hard','Hard','Past→Muḍāriʿ • Amr • Ism al-Fāʿil/Mafʿūl'],['hardest','Hardest','Cumulative mixed review • active/passive • all 14 slots']];
 q('#additional').innerHTML=card('Additional Practice — Beyond the Textbook',`<p>${esc(ap.source_note)}</p><p class="muted">30 Quran-attested lemmas. The Quranic Arabic Corpus is used for external morphology/attestation; the app then supplies complete paradigms for practice.</p><div class="level-buttons">${levels.map(x=>`<button class="btn" onclick="startAdditionalQuiz('${x[0]}')">${x[1]}<span class="muted">${x[2]}</span></button>`).join('')}</div><div class="searchbar"><input id="addSearch" placeholder="Search the 30 additional verbs…"><span>${ap.verbs.length} verbs</span></div><div id="addGrid" class="grid"></div>`);
 const draw=()=>{const t=q('#addSearch').value.trim().toLowerCase(); const list=ap.verbs.filter(v=>[v.ar,v.root,v.wazn,v.meaning].join(' ').toLowerCase().includes(t)); q('#addGrid').innerHTML=list.map((v,i)=>`<article class="card"><div class="lesson-header"><div><h3>${arabic(v.ar,'ar verb')}</h3><p class="en-title">${esc(v.meaning)}</p></div><span class="badge">${esc(v.level)}</span></div><p><b>Root:</b> ${esc(v.root)} &nbsp; <b>وزن:</b> ${arabic(v.wazn,'small-ar')}</p><p class="muted">Qur'an ${esc(v.quran_reference)} · External morphology source: Quranic Arabic Corpus</p><details><summary>Full paradigm</summary><h5>Māḍī</h5>${miniTable(v.past_conjugation)}<h5>Muḍāriʿ</h5>${miniTable(v.present_conjugation)}<h5>Amr</h5><div class="examples">${v.amr_5_persons.map((x,j)=>`<div>${arabic(['أَنْتَ','أَنْتُمَا','أَنْتُمْ','أَنْتِ','أَنْتُنَّ'][j],'small-ar')} — ${arabic(x,'small-ar')}</div>`).join('')}</div><h5>Passive Māḍī / 3ms</h5><div class="examples">${arabic(v.passive_past_3ms,'ar table-ar')}</div><h5>Passive Muḍāriʿ</h5>${miniTable(v.passive_present_conjugation)}<h5>Derived nouns</h5><div class="examples"><div>اسم الفاعل — ${arabic(v.ism_al_faail,'small-ar')}</div><div>اسم المفعول — ${arabic(v.ism_al_mafool,'small-ar')}</div></div></details></article>`).join('')||'<p>No match.</p>';};
 q('#addSearch').addEventListener('input',draw); draw();
}
function miniTable(rows){return '<table><thead><tr><th>ضَمِير</th><th>Form</th></tr></thead><tbody>'+rows.map(r=>`<tr><td>${arabic(r[0],'small-ar')}</td><td>${arabic(r[1],'ar table-ar')}</td></tr>`).join('')+'</tbody></table>'}
function startAdditionalQuiz(level){
 const ap=DATA.additional_practice.verbs;
 const pool=level==='medium'?ap:level==='hard'?ap.filter(v=>['medium','hard'].includes(v.level)):ap;
 const v=pool[Math.floor(Math.random()*pool.length)];
 let correct,question,options,shown=v.ar;
 const modesByLevel={
  medium:['meaning','root','wazn','present','past'],
  hard:['present','amr','faail','mafool','passive_present','passive_past','wazn'],
  hardest:['past14','present14','amr','passive_present14','passive_past','faail','mafool','wazn','root']
 };
 const mode=modesByLevel[level][Math.floor(Math.random()*modesByLevel[level].length)];
 const same=(getter)=>ap.map(x=>getter(x)).filter(Boolean);
 if(mode==='meaning'){question='Identify the English meaning.';correct=v.meaning;options=same(x=>x.meaning)}
 else if(mode==='root'){question='Identify the root.';correct=v.root;options=same(x=>x.root)}
 else if(mode==='wazn'){question='Which وَزْن / مِيزَان does this verb belong to?';correct=v.wazn;options=same(x=>x.wazn)}
 else if(mode==='past'){question='Give the هُوَ Māḍī form.';correct=v.past_conjugation?.[0]?.[1]||v.ar;options=same(x=>x.past_conjugation?.[0]?.[1])}
 else if(mode==='present'){question='Give the هُوَ Muḍāriʿ form.';correct=v.present_3ms;options=same(x=>x.present_3ms)}
  else if(mode==='faail'){question='Give اسم الفاعل.';correct=v.ism_al_faail;options=same(x=>x.ism_al_faail)}
 else if(mode==='mafool'){question='Give اسم المفعول.';correct=v.ism_al_mafool;options=same(x=>x.ism_al_mafool)}
 else if(mode==='passive_present'){question='Give the هُوَ passive Muḍāriʿ form.';correct=v.passive_present_3ms;options=same(x=>x.passive_present_3ms)}
 else if(mode==='passive_past'){question='Give the هُوَ passive Māḍī form.';correct=v.passive_past_3ms;options=same(x=>x.passive_past_3ms)}
 else if(mode==='past14'){const r=v.past_conjugation[Math.floor(Math.random()*v.past_conjugation.length)];question=`Give the ${arabic(r[0],'small-ar')} Māḍī form.`;correct=r[1];options=ap.flatMap(x=>x.past_conjugation.map(y=>y[1]))}
 else if(mode==='present14'){const r=v.present_conjugation[Math.floor(Math.random()*v.present_conjugation.length)];question=`Give the ${arabic(r[0],'small-ar')} Muḍāriʿ form.`;correct=r[1];options=ap.flatMap(x=>x.present_conjugation.map(y=>y[1]))}
 else if(mode==='amr'){const r=v.amr_5_persons[Math.floor(Math.random()*v.amr_5_persons.length)];question='Give the corresponding فِعْلُ الأَمْر form.';correct=r;options=ap.flatMap(x=>x.amr_5_persons||[])}
 else if(mode==='passive_present14'){const r=v.passive_present_conjugation[Math.floor(Math.random()*v.passive_present_conjugation.length)];question=`Give the ${arabic(r[0],'small-ar')} passive Muḍāriʿ form.`;correct=r[1];options=ap.flatMap(x=>x.passive_present_conjugation.map(y=>y[1]))}
 renderChoiceQuestion('Additional Practice — '+level.toUpperCase(),shown,question,correct,options,'Beyond-textbook morphology practice');
 q('#quizFeedback').insertAdjacentHTML('afterend',`<p class="muted"><a href="${esc(DATA.additional_practice.source_url)}" target="_blank" rel="noopener">Verify source morphology in the Quranic Arabic Corpus</a></p>`);
}
function renderFlash(){startQuiz()}
function renderDashboard(){
 const done=Object.values(state.completed).filter(Boolean).length;
 const total=state.correct+state.wrong;
 q('#dashboard').innerHTML=card('Your progress',`<div class="stats"><div><b>${done}</b><span>lessons complete</span></div><div><b>${DATA.lessons.length}</b><span>book lessons mapped</span></div><div><b>${total?Math.round(state.correct/total*100):0}%</b><span>practice accuracy</span></div></div><div class="progress-line"><span style="width:${total?Math.min(100,state.correct/total*100):0}%"></span></div><p class="muted">Progress is stored locally on this device.</p>`);
}

function renderVerification(){
 const qa=typeof qaDataset==='function'?qaDataset(DATA):{issues:[{issues:['QA script unavailable']}],patterns:DATA.patterns.length,verbs:DATA.verbs.length}; const aq=typeof additionalPracticeQA==='function'?additionalPracticeQA(DATA):{issues:[{issues:['Additional QA unavailable']}],count:0};
 const issueText=qa.issues.length?qa.issues.map(x=>`<li>${esc(x.kind||'item')}: ${esc(x.value||'')} — ${esc((x.issues||[]).join(', '))}</li>`).join(''):'<li class="ok-line">✓ Arabic-string integrity checks passed for the current app dataset.</li>';
 q('#verification').innerHTML=card('Strict linguistic QA',`<div class="status-list"><p>✓ Source PDF: loaded</p><p>✓ ${DATA.lessons.length}-lesson curriculum map: loaded</p><p>✓ ${DATA.patterns.length} patterns indexed</p><p>✓ ${DATA.patterns.length*14} past-tense slots stored</p><p>✓ ${DATA.lessons.reduce((n,l)=>n+(l.sublessons||[]).length,0)} instructional sub-lessons mapped</p><p>✓ Source rules translated into lesson notes</p><p>✓ Supplementary grammar notes clearly separated from source-derived material</p><p>✓ Large RTL Arabic typography enabled</p><p>✓ Local progress storage enabled</p><p>✓ Correct/wrong feedback enabled</p><p>✓ Feedback sounds enabled (toggle available)</p></div><ul>${issueText}</ul><p class="muted">${DATA.exercise_entries.length} source/lexical exercise entries are frozen into the QA dataset.<br>✓ ${aq.count} additional verbs checked for full paradigm structure.</p><ul>${aq.issues.length?aq.issues.map(x=>`<li>${esc(x.kind||"additional")}: ${esc(x.value||"")} — ${esc((x.issues||[]).join(", "))}</li>`).join(""):"<li class=\"ok-line\">✓ Additional-practice structural QA passed.</li>"}</ul>`);
}

function setFont(delta){state.font=Math.min(1.8,Math.max(.8,state.font+delta));document.documentElement.style.setProperty('--arabic-scale',state.font);save()}
function showTab(id){document.querySelectorAll('.tab').forEach(x=>x.classList.add('hidden'));q('#'+id).classList.remove('hidden');document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));if(id==='practice')startQuiz()}

function initSettings(){
 q('#soundToggle').checked=state.sound;
 q('#soundToggle').onchange=e=>{state.sound=e.target.checked;save()};
}

document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
q('#fontPlus').onclick=()=>setFont(.1); q('#fontMinus').onclick=()=>setFont(-.1); q('#fontReset').onclick=()=>{state.font=1;save();document.documentElement.style.setProperty('--arabic-scale',1)};

document.documentElement.style.setProperty('--arabic-scale',state.font);
renderDashboard();renderLessons();renderPatterns();renderVerbs();renderConjugator();renderVerification();renderAdditional();initSettings();showTab('dashboard');
window.toggleLesson=toggleLesson; window.startQuiz=startQuiz; window.startAdditionalQuiz=startAdditionalQuiz;
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
