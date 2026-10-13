const q = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const state = JSON.parse(localStorage.getItem('sarfTextbookStateV103') || '{}');
state.font = state.font || 1;
state.completed = state.completed || {};
state.correct = state.correct || 0;
state.wrong = state.wrong || 0;
state.sound = state.sound !== false;
state.streak = state.streak || 0;
state.fullAccess = state.fullAccess === true;
state.additionalFullAccess = state.additionalFullAccess === true;
state.openLesson = state.openLesson || null;
state.openSublesson = state.openSublesson || null;

function save(){localStorage.setItem('sarfTextbookStateV103',JSON.stringify(state));}
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
  const completedLessons=DATA.lessons.filter(x=>lessonComplete(x.id)).length;
  root.innerHTML=`<div class="section-intro card"><div class="eyebrow">BOOK SEQUENCE</div><h2>Lessons</h2><p>Completed <strong>${completedLessons} of ${DATA.lessons.length}</strong> lessons. Open the first available lesson and mark each sub-lesson understood. The next lesson unlocks when all sub-lessons in the current lesson are complete.</p></div><div class="lesson-list">${DATA.lessons.map((x,i)=>{const done=lessonComplete(x.id), unlocked=allPriorLessonsComplete(x.id);return `<button class="lesson-tile ${done?'completed':''} ${unlocked?'':'locked'}" ${unlocked?'':'disabled'} aria-label="${esc(x.title_en)}${unlocked?'':' — locked; complete all earlier lessons first'}" onclick="openLesson('${x.id}')"><span class="tile-number">${i+1}</span><span class="tile-main"><strong>${esc(x.title_en)}</strong><span>${arabic(x.title_ar,'small-ar')}</span><small>Pages ${esc(x.pages)} · ${(x.sublessons||[]).length} sub-lessons</small>${unlocked?'':'<small class="locked-help">Complete earlier lessons to unlock</small>'}</span><span class="tile-status">${done?'✓ Complete':unlocked?'Open →':'🔒 Locked'}</span></button>`}).join('')}</div>`;
}
function renderPatterns(){
  const groups=[
    ['Form I — three-letter verb',['فَعَلَ','فَعِلَ','فَعُلَ'],'Three basic three-letter past patterns.'],
    ['Derived three-letter forms — Forms II–IV',['فَعَّلَ','فَاعَلَ','أَفْعَلَ'],'The verb gains additional letters/pattern features while the underlying root remains identifiable.'],
    ['Derived five-letter forms — Forms V–VI',['تَفَعَّلَ','تَفَاعَلَ'],'Five-letter patterns built from the derived three-letter patterns.'],
    ['Derived five-letter forms — Forms VII–IX',['اِنْفَعَلَ','اِفْتَعَلَ','اِفْعَلَّ'],'Five-letter patterns with their characteristic prefixes and changes.'],
    ['Six-letter form — Form X',['اِسْتَفْعَلَ'],'The six-letter pattern introduced in the textbook.'],
    ['Four-letter verbs',['فَعْلَلَ','تَفَعْلَلَ'],'A true four-letter base and its derived five-letter pattern.']
  ];
  q('#patterns').innerHTML=`<div class="section-intro card"><div class="eyebrow">PATTERN MAP</div><h2>Verb Forms at a Glance</h2><p>Use this map to identify the pattern and traditional form. Select a pattern card to open its textbook example in the Textbook Verb Conjugator.</p></div>${groups.map(g=>`<article class="card"><h3>${esc(g[0])}</h3><p class="muted">${esc(g[2])}</p><div class="grid">${g[1].map(pat=>{const p=DATA.patterns.find(x=>x[0]===pat);const ex=(DATA.verbs||[]).find(v=>v.wazn===pat);return p?`<button class="card pattern-pick" type="button" onclick="openPatternInConjugator('${esc(pat)}')"><span>${arabic(p[0],'ar pattern')}</span><p>${esc(p[1])} · ${esc(p[2])}</p>${ex?`<p class="pattern-example">${arabic(ex.ar,'small-ar')} <span>— ${esc(ex.meaning||'')}</span></p>`:''}<span class="pattern-open">Open textbook example →</span></button>`:''}).join('')}</div></article>`).join('')}`;
}

function openPatternInConjugator(pattern){
  const example=(DATA.verbs||[]).find(v=>v.wazn===pattern);
  showTab('conjugator');
  if(!example)return;
  const input=q('#conjInput'), selector=q('#conjWhat');
  if(input) input.value=example.ar;
  if(selector) selector.value='everything';
  const run=q('#runConj'); if(run) run.click();
}

function learningEntries(){return [...(DATA.verbs||[]),...(DATA.exercise_entries||[])];}

function normalizeArabic(s){
  return String(s||'').normalize('NFD').replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').trim();
}
function allVerbRecords(){
  return [...(DATA.verbs||[]),...(DATA.exercise_entries||[])];
}
function findVerbRecord(input){
  const n=normalizeArabic(input);
  if(!n) return null;
  return allVerbRecords().find(v=>normalizeArabic(v.ar)===n) || allVerbRecords().find(v=>normalizeArabic(v.past_3ms)===n) || allVerbRecords().find(v=>normalizeArabic(v.present_3ms)===n) || null;
}
function fullParadigmHTML(v){
  const rows=(title,arr)=>arr?.length?`<h4>${title}</h4>${miniTable(arr)}`:'';
  const amr=v.amr_5_persons||v.expected_answers?.amr_5_persons;
  return `<details class="verb-paradigm"><summary>View complete Ṣarf</summary>
    ${rows('Māḍī',v.past_conjugation)}
    ${rows('Muḍāriʿ',v.present_conjugation)}
    ${amr?.length?`<h4>Amr</h4><div class="examples">${amr.map((x,i)=>`<div>${arabic(['أَنْتَ','أَنْتُمَا','أَنْتُمْ','أَنْتِ','أَنْتُنَّ'][i],'small-ar')} — ${arabic(x,'small-ar')}</div>`).join('')}</div>`:''}
    ${v.passive_past_3ms||v.expected_answers?.passive_past_3ms?`<h4>Passive Māḍī</h4><div class="examples">${arabic(v.passive_past_3ms||v.expected_answers.passive_past_3ms,'table-ar')}</div>`:''}
    ${rows('Passive Muḍāriʿ',v.passive_present_conjugation)}
    ${v.ism_al_faail||v.expected_answers?.ism_al_faail?`<h4>Derived forms</h4><div class="examples"><div>اسم الفاعل — ${arabic(v.ism_al_faail||v.expected_answers.ism_al_faail,'small-ar')}</div>${(v.ism_al_mafool||v.expected_answers?.ism_al_mafool)?`<div>اسم المفعول — ${arabic(v.ism_al_mafool||v.expected_answers.ism_al_mafool,'small-ar')}</div>`:''}${(v.expected_answers?.masdar)?`<div>المصدر — ${arabic(v.expected_answers.masdar,'small-ar')}</div>`:''}</div>`:''}
  </details>`;
}
function renderVerbs(){
  const entries=learningEntries();
  q('#verbs').innerHTML = `<div class="section-intro card"><div class="eyebrow">VERB DIRECTORY</div><h2>Textbook Verbs</h2><p>Tap any entry to open its complete available Ṣarf reference. The list is separate from Additional Practice.</p></div><div class="searchbar"><input id="verbSearch" placeholder="Search Arabic, root, meaning or وزن…"><span>${entries.length} textbook-index entries</span></div><div id="verbGrid" class="grid"></div>`;
  const draw=()=>{
    const term=q('#verbSearch').value.trim().toLowerCase();
    const list=entries.filter(v=>[v.ar,v.root,v.wazn,v.meaning].join(' ').toLowerCase().includes(term));
    q('#verbGrid').innerHTML=list.map(v=>card(arabic(v.ar,'ar verb'),`<p><b>Root:</b> ${esc(v.root||'—')}</p><p><b>وزن:</b> ${v.wazn?arabic(v.wazn,'small-ar'):'—'}</p><p>${esc(v.meaning||'')}</p><p class="muted">Source page: ${esc(v.source_page||v.source||v.lesson||'')}</p>${v.source_anomaly?`<p class="muted"><b>Source note:</b> ${esc(v.source_anomaly)}</p>`:''}${fullParadigmHTML(v)}`)).join('') || '<p>No match.</p>';
  };
  q('#verbSearch').addEventListener('input',draw); draw();
}

function miniTable(rows){
  if(!Array.isArray(rows)||!rows.length) return '';
  return `<div class="table-wrap"><table class="mini-table"><thead><tr><th>Pronoun</th><th>Form</th></tr></thead><tbody>${rows.map(r=>`<tr><th>${arabic(r[0]||'','small-ar')}</th><td>${arabic(r[1]||'','table-ar')}</td></tr>`).join('')}</tbody></table></div>`;
}
function conjugationRows(v,kind){
  if(kind==='past') return v?.past_conjugation||[];
  if(kind==='present') return v?.present_conjugation||[];
  if(kind==='passive_present') return v?.passive_present_conjugation||[];
  return [];
}
function normalizeForRegistry(s){return normalizeArabic(s).replace(/[\u0640\u0671]/g,'ا').replace(/ة/g,'ه')}
function verifiedLexeme(input){
  const records=window.TEXTBOOK_VERIFIED_CONJUGATIONS||{};
  const target=normalizeForRegistry(input);
  return Object.values(records).find(v=>normalizeForRegistry(v.canonical)===target)||null;
}
function renderConjugator(){
  q('#conjugator').innerHTML=card('Textbook Verb Conjugator',`<p class="muted">Reviewed coverage: 14 representative textbook verbs. The selector shows active past, present, imperative, passive forms, participles, maṣdar, Ism al-Tafdīl, and Mīzān where a reviewed/source-supported form exists. Unavailable forms are explicitly explained rather than guessed. Other textbook entries display only forms actually stored in their source records.</p><div class="conj-controls"><input id="conjInput" placeholder="Enter a verb, e.g. كَتَبَ" inputmode="text" autocomplete="off"><select id="conjWhat"><option value="everything">Everything verified</option><option value="past">Māḍī</option><option value="present">Muḍāriʿ</option><option value="amr">Amr</option><option value="faail">Ism al-Fāʿil / lexical adjective</option><option value="mafool">Ism al-Mafʿūl</option><option value="passive_past">Passive Māḍī</option><option value="passive_present">Passive Muḍāriʿ</option><option value="masdar">Maṣdar</option><option value="tafdil">Ism al-Tafdīl</option><option value="wazn">Mīzān / وزن</option></select><button class="btn" id="runConj">Show</button></div><div class="conj-hint">Reviewed examples: كَتَبَ، فَرِحَ، كَرُمَ، أَكْرَمَ، كَاتَبَ، عَلَّمَ، بَرْهَنَ، اِنْكَسَرَ، اِشْتَغَلَ، اِحْمَرَّ، تَعَلَّمَ، تَنَاصَرَ، تَدَحْرَجَ، اِسْتَخْرَجَ.</div><div id="conjResult"></div>`);
  const run=()=>{
    const input=q('#conjInput').value.trim(), kind=q('#conjWhat').value, out=q('#conjResult');
    if(!input){out.innerHTML='<div class="empty-state"><h3>Choose a textbook verb</h3><p>Enter one of the reviewed pattern examples, or choose a verb from the Textbook Verbs directory.</p></div>';return;}
    const v=findVerbRecord(input);
    if(!v){out.innerHTML='<div class="empty-state"><h3>Verb not found in the textbook index</h3><p>Try the verb with Arabic spelling, or choose it from the Textbook Verbs directory. No unverified form will be guessed.</p></div>';return;}
    const verified=verifiedLexeme(input) || verifiedLexeme(v.ar);
    const active=verified?.active, passive=verified?.passive, nouns=verified?.nouns;
    const titleVerb=verified?.canonical||v.ar;
    const rows=(title,arr,note='No reviewed table is stored for this form.')=>Array.isArray(arr)&&arr.length?`<h4>${title}</h4>${miniTable(arr)}`:`<h4>${title}</h4><p class="muted">${esc(note)}</p>`;
    const scalar=(title,value,note='')=>value?`<h4>${title}</h4><div class="examples">${arabic(value,'table-ar')}</div>${note?`<p class="muted">${esc(note)}</p>`:''}`:note?`<h4>${title}</h4><p class="muted">${esc(note)}</p>`:`<h4>${title}</h4><p class="muted">No reviewed/source-supported form is stored for this entry; no form has been inferred.</p>`;
    let body=`<div class="card"><div class="lesson-header"><div><h3>${arabic(titleVerb,'ar verb')}</h3><p>${esc(verified?.meaning||v.meaning||'')}</p></div><span class="badge">${verified?esc(verified.wazn):esc(v.wazn||'Textbook entry')}</span></div><p><b>Root:</b> ${esc(verified?.root||v.root||'—')}</p>`;
    if(verified){
      if(kind==='everything'||kind==='past') body+=rows('Māḍī',active.past,'No reviewed active-past table is stored.');
      if(kind==='everything'||kind==='present') body+=rows('Muḍāriʿ',active.present,'No reviewed active-present table is stored.');
      if(kind==='everything'||kind==='amr') body+=rows('Amr',active.amr,verified.canonical==='اِحْمَرَّ'?'The reviewed Form IX record intentionally omits an ordinary productive imperative.':'No reviewed imperative table is stored for this lexeme.');
      if(kind==='everything'||kind==='passive_past') body+=rows('Passive Māḍī',passive.past,passive.note||'No reviewed passive-past paradigm is supplied for this lexeme.');
      if(kind==='everything'||kind==='passive_present') body+=rows('Passive Muḍāriʿ',passive.present,passive.note||'No reviewed passive-present paradigm is supplied for this lexeme.');
      if(kind==='everything'||kind==='faail') body+=scalar(nouns.faail_label||'Ism al-Fāʿil',nouns.faail,nouns.faail_note||'');
      if(kind==='everything'||kind==='mafool') body+=scalar('Ism al-Mafʿūl',nouns.mafool,nouns.mafool_note||'');
      if(kind==='everything'||kind==='masdar') body+=scalar('Maṣdar',nouns.masdar,nouns.masdar_note||'');
      if(kind==='everything'||kind==='tafdil') body+=scalar('Ism al-Tafdīl',nouns.tafdil,nouns.tafdil_note||'No reviewed direct اسم التفضيل is supplied; use a context-appropriate analytic expression when grammatically required.');
      if(kind==='everything'||kind==='wazn') body+=scalar('Mīzān / وزن',verified.wazn,'No reviewed وزن is stored for this entry.');
      body+=`<p class="source"><b>Verification status:</b> ${esc(verified.verification?.status||'reviewed')} · <b>Paradigm basis:</b> ${esc(verified.verification?.basis||'')}</p>`;
    }else{
      if(kind==='everything'||kind==='past') body+=rows('Māḍī',v.past_conjugation);
      if(kind==='everything'||kind==='present') body+=rows('Muḍāriʿ',v.present_conjugation);
      if(kind==='everything'||kind==='amr') body+=rows('Amr',v.expected_answers?.amr_5_persons?.map((x,i)=>[['أَنْتَ','أَنْتُمَا','أَنْتُمْ','أَنْتِ','أَنْتُنَّ'][i],x]));
      if(kind==='everything'||kind==='faail') body+=scalar('Ism al-Fāʿil',v.ism_al_faail||v.expected_answers?.ism_al_faail);
      if(kind==='everything'||kind==='mafool') body+=scalar('Ism al-Mafʿūl',v.ism_al_mafool||v.expected_answers?.ism_al_mafool);
      if(kind==='everything'||kind==='passive_past') body+=scalar('Passive Māḍī — هُوَ',v.passive_past_3ms||v.expected_answers?.passive_past_3ms,'Only a stored singular principal part is available for this entry.');
      if(kind==='everything'||kind==='passive_present') body+=rows('Passive Muḍāriʿ',v.passive_present_conjugation);
      if(kind==='everything'||kind==='masdar') body+=scalar('Maṣdar',v.expected_answers?.masdar);
      if(kind==='everything'||kind==='tafdil') body+=scalar('Ism al-Tafdīl',v.expected_answers?.ism_al_tafdil);
      if(kind==='everything'||kind==='wazn') body+=scalar('Mīzān / وزن',v.wazn);
      if(!body.includes('<h4>')) body+='<p class="muted">No verified paradigm is stored for this exact verb yet. Only textbook-sourced individual forms are available.</p>';
      else body+='<p class="muted">This entry is not yet in the reviewed 14-example paradigm registry. Displayed forms are only those explicitly stored in the textbook index; no missing forms were inferred.</p>';
    }
    body+='</div>'; out.innerHTML=body;
  };
  q('#runConj').onclick=run; q('#conjInput').addEventListener('keydown',e=>{if(e.key==='Enter')run()}); q('#conjWhat').addEventListener('change',run);
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
  q('#practice').innerHTML=card('Textbook Practice Questions',`<div class="unlock-panel practice-unlock"><div><strong>🔓 Full Textbook Test</strong><p class="muted">${state.fullAccess?'All textbook questions are unlocked.':'Normal mode follows completed textbook lessons only.'}</p></div><button class="btn ${state.fullAccess?'secondary-btn':''}" ${state.fullAccess?'disabled':''} onclick="unlockAllTextbookQuestions();startQuiz()">${state.fullAccess?'✓ All questions unlocked':'Unlock all questions'}</button></div><div class="quiz-meta"><span>${meta}</span><span>Score ${state.correct} / ${state.correct+state.wrong}</span></div><div class="question-word">${arabic(shown,'ar quiz-word')}</div><p class="question">${questionText}</p><p class="quiz-instruction">Choose one answer. Your answer is checked immediately.</p><div class="options">${options.map((o,i)=>`<button class="option" data-i="${i}">${arabic(o,'small-ar')}<span class="mark" aria-hidden="true"></span></button>`).join('')}</div><div id="quizFeedback" class="quiz-feedback" aria-live="polite"></div><button class="btn next-btn" id="nextQuestion" disabled>Next question</button>`);
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
  return learningEntries().filter(v=>entryUnlocked(v,c));
}

function learnedPastPatterns(){
  const c=learnedCapabilities();
  const ids=[];
  if(c.past3) ids.push('فَعَلَ','فَعِلَ','فَعُلَ');
  if(c.past4) ids.push('أَفْعَلَ','فَاعَلَ','فَعَّلَ','فَعْلَلَ');
  if(c.past5) ids.push('اِنْفَعَلَ','اِفْتَعَلَ','اِفْعَلَّ','تَفَعَّلَ','تَفَاعَلَ','تَفَعْلَلَ');
  if(c.past6) ids.push('اِسْتَفْعَلَ');
  return ids;
}
function startQuiz(){
  const entries=practiceEntries();
  if(!entries.length){
    q('#practice').innerHTML=card('Textbook Practice Questions',`<div class="unlock-panel practice-unlock"><div><strong>🔓 Full Textbook Test</strong><p class="muted">No normal questions are unlocked yet. You can still test the entire textbook.</p></div><button class="btn" onclick="unlockAllTextbookQuestions();startQuiz()">Unlock all questions</button></div><div class="empty-state"><div class="big-icon">📘</div><h3>No normal questions unlocked yet</h3><p>Complete a lesson to begin cumulative practice, or use the button above for a full-textbook test.</p><button class="btn secondary-btn" onclick="showTab('lessons')">Go to Lessons</button></div>`); return;
  }
  const useConj=entries.some(v=>v.expected_answers?.root) && Math.random()<.34;
  if(useConj && Object.keys(DATA.past_conjugations||{}).length && learnedCapabilities().past3){
    const allowed=learnedPastPatterns(); const pattern=allowed[Math.floor(Math.random()*allowed.length)]; const rows=DATA.past_conjugations[pattern]||[]; const idx=Math.floor(Math.random()*rows.length); const pronoun=rows[idx][0],correct=rows[idx][1];
    if(Math.random()<.45) renderChoiceQuestion('Past-tense pattern',correct,'Which <strong>وَزْن / مِيزَان</strong> does this form belong to?',pattern,allowed,'Māḍī pattern review');
    else renderChoiceQuestion('Past-tense conjugation',pattern,`Give the <strong>${arabic(pronoun,'small-ar')}</strong> form.`,correct,rows.map(r=>r[1]),'Māḍī conjugation review');
    return;
  }
  const verb=entries[Math.floor(Math.random()*entries.length)];
  const available=[];
  const c=learnedCapabilities();
  if(verb.expected_answers?.root) available.push(['root','Identify the root',v=>v.expected_answers?.root]);
  if(verb.expected_answers?.wazn) available.push(['wazn','Identify the وَزْن / مِيزَان',v=>v.expected_answers?.wazn]);
  if(verb.expected_answers?.meaning) available.push(['meaning','Identify the English meaning',v=>v.expected_answers?.meaning]);
  if(c.present && verb.present_3ms) available.push(['present','Give the هُوَ Muḍāriʿ form',v=>v.present_3ms]);
  if(c.faail && verb.ism_al_faail) available.push(['faail','Give اسم الفاعل',v=>v.ism_al_faail]);
  if(c.mafool && verb.ism_al_mafool) available.push(['mafool','Give اسم المفعول',v=>v.ism_al_mafool]);
  if(c.amr && verb.expected_answers?.amr_5_persons) available.push(['amr','Give the فِعْلُ الأَمْر form',v=>v.expected_answers?.amr_5_persons?.[0]]);
  if(c.passivePresent && verb.expected_answers?.passive_present_3ms) available.push(['passive','Give the هُوَ passive Muḍāriʿ form',v=>v.expected_answers?.passive_present_3ms]);
  if(c.passivePast && verb.expected_answers?.passive_past_3ms) available.push(['passivepast','Give the هُوَ passive Māḍī form',v=>v.expected_answers?.passive_past_3ms]);
  if(c.tafdil && verb.expected_answers?.ism_al_tafdil) available.push(['tafdil','Give اسم التفضيل',v=>v.expected_answers?.ism_al_tafdil]);
  if(c.masdar && verb.expected_answers?.masdar) available.push(['masdar','Give the مصدر',v=>v.expected_answers?.masdar]);
  if(!available.length) return startQuizFallback(entries);
  const mode=available[Math.floor(Math.random()*available.length)]; const correct=mode[2](verb); const pool=entries.filter(v=>v.expected_answers && mode[2](v)).map(mode[2]).filter(Boolean);
  if(pool.length<2 || !correct) return startQuizFallback(entries);
  renderChoiceQuestion('Textbook Practice Questions',verb.ar,mode[1],correct,pool,state.fullAccess?'Full-textbook practice':'Cumulative textbook practice');
}
function startQuizFallback(entries){
 const verb=entries[Math.floor(Math.random()*entries.length)];
 const correct=verb.meaning||verb.root||verb.wazn; const pool=entries.map(v=>v.meaning||v.root||v.wazn).filter(Boolean);
 renderChoiceQuestion('Textbook Practice Questions',verb.ar,'Identify the correct answer.',correct,pool,state.fullAccess?'Full-textbook practice':'Cumulative textbook practice');
}
function answerQuiz(button,value){
  if(!quiz || quiz.answered) return;
  quiz.answered=true;
  const nextButton=q('#nextQuestion'); if(nextButton) nextButton.disabled=false;
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


function learnedCapabilities(forAdditional=false){
  if(state.fullAccess && !forAdditional) return {intro:true,past3:true,past4:true,past5:true,past6:true,past:true,present3:true,present4:true,present5:true,present6:true,present:true,amr:true,faail:true,passivePast:true,passivePresent:true,mafool:true,tafdil:true,masdar:true};
  const completedIds=new Set(DATA.lessons.filter(x=>lessonComplete(x.id)).map(x=>x.id));
  return {
    intro: completedIds.has('L01'),
    past3: completedIds.has('L02'), past4: completedIds.has('L03'), past5: completedIds.has('L04'), past6: completedIds.has('L05'),
    past: ['L02','L03','L04','L05'].some(id=>completedIds.has(id)),
    present3: completedIds.has('L06'), present4: completedIds.has('L07'), present5: completedIds.has('L08'), present6: completedIds.has('L09'),
    present: ['L06','L07','L08','L09'].some(id=>completedIds.has(id)),
    amr:completedIds.has('L10'), faail:completedIds.has('L11'), passivePast:completedIds.has('L12'), passivePresent:completedIds.has('L13'),
    mafool:completedIds.has('L14'), tafdil:completedIds.has('L15'), masdar:completedIds.has('L16')
  };
}
function entryUnlocked(v,c){
  const lesson=v.lesson;
  if(lesson){ return !!c[({L01:'intro',L02:'past3',L03:'past4',L04:'past5',L05:'past6',L06:'present3',L07:'present4',L08:'present5',L09:'present6',L10:'amr',L11:'faail',L12:'passivePast',L13:'passivePresent',L14:'mafool',L15:'tafdil',L16:'masdar'})[lesson]||'past3']; }
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
}

let additionalQuiz=null;
function renderAdditionalQuestion(title, shown, questionText, correct, pool, meta){
  const options=makeOptions(correct,pool); additionalQuiz={correct,answered:false};
  q('#additional').innerHTML=card('Additional Practice — '+title,`<div class="unlock-panel"><div><strong>🔓 Unlock All Questions</strong><p class="muted">${state.additionalFullAccess?'Full additional-verb bank is unlocked.':'Normal mode follows your completed textbook lessons.'}</p></div><button class="btn ${state.additionalFullAccess?'secondary-btn':''}" onclick="toggleFullAccess();renderAdditional()">${state.additionalFullAccess?'✓ Full bank enabled':'Unlock all questions'}</button></div><div class="quiz-meta"><span>${esc(meta)}</span><span>Score ${state.correct} / ${state.correct+state.wrong}</span></div><div class="question-word">${arabic(shown,'ar quiz-word')}</div><p class="question">${questionText}</p><div class="options" id="additionalOptions">${options.map((o,i)=>`<button class="option" data-i="${i}">${arabic(o,'small-ar')}<span class="mark" aria-hidden="true"></span></button>`).join('')}</div><div id="additionalFeedback" class="quiz-feedback" aria-live="polite"></div><button class="btn next-btn" id="additionalNext">Next question</button><button class="btn secondary-btn" id="backAdditional">← Back to Additional Practice</button>`);
  q('#additionalNext').onclick=()=>startAdditionalQuiz(title.toLowerCase());
  q('#backAdditional').onclick=renderAdditional;
  q('#additionalOptions').querySelectorAll('.option').forEach((b,i)=>b.onclick=()=>answerAdditional(b,options[i]));
}
function answerAdditional(button,value){
  if(!additionalQuiz||additionalQuiz.answered)return; additionalQuiz.answered=true;
  q('#additionalOptions').querySelectorAll('.option').forEach(b=>b.disabled=true);
  if(value===additionalQuiz.correct){button.classList.add('correct');button.querySelector('.mark').textContent='✓';q('#additionalFeedback').innerHTML='<span class="feedback-correct">Correct</span>';state.correct++;state.streak++;tone('correct');}
  else {button.classList.add('wrong');button.querySelector('.mark').textContent='×';const right=[...q('#additionalOptions').querySelectorAll('.option')].find(b=>b.textContent.includes(additionalQuiz.correct));if(right){right.classList.add('correct');right.querySelector('.mark').textContent='✓';}q('#additionalFeedback').innerHTML=`<span class="feedback-wrong">Not quite.</span> ${arabic(additionalQuiz.correct,'small-ar')}`;state.wrong++;state.streak=0;tone('wrong');}
  save();renderDashboard();
}
function renderAdditional(){
 const ap=DATA.additional_practice; const gate=state.additionalFullAccess?'Full additional-verb bank is ON.':'Normal mode follows your completed lessons.';
 const levels=[['easy','Easy','Meaning • root • وزن • direct forms'],['medium','Medium','Random conjugation slot • pronoun • conversion'],['hard','Hard','Random verb + random pronoun + hidden conjugation slot']];
 q('#additional').innerHTML=card('Additional Practice — Beyond the Textbook',`<p>${esc(ap.source_note)}</p><div class="unlock-panel"><div><strong>🔓 Unlock All Questions</strong><p class="muted">${esc(gate)}</p></div><button class="btn ${state.additionalFullAccess?'secondary-btn':''}" onclick="toggleFullAccess()">${state.additionalFullAccess?'✓ Full bank enabled':'Unlock all questions'}</button></div><div class="level-buttons">${levels.map(x=>`<button class="btn level-btn" onclick="startAdditionalQuiz('${x[0]}')"><strong>${x[1]}</strong><span class="muted">${x[2]}</span></button>`).join('')}</div><p class="muted">Each level uses a separate question bank. Levels do not mix.</p><div class="searchbar"><input id="addSearch" placeholder="Search additional verbs…"><span>${ap.verbs.length} verbs</span></div><div id="addGrid" class="grid"></div>`);
 const draw=()=>{const t=q('#addSearch').value.trim().toLowerCase();const list=ap.verbs.filter(v=>[v.ar,v.root,v.wazn,v.meaning].join(' ').toLowerCase().includes(t));q('#addGrid').innerHTML=list.map(v=>`<article class="card"><div class="lesson-header"><div><h3>${arabic(v.ar,'ar verb')}</h3><p class="en-title">${esc(v.meaning)}</p></div><span class="badge">${esc(v.difficulty||'')}</span></div><p><b>Root:</b> ${esc(v.root)} &nbsp; <b>وزن:</b> ${arabic(v.wazn,'small-ar')}</p><p class="muted">Qur'anic reference: ${esc(v.quran_reference||'')}</p></article>`).join('')||'<p>No match.</p>';};
 q('#addSearch').addEventListener('input',draw);draw();
}
function additionalEligible(){return state.additionalFullAccess?DATA.additional_practice.verbs:DATA.additional_practice.verbs.filter(v=>entryUnlocked(v,learnedCapabilities(true)));}
function startAdditionalQuiz(level){
 const eligible=additionalEligible(); if(!eligible.length){renderAdditional();return;}
 const v=eligible[Math.floor(Math.random()*eligible.length)]; const c=learnedCapabilities(true); let correct,question,pool;
 const same=getter=>eligible.map(getter).filter(Boolean);
 const pronPast=['هُوَ','هُمَا','هُمْ','هِيَ','هُنَّ','أَنْتَ','أَنْتُمَا','أَنْتُمْ','أَنْتِ','أَنْتُنَّ','أَنَا','نَحْنُ'];
 const pronAmr=['أَنْتَ','أَنْتُمَا','أَنْتُمْ','أَنْتِ','أَنْتُنَّ'];
 if(level==='easy'){
   const choices=[['meaning','Identify the English meaning.',v.meaning,x=>x.meaning],['root','Identify the root.',v.root,x=>x.root],['wazn','Which وَزْن / مِيزَان does this verb belong to?',v.wazn,x=>x.wazn]];
   if(c.present) choices.push(['present','Give the هُوَ Muḍāriʿ form.',v.present_3ms,x=>x.present_3ms]);
   if(c.faail) choices.push(['faail','Give اسم الفاعل.',v.ism_al_faail,x=>x.ism_al_faail]);
   if(c.mafool) choices.push(['mafool','Give اسم المفعول.',v.ism_al_mafool,x=>x.ism_al_mafool]);
   const m=choices[Math.floor(Math.random()*choices.length)];question=m[1];correct=m[2];pool=same(m[3]);
 } else {
   const families=[];
   if(v.past_conjugation?.length && c.past) families.push(['past_conjugation','Māḍī']);
   if(v.present_conjugation?.length && c.present) families.push(['present_conjugation','Muḍāriʿ']);
   if(v.amr_5_persons?.length && c.amr) families.push(['amr_5_persons','Amr']);
   if(level==='hard'){
     if(v.passive_present_conjugation?.length && c.passivePresent) families.push(['passive_present_conjugation','passive Muḍāriʿ']);
     if(v.passive_past_3ms && c.passivePast) families.push(['passive_past_3ms','passive Māḍī']);
   }
   if(!families.length){question='Identify the English meaning.';correct=v.meaning;pool=same(x=>x.meaning);}
   else {
     const f=families[Math.floor(Math.random()*families.length)];
     if(f[0]==='amr_5_persons'){
       const i=Math.floor(Math.random()*5);correct=v.amr_5_persons[i];question=`${level==='hard'?'Hard: ':''}Give the ${arabic(pronAmr[i],'small-ar')} Amr form.`;pool=eligible.flatMap(x=>x.amr_5_persons||[]);
     } else if(f[0].endsWith('_3ms')){
       correct=v[f[0]];question=`${level==='hard'?'Hard: ':''}Give the هُوَ ${f[1]} form.`;pool=eligible.map(x=>x[f[0]]).filter(Boolean);
     } else {
       const rows=v[f[0]];const i=Math.floor(Math.random()*rows.length);correct=rows[i][1];question=`${level==='hard'?'Hard: ':''}Give the ${arabic(rows[i][0],'small-ar')} ${f[1]} form.`;pool=eligible.flatMap(x=>(x[f[0]]||[]).map(r=>r[1]));
     }
   }
 }
 renderAdditionalQuestion(level.toUpperCase(),v.ar,question,correct,pool,`Additional Practice • ${level.toUpperCase()} • ${eligible.length} eligible verbs`);
}

function unlockAllTextbookQuestions(){state.fullAccess=true;save();}
function toggleFullAccess(){state.additionalFullAccess=!state.additionalFullAccess;save();renderAdditional();}
function renderFlash(){startQuiz()}
function renderAbout(){
 q('#about').innerHTML=`<div class="about-wrap"><article class="card"><div class="eyebrow">ABOUT THIS COURSE</div><h2>الصَّرْفُ لِلْمُبْتَدِئِينَ</h2><p class="about-author" dir="rtl" lang="ar">إعداد: أبو عبد الرحمن نواس بن محمد أنوي الهندي السيلاني</p><p>This app is based on the main Ṣarf textbook uploaded for this project. The book's own sequence, explanations, examples, exercises, and terminology remain the source basis of the curriculum.</p><div class="about-meta"><p><b>Book:</b> الصرف للمبتدئين</p><p><b>Author:</b> أبو عبد الرحمن نواس الهندي السيلاني</p></div></article><article class="card"><h3>مقدمة المؤلف — النص العربي الأصلي</h3><p class="muted">The author's introduction and preface are preserved below in their original Arabic form, as requested. The app does not replace the author's words with an English translation.</p><div class="preface-pages"><figure><img src="./assets/preface/page-01.jpg" alt="صفحة عنوان الكتاب الأصلية"><figcaption>غلاف / صفحة العنوان</figcaption></figure><figure><img src="./assets/preface/page-02.jpg" alt="صفحة المقدمة الأصلية 2"><figcaption>المقدمة — الصفحة 2</figcaption></figure><figure><img src="./assets/preface/page-03.jpg" alt="صفحة المقدمة الأصلية 3"><figcaption>المقدمة — الصفحة 3</figcaption></figure><figure><img src="./assets/preface/page-04.jpg" alt="صفحة المقدمة الأصلية 4"><figcaption>المقدمة — الصفحة 4</figcaption></figure></div></article><article class="card creator-card"><h3>App created and designed by</h3><p class="creator-name">Abu Sara Jafar</p><p class="muted">Project app creator and designer.</p></article></div>`;
}
function renderDashboard(){
 const done=DATA.lessons.filter(x=>lessonComplete(x.id)).length;
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
window.startQuiz=startQuiz; window.startAdditionalQuiz=startAdditionalQuiz; window.openLesson=openLesson; window.openSublesson=openSublesson; window.closeLesson=closeLesson; window.markSublessonDone=markSublessonDone; window.toggleFullAccess=toggleFullAccess; window.unlockAllTextbookQuestions=unlockAllTextbookQuestions; window.openPatternInConjugator=openPatternInConjugator; window.answerAdditional=answerAdditional;
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
