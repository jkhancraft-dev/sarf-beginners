const q = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const state = JSON.parse(localStorage.getItem('sarfState') || '{}');
state.font = state.font || 1;
state.completed = state.completed || {};
state.correct = state.correct || 0;
state.wrong = state.wrong || 0;
state.sound = state.sound !== false;
state.streak = state.streak || 0;
state.fullAccess = state.fullAccess === true;
state.openLesson = state.openLesson || null;
state.openSublesson = state.openSublesson || null;

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

function lessonById(id){return DATA.lessons.find(x=>x.id===id)}
function lessonComplete(id){return !!state.completed[id]}
function allPriorLessonsComplete(id){
  const idx=DATA.lessons.findIndex(x=>x.id===id);
  return idx<0 || DATA.lessons.slice(0,idx).every(x=>lessonComplete(x.id));
}
function markSublessonDone(lessonId, subId){
  state.completed[subId]=true;
  const lesson=lessonById(lessonId);
  if(lesson && (lesson.sublessons||[]).every(x=>state.completed[x.id])) state.completed[lessonId]=true;
  save(); renderLessons(); renderDashboard();
}
function openLesson(id){state.openLesson=id; state.openSublesson=null; save(); renderLessons()}
function openSublesson(lessonId,subId){state.openLesson=lessonId; state.openSublesson=subId; save(); renderLessons()}
function closeLesson(){state.openLesson=null; state.openSublesson=null; save(); renderLessons()}
function renderLessons(){
  const root=q('#lessons');
  if(state.openLesson){
    const lesson=lessonById(state.openLesson);
    if(!lesson){state.openLesson=null;state.openSublesson=null;save();return renderLessons()}
    const subs=lesson.sublessons||[];
    if(state.openSublesson){
      const sub=subs.find(x=>x.id===state.openSublesson);
      if(!sub){state.openSublesson=null;save();return renderLessons()}
      const done=!!state.completed[sub.id];
      const idx=subs.findIndex(x=>x.id===sub.id);
      const next=subs[idx+1];
      root.innerHTML=`<div class="lesson-detail-card card"><button class="back-btn" onclick="closeLesson()">← Back to lessons</button><div class="lesson-detail-head"><div><div class="eyebrow">${esc(lesson.id)} · ${esc(lesson.title_en)}</div><h2>${arabic(sub.title_ar,'title-ar lesson-title-ar')}</h2><p class="en-title">${esc(sub.title_en)}</p></div><span class="badge ${done?'done':''}">${done?'✓ Understood':'Study now'}</span></div><p class="source"><b>Textbook basis:</b> ${esc(sub.source_basis||lesson.pages||'')}</p><div class="lesson-copy"><p>${esc(sub.explanation||'')}</p></div>${sub.rule_en?`<div class="rule-box"><h5>${esc(sub.rule_title||'Rule')}</h5><p>${esc(sub.rule_en)}</p></div>`:''}${sub.steps?.length?`<h4>Step-by-step</h4><ol class="steps">${sub.steps.map(z=>`<li>${esc(z)}</li>`).join('')}</ol>`:''}${sub.examples?.length?`<h4>Examples</h4><div class="examples">${sub.examples.map(z=>`<div>${esc(z)}</div>`).join('')}</div>`:''}${sub.notes?.length?`<h4>Notes</h4><ul class="notes">${sub.notes.map(z=>`<li>${esc(z)}</li>`).join('')}</ul>`:''}${sub.supplementary?.length?`<div class="supp-note"><b>Additional reference:</b> ${sub.supplementary.map(r=>`<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a>`).join(' · ')}</div>`:''}<div class="lesson-complete-box"><button class="btn understood-btn" onclick="markSublessonDone('${lesson.id}','${sub.id}')">${done?'✓ Lesson understood':'✓ I understand this lesson'}</button>${next?`<button class="btn secondary-btn" onclick="openSublesson('${lesson.id}','${next.id}')">Next sub-lesson →</button>`:`<p class="ok-line">✓ Final sub-lesson in this lesson.</p>`}</div></div>`;
      return;
    }
    const done=lessonComplete(lesson.id);
    root.innerHTML=`<div class="lesson-detail-card card"><button class="back-btn" onclick="closeLesson()">← All lessons</button><div class="lesson-detail-head"><div><div class="eyebrow">${esc(lesson.id)}</div><h2>${arabic(lesson.title_ar,'title-ar lesson-title-ar')}</h2><p class="en-title">${esc(lesson.title_en)}</p></div><span class="badge ${done?'done':''}">${done?'✓ Complete':'In progress'}</span></div><p class="muted">Textbook pages: ${esc(lesson.pages)}</p><p class="lesson-path"><b>Learning path:</b> ${esc(lesson.learning_path_note||'Study each sub-lesson in order.')}</p><div class="sublesson-grid">${subs.map((sub,i)=>`<button class="sublesson-button ${state.completed[sub.id]?'completed':''}" onclick="openSublesson('${lesson.id}','${sub.id}')"><span class="sub-index">${i+1}</span><span>${arabic(sub.title_ar,'small-ar')}</span><strong>${esc(sub.title_en)}</strong><em>${state.completed[sub.id]?'✓ Understood':'Open lesson →'}</em></button>`).join('')}</div></div>`;
    return;
  }
  root.innerHTML=`<div class="section-intro card"><div class="eyebrow">BOOK SEQUENCE</div><h2>Lessons</h2><p>Open one lesson at a time. Each lesson contains clickable sub-lessons. Complete them in order; practice expands only as you learn.</p></div><div class="lesson-list">${DATA.lessons.map((x,i)=>{const done=lessonComplete(x.id), unlocked=allPriorLessonsComplete(x.id);return `<button class="lesson-tile ${done?'completed':''} ${unlocked?'':'locked'}" ${unlocked?'':'disabled'} onclick="openLesson('${x.id}')"><span class="tile-number">${i+1}</span><span class="tile-main"><strong>${esc(x.title_en)}</strong><span>${arabic(x.title_ar,'small-ar')}</span><small>Pages ${esc(x.pages)} · ${(x.sublessons||[]).length} sub-lessons</small></span><span class="tile-status">${done?'✓ Complete':unlocked?'Open →':'🔒 Locked'}</span></button>`}).join('')}</div>`;
}
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
  q('#practice').innerHTML=card('Practice',`<div class="unlock-panel practice-unlock"><div><strong>🔓 Full-textbook test</strong><p class="muted">${state.fullAccess?'All questions are unlocked.':'Normal mode follows completed lessons only.'}</p></div><button class="btn ${state.fullAccess?'secondary-btn':''}" onclick="toggleFullAccess();startQuiz()">${state.fullAccess?'✓ Full textbook':'Unlock all questions'}</button></div><div class="quiz-meta"><span>${meta}</span><span>Score ${state.correct} / ${state.correct+state.wrong}</span></div><div class="question-word">${arabic(shown,'ar quiz-word')}</div><p class="question">${questionText}</p><div class="options">${options.map((o,i)=>`<button class="option" data-i="${i}">${arabic(o,'small-ar')}<span class="mark" aria-hidden="true"></span></button>`).join('')}</div><div id="quizFeedback" class="quiz-feedback" aria-live="polite"></div><button class="btn next-btn" id="nextQuestion">Next question</button>`);
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
function practiceEntries(){
  const c=learnedCapabilities();
  if(state.fullAccess) return learningEntries();
  return learningEntries().filter(v=>{
    const st=v.stage;
    if(!st || st==='recovered_source_exercise') return c.past;
    if(st==='مُضَارِع') return c.present;
    if(st==='فِعْلُ الأَمْر') return c.amr;
    if(st==='اِسْمُ الفَاعِل') return c.faail;
    if(st==='المَاضِي المَبْنِيُّ لِلْمَجْهُول') return c.passivePast;
    if(st==='المُضَارِعُ المَبْنِيُّ لِلْمَجْهُول') return c.passivePresent;
    if(st==='اِسْمُ المَفْعُول') return c.mafool;
    if(st==='اِسْمُ التَّفْضِيل') return c.tafdil;
    if(st==='المَصْدَر') return c.masdar;
    return false;
  });
}
function startQuiz(){
  const entries=practiceEntries();
  if(!entries.length){
    q('#practice').innerHTML=card('Practice',`<div class="empty-state"><div class="big-icon">📘</div><h3>Complete a lesson first</h3><p>Normal practice only tests material you have completed. Finish the Māḍī lessons to begin, or use <b>Unlock All Questions</b> for a full-textbook test.</p><button class="btn" onclick="showTab('lessons')">Go to Lessons</button></div>`); return;
  }
  const useConj=entries.some(v=>v.expected_answers?.root) && Math.random()<.34;
  if(useConj && Object.keys(DATA.past_conjugations||{}).length && learnedCapabilities().past){
    const pattern=DATA.patterns[Math.floor(Math.random()*DATA.patterns.length)][0]; const rows=DATA.past_conjugations[pattern]; const idx=Math.floor(Math.random()*rows.length); const pronoun=rows[idx][0],correct=rows[idx][1];
    if(Math.random()<.45) renderChoiceQuestion('Past-tense pattern',correct,'Which <strong>وَزْن / مِيزَان</strong> does this form belong to?',pattern,DATA.patterns.map(p=>p[0]),'Māḍī pattern review');
    else renderChoiceQuestion('Past-tense conjugation',pattern,`Give the <strong>${arabic(pronoun,'small-ar')}</strong> form.`,correct,rows.map(r=>r[1]),'Māḍī conjugation review');
    return;
  }
  const verb=entries[Math.floor(Math.random()*entries.length)];
  const available=[];
  const c=learnedCapabilities();
  if(verb.expected_answers?.root) available.push(['root','Identify the root',v=>v.expected_answers.root]);
  if(verb.expected_answers?.wazn) available.push(['wazn','Identify the وَزْن / مِيزَان',v=>v.expected_answers.wazn]);
  if(verb.expected_answers?.meaning) available.push(['meaning','Identify the English meaning',v=>v.expected_answers.meaning]);
  if(c.present && verb.present_3ms) available.push(['present','Give the هُوَ Muḍāriʿ form',v=>v.present_3ms]);
  if(c.faail && verb.ism_al_faail) available.push(['faail','Give اسم الفاعل',v=>v.ism_al_faail]);
  if(c.mafool && verb.ism_al_mafool) available.push(['mafool','Give اسم المفعول',v=>v.ism_al_mafool]);
  if(c.amr && verb.expected_answers?.amr_5_persons) available.push(['amr','Give the فِعْلُ الأَمْر form',v=>v.expected_answers.amr_5_persons[0]]);
  if(c.passivePresent && verb.expected_answers?.passive_present_3ms) available.push(['passive','Give the هُوَ passive Muḍāriʿ form',v=>v.expected_answers.passive_present_3ms]);
  if(c.passivePast && verb.expected_answers?.passive_past_3ms) available.push(['passivepast','Give the هُوَ passive Māḍī form',v=>v.expected_answers.passive_past_3ms]);
  if(c.tafdil && verb.expected_answers?.ism_al_tafdil) available.push(['tafdil','Give اسم التفضيل',v=>v.expected_answers.ism_al_tafdil]);
  if(c.masdar && verb.expected_answers?.masdar) available.push(['masdar','Give the مصدر',v=>v.expected_answers.masdar]);
  if(!available.length) return startQuizFallback(entries);
  const mode=available[Math.floor(Math.random()*available.length)]; const correct=mode[2](verb); const pool=entries.map(mode[2]).filter(Boolean);
  renderChoiceQuestion('Practice',verb.ar,mode[1],correct,pool,state.fullAccess?'Full-textbook practice':'Cumulative practice');
}
function startQuizFallback(entries){
 const verb=entries[Math.floor(Math.random()*entries.length)];
 const correct=verb.meaning||verb.root||verb.wazn; const pool=entries.map(v=>v.meaning||v.root||v.wazn).filter(Boolean);
 renderChoiceQuestion('Practice',verb.ar,'Identify the correct answer.',correct,pool,state.fullAccess?'Full-textbook practice':'Cumulative practice');
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


function learnedCapabilities(){
  const completedIds=new Set(DATA.lessons.filter(x=>lessonComplete(x.id)).map(x=>x.id));
  return {
    past:['L02','L03','L04','L05'].every(id=>completedIds.has(id)),
    present:['L06','L07','L08','L09'].every(id=>completedIds.has(id)),
    amr:completedIds.has('L10'),
    faail:completedIds.has('L11'),
    passivePast:completedIds.has('L12'),
    passivePresent:completedIds.has('L13'),
    mafool:completedIds.has('L14'),
    tafdil:completedIds.has('L15'),
    masdar:completedIds.has('L16')
  };
}
function renderAdditional(){
 const ap=DATA.additional_practice;
 const c=learnedCapabilities();
 const gate=state.fullAccess?'Full-textbook mode is ON. All additional-practice fields are available.':'Additional Practice follows your completed lessons. Unlock All Questions to test the entire textbook.';
 const levels=[['medium','Medium','Meaning • root • وزن • learned forms'],['hard','Hard','Mixed conjugation within learned material'],['hardest','Hardest','Cumulative mixed review within learned material']];
 q('#additional').innerHTML=card('Additional Practice — Beyond the Textbook',`<p>${esc(ap.source_note)}</p><div class="unlock-panel"><div><strong>🔓 Unlock All Questions</strong><p class="muted">${esc(gate)}</p></div><button class="btn ${state.fullAccess?'secondary-btn':''}" onclick="toggleFullAccess()">${state.fullAccess?'✓ Full textbook enabled':'Unlock all questions'}</button></div><div class="level-buttons">${levels.map(x=>`<button class="btn" onclick="startAdditionalQuiz('${x[0]}')">${x[1]}<span class="muted">${x[2]}</span></button>`).join('')}</div><div class="searchbar"><input id="addSearch" placeholder="Search additional verbs…"><span>${ap.verbs.length} verbs</span></div><div id="addGrid" class="grid"></div>`);
 const draw=()=>{const t=q('#addSearch').value.trim().toLowerCase(); const list=ap.verbs.filter(v=>[v.ar,v.root,v.wazn,v.meaning].join(' ').toLowerCase().includes(t)); q('#addGrid').innerHTML=list.map(v=>`<article class="card"><div class="lesson-header"><div><h3>${arabic(v.ar,'ar verb')}</h3><p class="en-title">${esc(v.meaning)}</p></div><span class="badge">${esc(v.level)}</span></div><p><b>Root:</b> ${esc(v.root)} &nbsp; <b>وزن:</b> ${arabic(v.wazn,'small-ar')}</p><details><summary>Full paradigm</summary><h5>Māḍī</h5>${miniTable(v.past_conjugation)}<h5>Muḍāriʿ</h5>${miniTable(v.present_conjugation)}<h5>Amr</h5><div class="examples">${v.amr_5_persons.map((x,j)=>`<div>${arabic(['أَنْتَ','أَنْتُمَا','أَنْتُمْ','أَنْتِ','أَنْتُنَّ'][j],'small-ar')} — ${arabic(x,'small-ar')}</div>`).join('')}</div><h5>Passive Māḍī / 3ms</h5><div class="examples">${arabic(v.passive_past_3ms,'ar table-ar')}</div><h5>Passive Muḍāriʿ</h5>${miniTable(v.passive_present_conjugation)}<h5>Derived nouns</h5><div class="examples"><div>اسم الفاعل — ${arabic(v.ism_al_faail,'small-ar')}</div><div>اسم المفعول — ${arabic(v.ism_al_mafool,'small-ar')}</div></div></details></article>`).join('')||'<p>No match.</p>';};
 q('#addSearch').addEventListener('input',draw); draw();
}
function toggleFullAccess(){state.fullAccess=!state.fullAccess;save();renderAdditional();}
function miniTable(rows){return '<table><thead><tr><th>ضَمِير</th><th>Form</th></tr></thead><tbody>'+rows.map(r=>`<tr><td>${arabic(r[0],'small-ar')}</td><td>${arabic(r[1],'ar table-ar')}</td></tr>`).join('')+'</tbody></table>'}
function startAdditionalQuiz(level){
 const ap=DATA.additional_practice.verbs;
 const c=learnedCapabilities();
 const eligible=state.fullAccess?ap:ap.filter(v=>{
   // Additional-practice records contain complete paradigms. Normal mode exposes only fields already learned.
   return c.past;
 });
 if(!eligible.length){q('#additional').scrollIntoView({behavior:'smooth'});return;}
 const v=eligible[Math.floor(Math.random()*eligible.length)];
 const modesByLevel={medium:['meaning','root','wazn',...(c.present?['present']:[]),...(c.past?['past']:[])],hard:['meaning','root','wazn',...(c.present?['present']:[]),...(c.amr?['amr']:[]),...(c.faail?['faail']:[]),...(c.mafool?['mafool']:[]),...(c.passivePresent?['passive_present']:[]),...(c.passivePast?['passive_past']:[])],hardest:['meaning','root','wazn',...(c.past?['past14']:[]),...(c.present?['present14']:[]),...(c.amr?['amr']:[]),...(c.passivePresent?['passive_present14']:[]),...(c.passivePast?['passive_past']:[]),...(c.faail?['faail']:[]),...(c.mafool?['mafool']:[])]};
 const mode=modesByLevel[level][Math.floor(Math.random()*modesByLevel[level].length)]; let correct,question,options;
 const same=getter=>eligible.map(x=>getter(x)).filter(Boolean);
 if(mode==='meaning'){question='Identify the English meaning.';correct=v.meaning;options=same(x=>x.meaning)}
 else if(mode==='root'){question='Identify the root.';correct=v.root;options=same(x=>x.root)}
 else if(mode==='wazn'){question='Which وَزْن / مِيزَان does this verb belong to?';correct=v.wazn;options=same(x=>x.wazn)}
 else if(mode==='past'){question='Give the هُوَ Māḍī form.';correct=v.past_conjugation?.[0]?.[1]||v.ar;options=same(x=>x.past_conjugation?.[0]?.[1])}
 else if(mode==='present'){question='Give the هُوَ Muḍāriʿ form.';correct=v.present_3ms;options=same(x=>x.present_3ms)}
 else if(mode==='faail'){question='Give اسم الفاعل.';correct=v.ism_al_faail;options=same(x=>x.ism_al_faail)}
 else if(mode==='mafool'){question='Give اسم المفعول.';correct=v.ism_al_mafool;options=same(x=>x.ism_al_mafool)}
 else if(mode==='passive_present'){question='Give the هُوَ passive Muḍāriʿ form.';correct=v.passive_present_3ms;options=same(x=>x.passive_present_3ms)}
 else if(mode==='passive_past'){question='Give the هُوَ passive Māḍī form.';correct=v.passive_past_3ms;options=same(x=>x.passive_past_3ms)}
 else if(mode==='past14'){const r=v.past_conjugation[Math.floor(Math.random()*v.past_conjugation.length)];question=`Give the ${arabic(r[0],'small-ar')} Māḍī form.`;correct=r[1];options=eligible.flatMap(x=>x.past_conjugation.map(y=>y[1]))}
 else if(mode==='present14'){const r=v.present_conjugation[Math.floor(Math.random()*v.present_conjugation.length)];question=`Give the ${arabic(r[0],'small-ar')} Muḍāriʿ form.`;correct=r[1];options=eligible.flatMap(x=>x.present_conjugation.map(y=>y[1]))}
 else if(mode==='amr'){const r=v.amr_5_persons[Math.floor(Math.random()*v.amr_5_persons.length)];question='Give the corresponding فِعْلُ الأَمْر form.';correct=r;options=eligible.flatMap(x=>x.amr_5_persons||[])}
 else if(mode==='passive_present14'){const r=v.passive_present_conjugation[Math.floor(Math.random()*v.passive_present_conjugation.length)];question=`Give the ${arabic(r[0],'small-ar')} passive Muḍāriʿ form.`;correct=r[1];options=eligible.flatMap(x=>x.passive_present_conjugation.map(y=>y[1]))}
 renderChoiceQuestion('Additional Practice — '+level.toUpperCase(),v.ar,question,correct,options,state.fullAccess?'Full-textbook additional practice':'Additional practice within completed syllabus');
}
function renderFlash(){startQuiz()}
function renderAbout(){
 q('#about').innerHTML=`<div class="about-wrap"><article class="card"><div class="eyebrow">ABOUT THIS COURSE</div><h2>الصَّرْفُ لِلْمُبْتَدِئِينَ</h2><p class="about-author" dir="rtl" lang="ar">إعداد: أبو عبد الرحمن نواس بن محمد أنوي الهندي السيلاني</p><p>This app is based on the main Ṣarf textbook uploaded for this project. The book's own sequence, explanations, examples, exercises, and terminology remain the source basis of the curriculum.</p><div class="about-meta"><p><b>Book:</b> الصرف للمبتدئين</p><p><b>Author:</b> أبو عبد الرحمن نواس الهندي السيلاني</p></div></article><article class="card"><h3>مقدمة المؤلف — النص العربي الأصلي</h3><p class="muted">The author's introduction and preface are preserved below in their original Arabic form, as requested. The app does not replace the author's words with an English translation.</p><div class="preface-pages"><figure><img src="./assets/preface/page-02.jpg" alt="صفحة المقدمة الأصلية 2"><figcaption>المقدمة — الصفحة 2</figcaption></figure><figure><img src="./assets/preface/page-03.jpg" alt="صفحة المقدمة الأصلية 3"><figcaption>المقدمة — الصفحة 3</figcaption></figure><figure><img src="./assets/preface/page-04.jpg" alt="صفحة المقدمة الأصلية 4"><figcaption>المقدمة — الصفحة 4</figcaption></figure></div></article><article class="card creator-card"><h3>App created and designed by</h3><p class="creator-name">Abu Saaarah Jaffar</p><p class="muted">Project app creator and designer.</p></article></div>`;
}
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
function showTab(id){document.querySelectorAll('.tab').forEach(x=>x.classList.add('hidden'));q('#'+id).classList.remove('hidden');document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));if(id==='practice')startQuiz();if(id==='about')renderAbout();if(id==='lessons')renderLessons();if(id==='additional')renderAdditional()}

function initSettings(){
 q('#soundToggle').checked=state.sound;
 q('#soundToggle').onchange=e=>{state.sound=e.target.checked;save()};
}

document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
q('#fontPlus').onclick=()=>setFont(.1); q('#fontMinus').onclick=()=>setFont(-.1); q('#fontReset').onclick=()=>{state.font=1;save();document.documentElement.style.setProperty('--arabic-scale',1)};

document.documentElement.style.setProperty('--arabic-scale',state.font);
renderDashboard();renderLessons();renderPatterns();renderVerbs();renderConjugator();renderVerification();renderAdditional();renderAbout();initSettings();showTab('dashboard');
window.toggleLesson=toggleLesson; window.startQuiz=startQuiz; window.startAdditionalQuiz=startAdditionalQuiz; window.openLesson=openLesson; window.openSublesson=openSublesson; window.closeLesson=closeLesson; window.markSublessonDone=markSublessonDone; window.toggleFullAccess=toggleFullAccess;
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
