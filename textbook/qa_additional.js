function additionalPracticeQA(DATA){
 const issues=[]; const ap=DATA.additional_practice||{}; const vs=ap.verbs||[];
 if(vs.length!==30) issues.push({kind:'count',value:String(vs.length),issues:['Expected exactly 30 additional verbs']});
 const required=['ar','root','wazn','meaning','past_3ms','present_3ms','amr_5_persons','past_conjugation','present_conjugation','passive_past_3ms','passive_present_3ms','passive_present_conjugation','ism_al_faail','ism_al_mafool','quran_reference'];
 for(const v of vs){
   for(const k of required) if(!v[k] || (Array.isArray(v[k])&&v[k].length===0)) issues.push({kind:'missing',value:v.ar,issues:[k]});
   if((v.past_conjugation||[]).length!==14) issues.push({kind:'past_slots',value:v.ar,issues:['expected 14']});
   if((v.present_conjugation||[]).length!==14) issues.push({kind:'present_slots',value:v.ar,issues:['expected 14']});
   if((v.passive_present_conjugation||[]).length!==14) issues.push({kind:'passive_present_slots',value:v.ar,issues:['expected 14']});
   if((v.amr_5_persons||[]).length!==5) issues.push({kind:'amr_slots',value:v.ar,issues:['expected 5']});
   const all=[v.ar,v.root,v.wazn,v.present_3ms,v.amr_5_persons.join(' '),v.passive_past_3ms,v.passive_present_3ms,v.ism_al_faail,v.ism_al_mafool];
   if(all.some(x=>/[A-Za-z{}\[\]]/.test(String(x)))) issues.push({kind:'script',value:v.ar,issues:['unexpected Latin/template marker in Arabic data']});
 }
 return {ok:issues.length===0,count:vs.length,issues};
}
