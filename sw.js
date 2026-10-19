const CACHE = 'rescate-v2';
const SHELL = ['./','./index.html','./manifest.json','./app.js','./motivos.js','./icon-192.png','./icon-512.png'];
const LIBS = [
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET') return;
  const url = new URL(e.request.url);

  // Mismo origen (la app): primero caché, actualiza en segundo plano
  if(url.origin===location.origin){
    e.respondWith(
      caches.open(CACHE).then(async c=>{
        const hit = await c.match(e.request);
        const net = fetch(e.request).then(res=>{
          if(res && res.status===200) c.put(e.request, res.clone());
          return res;
        }).catch(()=>hit);
        return hit || net;
      })
    );
    return;
  }

  // Librerías conocidas: caché primero (nunca cambian de versión)
  if(url.hostname.includes('gstatic.com') || url.hostname.includes('cdnjs.cloudflare.com')){
    e.respondWith(
      caches.open(CACHE).then(async c=>{
        const hit = await c.match(e.request);
        if(hit) return hit;
        const res = await fetch(e.request);
        if(res && res.status===200) c.put(e.request, res.clone());
        return res;
      })
    );
  }
  // Firebase/Firestore y demás: no se interceptan (el SDK maneja su propio modo offline)
});
