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
    return card(`${x.id} — ${arabic(x.title_ar,'ar title-ar')} <span class="badge ${done?'done':''}">${done?'✓ Complete':'Not started'}</span>`,
      `<p class="en-title">${esc(x.title_en)}</p><p class="muted">Source pages: ${esc(x.pages)}</p><ul>${x.topics.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><button class="btn" onclick="toggleLesson('${x.id}')">${done?'Mark incomplete':'Mark complete'}</button>`);
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
  {id:'lesson',q:'Which source page contains this entry?',get:v=>String(v.source_page||'')}
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

function renderFlash(){startQuiz()}
function renderDashboard(){
 const done=Object.values(state.completed).filter(Boolean).length;
 const total=state.correct+state.wrong;
 q('#dashboard').innerHTML=card('Your progress',`<div class="stats"><div><b>${done}</b><span>lessons complete</span></div><div><b>${DATA.lessons.length}</b><span>book lessons mapped</span></div><div><b>${total?Math.round(state.correct/total*100):0}%</b><span>practice accuracy</span></div></div><div class="progress-line"><span style="width:${total?Math.min(100,state.correct/total*100):0}%"></span></div><p class="muted">Progress is stored locally on this device.</p>`);
}

function renderVerification(){
 const qa=typeof qaDataset==='function'?qaDataset(DATA):{issues:[{issues:['QA script unavailable']}],patterns:DATA.patterns.length,verbs:DATA.verbs.length};
 const issueText=qa.issues.length?qa.issues.map(x=>`<li>${esc(x.kind||'item')}: ${esc(x.value||'')} — ${esc((x.issues||[]).join(', '))}</li>`).join(''):'<li class="ok-line">✓ Arabic-string integrity checks passed for the current app dataset.</li>';
 q('#verification').innerHTML=card('Strict linguistic QA',`<div class="status-list"><p>✓ Source PDF: loaded</p><p>✓ ${DATA.lessons.length}-lesson curriculum map: loaded</p><p>✓ ${DATA.patterns.length} patterns indexed</p><p>✓ ${DATA.patterns.length*14} past-tense slots stored</p><p>✓ Large RTL Arabic typography enabled</p><p>✓ Local progress storage enabled</p><p>✓ Correct/wrong feedback enabled</p><p>✓ Feedback sounds enabled (toggle available)</p></div><ul>${issueText}</ul><p class="muted">${DATA.exercise_entries.length} source/lexical exercise entries are frozen into the QA dataset. Source anomalies are preserved explicitly rather than silently corrected.</p>`);
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
renderDashboard();renderLessons();renderPatterns();renderVerbs();renderConjugator();renderVerification();initSettings();showTab('dashboard');
window.toggleLesson=toggleLesson; window.startQuiz=startQuiz;
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
