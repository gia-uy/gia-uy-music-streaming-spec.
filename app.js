
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const toast = (msg)=>{ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 1200); };
const DB = window.MUSIC_DATA;

const state = {
  view:'home',
  now:null, currentIdx:-1,
  queue: DB.tracks.map(t=>t.id),
  history:[],
  liked:new Set(),
  playlists:new Map(DB.playlists.map(p=>[p.id,{...p, tracks:[...p.tracks]}])),
  activePL:'p1',
  lastStart:0
};

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
}
$$('.tab').forEach(t=> t.onclick = ()=> setView(t.dataset.view));

const deburr = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

function renderSidePlaylists(){
  const box = $('#side-playlists'); box.innerHTML='';
  [...state.playlists.values()].forEach(p=>{
    const count = (p.tracks||[]).length;
    box.insertAdjacentHTML('beforeend', `<div class="row"><div class="meta"><span class="badge circle">${count} bài</span> <strong>${p.title}</strong></div><div><button class="btn" data-openpl="${p.id}">Open</button></div></div>`);
  });
}
$('#new-pl').onclick = ()=>{
  const id = 'p' + (state.playlists.size+1);
  state.playlists.set(id,{id,title:'New Playlist',owner:'me',tracks:[]});
  renderSidePlaylists();
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
  const rs = !k ? [] : DB.tracks.filter(t=> deburr(t.title+' '+(DB.artists.find(a=>a.id===t.artistId)?.name||'')).includes(k));
  const box = $('#result'); box.innerHTML = rs.length? '' : '';
  rs.forEach(tr=>{
    box.insertAdjacentHTML('beforeend', `<div class="row">
      <div class="meta"><img src="${tr.cover}" class="thumb"><strong>${tr.title}</strong><span class="tag">${DB.artists.find(a=>a.id===tr.artistId)?.name||''}</span></div>
      <div><button class="btn" data-play="${tr.id}">Play</button> <button class="heart ${state.liked.has(tr.id)?'liked':''}" data-like="${tr.id}">♥</button> <button class="btn" data-add="${tr.id}">+ Playlist</button></div>
    </div>`);
  });
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
      const arr = p.tracks; const [m] = arr.splice(from,1); arr.splice(to,0,m); renderPlaylist(); toast('Đã sắp xếp');
    };
  });
  $('#pl-clear').onclick = ()=>{ p.tracks.length=0; renderPlaylist(); };
}

function renderTrack(tr){
  if(!tr){ $('#track-detail').innerHTML='<div class="badge">Chưa chọn bài...</div>'; return; }
  const ar = DB.artists.find(a=>a.id===tr.artistId);
  $('#track-detail').innerHTML = `<div class="row">
    <div class="meta"><img class="thumb" src="${tr.cover}"><strong>${tr.title}</strong><span class="badge">${ar?.name||''}</span></div>
    <div><button class="btn" data-play="${tr.id}">Play</button> <button class="heart ${state.liked.has(tr.id)?'liked':''}" data-like="${tr.id}">♥</button></div>
  </div>
  <div class="badge">Album: ${(DB.albums.find(a=>a.id===tr.albumId)||{}).title||''} • ${Math.round(tr.duration/60)}m</div>`;
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
  const title = $('#adm-title').value.trim(), artist = $('#adm-artist').value.trim(), album = $('#adm-album').value.trim();
  if(!title||!artist||!album){ toast('Điền đủ Title/ArtistId/AlbumId'); return; }
  const id = 't'+(DB.tracks.length+1);
  DB.tracks.push({ id, albumId:album, artistId:artist, title, duration:160, audio:'assets/melody_sunny.wav', cover:(DB.albums.find(a=>a.id===album)||{}).cover||'' });
  toast('Đã thêm track (mock)'); renderAdmin();
};

// Album click -> show tracks
document.body.addEventListener('click', e=>{
  const card = e.target.closest('[data-album]');
  if(card){
    const id = card.dataset.album;
    const tracks = DB.tracks.filter(t=>t.albumId===id);
    const box = $('#album-tracks');
    box.innerHTML = tracks.map(tr => `<div class="row">
      <div class="meta"><img class="thumb" src="${tr.cover}"><strong>${tr.title}</strong><span class="tag">${DB.artists.find(a=>a.id===tr.artistId)?.name||''}</span></div>
      <div><button class="btn" data-play="${tr.id}">Play</button> <button class="heart ${state.liked.has(tr.id)?'liked':''}" data-like="${tr.id}">♥</button></div>
    </div>`).join('');
  }
}, true);

// PLAYER
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
  audio.play(); $('#play').textContent = '⏸'; state.lastStart = Date.now();
  renderTrack(tr);
  if(ticking) clearInterval(ticking);
  ticking = setInterval(()=>{
    const p = audio.duration ? Math.min(100, Math.round((audio.currentTime/audio.duration)*100)) : 0;
    $('#seek').value = p;
  }, 300);
}
$('#play').onclick = ()=>{ if(audio.paused){ audio.play(); $('#play').textContent='⏸'; } else { audio.pause(); $('#play').textContent='►'; } };
$('#prev').onclick = ()=>{ const i = Math.max(0,(state.currentIdx>0?state.currentIdx-1:0)); playTrackById(state.queue[i]||DB.tracks[0].id); };
$('#next').onclick = ()=>{
  if(state.now && audio.currentTime>=30) state.history.push({trackId:state.now.id,seconds:Math.floor(audio.currentTime)});
  const i = Math.min(state.queue.length-1,(state.currentIdx>=0?state.currentIdx+1:0));
  playTrackById(state.queue[i]||DB.tracks[0].id);
};
$('#seek').oninput = ()=>{ if(audio.duration) audio.currentTime = (audio.duration*($('#seek').value/100)); };
audio.addEventListener('ended', ()=> $('#next').click());
window.addEventListener('beforeunload', ()=>{ if(state.now && audio.currentTime>=30) state.history.push({trackId:state.now.id,seconds:Math.floor(audio.currentTime)}); });

// Global actions
document.body.addEventListener('click', e=>{
  const play = e.target.closest('[data-play]');
  const add  = e.target.closest('[data-add]');
  const del  = e.target.closest('[data-del]');
  const open = e.target.closest('[data-openpl]');
  const like = e.target.closest('[data-like]');
  if(play){ playTrackById(play.dataset.play); }
  if(add){
    const id = add.dataset.add;
    const p = state.playlists.get(state.activePL) || [...state.playlists.values()][0];
    if(p.tracks.includes(id)) toast('Bài đã có trong playlist');
    else { p.tracks.push(id); toast('Đã thêm vào playlist'); renderPlaylist(); }
  }
  if(del){ const idx=+del.dataset.del; const p=state.playlists.get(state.activePL); p.tracks.splice(idx,1); renderPlaylist(); }
  if(open){ state.activePL=open.dataset.openpl; setView('playlist'); }
  if(like){
    const id = like.dataset.like;
    if(state.liked.has(id)){ state.liked.delete(id); like.classList.remove('liked'); toast('Đã bỏ like'); }
    else { state.liked.add(id); like.classList.add('liked'); toast('Đã like'); }
  }
}, true);

$('#mini-play').onclick = ()=> $('#play').click();

// init
renderSidePlaylists();
renderHome();
setView('home');
