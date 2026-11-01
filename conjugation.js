(function(){
 'use strict';
 const $=s=>document.querySelector(s);
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const hasArabic=s=>/[\u0600-\u06FF]/u.test(String(s||''));
 const core=window.SARF_CONJUGATION_CORE;
 let data=null,category='thulathi',pattern='all',selected=null,quiz=null,score=[0,0],seen=new Set();
 const categoryOrder=['thulathi','rubai','khumasi','sudasi'];
 function setMessage(el,msg){el.innerHTML=`<p class="conj-status" role="status">${esc(msg)}</p>`;}
 function init(){
  const section=$('#conjugation'); if(!section)return;
  fetch('./conjugation_data.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();}).then(obj=>{
   data=obj; renderCategories(); renderPatterns(); renderVerbList();
  }).catch(err=>{console.error('Conjugation section failed to load',err);setMessage($('#conjVerbList'),'Could not load textbook verb data. Check that conjugation_data.json is included beside index.html.');});
 }
 function categoryButtons(){
  const el=$('#conjCategoryButtons');
  el.innerHTML=categoryOrder.map(id=>{
   const meta=data.categories[id],count=data.verbs.filter(v=>v.category===id).length;
   return `<button class="conj-category ${id===category?'active':''}" type="button" data-category="${id}"><span>${esc(meta.label)}</span><small>${esc(meta.ar)} · ${count} verbs</small></button>`;
  }).join('');
  el.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{
   category=b.dataset.category;pattern='all';selected=null;quiz=null;score=[0,0];seen.clear();
   renderCategories();renderPatterns();renderVerbList();renderSelected();
  }));
 }
 function renderCategories(){categoryButtons();}
 function renderPatterns(){
  const el=$('#conjPatternButtons'),list=data.patterns[category]||[];
  el.innerHTML=`<button type="button" class="conj-pattern ${pattern==='all'?'active':''}" data-pattern="all">All wazan <small>${data.verbs.filter(v=>v.category===category).length} verbs</small></button>`+list.map(w=>{
   const count=data.verbs.filter(v=>v.category===category&&v.wazn===w).length;
   return `<button type="button" class="conj-pattern ${pattern===w?'active':''}" data-pattern="${esc(w)}"><span lang="ar" dir="rtl">${esc(w)}</span><small>${count} verbs</small></button>`;
  }).join('');
  el.querySelectorAll('[data-pattern]').forEach(b=>b.addEventListener('click',()=>{pattern=b.dataset.pattern;selected=null;quiz=null;score=[0,0];seen.clear();renderPatterns();renderVerbList();renderSelected();}));
 }
 function renderVerbList(){
  const el=$('#conjVerbList');
  const term=$('#conjVerbSearch').value.trim().toLocaleLowerCase();
  const verbs=data.verbs.filter(v=>v.category===category&&(pattern==='all'||v.wazn===pattern)&&(!term||[v.canonical,v.root,v.wazn,(v.meanings||[]).join(' ')].join(' ').toLocaleLowerCase().includes(term)));
  $('#conjVerbCount').textContent=`${verbs.length} verb${verbs.length===1?'':'s'}`;
  if(!verbs.length){setMessage(el,'No textbook verbs match this filter.');return;}
  el.innerHTML=verbs.map(v=>{
   const forms=v.formFactCount||0;
   return `<button type="button" class="conj-verb-card ${selected&&selected.key===v.key?'selected':''}" data-verb-key="${esc(v.key)}"><span class="conj-verb-ar" lang="ar" dir="rtl">${esc(v.canonical)}</span><span class="conj-verb-meta"><span lang="ar" dir="rtl">${esc(v.wazn)}</span><span>${esc(v.root)}</span></span><span class="conj-verb-availability">${forms?`${forms} form questions`:'Root / wazan / meaning'}</span></button>`;
  }).join('');
  el.querySelectorAll('[data-verb-key]').forEach(b=>b.addEventListener('click',()=>{
   selected=data.verbs.find(v=>v.key===b.dataset.verbKey)||null;quiz=null;score=[0,0];seen.clear();renderVerbList();renderSelected();
  }));
 }
 function renderSelected(){
  const el=$('#conjSelected'),qel=$('#conjQuiz');
  qel.innerHTML='';
  if(!selected){el.innerHTML='<div class="conj-selected-empty">Select a verb above to begin practising its textbook-supported forms.</div>';return;}
  const morphology=core.availableFacts(selected,data);
  const types=[...new Set(morphology.map(f=>f.type))];
  const typeNames=types.map(t=>core.TYPE_LABELS[t]||t);
  const limited=!morphology.length;
  el.innerHTML=`<article class="conj-selected-card"><div class="conj-selected-head"><div><p class="conj-kicker">SELECTED VERB</p><h3 lang="ar" dir="rtl">${esc(selected.canonical)}</h3><p class="conj-selected-meta">Root: <b>${esc(selected.root)}</b> · Wazan: <b lang="ar" dir="rtl">${esc(selected.wazn)}</b></p></div><button type="button" class="conj-secondary" id="conjChooseAnother">Choose another</button></div><p class="conj-meanings">${esc((selected.meanings||[]).join(' · ')||'Meaning not supplied in the textbook index.')}</p><div class="conj-coverage ${limited?'limited':''}"><strong>${limited?'Limited morphology coverage':'Textbook-supported form practice'}</strong><p>${limited?'No individual conjugation form is stored for this verb in the reviewed textbook data. You can still test root, wazan, and meaning; unsupported forms will not be guessed.':`This verb has ${morphology.length} stored form questions covering: ${typeNames.map(esc).join(' · ')}.`}</p></div><button type="button" class="conj-start" id="conjStart">Start practice — 4 choices</button></article>`;
  $('#conjChooseAnother').addEventListener('click',()=>{selected=null;quiz=null;renderVerbList();renderSelected();});
  $('#conjStart').addEventListener('click',startQuiz);
 }
 function startQuiz(){score=[0,0];seen.clear();nextQuestion();}
 function nextQuestion(){
  if(!selected||!data)return;
  quiz=core.createQuestion(selected,data);
  if(!quiz){setMessage($('#conjQuiz'),'No four-option question could be created for this entry. Select another textbook verb.');return;}
  renderQuiz();
 }
 function renderQuiz(){
  const el=$('#conjQuiz');
  const f=quiz.fact;
  el.innerHTML=`<article class="conj-quiz-card"><div class="conj-quiz-top"><span class="conj-quiz-badge">ONE VERB · MIXED ṢARF</span><span class="conj-score">Score ${score[0]} / ${score[1]}</span></div><div class="conj-quiz-verb" lang="ar" dir="rtl">${esc(selected.canonical)}</div><p class="conj-quiz-question">${esc(quiz.question)}</p><div class="conj-quiz-options">${quiz.options.map((o,i)=>`<button type="button" class="conj-option ${hasArabic(o)?'arabic-option':'text-option'}" data-option="${i}" ${hasArabic(o)?'dir="rtl"':''}>${esc(o)}</button>`).join('')}</div><div id="conjFeedback" class="conj-feedback" aria-live="polite"></div><div class="conj-quiz-actions"><button type="button" class="conj-secondary" id="conjBackToVerb">Back to verb</button><button type="button" class="conj-next" id="conjNext" disabled>Next question</button></div><p class="conj-source-note">Question basis: ${esc(f.basis||'Textbook data')} · Only stored/reviewed forms are tested.</p></article>`;
  $('#conjNext').addEventListener('click',nextQuestion);
  $('#conjBackToVerb').addEventListener('click',()=>{quiz=null;renderSelected();});
 }
 function answer(index){
  if(!quiz||quiz.answered)return;
  quiz.answered=true;
  const chosen=quiz.options[index],correct=chosen===quiz.correct;
  score[1]++;if(correct)score[0]++;
  $('#conjQuiz').querySelectorAll('[data-option]').forEach((b,i)=>{
   b.disabled=true;
   if(quiz.options[i]===quiz.correct)b.classList.add('correct');
   if(i===index&&!correct)b.classList.add('wrong');
  });
  const fb=$('#conjFeedback');
  fb.className=`conj-feedback ${correct?'correct':'wrong'}`;
  fb.textContent=correct?'Correct — well done.':`Not quite. Correct answer: ${quiz.correct}`;
  const scoreEl=$('#conjQuiz .conj-score');if(scoreEl)scoreEl.textContent=`Score ${score[0]} / ${score[1]}`;
  $('#conjNext').disabled=false;
 }
 // Keep each question bound to its own answer after the options are rendered.
 function answerFromEvent(index){answer(index);}
 function bindDelegation(){
  $('#conjQuiz').addEventListener('click',e=>{const b=e.target.closest('[data-option]');if(b)answerFromEvent(+b.dataset.option);});
 }
 // The listener is installed once; renderQuiz uses buttons without per-button handlers.
 bindDelegation();
 $('#conjVerbSearch').addEventListener('input',renderVerbList);
 init();
})();
