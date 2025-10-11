
window.MUSIC_DATA = {
  artists: [
    { id: 'ar1', name: 'BTS', country: 'KR', debut: 2013, avatar: 'assets/h123.jpg' },
    { id: 'ar2', name: 'Dương Domic', country: 'VN', debut: 2020, avatar: 'assets/duong_domic_dopamine.jpg' },
    { id: 'ar3', name: 'Cynthia Hiver', country: 'FR', debut: 2021, avatar: 'assets/cynthia_hiver.jpg' },
    { id: 'ar4', name: 'Ngọt', country: 'VN', debut: 2013, avatar: 'assets/ngot_logo.jpg' },
    { id: 'ar5', name: 'Pastel Beats', country: 'VN', debut: 2024, avatar: 'assets/abstract_marble.jpg' }
  ],
  albums: [
    { id: 'al1', artistId: 'ar1', title: 'Map of the Soul: 7', cover: 'assets/h123.jpg' },
    { id: 'al2', artistId: 'ar1', title: 'Love Yourself: Answer', cover: 'assets/bts_loveyourself.jpg' },
    { id: 'al3', artistId: 'ar1', title: 'Lights / Boy With Luv', cover: 'assets/bts_lights.jpg' },
    { id: 'al4', artistId: 'ar2', title: 'Dopamine', cover: 'assets/duong_domic_dopamine.jpg' },
    { id: 'al5', artistId: 'ar2', title: 'Mất Kết Nối', cover: 'assets/duong_domic_matketnoi.jpg' }
  ],
  tracks: [
    { id:'t1', albumId:'al1', artistId:'ar1', title:'Dynamite', duration:180, audio:'assets/tone_a.wav', cover:'assets/h123.jpg' },
    { id:'t2', albumId:'al1', artistId:'ar1', title:'Butter', duration:185, audio:'assets/tone_c.wav', cover:'assets/h123.jpg' },
    { id:'t3', albumId:'al3', artistId:'ar1', title:'Boy With Luv', duration:178, audio:'assets/tone_e.wav', cover:'assets/bts_lights.jpg' },
    { id:'t4', albumId:'al2', artistId:'ar1', title:'IDOL', duration:176, audio:'assets/tone_a.wav', cover:'assets/bts_loveyourself.jpg' },
    { id:'t5', albumId:'al2', artistId:'ar1', title:'MIC Drop', duration:200, audio:'assets/tone_c.wav', cover:'assets/bts_loveyourself.jpg' },
    { id:'t6', albumId:'al4', artistId:'ar2', title:'DOPAMINE', duration:190, audio:'assets/tone_e.wav', cover:'assets/duong_domic_dopamine.jpg' },
    { id:'t7', albumId:'al5', artistId:'ar2', title:'Mất Kết Nối', duration:210, audio:'assets/tone_a.wav', cover:'assets/duong_domic_matketnoi.jpg' },
    { id:'t8', albumId:'al5', artistId:'ar2', title:'Đừng Rời Xa', duration:160, audio:'assets/tone_c.wav', cover:'assets/duong_domic_matketnoi.jpg' },
    { id:'t9', albumId:'al3', artistId:'ar1', title:'Lights', duration:175, audio:'assets/tone_e.wav', cover:'assets/bts_lights.jpg' },
    { id:'t10', albumId:'al1', artistId:'ar1', title:'Life Goes On', duration:182, audio:'assets/tone_a.wav', cover:'assets/h123.jpg' },
    { id:'t11', albumId:'al1', artistId:'ar1', title:'Permission to Dance', duration:199, audio:'assets/tone_c.wav', cover:'assets/h123.jpg' },
    { id:'t12', albumId:'al4', artistId:'ar2', title:'Blue Mood', duration:170, audio:'assets/tone_e.wav', cover:'assets/duong_domic_dopamine.jpg' },
    { id:'t13', albumId:'al2', artistId:'ar1', title:'Euphoria', duration:168, audio:'assets/tone_a.wav', cover:'assets/bts_loveyourself.jpg' },
    { id:'t14', albumId:'al1', artistId:'ar1', title:'Black Swan', duration:177, audio:'assets/tone_c.wav', cover:'assets/h123.jpg' },
    { id:'t15', albumId:'al3', artistId:'ar1', title:'Make It Right', duration:166, audio:'assets/tone_e.wav', cover:'assets/bts_lights.jpg' },
    { id:'t16', albumId:'al4', artistId:'ar2', title:'Không Còn Em', duration:173, audio:'assets/tone_a.wav', cover:'assets/duong_domic_dopamine.jpg' },
    { id:'t17', albumId:'al2', artistId:'ar1', title:'Anpanman', duration:169, audio:'assets/tone_c.wav', cover:'assets/bts_loveyourself.jpg' },
    { id:'t18', albumId:'al1', artistId:'ar1', title:'ON', duration:171, audio:'assets/tone_e.wav', cover:'assets/h123.jpg' },
    { id:'t19', albumId:'al1', artistId:'ar1', title:'Fake Love', duration:181, audio:'assets/tone_a.wav', cover:'assets/h123.jpg' },
    { id:'t20', albumId:'al3', artistId:'ar1', title:'Spring Day', duration:172, audio:'assets/tone_c.wav', cover:'assets/bts_lights.jpg' }
  ],
  playlists: [
    { id:'p1', title:'My Pastel Mix', owner:'me', tracks:['t3','t6','t1'] },
    { id:'p2', title:'Chill Light', owner:'me', tracks:['t10','t2'] },
    { id:'p3', title:'Morning Air', owner:'me', tracks:['t7','t9'] },
    { id:'p4', title:'Soft Beats', owner:'me', tracks:['t11','t12','t4'] },
    { id:'p5', title:'Gentle Focus', owner:'me', tracks:['t14','t16'] }
  ]
};
