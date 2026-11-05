(function(root){
  'use strict';
  const ARABIC_MARKS=/[\u064B-\u065F\u0670\u06D6-\u06ED]/u;
  const VOWEL_MARKS=['َ','ِ','ُ','ْ','ً','ٍ','ٌ'];
  const TYPE_LABELS={
    past_active:'Māḍī maʿlūm — الماضي المعلوم',
    present_active:'Muḍāriʿ maʿlūm — المضارع المعلوم',
    amr:'Amr — فعل الأمر',
    past_passive:'Māḍī majhūl — الماضي المبني للمجهول',
    present_passive:'Muḍāriʿ majhūl — المضارع المبني للمجهول',
    ism_faail:'Ism al-Fāʿil — اسم الفاعل',
    ism_mafool:'Ism al-Mafʿūl — اسم المفعول',
    masdar:'Maṣdar — المصدر',
  };
  function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function unique(arr){return [...new Set(arr.filter(x=>typeof x==='string'&&x.trim()))];}
  function nounInflections(base,nounType){
    // Inflect the actual participle supplied by the source. The Fa'il and Maf'ul
    // forms must never share a stem: كَاتِبٌ -> كَاتِبَانِ, مَكْتُوبٌ -> مَكْتُوبَانِ.
    if(!base || base.includes('/') || !base.endsWith('ٌ') || !['ism_faail','ism_mafool'].includes(nounType)) return [];
    const stem=base.slice(0,-1);
    const typePrefix=nounType;
    const mk=(suffix,answer,label)=>({type:`${typePrefix}_${suffix}`,answer,promptLabel:label,nounType});
    return [
      mk('m_sg',base,'مُذَكَّر — مُفْرَد (masculine singular)'),
      mk('f_sg',stem+'َةٌ','مُؤَنَّث — مُفْرَد (feminine singular)'),
      mk('m_du',stem+'َانِ','مُذَكَّر — مُثَنَّى (masculine dual, nominative)'),
      mk('f_du',stem+'َتَانِ','مُؤَنَّث — مُثَنَّى (feminine dual, nominative)'),
      mk('m_pl',stem+'ُونَ','مُذَكَّر — جَمْع (masculine sound plural, nominative)'),
      mk('f_pl',stem+'َاتٌ','مُؤَنَّث — جَمْع (feminine sound plural)')
    ];
  }
  function factsForVerb(verb,data){
    const base=(data.facts||[]).filter(f=>f.verbKey===verb.key && !(f.type==='past_active'&&f.slot==='past:0')); // don't quiz the already-shown lemma as its own answer
    const out=[],seen=new Set();
    for(const f of base){
      const sig=[f.type,f.answer,f.promptLabel||''].join('|');
      if(seen.has(sig)) continue; seen.add(sig);
      if(f.type==='ism_faail'||f.type==='ism_mafool'){
        for(const n of nounInflections(f.answer,f.type)) out.push({...f,...n,baseNoun:f.answer});
      }else out.push(f);
    }
    return out;
  }
  function mutateHarakat(word){
    if(!word || typeof word!=='string') return [];
    const chars=Array.from(word), out=[];
    const push=(arr)=>{const s=arr.join('');if(s!==word&&!out.includes(s))out.push(s);};
    for(let i=0;i<chars.length;i++){
      if(VOWEL_MARKS.includes(chars[i])){
        for(const mark of VOWEL_MARKS){if(mark!==chars[i]){const a=[...chars];a[i]=mark;push(a);if(out.length>=12)return out;}}
      }
    }
    // If the answer has few vowel marks, add a competing vowel to an unmarked consonant.
    for(let i=0;i<chars.length;i++){
      if(/[\u0621-\u064A\u0671-\u06D3]/u.test(chars[i]) && !(chars[i+1]&&ARABIC_MARKS.test(chars[i+1]))){
        for(const mark of ['َ','ِ','ُ','ْ']){const a=[...chars];a.splice(i+1,0,mark);push(a);if(out.length>=12)return out;}
      }
    }
    return out;
  }
  function questionText(f,verb){
    if(f.type==='root') return 'Identify the root (الجذر) of this verb.';
    if(f.type==='wazn') return 'Identify its wazan (الوزن الصرفي).';
    if(f.type==='meaning') return 'Choose the textbook meaning of this verb.';
    if(f.type.startsWith('ism_faail_')) return `Give the Ism al-Fāʿil — ${f.promptLabel}.`;
    if(f.type.startsWith('ism_mafool_')) return `Give the Ism al-Mafʿūl — ${f.promptLabel}.`;
    const label=TYPE_LABELS[f.type]||f.type;
    if(f.promptLabel) return `Give the ${label} form for ${f.promptLabel}.`;
    return `Give the ${label} form of this verb.`;
  }
  function buildOptions(correct,pool){
    const opts=[];
    const add=x=>{if(x && x!==correct && !opts.includes(x))opts.push(x);};
    // First favor close, fully vocalized near-misses.
    for(const x of mutateHarakat(correct)) {add(x);if(opts.length===2)break;}
    // Then use exact answers from the same form/slot in the source bank.
    for(const x of shuffle(unique(pool))) {add(x);if(opts.length===3)break;}
    // Last-resort close distractors still guarantee four unique choices.
    for(const x of mutateHarakat(correct)) {add(x);if(opts.length===3)break;}
    // Root/meaning/wazan may have no diacritics to mutate; source bank is expected to supply choices.
    if(opts.length<3) return null;
    return shuffle([correct,...opts.slice(0,3)]);
  }
  function createQuestion(verb,data){
    const own=factsForVerb(verb,data);
    if(!own.length) return null;
    const morph=own.filter(f=>!['root','wazn','meaning'].includes(f.type));
    const selected=(morph.length && Math.random()<0.88)?shuffle(morph)[0]:shuffle(own)[0];
    let pool=(data.facts||[]).filter(f=>f.type===selected.type && f.verbKey!==verb.key).map(f=>f.answer);
    if(selected.type==='wazn') pool=(data.verbs||[]).filter(v=>v.key!==verb.key).map(v=>v.wazn);
    if(selected.type==='root') pool=(data.verbs||[]).filter(v=>v.key!==verb.key&&v.category===verb.category).map(v=>v.root);
    if(selected.type==='meaning') pool=(data.verbs||[]).filter(v=>v.key!==verb.key&&v.category===verb.category).flatMap(v=>v.meanings||[]);
    // Match conjugation/person slot where possible, then relax to the same type.
    if(selected.promptLabel){
      const exact=(data.facts||[]).filter(f=>f.type===selected.type&&f.promptLabel===selected.promptLabel&&f.verbKey!==verb.key).map(f=>f.answer);
      pool=[...exact,...pool];
    }
    if(selected.type.startsWith('ism_')){
      const exact=own.filter(f=>f.type===selected.type&&f.nounType===selected.nounType).map(f=>f.answer);
      pool=[...exact,...pool];
    }
    const options=buildOptions(selected.answer,pool);
    return options?{verb,fact:selected,correct:selected.answer,options,question:questionText(selected,verb)}:null;
  }
  function availableFacts(verb,data){return factsForVerb(verb,data).filter(f=>!['root','wazn','meaning'].includes(f.type));}
  root.SARF_CONJUGATION_CORE={factsForVerb,createQuestion,buildOptions,mutateHarakat,questionText,availableFacts,TYPE_LABELS};
})(window);
