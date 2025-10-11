window.MUSIC_DATA = {
  artists: [
    { id: 'ar1',  name: 'BTS',          country: 'KR', debut: 2013, avatar: 'assets/bts.jpg' },
    { id: 'ar2',  name: 'Jungkook',  country: 'KR', debut: 2020, avatar: 'assets/jungkook.jpg' },
    { id: 'ar3',  name: 'Han Sara',country: 'VN', debut: 2021, avatar: 'assets/hansara.jpg' },
    { id: 'ar4',  name: 'Dương Domic',         country: 'VN', debut: 2013, avatar: 'assets/duongdomic.jpg' },
    { id: 'ar5',  name: 'Shiki', country: 'VN', debut: 2024, avatar: 'assets/shiki.jpg' },
    { id: 'ar6',  name: 'Phương Ly',   country: 'VN', debut: 2020, avatar: 'assets/phuongly.jpg' },
    { id: 'ar7',  name: 'JustaTee',    country: 'VN', debut: 2019, avatar: 'assets/justatee.jpg' },
    { id: 'ar8',  name: 'V',      country: 'KR', debut: 2021, avatar: 'assets/v.jpg' },
    { id: 'ar9',  name: 'Da LAB',     country: 'VN', debut: 2018, avatar: 'assets/dalab.jpg' },
    { id: 'ar10', name: 'Bùi Công Nam',      country: 'VN', debut: 2022, avatar: 'assets/buicongnam.jpg' }
  ],
  albums: [
    { id: 'al1', artistId: 'ar1',  title: 'Map of the Soul: 7',   cover: 'assets/cover_1.jpg' },
    { id: 'al2', artistId: 'ar1',  title: 'Love Yourself: Answer', cover: 'assets/cover_2.jpg' },
    { id: 'al3', artistId: 'ar1',  title: ' Boy With Luv', cover: 'assets/cover_10.jpg' },
    { id: 'al4', artistId: 'ar2',  title: 'Dopamine',              cover: 'assets/cover_4.jpg' },
    { id: 'al5', artistId: 'ar2',  title: 'Mất Kết Nối',           cover: 'assets/cover_3.jpg' }
  ],
  tracks: [
    { id:'t1',  albumId:'al1', artistId:'ar1',  title:'Dynamite',             duration:180, audio:'assets/dynamite.mp3',  cover:'assets/cover_1.jpg' },
     { id:'t12', albumId:'al4', artistId:'ar2',  title:'Soda Pop',            duration:170, audio:'assets/sodapop.mp3', cover:'assets/cover_7.jpg' },
    { id:'t2',  albumId:'al1', artistId:'ar7',  title:'Phép Màu',               duration:185, audio:'assets/phepmau.mp3', cover:'assets/cover_5.jpg' },
    { id:'t3',  albumId:'al3', artistId:'ar7',  title:'2AM',         duration:178, audio:'assets/2am.mp3', cover:'assets/cover_10.jpg' },
    { id:'t4',  albumId:'al2', artistId:'ar5',  title:'Có Đôi Điều',                 duration:176, audio:'assets/codoidieu.mp3',  cover:'assets/cover_2.jpg' },
    { id:'t14', albumId:'al1', artistId:'ar9',  title:'Bầu Trời Mới',           duration:177, audio:'assets/bautroimoi.mp3', cover:'assets/cover_6.jpg' },
    { id:'t5',  albumId:'al2', artistId:'ar3',  title:'Người Đầu Tiên',             duration:200, audio:'assets/nguoidautien.mp3', cover:'assets/cover_9.jpg' },
     { id:'t8',  albumId:'al5', artistId:'ar6',  title:'Cứ đổ tại cơn mưa',          duration:160, audio:'assets/cudotaiconmua.mp3', cover:'assets/cover_3.jpg' },
    { id:'t6',  albumId:'al4', artistId:'ar4',  title:'Không Thời Gian',             duration:190, audio:'assets/khongthoigian.mp3', cover:'assets/cover_7.jpg' },
    { id:'t7',  albumId:'al5', artistId:'ar4',  title:'Mất Kết Nối',          duration:210, audio:'assets/matketnoi.mp3',  cover:'assets/cover_3.jpg' },
    { id:'t16', albumId:'al4', artistId:'ar2',  title:'Savage Love',         duration:173, audio:'assets/savagelove.mp3',  cover:'assets/cover_7.jpg' },
   
    { id:'t9',  albumId:'al3', artistId:'ar1',  title:'Lights',               duration:175, audio:'assets/light.mp3', cover:'assets/cover_10.jpg' },
    { id:'t10', albumId:'al1', artistId:'ar1',  title:'Life Goes On',         duration:182, audio:'assets/light.mp3',  cover:'assets/cover_3.jpg' },
    { id:'t11', albumId:'al1', artistId:'ar3',  title:'Có Khi Nào',  duration:199, audio:'assets/cokhinao.mp3', cover:'assets/cover_1.jpg' },
    { id:'t13', albumId:'al2', artistId:'ar2',  title:'Euphoria',             duration:168, audio:'assets/euphoria.mp3',  cover:'assets/cover_2.jpg' },
    { id:'t15', albumId:'al3', artistId:'ar10',  title:'Tiến Hay Lùi',        duration:166, audio:'assets/tienhaylui.mp3', cover:'assets/cover_10.jpg' },
    { id:'t17', albumId:'al2', artistId:'ar1',  title:'Micdrop',             duration:169, audio:'assets/micdrop.mp3', cover:'assets/cover_2.jpg' },
    { id:'t18', albumId:'al1', artistId:'ar1',  title:'Butter',                   duration:171, audio:'assets/butter.mp3', cover:'assets/cover_1.jpg' },
    { id:'t19', albumId:'al1', artistId:'ar1',  title:'IDOL',            duration:181, audio:'assets/idol.mp3',  cover:'assets/cover_1.jpg' },
    { id:'t20', albumId:'al3', artistId:'ar1',  title:'Boy With Luv',           duration:172, audio:'assets/boywithluv.mp3', cover:'assets/cover_10.jpg' }
  ],
  playlists: [
    { id:'p1', title:'My Mix', owner:'me', tracks:['t3','t6','t1'] },
    { id:'p2', title:'Chill Light',   owner:'me', tracks:['t10','t2'] },
    { id:'p3', title:'Morning Air',   owner:'me', tracks:['t7','t9'] },
    { id:'p4', title:'Soft Beats',    owner:'me', tracks:['t11','t12','t4'] },
    { id:'p5', title:'Gentle Focus',  owner:'me', tracks:['t14','t16'] }
  ]
};
