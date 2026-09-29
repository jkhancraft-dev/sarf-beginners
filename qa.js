// Strict linguistic QA helpers.
const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/u;
const MARK_RE = /[\u064B-\u065F\u0670\u06D6-\u06ED]/u;
const LATIN_RE = /[A-Za-z]/u;
const BAD_ISOLATED_MARK_RE = /(^|[^\u0600-\u06FF])[\u064B-\u065F\u0670\u06D6-\u06ED]/u;
function qaArabicString(s){
  const issues=[];
  if(!ARABIC_RE.test(s)) issues.push('no Arabic letters');
  if(!MARK_RE.test(s)) issues.push('no Arabic diacritic in a field expected to be vowelized');
  if(BAD_ISOLATED_MARK_RE.test(s)) issues.push('isolated combining mark');
  if(LATIN_RE.test(s)) issues.push('Latin letters embedded');
  return {ok:issues.length===0,issues};
}
function qaDataset(data){
  const out={patterns:0,verbs:0,issues:[]};
  for(const p of data.patterns){
    out.patterns++;
    const q=qaArabicString(p[0]); if(!q.ok) out.issues.push({kind:'pattern',value:p[0],issues:q.issues});
  }
  for(const v of [...(data.verbs||[]),...(data.exercise_entries||[])]){
    out.verbs++;
    for(const [k,val] of Object.entries(v)) if(typeof val==='string' && /[\u0600-\u06FF]/.test(val)){
      const q=qaArabicString(val); if(!q.ok && !['root','root_calc','meaning','normalized_form','source_anomaly'].includes(k)) out.issues.push({kind:'arabic-field',field:k,value:val,issues:q.issues});
    }
    for(const arr of Object.values(v.expected_answers||{})){
      if(Array.isArray(arr)) for(const x of arr) if(typeof x==='string' && /[\u0600-\u06FF]/.test(x)){const q=qaArabicString(x); if(!q.ok) out.issues.push({kind:'answer',value:x,issues:q.issues});}
      else if(typeof arr==='string' && /[\u0600-\u06FF]/.test(arr)){const q=qaArabicString(arr); if(!q.ok) out.issues.push({kind:'answer',value:arr,issues:q.issues});}
    }
  }
  if(Object.values(data.past_conjugations||{}).some(rows=>rows.length!==14)) out.issues.push({kind:'conjugation',value:'past_conjugations',issues:['one or more patterns does not contain exactly 14 slots']});
  if(Object.keys(data.past_conjugations||{}).length!==data.patterns.length) out.issues.push({kind:'conjugation',value:'pattern coverage',issues:['not every indexed pattern has a past table']});
  return out;
}
function strictFreezeGate(data){
  const failures=[];
  const seen=new Set();
  for(const e of [...(data.exercise_entries||[])]){
    const key=`${e.source_page||'na'}|${e.ar||''}|${e.stage||''}|${e.source_type||''}`;
    if(seen.has(key)) failures.push({kind:'duplicate',value:key});
    seen.add(key);
    if(e.status!=='verified') failures.push({kind:'unverified',value:e.ar||key});
    if(e.arabic_verified!==true) failures.push({kind:'arabic_not_verified',value:e.ar||key});
    if(e.meaning_verified!==true) failures.push({kind:'meaning_not_verified',value:e.ar||key});
    if(e.root_verified!==true) failures.push({kind:'root_not_verified',value:e.ar||key});
    if(e.wazn_verified!==true) failures.push({kind:'wazn_not_verified',value:e.ar||key});
    if(e.answer_verified!==true) failures.push({kind:'answer_not_verified',value:e.ar||key});
    if(!e.source_page) failures.push({kind:'missing_source_page',value:e.ar||key});
  }
  return {ok:failures.length===0,failures};
}
