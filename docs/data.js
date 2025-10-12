window.MUSIC_DATA = {
  artists: [
    { id: 'BTS',  name: 'BTS',          country: 'KR', debut: 2013, avatar: 'assets/bts.jpg' },
    { id: 'Jungkook',  name: 'Jungkook',     country: 'KR', debut: 2016, avatar: 'assets/jungkook.jpg' },
    { id: 'Han Sara',  name: 'Han Sara', country: 'VN', debut: 2021, avatar: 'assets/hansara.jpg' },
    { id: 'Dương Domic',  name: 'Dương Domic',  country: 'VN', debut: 2013, avatar: 'assets/duongdomic.jpg' },
    { id: 'JustaTee',  name: 'JustaTee',  country: 'US', debut: 2011, avatar: 'assets/justatee.jpg' },
    { id: 'Phương Ly',  name: 'Phương Ly',    country: 'VN', debut: 2017, avatar: 'assets/phuongly.jpg' },
    { id: 'Shiki',  name: 'Shiki',      country: 'VN', debut: 2019, avatar: 'assets/shiki.jpg' },
    { id: 'V',  name: 'V',            country: 'KR', debut: 2013, avatar: 'assets/v.jpg' },
    { id: 'Da LAB',  name: 'Da LAB',       country: 'VN', debut: 2017, avatar: 'assets/dalab.jpg' },
    { id: 'Bùi Công Nam', name: 'Bùi Công Nam', country: 'VN', debut: 2022, avatar: 'assets/buicongnam.jpg' }
  ],
  albums: [
    { id: 'al1', artistId: 'Han Sara',  title: 'UnFrozen',    cover: 'assets/cover_1.jpg' },
    { id: 'al2', artistId: 'BTS',  title: 'Love Yourself: Answer',  cover: 'assets/cover_2.jpg' },
    { id: 'al3', artistId: 'Dương Domic',  title: 'Dopamine',  cover: 'assets/cover_4.jpg' },
    { id: 'al4', artistId: 'V',  title: 'Layout',               cover: 'assets/cover_5.jpg' },
    { id: 'al5', artistId: 'Jungkook',  title: 'Golden',            cover: 'assets/cover_8.jpg' }
  ],
  tracks: [
    { id:'t1',  albumId:'al2', artistId:'BTS',  title:'Dynamite',             duration:180, audio:'assets/dynamite.mp3',  cover:'assets/cover_2.jpg' },
    { id:'t12', albumId:'al3', artistId:'JustaTee',  title:'Phép Màu',            duration:170, audio:'assets/phepmau.mp3', cover:'assets/cover_4.jpg' },
    { id:'t17', albumId:'al2', artistId:'Da LAB',  title:'Bầu Trời Mới',       duration:169, audio:'assets/bautroimoi.mp3', cover:'assets/cover_2.jpg' },
    { id:'t10', albumId:'al5', artistId:'Jungkook',  title:'Soda Pop',         duration:182, audio:'assets/sodapop.mp3',  cover:'assets/cover_8.jpg' },
    { id:'t18', albumId:'al1', artistId:'Han Sara',  title:'Người Đầu Tiên',         duration:171, audio:'assets/nguoidautien.mp3', cover:'assets/cover_1.jpg' },
    { id:'t19', albumId:'al5', artistId:'Jungkook',  title:'Savage Love',            duration:181, audio:'assets/savagelove.mp3',  cover:'assets/cover_8.jpg' },
   
    { id:'t14', albumId:'al1', artistId:'JustaTee',  title:'2AM',           duration:177, audio:'assets/2am.mp3', cover:'assets/cover_1.jpg' },
    { id:'t6',  albumId:'al3', artistId:'Dương Domic',  title:'Không Thời Gian',      duration:190, audio:'assets/khongthoigian.mp3', cover:'assets/cover_4.jpg' },
    { id:'t15', albumId:'al4', artistId:'Shiki',  title:'Có Đôi Điều',        duration:166, audio:'assets/codoidieu.mp3', cover:'assets/cover_5.jpg' },
    { id:'t2',  albumId:'al2', artistId:'BTS',  title:'Butter',               duration:185, audio:'assets/butter.mp3', cover:'assets/cover_2.jpg' },
    { id:'t3',  albumId:'al2', artistId:'V',  title:'Boy With Luv',         duration:178, audio:'assets/boywithluv.mp3', cover:'assets/cover_2.jpg' },
    { id:'t4',  albumId:'al2', artistId:'V',  title:'IDOL',                 duration:176, audio:'assets/idol.mp3',  cover:'assets/cover_2.jpg' },
    { id:'t5',  albumId:'al4', artistId:'BTS',  title:'MIC Drop',             duration:200, audio:'assets/micdrop.mp3', cover:'assets/cover_5.jpg' },
    { id:'t7',  albumId:'al3', artistId:'Dương Domic',  title:'Mất Kết Nối',          duration:210, audio:'assets/matketnoi.mp3',  cover:'assets/cover_4.jpg' },
    { id:'t8',  albumId:'al1', artistId:'Phương Ly',  title:'Cứ Đổ Tại Cơn Mưa',    duration:160, audio:'assets/cudotaiconmua.mp3', cover:'assets/cover_1.jpg' },
    { id:'t9',  albumId:'al5', artistId:'BTS',  title:'Lights',               duration:175, audio:'assets/lights.mp3', cover:'assets/cover_8.jpg' },
    { id:'t11', albumId:'al1', artistId:'Han Sara',  title:'Có Khi Nào',  duration:199, audio:'assets/cokhinao.mp3', cover:'assets/cover_1.jpg' },
    { id:'t13', albumId:'al5', artistId:'Jungkook',  title:'Euphoria',             duration:168, audio:'euphoria.mp3',  cover:'assets/cover_8.jpg' },
    { id:'t16', albumId:'al4', artistId:'Han Sara',  title:'Winter Bear',         duration:173, audio:'assets/savagelove.mp3',  cover:'assets/cover_5.jpg' },
    { id:'t20', albumId:'al3', artistId:'Bùi Công Nam',  title:'Tiến Hay Lùi',           duration:172, audio:'assets/tienhaylui.mp3', cover:'assets/cover_4.jpg' }
  ],
  playlists: [
    { id:'p1', title:'My Mix', owner:'me', public:false, tracks:['t3','t6','t1'] },
    { id:'p2', title:'Chill Light',   owner:'me', public:false, tracks:['t10','t2'] },
    { id:'p3', title:'Morning Air',   owner:'me', public:false, tracks:['t7','t9'] },
    { id:'p4', title:'Soft Beats',    owner:'me', public:false, tracks:['t11','t12','t4'] },
    { id:'p5', title:'Gentle Focus',  owner:'me', public:false, tracks:['t14','t16'] }
  ],
  users: [
    { id:'u1', email:'demo@music.app', passwordHash:'demo', otp:null, name:'Demo User', plan:'free' }
  ],
  genres: [
    { id:'g1', name:'Pop' }, { id:'g2', name:'Indie' }, { id:'g3', name:'Ballad' }
  ],
  lyrics: {
    t1: "Cause I, I, I'm in the stars tonight...\n(lyrics demo)",
    t3: "Boy with luv... (lyrics demo)",
    t7: "Mất kết nối... (lyrics demo)"
  },
  related: {
    t1: ['t2','t3','t14'],
    t3: ['t9','t15','t20'],
    t7: ['t8','t12']
  }
};
