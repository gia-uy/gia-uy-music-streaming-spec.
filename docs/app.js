const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const toast = (msg)=>{ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 1200); };
const DB = window.MUSIC_DATA;

const state = {
  view:'home',
  now:null, currentIdx:-1,
  queue: DB.tracks.map(t=>t.id),
  history: JSON.parse(localStorage.getItem('hist')||'[]'),
  liked: new Set(JSON.parse(localStorage.getItem('liked')||'[]')),
  followArtists: new Set(JSON.parse(localStorage.getItem('fAr')||'[]')),
  followAlbums:  new Set(JSON.parse(localStorage.getItem('fAl')||'[]')),
  playlists: new Map((JSON.parse(localStorage.getItem('pls')||'null') || DB.playlists).map(p=>[p.id,{...p, tracks:[...p.tracks]}])),
  activePL:'p1',
  lastStart:0,
  auth: JSON.parse(localStorage.getItem('auth')||'null') || { userId:null, email:null, name:null, plan:'free' },
  player: { shuffle:false, repeat:'off' }
};

function saveAll(){
  localStorage.setItem('hist', JSON.stringify(state.history));
  localStorage.setItem('liked', JSON.stringify([...state.liked]));
  localStorage.setItem('fAr', JSON.stringify([...state.followArtists]));
  localStorage.setItem('fAl', JSON.stringify([...state.followAlbums]));
  localStorage.setItem('pls', JSON.stringify([...state.playlists.values()]));
  localStorage.setItem('auth', JSON.stringify(state.auth));
}

function setView(v){
  state.view = v;
  $$('.section').forEach(e=>e.classList.add('hide'));
  $$('.tab').forEach(e=>e.classList.remove('active'));
  $(`.tab[data-view="${v}"]`)?.classList.add('active');
  $(`#view-${v}`)?.classList.remove('hide');
  if(v==='home') renderHome();
  if(v==='search') renderSearch();
  if(v==='artist') renderArtists();
  if(v==='album') renderAlbums();
  if(v==='playlist') renderPlaylist();
  if(v==='track') renderTrack(state.now);
  if(v==='admin') renderAdmin();
  if(v==='auth') renderAuth();
  if(v==='history') renderHistory();
}
$$('.tab').forEach(t=> t.onclick = ()=> setView(t.dataset.view));

const deburr = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

function renderSidePlaylists(){
  const box = $('#side-playlists'); box.innerHTML='';
  [...state.playlists.values()].forEach(p=>{
    const count = (p.tracks||[]).length;
    const vis = p.public ? 'Public' : 'Private';
    box.insertAdjacentHTML('beforeend', `<div class="row">
      <div class="meta"><span class="badge circle">${count} bài</span> <strong>${p.title}</strong> <span class="tag">${vis}</span></div>
      <div>
        <button class="btn" data-openpl="${p.id}">Open</button>
        <button class="btn" data-share="${p.id}">Share</button>
        <button class="btn alt" data-delpl="${p.id}">Delete</button>
      </div>
    </div>`);
  });
}
$('#new-pl').onclick = ()=>{
  const id = 'p' + (state.playlists.size+1);
  state.playlists.set(id,{id,title:'New Playlist',owner:'me',tracks:[], public:false});
  saveAll(); renderSidePlaylists();
};

function cardTrack(tr){
  const ar = DB.artists.find(a=>a.id===tr.artistId);
  return `<div class="card">
    <img class="cover" src="${tr.cover}" alt="">
    <h4>${tr.title}</h4>
    <div class="badge">${ar?.name||''}</div>
    <div style="display:flex;gap:8px;margin-top:6px">
      <button class="btn" data-play="${tr.id}">Play</button>
      <button class="heart ${state.liked.has(tr.id)?'liked':''}" data-like="${tr.id}">♥</button>
      <button class="btn" data-add="${tr.id}">+ Playlist</button>
    </div>
  </div>`;
}
function renderHome(){
  const box = $('#discover'); box.innerHTML='';
  DB.tracks.slice(0,9).forEach(tr=> box.insertAdjacentHTML('beforeend', cardTrack(tr)));
  const sg = $('#suggest'); sg.innerHTML='';
  DB.playlists.forEach(p=>{
    const n = p.tracks.length;
    sg.insertAdjacentHTML('beforeend', `<div class="card"><h4>${p.title}</h4><div class="badge">${n} tracks</div></div>`);
  });
}

function renderSearch(){
  const q = $('#q').value.trim();
  const k = deburr(q);
  const box = $('#result'); box.innerHTML='';
  if(!k) return;

  const ar = DB.artists.filter(a => deburr(a.name).includes(k));
  const al = DB.albums.filter(a => deburr(a.title).includes(k));
  const tr = DB.tracks.filter(t => deburr(t.title+' '+(DB.artists.find(a=>a.id===t.artistId)?.name||'')).includes(k));
  const pl = [...state.playlists.values()].filter(p => deburr(p.title).includes(k));

  const section = (title) => `<div class="badge" style="margin:8px 0">${title}</div>`;
  if(ar.length){ box.insertAdjacentHTML('beforeend', section('Nghệ sĩ')); ar.forEach(a=> box.insertAdjacentHTML('beforeend', `<div class="row"><div class="meta"><img src="${a.avatar}" class="thumb"><strong>${a.name}</strong></div><div><button class="btn" data-follow-artist="${a.id}">${state.followArtists.has(a.id)?'Unfollow':'Follow'}</button></div></div>`)); }
  if(al.length){ box.insertAdjacentHTML('beforeend', section('Album')); al.forEach(a=> box.insertAdjacentHTML('beforeend', `<div class="row"><div class="meta"><img src="${a.cover}" class="thumb"><strong>${a.title}</strong></div><div><button class="btn" data-open-album="${a.id}">Mở album</button> <button class="btn" data-follow-album="${a.id}">${state.followAlbums.has(a.id)?'Unfollow':'Follow'}</button></div></div>`)); }
  if(pl.length){ box.insertAdjacentHTML('beforeend', section('Playlist')); pl.forEach(p=> box.insertAdjacentHTML('beforeend', `<div class="row"><div class="meta"><strong>${p.title}</strong></div><div><button class="btn" data-openpl="${p.id}">Open</button></div></div>`)); }
  if(tr.length){ box.insertAdjacentHTML('beforeend', section('Bài hát')); tr.forEach(t=> box.insertAdjacentHTML('beforeend', `<div class="row"><div class="meta"><img src="${t.cover}" class="thumb"><strong>${t.title}</strong><span class="tag">${DB.artists.find(a=>a.id===t.artistId)?.name||''}</span></div><div><button class="btn" data-play="${t.id}">Play</button> <button class="heart ${state.liked.has(t.id)?'liked':''}" data-like="${t.id}">♥</button> <button class="btn" data-add="${t.id}">+ Playlist</button></div></div>`)); }
}
$('#q').addEventListener('input', ()=> setView('search'));

function renderArtists(){
  const box = $('#artists'); box.innerHTML='';
  DB.artists.forEach(a=>{
    box.insertAdjacentHTML('beforeend', `<div class="card"><img class="cover" src="${a.avatar}"/><h4>${a.name}</h4><div class="badge">${a.country}</div></div>`);
  });
}

function renderAlbums(){
  const box = $('#albums'); box.innerHTML='';
  DB.albums.forEach(a=>{
    box.insertAdjacentHTML('beforeend', `<div class="card" data-album="${a.id}"><img class="cover" src="${a.cover}"/><h4>${a.title}</h4><div class="badge">${a.artistId}</div></div>`);
  });
  $('#album-tracks').innerHTML = '<div class="badge">Chọn album để xem bài...</div>';
}

function renderPlaylist(){
  const p = state.playlists.get(state.activePL) || [...state.playlists.values()][0];
  if(!p) return;
  state.activePL = p.id;
  $('#pl-header').innerHTML = `<div class="meta"><strong>${p.title}</strong><span class="badge">${(p.tracks||[]).length} bài</span></div>
    <div><button class="btn" id="pl-clear">Clear</button></div>`;
  const box = $('#pl-tracks'); box.innerHTML='';
  p.tracks.forEach((id, idx)=>{
    const tr = DB.tracks.find(t=>t.id===id); if(!tr) return;
    box.insertAdjacentHTML('beforeend', `<div class="row drag" draggable="true" data-idx="${idx}" data-tid="${id}">
      <div class="meta"><img class="thumb" src="${tr.cover}"><strong>${tr.title}</strong></div>
      <div><button class="btn" data-play="${tr.id}">Play</button> <button class="btn alt" data-del="${idx}">Remove</button></div>
    </div>`);
  });
  $$('#pl-tracks .row').forEach(el=>{
    el.ondragstart = ev => ev.dataTransfer.setData('text/plain', el.dataset.idx);
    el.ondragover = ev => ev.preventDefault();
    el.ondrop = ev => { ev.preventDefault();
      const from = +ev.dataTransfer.getData('text/plain'); const to = +el.dataset.idx;
      const arr = p.tracks; const [m] = arr.splice(from,1); arr.splice(to,0,m); renderPlaylist(); toast('Đã sắp xếp'); saveAll();
    };
  });
  $('#pl-clear').onclick = ()=>{ p.tracks.length=0; renderPlaylist(); saveAll(); };
}

function renderTrack(tr){
  if(!tr){ $('#track-detail').innerHTML='<div class="badge">Chưa chọn bài...</div>'; return; }
  const ar = DB.artists.find(a=>a.id===tr.artistId);
  const al = DB.albums.find(a=>a.id===tr.albumId);
  const lyr = (DB.lyrics[tr.id]||'Chưa có lyrics');
  const rel = (DB.related[tr.id]||[]).map(id=>DB.tracks.find(t=>t.id===id)).filter(Boolean);

  $('#track-detail').innerHTML = `<div class="row">
    <div class="meta"><img class="thumb" src="${tr.cover}"><strong>${tr.title}</strong><span class="badge">${ar?.name||''}</span></div>
    <div><button class="btn" data-play="${tr.id}">Play</button> <button class="heart ${state.liked.has(tr.id)?'liked':''}" data-like="${tr.id}">♥</button></div>
  </div>
  <div class="badge">Album: ${al?.title||''} • ${Math.round(tr.duration/60)}m</div>
  <div class="section" style="margin-top:8px">
    <h4>Lyrics</h4>
    <pre style="white-space:pre-wrap">${lyr}</pre>
  </div>
  <div class="section" style="margin-top:8px">
    <h4>Đề xuất liên quan</h4>
    ${(rel.length?rel.map(r=>`<div class="row"><div class="meta"><img class="thumb" src="${r.cover}"><strong>${r.title}</strong></div><div><button class="btn" data-play="${r.id}">Play</button></div></div>`).join(''):'<div class="badge">Chưa có</div>')}
  </div>`;
}

function renderAdmin(){
  const tbl = $('#adm-table'); tbl.innerHTML='';
  tbl.insertAdjacentHTML('beforeend','<div><strong>Title</strong></div><div><strong>Artist</strong></div><div><strong>Album</strong></div><div><strong>Action</strong></div>');
  DB.tracks.forEach(t=>{
    tbl.insertAdjacentHTML('beforeend', `<div>${t.title}</div><div>${t.artistId}</div><div>${t.albumId}</div>
      <div><button class="btn" data-edit="${t.id}">Edit</button> <button class="btn alt" data-delrow="${t.id}">Delete</button></div>`);
  });
}

$('#adm-add').onclick = ()=>{
  const title = $('#adm-title').value.trim(),
        artist = $('#adm-artist').value.trim(),
        album = $('#adm-album').value.trim(),
        genre = $('#adm-genre').value.trim(),
        audioUrl = ($('#adm-audio').value.trim()||'assets/melody_lofi.wav');
  if(!title||!artist||!album){ toast('Điền đủ Title/ArtistId/AlbumId'); return; }
  const id = 't'+(DB.tracks.length+1);
  DB.tracks.push({ id, albumId:album, artistId:artist, title, duration:160, audio:audioUrl, cover:(DB.albums.find(a=>a.id===album)||{}).cover||'', genreId:genre });
  toast('Đã thêm track (mock)'); renderAdmin();
};

function renderAuth(){
  const as = $('#auth-status');
  if(state.auth?.userId) as.textContent = `Đã đăng nhập: ${state.auth.email} • plan: ${state.auth.plan}`;
  else as.textContent = 'Chưa đăng nhập';
}

// Album click -> show tracks
document.body.addEventListener('click', e=>{
  const card = e.target.closest('[data-album]');
  if(card){
    const id = card.dataset.album;
    const tracks = DB.tracks.filter(t=>t.albumId===id);
    const box = $('#album-tracks'); box.innerHTML='';
    tracks.forEach(tr => {
      box.insertAdjacentHTML('beforeend', `<div class="row">
        <div class="meta"><img class="thumb" src="${tr.cover}"><strong>${tr.title}</strong><span class="tag">${DB.artists.find(a=>a.id===tr.artistId)?.name||''}</span></div>
        <div><button class="btn" data-play="${tr.id}">Play</button> <button class="heart ${state.liked.has(tr.id)?'liked':''}" data-like="${tr.id}">♥</button></div>
      </div>`);
    });
  }
}, true);

// PLAYER + history + shuffle/repeat
const audio = $('#audio');
let ticking = null;
function playTrackById(id){
  const tr = DB.tracks.find(t=>t.id===id); if(!tr) return;
  state.now = tr; state.currentIdx = state.queue.indexOf(id);
  audio.src = tr.audio;
  $('#now').textContent = `${tr.title} — ${DB.artists.find(a=>a.id===tr.artistId)?.name||''}`;
  $('#mini-cover').src = tr.cover || '';
  $('#mini-title').textContent = `${tr.title} — ${DB.artists.find(a=>a.id===tr.artistId)?.name||''}`;
  $('#seek').value = 0;
  audio.play().catch(()=>{});
  $('#play').textContent = '⏸'; state.lastStart = Date.now();
  renderTrack(tr);
  if(ticking) clearInterval(ticking);
  ticking = setInterval(()=>{
    const p = audio.duration ? Math.min(100, Math.round((audio.currentTime/audio.duration)*100)) : 0;
    $('#seek').value = p;
  }, 300);
}
$('#play').onclick = ()=>{ if(audio.paused){ audio.play(); $('#play').textContent='⏸'; } else { audio.pause(); $('#play').textContent='►'; } };
$('#prev').onclick = ()=>{
  let idx = state.currentIdx>0 ? state.currentIdx-1 : (state.player.repeat==='all' ? state.queue.length-1 : 0);
  playTrackById(state.queue[idx]||DB.tracks[0].id);
};
$('#next').onclick = ()=>{
  if(state.now && audio.currentTime>=30)
    state.history.push({trackId:state.now.id,seconds:Math.floor(audio.currentTime), at:Date.now()});
  let nextIndex;
  if(state.player.repeat==='one'){ nextIndex = state.currentIdx; }
  else if(state.player.shuffle){ nextIndex = Math.floor(Math.random()*state.queue.length); }
  else { nextIndex = Math.min(state.queue.length-1,(state.currentIdx>=0?state.currentIdx+1:0)); }
  if(nextIndex===state.currentIdx && state.player.repeat!=='one'){
    if(state.player.repeat==='all') nextIndex = 0;
  }
  playTrackById(state.queue[nextIndex]||DB.tracks[0].id);
  saveAll();
};
$('#seek').oninput = ()=>{ if(audio.duration) audio.currentTime = (audio.duration*($('#seek').value/100)); };
audio.addEventListener('ended', ()=> $('#next').click());

// shuffle/repeat buttons
$('#shuffle').onclick = ()=>{
  state.player.shuffle = !state.player.shuffle;
  toast(state.player.shuffle?'Shuffle ON':'Shuffle OFF');
};
$('#repeat').onclick = ()=>{
  const order = ['off','one','all'];
  const i = order.indexOf(state.player.repeat);
  state.player.repeat = order[(i+1)%order.length];
  $('#repeat').textContent = 'Repeat: '+state.player.repeat;
  saveAll();
};

window.addEventListener('beforeunload', ()=>{
  if(state.now && audio.currentTime>=30) state.history.push({trackId:state.now.id,seconds:Math.floor(audio.currentTime), at:Date.now()});
  saveAll();
});

// Global actions
document.body.addEventListener('click', e=>{
  const play = e.target.closest('[data-play]');
  const add  = e.target.closest('[data-add]');
  const del  = e.target.closest('[data-del]');
  const open = e.target.closest('[data-openpl]');
  const like = e.target.closest('[data-like]');
  const share= e.target.closest('[data-share]');
  const delpl= e.target.closest('[data-delpl]');

  if(play){ playTrackById(play.dataset.play); }
  if(add){
    const id = add.dataset.add;
    const p = state.playlists.get(state.activePL) || [...state.playlists.values()][0];
    if(p.tracks.includes(id)) toast('Bài đã có trong playlist');
    else { p.tracks.push(id); toast('Đã thêm vào playlist'); renderPlaylist(); saveAll(); }
  }
  if(del){ const idx=+del.dataset.del; const p=state.playlists.get(state.activePL); p.tracks.splice(idx,1); renderPlaylist(); saveAll(); }
  if(open){ state.activePL=open.dataset.openpl; setView('playlist'); }
  if(like){
    const id = like.dataset.like;
    if(state.liked.has(id)){ state.liked.delete(id); like.classList.remove('liked'); toast('Đã bỏ like'); }
    else { state.liked.add(id); like.classList.add('liked'); toast('Đã like'); }
    saveAll();
  }
  if(share){
    const id=share.dataset.share; const p = state.playlists.get(id);
    p.public = !p.public; saveAll();
    const url = location.origin + location.pathname + `?playlist=${encodeURIComponent(id)}`;
    navigator.clipboard?.writeText(url);
    toast((p.public?'Public':'Private')+' — link đã copy');
    renderSidePlaylists();
  }
  if(delpl){
    const id=delpl.dataset.delpl;
    state.playlists.delete(id); saveAll(); renderSidePlaylists();
    toast('Đã xóa playlist');
  }
}, true);

// History view + stats
function renderHistory(){
  const box = $('#hist-list'); box.innerHTML='';
  const latest = [...state.history].reverse();
  const uniq = []; const seen = new Set();
  for(const h of latest){
    if(!seen.has(h.trackId)){ uniq.push(h); seen.add(h.trackId); }
    if(uniq.length>=10) break;
  }
  uniq.forEach(h=>{
    const t = DB.tracks.find(x=>x.id===h.trackId);
    if(!t) return;
    box.insertAdjacentHTML('beforeend', `<div class="row">
      <div class="meta"><img class="thumb" src="${t.cover}"><strong>${t.title}</strong></div>
      <div class="badge">${Math.round((Date.now()-h.at)/1000)}s trước</div>
    </div>`);
  });

  const day = aggregatePlays('day');
  const wk = aggregatePlays('week');
  box.insertAdjacentHTML('beforeend', `
    <div class="section"><h4>Thống kê theo ngày</h4>${day.map(([k,v])=>`<div class="row"><div class="meta"><strong>${k}</strong></div><div class="badge">${v}</div></div>`).join('')||'<div class="badge">Chưa có</div>'}</div>
    <div class="section"><h4>Thống kê theo tuần</h4>${wk.map(([k,v])=>`<div class="row"><div class="meta"><strong>${k}</strong></div><div class="badge">${v}</div></div>`).join('')||'<div class="badge">Chưa có</div>'}</div>
  `);
}
function aggregatePlays(by='day'){
  const grp = {};
  for(const h of state.history){
    const d = new Date(h.at);
    const key = by==='week'
      ? `${d.getFullYear()}-W${Math.ceil((d.getDate() + (new Date(d.getFullYear(),0,1).getDay()||7)-1)/7)}`
      : d.toISOString().slice(0,10);
    grp[key] = (grp[key]||0)+1;
  }
  return Object.entries(grp).sort((a,b)=>a[0].localeCompare(b[0]));
}

// Auth handlers
function renderAuth(){
  const as = $('#auth-status');
  if(state.auth?.userId) as.textContent = `Đã đăng nhập: ${state.auth.email} • plan: ${state.auth.plan}`;
  else as.textContent = 'Chưa đăng nhập';
}
$('#otp-send')?.addEventListener('click', ()=>{
  const email = $('#auth-email').value.trim();
  if(!email) return toast('Nhập email');
  const code = (''+Math.floor(100000+Math.random()*900000));
  const u = DB.users.find(x=>x.email===email);
  if(u) u.otp = code; else DB.users.push({id:'u'+(DB.users.length+1), email, passwordHash:null, otp:code, name:email.split('@')[0], plan:'free'});
  toast('OTP (mock): '+code+' (xem Console)'); console.log('OTP for', email, '=>', code);
});
$('#otp-login')?.addEventListener('click', ()=>{
  const email = $('#auth-email').value.trim();
  const code  = $('#auth-otp').value.trim();
  const u = DB.users.find(x=>x.email===email && x.otp===code);
  if(!u) return toast('OTP sai');
  state.auth = { userId:u.id, email:u.email, name:u.name, plan:u.plan };
  u.otp = null; saveAll(); renderAuth(); toast('Đăng nhập OTP OK');
});
$('#pw-register')?.addEventListener('click', ()=>{
  const email=$('#pw-email').value.trim(), pass=$('#pw-pass').value.trim();
  if(!email||!pass) return toast('Nhập email/pass');
  if(DB.users.some(u=>u.email===email)) return toast('Email đã tồn tại');
  DB.users.push({id:'u'+(DB.users.length+1), email, passwordHash:pass, otp:null, name:email.split('@')[0], plan:'free'});
  toast('Đăng ký xong');
});
$('#pw-login')?.addEventListener('click', ()=>{
  const email=$('#pw-email').value.trim(), pass=$('#pw-pass').value.trim();
  const u=DB.users.find(x=>x.email===email && x.passwordHash===pass);
  if(!u) return toast('Sai email/pass');
  state.auth={userId:u.id, email:u.email, name:u.name, plan:u.plan}; saveAll(); renderAuth(); toast('Login OK');
});
$('#sso-google')?.addEventListener('click', ()=>{
  state.auth = { userId:'sso1', email:'sso_user@gmail.com', name:'SSO User', plan:'free' };
  saveAll(); renderAuth(); toast('SSO (mock) thành công');
});
$('#auth-logout')?.addEventListener('click', ()=>{ state.auth = { userId:null, email:null, name:null, plan:'free' }; saveAll(); renderAuth(); toast('Đã logout'); });
$('#plan-free')?.addEventListener('click', ()=>{ if(!state.auth.userId) return toast('Đăng nhập đã'); state.auth.plan='free'; saveAll(); renderAuth(); });
$('#plan-pro')?.addEventListener('click', ()=>{ if(!state.auth.userId) return toast('Đăng nhập đã'); state.auth.plan='pro'; saveAll(); renderAuth(); });

// open shared playlist via URL query (?playlist=p1)
(function openShared(){
  const pid = new URLSearchParams(location.search).get('playlist');
  if(pid && state.playlists.has(pid)){ state.activePL=pid; setView('playlist'); }
})();

// follow & open album from search
document.body.addEventListener('click', e=>{
  const fAr = e.target.closest('[data-follow-artist]');
  const fAl = e.target.closest('[data-follow-album]');
  const openAl = e.target.closest('[data-open-album]');
  if(fAr){ const id=fAr.dataset.followArtist;
    if(state.followArtists.has(id)){ state.followArtists.delete(id); e.target.textContent='Follow'; }
    else { state.followArtists.add(id); e.target.textContent='Unfollow'; }
    saveAll();
  }
  if(fAl){ const id=fAl.dataset.followAlbum;
    if(state.followAlbums.has(id)){ state.followAlbums.delete(id); e.target.textContent='Follow'; }
    else { state.followAlbums.add(id); e.target.textContent='Unfollow'; }
    saveAll();
  }
  if(openAl){
    setView('album');
    const id=openAl.dataset.openAlbum;
    const tracks = DB.tracks.filter(t=>t.albumId===id);
    const box = $('#album-tracks'); box.innerHTML='';
    tracks.forEach(tr=> box.insertAdjacentHTML('beforeend', `<div class="row"><div class="meta"><img class="thumb" src="${tr.cover}"><strong>${tr.title}</strong></div><div><button class="btn" data-play="${tr.id}">Play</button></div></div>`));
  }
}, true);

$('#mini-play').onclick = ()=> $('#play').click();

// init
renderSidePlaylists();
renderHome();
setView('home');
