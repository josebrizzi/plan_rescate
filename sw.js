const CACHE = 'rescate-v1';
const SHELL = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET') return;
  const url = new URL(e.request.url);
  if(url.origin===location.origin){
    e.respondWith(caches.open(CACHE).then(async c=>{
      const hit = await c.match(e.request);
      const net = fetch(e.request).then(res=>{ if(res && res.status===200) c.put(e.request, res.clone()); return res; }).catch(()=>hit);
      return hit || net;
    }));
    return;
  }
  if(url.hostname.includes('gstatic.com') || url.hostname.includes('cdnjs.cloudflare.com')){
    e.respondWith(caches.open(CACHE).then(async c=>{
      const hit = await c.match(e.request);
      if(hit) return hit;
      const res = await fetch(e.request);
      if(res && res.status===200) c.put(e.request, res.clone());
      return res;
    }));
  }
});
