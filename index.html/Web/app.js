
/* Pastel Music – static prototype v2 */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const DB = window.MUSIC_DATA;

const state = {
  now: null, queue: [], liked: new Set(), history: [],
  playlist: new Set(DB.playlists.find(p=>p.id==='p1').tracks),
  currentIndex: -1,
};

const vnNormalize = str => (str||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
const fmt = s => s<10?`0${s}`:s;
const fmtDur = sec => `${fmt((sec/60)|0)}:${fmt(sec%60|0)}`;
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1500); }

function renderHome(){
  const home = $('#home-tracks'); home.innerHTML='';
  DB.tracks.slice(0,8).forEach(tr=>{
    const ar = DB.artists.find(a=>a.id===tr.artistId);
    home.insertAdjacentHTML('beforeend',`
      <div class="card">
        <img class="cover" src="${tr.cover||DB.albums.find(a=>a.id===tr.albumId)?.cover||''}" alt="">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
          <div class="badge">${fmtDur(tr.duration)}</div>
        </div>
        <h4 style="margin-top:6px">${tr.title}</h4>
        <div class="muted">${ar?.name||''}</div>
        <div style="display:flex;gap:8px;margin-top:6px">
          <button class="btn" data-play="${tr.id}">Play</button>
          <button class="btn" data-add="${tr.id}">+ Playlist</button>
        </div>
      </div>`);
  });
  $('#home-reco').innerHTML = DB.playlists.map(p=>`<div class="card"><h4>${p.title}</h4><div class="badge">${p.tracks.length} tracks</div></div>`).join('');
}

function renderSidebar(){
  const box = $('#sidebar-playlists');
  box.innerHTML = DB.playlists.map(p=>`<div class="row"><div class="meta"><strong>${p.title}</strong></div><button class="btn" data-open-pl="${p.id}">Open</button></div>`).join('');
}

function renderArtists(){
  const g = $('#artist-grid'); g.innerHTML='';
  DB.artists.forEach(a=>{
    g.insertAdjacentHTML('beforeend',`<div class="card"><img class="cover" src="${a.avatar||''}" alt=""><h4 style="margin-top:6px">${a.name}</h4><div class="badge">Debut ${a.debut}</div><div style="margin-top:6px"><button class="btn" data-follow="${a.id}">Follow</button></div></div>`);
  });
}

function renderAlbums(){
  const g = $('#album-grid'); g.innerHTML='';
  DB.albums.forEach(al=>{
    const ar = DB.artists.find(a=>a.id===al.artistId);
    g.insertAdjacentHTML('beforeend',`<div class="card"><img class="cover" src="${al.cover||''}" alt=""><h4 style="margin-top:6px">${al.title}</h4><div class="badge">${ar?.name||''}</div></div>`);
  });
}

function renderPlaylist(){
  const rows = $('#playlist-rows'); rows.innerHTML='';
  const ids = Array.from(state.playlist);
  ids.forEach((id, idx)=>{
    const tr = DB.tracks.find(t=>t.id===id);
    const ar = DB.artists.find(a=>a.id===tr.artistId);
    const cover = tr.cover || (DB.albums.find(a=>a.id===tr.albumId)||{}).cover || '';
    rows.insertAdjacentHTML('beforeend',`
      <div class="row drag" draggable="true" data-tr="${tr.id}" data-idx="${idx}">
        <div class="meta">
          <img class="thumb" src="${cover}">
          <strong>${tr.title}</strong><span class="badge">${ar?.name||''}</span>
        </div>
        <div>
          <button class="btn" data-play="${tr.id}">Play</button>
          <button class="btn" data-del="${tr.id}">Remove</button>
        </div>
      </div>`);
  });

  // Drag & drop
  let srcIdx = null;
  rows.querySelectorAll('.drag').forEach(el=>{
    el.addEventListener('dragstart', e=>{ srcIdx = +el.dataset.idx; e.dataTransfer.setData('text/plain', el.dataset.tr); });
    el.addEventListener('dragover', e=>e.preventDefault());
    el.addEventListener('drop', e=>{
      e.preventDefault();
      const dstIdx = +el.dataset.idx;
      const arr = Array.from(state.playlist);
      const [m] = arr.splice(srcIdx,1);
      arr.splice(dstIdx,0,m);
      state.playlist = new Set(arr);
      renderPlaylist();
    });
  });
}

function renderSearch(q){
  const resBox = $('#search-results');
  const key = vnNormalize(q);
  const results = DB.tracks.filter(t=> vnNormalize(t.title).includes(key) 
    || vnNormalize(DB.artists.find(a=>a.id===t.artistId)?.name||'').includes(key)
    || vnNormalize(DB.albums.find(a=>a.id===t.albumId)?.title||'').includes(key));
  resBox.innerHTML = results.map(tr=>{
    const ar = DB.artists.find(a=>a.id===tr.artistId);
    const cover = tr.cover || (DB.albums.find(a=>a.id===tr.albumId)||{}).cover || '';
    return `<div class="row"><div class="meta"><img class="thumb" src="${cover}"> <strong>${tr.title}</strong><span class="badge">${ar?.name||''}</span></div>
            <div><button class="btn" data-play="${tr.id}">Play</button>
            <button class="btn" data-add="${tr.id}">+ Playlist</button></div></div>`;
  }).join('') || `<div class="badge">Không tìm thấy</div>`;
}

// Player
const audio = $('#audio');
function playTrackById(id){
  const tr = DB.tracks.find(t=>t.id===id);
  if(!tr) return;
  state.now = tr; audio.src = tr.audio; audio.play();
  $('#now-title').textContent = `${tr.title} — ${DB.artists.find(a=>a.id===tr.artistId)?.name||''}`;
  $('#play').textContent = '⏸';
  const inAlbum = DB.tracks.filter(t=>t.albumId===tr.albumId);
  state.queue = inAlbum.map(x=>x.id);
  state.currentIndex = state.queue.indexOf(id);
}

$('#play').onclick = ()=>{
  if(audio.paused){ audio.play(); $('#play').textContent='⏸'; } 
  else { audio.pause(); $('#play').textContent='▶'; }
};
$('#prev').onclick = ()=> step(-1);
$('#next').onclick = ()=> { markHistoryIfOver30(); step(1); };

function step(dir){
  if(state.queue.length===0) return;
  state.currentIndex = (state.currentIndex + dir + state.queue.length) % state.queue.length;
  playTrackById(state.queue[state.currentIndex]);
}

audio.ontimeupdate = ()=>{
  if(audio.duration){
    $('#seek').value = (audio.currentTime/audio.duration*100)|0;
  }
};
$('#seek').oninput = e=>{
  if(audio.duration){
    audio.currentTime = audio.duration * (+e.target.value)/100;
  }
};
audio.onended = ()=> { markHistoryIfOver30(); step(1); };

function markHistoryIfOver30(){
  if(audio.currentTime>=30 && state.now){
    state.history.unshift({trackId: state.now.id, ts: Date.now()});
    state.history = state.history.slice(0,10);
    toast('Đã ghi lịch sử nghe (≥30s)');
  }
}

// Delegated events
document.body.addEventListener('click', e=>{
  const play = e.target.closest('[data-play]');
  const add = e.target.closest('[data-add]');
  const del = e.target.closest('[data-del]');
  const openPl = e.target.closest('[data-open-pl]');
  const follow = e.target.closest('[data-follow]');

  if(play){ playTrackById(play.dataset.play); }
  if(add){
    const id = add.dataset.add;
    if(state.playlist.has(id)) toast('Bài đã tồn tại trong playlist');
    else { state.playlist.add(id); toast('Đã thêm vào playlist'); renderPlaylist(); }
  }
  if(del){ state.playlist.delete(del.dataset.del); renderPlaylist(); }
  if(openPl){ setView('playlist'); }
  if(follow){ toast('Đã theo dõi nghệ sĩ'); }
});

// Tabs + Search
$$('.tab').forEach(t=> t.onclick = ()=> setView(t.dataset.view));
function setView(v){
  $$('.tab').forEach(t=> t.classList.toggle('active', t.dataset.view===v));
  ['home','search','playlist','artist','album'].forEach(id=> $('#view-'+id).classList.toggle('hide', id!==v));
  if(v==='playlist') renderPlaylist();
  if(v==='artist') renderArtists();
  if(v==='album') renderAlbums();
}
$('#search').addEventListener('input', e=>{ setView('search'); renderSearch(e.target.value.trim()); });

// initial
renderHome(); renderSidebar(); setView('home');
