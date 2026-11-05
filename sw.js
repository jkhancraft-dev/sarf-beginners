const CACHE_NAME='sarf-v11-0-offline-app-shell';
const CORE_ASSETS=[
 './','./index.html','./styles.css','./app.js','./conjugation.js','./conjugation_core.js',
 './conjugation_data.json','./conjugation_database.json','./manifest.json',
 './data/verbs.json','./data/verbs-data.js','./data/verbs_flat.csv','./data/meaning_groups.json',
 './icons/icon-192.png','./icons/icon-512.png',
 './textbook/','./textbook/index.html','./textbook/style.css','./textbook/app.js',
 './textbook/data.js','./textbook/qa.js','./textbook/qa_additional.js',
 './textbook/verified_conjugations.js','./textbook/conjugation_database.js',
 './textbook/manifest.json','./textbook/sw.js','./textbook/icons/icon-192.png','./textbook/icons/icon-512.png',
 './textbook/assets/preface/page-01.jpg','./textbook/assets/preface/page-02.jpg',
 './textbook/assets/preface/page-03.jpg','./textbook/assets/preface/page-04.jpg'
];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE_NAME);
 await cache.addAll(CORE_ASSETS);
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith('sarf-v')&&k!==CACHE_NAME).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE_NAME);
  const cached=await cache.match(req,{ignoreSearch:true});
  if(cached)return cached;
  try{const response=await fetch(req);if(response.ok)cache.put(req,response.clone());return response;}
  catch(error){if(req.mode==='navigate')return cache.match('./index.html');throw error;}
 })());
});
