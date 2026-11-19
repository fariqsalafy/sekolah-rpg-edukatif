import * as THREE from 'three';
import { SCHOOL_ROOMS } from './schoolData.js';
import { buildCharacter } from './character.js';

const PROG_KEY = 'sekolahRpg.progres.v1';
const ROOM_CX = [-11, -5.5, 0, 5.5, 11];
const WALL_Y = 1.4;
const WALL_H = 2.8;
const DOOR_HALF = 1.5;

const CANTEEN_MENU = [
  { name: 'Risol', price: 2000, color: '#e0a44a' },
  { name: 'Donat', price: 3000, color: '#d98a9e' },
  { name: 'Roti Bakar', price: 3500, color: '#c98850' },
  { name: 'Susu Kotak', price: 4000, color: '#3f7fd9' },
  { name: 'Es Teh', price: 2500, color: '#2e9e5b' }
];

const SPORTS = [
  {
    id: 'sb', label: 'Sepak Bola', teacher: 'Pak Tono', color: '#2e9e5b',
    lesson: 'Sepak bola dimainkan dua tim di lapangan rumput. Setiap tim berisi 11 pemain, dan pertandingan berlangsung 2 x 45 menit.',
    quiz: [{ q: 'Jumlah pemain satu tim sepak bola di lapangan adalah...', o: ['10 pemain', '11 pemain', '12 pemain'], a: 1 }]
  },
  {
    id: 'vb', label: 'Voli', teacher: 'Pak Tono', color: '#3f7fd9',
    lesson: 'Voli dimainkan dua tim yang dipisahkan net. Bola dipantulkan dengan tangan melewati net agar jatuh di lapangan lawan.',
    quiz: [{ q: 'Satu tim voli di lapangan berjumlah...', o: ['5 pemain', '6 pemain', '7 pemain'], a: 1 }]
  },
  {
    id: 'bb', label: 'Basket', teacher: 'Pak Tono', color: '#d9822b',
    lesson: 'Basket dimainkan di dalam ruangan. Satu tim berisi 5 pemain, dan poin didapat saat bola berhasil masuk ke ring.',
    quiz: [{ q: 'Satu tim basket berjumlah...', o: ['4 pemain', '5 pemain', '6 pemain'], a: 1 }]
  },
  {
    id: 'bt', label: 'Bulu Tangkis', teacher: 'Pak Tono', color: '#8b5cf6',
    lesson: 'Bulu tangkis dimainkan tunggal atau ganda, memakai raket dan shuttlecock yang dipukul melewati net.',
    quiz: [{ q: 'Alat untuk memukul shuttlecock disebut...', o: ['Raket', 'Bola tangan', 'Sarung tangan'], a: 0 }]
  }
];

const FIELD_X0 = 16.8;
const FIELD_SX = 1.6;
const FIELD_SZ = 1.4;
const wx = x => FIELD_X0 + (x - FIELD_X0) * FIELD_SX;
const wz = z => z * FIELD_SZ;
const ww = v => v * FIELD_SX;
const wd = v => v * FIELD_SZ;

export const QUESTS = [
  { id: 'q1', xp: 15, giver: 'kantin', item: 'Paket jajanan', target: 'mtk', targetLabel: 'Pak Ahmad — Kelas Matematika' },
  { id: 'q2', xp: 15, giver: 'mtk', item: 'Spidol untuk Ibu Sari', target: 'ipa', targetLabel: 'Ibu Sari — Kelas IPA' },
  { id: 'q3', xp: 20, giver: 'ipa', item: 'Buku perpustakaan', target: 'bing', targetLabel: 'Pak Rizal — Kelas B. Inggris' },
  { id: 'q4', xp: 15, giver: 'pai', item: 'Pengingat shalat', target: 'mus', targetLabel: 'Mushola' },
  { id: 'q5', xp: 15, giver: 'bindo', item: 'Surat untuk Bu Kantin', target: 'kantin', targetLabel: 'Kantin — Bu Kantin' }
];

export const LIB = {
  id: 'lib', label: 'Perpustakaan', teacher: 'Bu Rina', color: '#b8863b',
  lesson: 'Membaca menambah ilmu dan melatih fokus. Di perpustakaan kita menjaga ketenangan dan merawat buku dengan baik.',
  quiz: [
    { q: 'Sikap yang benar di perpustakaan adalah...', o: ['Berbicara lantang', 'Menjaga ketenangan', 'Berlari-lari'], a: 1 },
    { q: 'Buku yang selesai dibaca sebaiknya...', o: ['Dibuang', 'Dikembalikan ke raknya', 'Disimpan di kantong'], a: 1 }
  ]
};

export const WUDHU_STEPS = [
  'Niat wudhu dalam hati',
  'Membasuh kedua tangan',
  'Berkumur-bumur (madmadhah)',
  'Membasuh wajah',
  'Membasuh kedua kaki'
];

export const TRASH_POS = [
  [-19.5, 2.2], [-18.2, -2.8], [-17.0, 1.1], [-13.2, 0.7], [-7.5, -1.2],
  [-2.4, 1.3], [3.3, -1.5], [9.2, 0.6], [13.9, -1.3], [-12.5, -10.2],
  [-6.9, -11.4], [21.0, -5.6]
];

export const STAR_POS = [
  [-19.5, 4.2], [-17, -12.5], [8.5, -12], [17.6, 5.5], [39.8, 2.8], [-9, 9.2]
];

export const HUNT_POS = [
  [-23.5, 10.5], [19.3, -7.8], [-31, 6.5], [-45.5, 6.8], [5.5, 12.5]
];

export const GARDEN_BEDS = [
  { x: -12, z: -10.5 }, { x: -9, z: -10.5 }, { x: -6, z: -10.5 }
];

export const LAB_LIQUIDS = {
  A: { name: 'Air Asam (A)', color: '#e5484d' },
  B: { name: 'Air Basa (B)', color: '#3f7fd9' },
  C: { name: 'Indikator (C)', color: '#8b5cf6' }
};

const EXTRA_DONE = ['lib', 'bball', 'fb', 'mus', 'kebun', 'lab', 'trash', 'stars', 'sbplay', 'vbplay', 'btplay', 'hunt'];

const TIPS = {
  mtk: ['Latihan perkalian 10 menit setiap hari membuat hitunganmu makin cepat.', 'Pecahan: 1/2 = 0,5 artinya separuh dari keseluruhan.', 'Pembagian adalah kebalikan dari perkalian.'],
  ipa: ['Daun yang hijau berarti klorofilnya aktif menangkap cahaya.', 'Tanaman butuh air, cahaya, dan udara untuk fotosintesis.', 'Ayo cek kebun sekolah, tanaman juga butuh perawatan!'],
  bindo: ['Bacalah buku 15 menit setiap hari untuk memperkaya kosakata.', 'Kalimat efektif dimulai dengan subjek di awal.', 'Tulis cerita harianmu, kemampuan menimu akan berkembang.'],
  bing: ['Sapa guru dengan "Good morning" saat pagi hari.', '"Excuse me" dipakai saat ingin menegur dengan sopan.', 'Coba hitung benda di sekitarmu dalam bahasa Inggris.'],
  pai: ['Shalat lima waktu membuat hati tetap tenang.', 'Mulai setiap kegiatan baik dengan bismillah.', 'Ingatkan keluargamu untuk shalat berjamaah.']
};

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.9,
    metalness: 0,
    ...opts
  });
}

function mesh(geo, material, opts = {}) {
  const m = new THREE.Mesh(geo, material);
  m.castShadow = true;
  Object.assign(m, opts);
  return m;
}

function box(w, h, d, material) {
  return mesh(new THREE.BoxGeometry(w, h, d), material);
}

function place(m, x, y, z, rot = null) {
  m.position.set(x, y, z);
  if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
  return m;
}

function lerpAngle(a, b, t) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

let audioCtx = null;
let soundOn = true;
try {
  soundOn = localStorage.getItem('sekolahRpg.sfx') !== '0';
} catch (e) {}

function tone(freq, dur, delay = 0, type = 'square', vol = 0.06) {
  if (!soundOn || !audioCtx) return;
  try {
    const t0 = audioCtx.currentTime + delay;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  } catch (e) {}
}

function ensureAudio() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    return;
  }
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return;
  try {
    audioCtx = new C();
  } catch (e) {}
}

const sfx = {
  correct() {
    tone(660, 0.1);
    tone(880, 0.16, 0.09);
  },
  wrong() {
    tone(190, 0.14, 0, 'sawtooth', 0.05);
    tone(150, 0.2, 0.12, 'sawtooth', 0.05);
  },
  pick() {
    tone(520, 0.07, 0, 'triangle', 0.08);
    tone(780, 0.1, 0.06, 'triangle', 0.08);
  },
  quest() {
    tone(523, 0.1);
    tone(659, 0.1, 0.1);
    tone(784, 0.22, 0.2);
  },
  coin() {
    tone(988, 0.06, 0, 'triangle', 0.07);
    tone(1319, 0.12, 0.05, 'triangle', 0.07);
  }
};

const buzz = ms => {
  if (navigator.vibrate) navigator.vibrate(ms);
};

function fmt(n) {
  return 'Rp' + n.toLocaleString('id-ID');
}

function loadProgress() {
  try {
    const p = JSON.parse(localStorage.getItem(PROG_KEY) || '{}');
    return {
      xp: p.xp || 0,
      done: p.done || {},
      notified: !!p.notified,
      uang: typeof p.uang === 'number' ? p.uang : 10000,
      rank: p.rank || 0,
      trash: Array.isArray(p.trash) ? p.trash : [],
      kebun: Array.isArray(p.kebun) ? p.kebun : [],
      lab: p.lab && typeof p.lab === 'object' ? p.lab : {},
      quests: p.quests && typeof p.quests === 'object' ? p.quests : {},
      stars: Array.isArray(p.stars) ? p.stars : [],
      hunt: Array.isArray(p.hunt) ? p.hunt : [],
      playMs: p.playMs || 0,
      carry: p.carry && typeof p.carry === 'object' ? p.carry : null
    };
  } catch (e) {
    return { xp: 0, done: {}, notified: false, uang: 10000, rank: 0, trash: [], kebun: [], lab: {}, quests: {}, stars: [], hunt: [], playMs: 0, carry: null };
  }
}

function saveProgress(p) {
  try {
    localStorage.setItem(PROG_KEY, JSON.stringify(p));
  } catch (e) {}
}

function textCanvas(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'));
  return c;
}

function drawSignCanvas(title, sub, color, done) {
  return textCanvas(512, 160, ctx => {
    ctx.fillStyle = done ? '#2e7d4f' : color;
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 140, 26);
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '800 52px system-ui, sans-serif';
    ctx.fillText(title, 256, 70);
    ctx.font = '600 32px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(sub, 256, 124);
  });
}

function makeSprite(title, sub, color, scale, pos) {
  const tex = new THREE.CanvasTexture(drawSignCanvas(title, sub, color, false));
  const m = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const s = new THREE.Sprite(m);
  s.scale.set(scale[0], scale[1], 1);
  s.position.set(pos[0], pos[1], pos[2]);
  return s;
}

function nameTag(text, color) {
  const cv = textCanvas(256, 64, ctx => {
    ctx.fillStyle = 'rgba(16,18,20,0.78)';
    ctx.beginPath();
    ctx.roundRect(8, 10, 240, 44, 12);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '700 26px system-ui, sans-serif';
    ctx.fillText(text, 128, 41);
  });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthTest: false }));
  s.scale.set(1.7, 0.42, 1);
  s.renderOrder = 5;
  return s;
}

function lessonCanvas(ent) {
  return textCanvas(512, 256, ctx => {
    ctx.fillStyle = '#f4f4f2';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = ent.color;
    ctx.fillRect(0, 0, 512, 56);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 30px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(ent.label, 18, 38);
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(ent.teacher, 494, 38);
    ctx.fillStyle = '#232527';
    ctx.font = '500 24px system-ui, sans-serif';
    ctx.textAlign = 'left';
    let line = '';
    let y = 100;
    for (const w of ent.lesson.split(' ')) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > 470) {
        ctx.fillText(line, 24, y);
        y += 32;
        line = w;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, 24, y);
  });
}

function buildTeacher(room) {
  const g = new THREE.Group();
  const M = {
    skin: mat(room.skin),
    shirt: mat(room.color),
    pants: mat('#2b2b30'),
    eye: mat('#241c18', { roughness: 0.35 }),
    white: mat('#ffffff', { roughness: 0.3 }),
    hair: mat('#161311'),
    hijab: mat(room.hijab || '#1b1b22'),
    peci: mat('#141414'),
    shoe: mat('#2b2b30')
  };
  for (const s of [-1, 1]) {
    g.add(place(box(0.24, 0.5, 0.26, M.pants), s * 0.17, 0.25, 0));
    g.add(place(box(0.28, 0.12, 0.42, M.shoe), s * 0.17, 0.06, 0.06));
    g.add(place(box(0.2, 0.46, 0.2, M.skin), s * 0.47, 0.76, 0));
    g.add(place(box(0.24, 0.3, 0.24, M.shirt), s * 0.47, 0.85, 0));
  }
  g.add(place(box(0.72, 0.52, 0.42, M.shirt), 0, 0.75, 0));
  const head = place(box(0.92, 0.8, 0.82, M.skin), 0, 1.29, 0);
  for (const s of [-1, 1]) {
    head.add(place(box(0.1, 0.17, 0.03, M.eye), s * 0.2, 0.02, 0.425));
    head.add(place(box(0.035, 0.05, 0.012, M.white), s * 0.163, 0.075, 0.444));
  }
  head.add(place(mesh(new THREE.TorusGeometry(0.11, 0.022, 12, 28, Math.PI), M.eye), 0, -0.16, 0.435, [0, 0, Math.PI]));
  if (room.gender === 'putri') {
    head.add(place(box(1.16, 0.28, 1.02, M.hijab), 0, 0.38, 0));
    head.add(place(box(1.06, 0.62, 0.16, M.hijab), 0, 0, -0.47));
    head.add(place(box(0.16, 0.6, 0.86, M.hijab), 0.5, 0, -0.03));
    head.add(place(box(0.16, 0.6, 0.86, M.hijab), -0.5, 0, -0.03));
  } else {
    head.add(place(box(0.98, 0.3, 0.92, M.hair), 0, 0.37, 0));
    if (room.peci) head.add(place(box(0.98, 0.14, 0.88, M.peci), 0, 0.44, 0));
  }
  g.add(head);
  return g;
}

export function createGame({ canvas, renderer, characterConfig, toast, onEdit, onLogout }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#202326');
  scene.fog = new THREE.Fog('#202326', 36, 70);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);

  const hemi = new THREE.HemisphereLight('#ffffff', '#43474d', 0.75);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight('#ffffff', 0.85);
  dir.position.set(10, 14, 6);
  dir.castShadow = true;
  dir.shadow.mapSize.set(1024, 1024);
  dir.shadow.camera.left = -30;
  dir.shadow.camera.right = 45;
  dir.shadow.camera.top = 20;
  dir.shadow.camera.bottom = -20;
  dir.shadow.camera.near = 0.5;
  dir.shadow.camera.far = 60;
  scene.add(dir);

  const SKY = {
    night: new THREE.Color('#12151d'),
    dusk: new THREE.Color('#e8935f'),
    day: new THREE.Color('#a8d4ff'),
    sunLow: new THREE.Color('#ffb37a'),
    sunDay: new THREE.Color('#ffffff'),
    moon: new THREE.Color('#8899cc')
  };
  const sun = place(mesh(new THREE.SphereGeometry(2.6, 16, 12), new THREE.MeshBasicMaterial({ color: '#ffd75e', fog: false })), 12, 55, -30);
  scene.add(sun);
  const moon = place(mesh(new THREE.SphereGeometry(1.9, 16, 12), new THREE.MeshBasicMaterial({ color: '#dfe6ff', fog: false })), -58, 55, -30);
  scene.add(moon);

  const wallMat = mat('#565b61');
  const floorMat = mat('#43484e', { roughness: 1 });
  const frameMat = mat('#37474f');
  const boardMat = mat('#f4f4f2');
  const deskMat = mat('#8a5a2b');
  const whiteMat = mat('#e8e8e8');
  const baseMat = mat('#3f444a');
  const trimMat = mat('#c9a86a', { roughness: 0.5 });
  const panelMat = mat('#61676e');
  const darkMat = mat('#2b2f34');

  const colliders = [];
  const addSolid = (w, h, d, x, y, z, material, collide = true, cast = false) => {
    const m = box(w, h, d, material);
    place(m, x, y, z);
    m.castShadow = cast;
    m.receiveShadow = true;
    scene.add(m);
    if (collide) colliders.push({ x1: x - w / 2, x2: x + w / 2, z1: z - d / 2, z2: z + d / 2 });
    return m;
  };
  const addCollider = (x1, x2, z1, z2) => colliders.push({ x1, x2, z1, z2 });

  const decorate = (cx, cz, len, axis) => {
    const horiz = axis === 'x';
    const bw = horiz ? len : 0.38;
    const bd = horiz ? 0.38 : len;
    const pw = horiz ? 1.1 : 0.34;
    const pd = horiz ? 0.34 : 1.1;
    scene.add(place(box(bw, 0.5, bd, baseMat), horiz ? cx : cx, 0.25, cz));
    scene.add(place(box(bw, 0.06, bd, trimMat), cx, 0.56, cz));
    const n = Math.floor(len / 2.4);
    for (let i = 0; i < n; i++) {
      const off = -len / 2 + 1.2 + i * 2.4;
      const px = horiz ? cx + off : cx;
      const pz = horiz ? cz : cz + off;
      scene.add(place(box(pw, 1.7, pd, panelMat), px, 1.45, pz));
    }
  };

  const floor = mesh(new THREE.PlaneGeometry(33, 11.6), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -3.1);
  floor.receiveShadow = true;
  scene.add(floor);

  const plaza = mesh(new THREE.PlaneGeometry(6.8, 9.6), floorMat);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(-19.5, 0, 0);
  plaza.receiveShadow = true;
  scene.add(plaza);

  addSolid(7, WALL_H, 0.3, -13, WALL_Y, 2.15, wallMat);
  addSolid(5.5, WALL_H, 0.3, -3.75, WALL_Y, 2.15, wallMat);
  addSolid(8, WALL_H, 0.3, 6, WALL_Y, 2.15, wallMat);
  addSolid(3.5, WALL_H, 0.3, 14.75, WALL_Y, 2.15, wallMat);
  addSolid(17.5, WALL_H, 0.3, -7.75, WALL_Y, -8.15, wallMat);
  addSolid(12.5, WALL_H, 0.3, 10.25, WALL_Y, -8.15, wallMat);
  for (const bx of [-13.75, -8.25, -2.75, 2.75, 8.25, 13.75]) {
    addSolid(0.3, WALL_H, 6.15, bx, WALL_Y, -5.05, wallMat);
  }
  for (const cx of ROOM_CX) {
    addSolid(1.25, WALL_H, 0.3, cx - 2.125, WALL_Y, -2.15, wallMat);
    addSolid(1.25, WALL_H, 0.3, cx + 2.125, WALL_Y, -2.15, wallMat);
  }

  addSolid(0.3, WALL_H, 6.7, -16.15, WALL_Y, -4.95, wallMat);
  addSolid(0.3, WALL_H, 0.7, -16.15, WALL_Y, 1.95, wallMat);
  addSolid(0.3, WALL_H, 6.8, 16.15, WALL_Y, -4.9, wallMat);
  addSolid(0.3, WALL_H, 0.8, 16.15, WALL_Y, 1.9, wallMat);
  addSolid(0.3, WALL_H, 6.0, 16.15, WALL_Y, 5.3, wallMat);

  addSolid(0.3, WALL_H, 6.0, 6.15, WALL_Y, 5.3, wallMat);
  addSolid(10.3, WALL_H, 0.3, 11.15, WALL_Y, 8.15, wallMat);

  addSolid(0.5, 3.0, 0.5, -16.15, 1.5, 1.9, panelMat, true, true);
  addSolid(0.5, 3.0, 0.5, -16.15, 1.5, -1.9, panelMat, true, true);
  addSolid(0.6, 0.3, 4.4, -16.15, 3.0, 0, darkMat, false, true);
  addSolid(0.3, 0.5, 3.6, -16.15, 2.65, 0, trimMat, false);
  const leafW = 1.45;
  for (const s of [-1, 1]) {
    const leaf = box(leafW, 2.3, 0.07, mat('#6b4a2f'));
    place(leaf, -16.15, 1.15, s * 1.55, [0, s * 1.2, 0]);
    scene.add(leaf);
  }
  scene.add(makeSprite('SMP ABBS SURAKARTA', 'Pintu Masuk', '#00a2ff', [4.2, 1.15], [-16.4, 3.75, 0]));

  addSolid(0.4, 3.0, 0.4, 16.15, 1.5, 1.75, panelMat, true, true);
  addSolid(0.4, 3.0, 0.4, 16.15, 1.5, -1.75, panelMat, true, true);
  addSolid(0.36, 0.4, 3.9, 16.15, 2.6, 0, trimMat, false);
  const leafE = box(1.4, 2.2, 0.07, mat('#6b4a2f'));
  place(leafE, 16.15, 1.1, 2.0, [0, 1.2, 0]);
  scene.add(leafE);
  scene.add(makeSprite('LAPANGAN OLAHRAGA', 'Aktivitas PJOK', '#2e9e5b', [2.9, 0.95], [17.5, 3.4, 0]));

  addSolid(3.0, 0.5, 0.3, 11.5, 2.65, 2.15, mat('#c96f2e'), false);
  const leafC = box(2.6, 2.2, 0.07, mat('#6b4a2f'));
  place(leafC, 10.1, 1.1, 2.5, [0, 1.3, 0]);
  scene.add(leafC);

  decorate(-13, 2.15, 7, 'x');
  decorate(-3.75, 2.15, 5.5, 'x');
  decorate(6, 2.15, 8, 'x');
  decorate(14.75, 2.15, 3.5, 'x');
  decorate(-7.75, -8.15, 17.5, 'x');
  decorate(10.25, -8.15, 12.5, 'x');
  for (const bx of [-13.75, -8.25, -2.75, 2.75, 8.25, 13.75]) decorate(bx, -5.05, 6.15, 'z');
  decorate(-16.15, -4.95, 6.7, 'z');
  decorate(16.15, -4.9, 6.8, 'z');
  decorate(16.15, 5.3, 6.0, 'z');
  decorate(6.15, 5.3, 6.0, 'z');
  decorate(11.15, 8.15, 10.3, 'x');

  const canteenFloor = mesh(new THREE.PlaneGeometry(10.3, 6.0), mat('#4d4438', { roughness: 1 }));
  canteenFloor.rotation.x = -Math.PI / 2;
  canteenFloor.position.set(11.15, 0.01, 5.3);
  canteenFloor.receiveShadow = true;
  scene.add(canteenFloor);

  const counter = addSolid(6.4, 1.0, 0.8, 10.2, 0.5, 3.3, mat('#7a5a35'), true, true);
  addSolid(6.6, 0.06, 1.0, 10.2, 1.03, 3.3, trimMat, false);
  CANTEEN_MENU.forEach((item, i) => {
    const snack = box(0.45, 0.45, 0.45, mat(item.color));
    place(snack, 7.9 + i * 1.15, 1.28, 3.3);
    scene.add(snack);
  });

  const tableMat = mat('#9a6b3d');
  for (const tx of [8.5, 13.0]) {
    addSolid(1.6, 0.75, 1.6, tx, 0.4, 6.5, tableMat, true, true);
    for (const [sx, sz] of [[-1.2, 0], [1.2, 0], [0, -1.2], [0, 1.2]]) {
      scene.add(place(box(0.42, 0.4, 0.42, darkMat), tx + sx, 0.2, 6.5 + sz));
    }
  }

  scene.add(makeSprite('KANTIN SEHAT', 'Aritmetika Sosial', '#c96f2e', [2.7, 0.95], [10.2, 2.7, 3.3]));
  const menuCv = textCanvas(448, 336, ctx => {
    ctx.fillStyle = '#232527';
    ctx.beginPath();
    ctx.roundRect(6, 6, 436, 324, 22);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#c96f2e';
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '800 40px system-ui, sans-serif';
    ctx.fillText('DAFTAR HARGA', 224, 52);
    ctx.textAlign = 'left';
    ctx.font = '600 30px system-ui, sans-serif';
    CANTEEN_MENU.forEach((item, i) => {
      const y = 104 + i * 44;
      ctx.fillStyle = item.color;
      ctx.fillRect(40, y - 16, 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.name, 74, y);
      ctx.textAlign = 'right';
      ctx.fillText(fmt(item.price), 408, y);
      ctx.textAlign = 'left';
    });
  });
  const menuTex = new THREE.CanvasTexture(menuCv);
  const menuSign = new THREE.Sprite(new THREE.SpriteMaterial({ map: menuTex, transparent: true }));
  menuSign.scale.set(2.4, 1.8, 1);
  menuSign.position.set(14.2, 2.35, 4.4);
  scene.add(menuSign);

  const buKantin = buildTeacher({ gender: 'putri', color: '#c96f2e', skin: '#b97f52', hijab: '#5b3a72' });
  buKantin.position.set(10.2, 0, 4.35);
  buKantin.rotation.y = Math.PI;
  buKantin.userData.rot0 = Math.PI;
  buKantin.add(nameTag('Bu Kantin', '#c96f2e'));
  buKantin.children[buKantin.children.length - 1].position.y = 2.25;
  scene.add(buKantin);
  addCollider(9.7, 10.7, 3.9, 4.8);

  const field = mesh(new THREE.PlaneGeometry(ww(24.6), wd(17.6)), mat('#3a7d44', { roughness: 1 }));
  field.rotation.x = -Math.PI / 2;
  field.position.set(wx(29.1), 0, 0);
  field.receiveShadow = true;
  scene.add(field);

  const patch = (w, d, x, z, color) => {
    const p = mesh(new THREE.PlaneGeometry(w, d), mat(color, { roughness: 1 }));
    p.rotation.x = -Math.PI / 2;
    p.position.set(x, 0.02, z);
    p.receiveShadow = true;
    scene.add(p);
  };
  patch(ww(5), wd(7.6), wx(31.5), wz(0), '#4a5a7a');
  patch(ww(4.6), wd(4.4), wx(37.3), wz(-1.2), '#6b4a2f');
  patch(ww(5), wd(3.6), wx(31.5), wz(6.4), '#2e6b4f');

  for (const gx of [19.6, 27.2]) {
    for (const s of [-1, 1]) scene.add(place(box(0.12, 1.2, 0.12, whiteMat), wx(gx), 0.6, wz(s * 1.5)));
    scene.add(place(box(0.12, 0.12, wd(3.12), whiteMat), wx(gx), 1.2, 0));
  }
  scene.add(place(mesh(new THREE.SphereGeometry(0.22, 14, 12), whiteMat), wx(23.4), 0.22, 0));
  const footBall = scene.children[scene.children.length - 1];
  footBall.userData.home = footBall.position.clone();

  for (const s of [-1, 1]) scene.add(place(box(0.12, 2.2, 0.12, whiteMat), wx(31.5), 1.1, wz(s * 2.1)));
  scene.add(place(box(0.05, 1.0, wd(4.2), mat('#ffffff', { transparent: true, opacity: 0.4 })), wx(31.5), 1.55, 0));
  const volleyBall = place(mesh(new THREE.SphereGeometry(0.2, 14, 12), mat('#3f7fd9')), wx(30.2), 0.2, wz(1.0));
  scene.add(volleyBall);
  volleyBall.userData.home = volleyBall.position.clone();

  scene.add(place(box(0.16, 2.9, 0.16, darkMat), wx(39.6), 1.45, wz(-1.2)));
  scene.add(place(box(0.08, 1.0, wd(1.6), boardMat), wx(39.42), 2.55, wz(-1.2)));
  scene.add(place(mesh(new THREE.TorusGeometry(0.3, 0.035, 10, 20), mat('#d9731f')), wx(39.2), 2.1, wz(-1.2), [Math.PI / 2, 0, 0]));
  scene.add(place(mesh(new THREE.SphereGeometry(0.19, 14, 12), mat('#d9731f')), wx(38.9), 0.19, wz(-0.4)));
  const basketBall = scene.children[scene.children.length - 1];
  basketBall.userData.home = basketBall.position.clone();

  for (const s of [-1, 1]) scene.add(place(box(0.1, 1.5, 0.1, whiteMat), wx(31.5) + s * ww(2.3), 0.75, wz(6.4)));
  scene.add(place(box(ww(4.6), 0.7, 0.04, mat('#ffffff', { transparent: true, opacity: 0.4 })), wx(31.5), 1.05, wz(6.4)));
  const shuttle = place(mesh(new THREE.ConeGeometry(0.09, 0.16, 10), whiteMat), wx(30.6), 0.1, wz(5.8));
  scene.add(shuttle);
  shuttle.userData.home = shuttle.position.clone();

  const fenceXs = [17.3, 21.8, 26.3, 30.8, 35.3, 39.8].map(wx);
  for (const sz of [8.8, -8.8]) {
    const zz = wz(sz);
    for (const ry of [0.45, 0.8]) scene.add(place(box(ww(23.9), 0.07, 0.07, whiteMat), wx(29.1), ry, zz));
    for (const fxp of [...fenceXs, wx(40.9)]) scene.add(place(box(0.12, 0.85, 0.12, whiteMat), fxp, 0.42, zz));
  }
  for (const ry of [0.45, 0.8]) scene.add(place(box(0.07, 0.07, wd(17.6), whiteMat), wx(40.9), ry, 0));
  scene.add(place(box(0.12, 0.85, 0.12, whiteMat), wx(40.9), 0.42, 0));
  addCollider(wx(16.9), wx(41.3), wz(8.7), wz(8.95));
  addCollider(wx(16.9), wx(41.3), wz(-8.95), wz(-8.7));
  addCollider(wx(40.75), wx(41.05), wz(-8.95), wz(8.95));

  scene.add(place(box(0.08, 3.2, 0.08, panelMat), -18.5, 1.6, -3));
  scene.add(place(box(0.9, 0.24, 0.04, mat('#d43b3b')), -18.06, 2.95, -3));
  scene.add(place(box(0.9, 0.24, 0.04, mat('#f4f4f2')), -18.06, 2.71, -3));

  const ground = mesh(new THREE.PlaneGeometry(300, 300), mat('#4b7f46', { roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(12, -0.02, -3);
  ground.receiveShadow = true;
  scene.add(ground);

  const tree = (x, z, s = 1) => {
    const g = new THREE.Group();
    g.add(place(box(0.34 * s, 1.7 * s, 0.34 * s, mat('#6b4a2f')), 0, 0.85 * s, 0));
    g.add(place(box(1.7 * s, 1.3 * s, 1.7 * s, mat('#2e6b3f')), 0, 2.2 * s, 0));
    g.add(place(box(1.1 * s, 0.9 * s, 1.1 * s, mat('#3fae5f')), 0, 3.1 * s, 0));
    g.position.set(x, 0, z);
    scene.add(g);
    addCollider(x - 0.25 * s, x + 0.25 * s, z - 0.25 * s, z + 0.25 * s);
  };
  tree(-21.3, -4.6);
  tree(-21.3, 4.6);
  tree(-15.2, -12.2);
  tree(-3.4, -13.0);
  tree(14.0, -13.5, 0.85);
  tree(60.5, 6.9, 0.9);
  for (const [tx, tz, ts] of [[-27, -9, 1.1], [-28, 11], [-29, -13], [-14, -19], [2, -19.5], [16, -18], [26, -16], [36, -16], [46, -14], [62, -2], [47, 17], [34, 14], [18, 14], [-6, 16], [-20, 16], [62, 4, 1.15], [62, -10], [-34, 12, 1.1], [-36, -6], [44, 20]]) tree(tx, tz, ts || 1);
  for (const [rx, rz] of [[-26, -7], [-24, 8], [10, 16], [30, 18], [62, -8], [62, 8], [-32, -16], [40, -19]]) {
    scene.add(place(box(0.8, 0.5, 0.7, mat('#7a7f85')), rx, 0.25, rz, [0, rx, 0]));
    addCollider(rx - 0.4, rx + 0.4, rz - 0.35, rz + 0.35);
  }

  const parkFloor = mesh(new THREE.PlaneGeometry(28, 22), mat('#4f8a4a', { roughness: 1 }));
  parkFloor.rotation.x = -Math.PI / 2;
  parkFloor.position.set(-38, 0.015, 0);
  parkFloor.receiveShadow = true;
  scene.add(parkFloor);

  for (let i = 0; i < 12; i++) {
    scene.add(place(box(1.5, 0.05, 1.5, mat('#8d8f92', { roughness: 1 })), -22.5 - i * 2.4, 0.03, 0));
  }

  const pond = mesh(new THREE.CircleGeometry(3.2, 28), new THREE.MeshStandardMaterial({ color: '#2f7fa8', roughness: 0.2, metalness: 0.15 }));
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(-40, 0.05, 6.5);
  scene.add(pond);
  for (let i = 0; i < 24; i++) {
    const a = i / 24 * Math.PI * 2;
    scene.add(place(box(0.16, 0.32, 0.16, mat(['#e5484d', '#ffd35c', '#c084fc'][i % 3])), -40 + Math.cos(a) * 4.1, 0.16, 6.5 + Math.sin(a) * 4.1));
  }

  for (const [bx, bz] of [[-34, -3.2], [-42, -3.2]]) {
    scene.add(place(box(1.8, 0.12, 0.55, trimMat), bx, 0.5, bz));
    scene.add(place(box(1.8, 0.5, 0.12, trimMat), bx, 0.78, bz - 0.26));
    for (const s of [-1, 1]) scene.add(place(box(0.14, 0.5, 0.5, darkMat), bx + s * 0.72, 0.25, bz));
    addCollider(bx - 0.95, bx + 0.95, bz - 0.5, bz + 0.35);
  }

  for (const s of [-1, 1]) {
    for (const t of [-1, 1]) scene.add(place(box(0.18, 2.4, 0.18, trimMat), -45 + s * 1.6, 1.2, -5 + t * 1.6));
  }
  scene.add(place(box(3.8, 0.18, 3.8, trimMat), -45, 2.5, -5));
  addCollider(-46.8, -43.2, -6.8, -3.2);
  scene.add(makeSprite('TAMAN SEKOLAH', 'Tempat bersantai', '#3fae5f', [3.2, 0.95], [-31, 3.0, 9]));

  for (const bz of [-3.4, 3.4]) {
    addSolid(1.9, 0.45, 0.6, -19.6, 0.225, bz, mat('#4a3423'), true, true);
    addSolid(1.7, 0.42, 0.5, -19.6, 0.64, bz, mat('#5a4230'), false, true);
  }

  const libFloor = mesh(new THREE.PlaneGeometry(10, 6), mat('#6b5a3f', { roughness: 1 }));
  libFloor.rotation.x = -Math.PI / 2;
  libFloor.position.set(-9, 0.01, 5.3);
  libFloor.receiveShadow = true;
  scene.add(libFloor);
  addSolid(0.3, WALL_H, 6.0, -14, WALL_Y, 5.3, wallMat);
  addSolid(0.3, WALL_H, 6.0, -4, WALL_Y, 5.3, wallMat);
  addSolid(10.3, WALL_H, 0.3, -9, WALL_Y, 8.15, wallMat);
  decorate(-14, 5.3, 6.0, 'z');
  decorate(-4, 5.3, 6.0, 'z');
  decorate(-9, 8.15, 10.3, 'x');
  for (const sx of [-12.6, -9.0, -5.4]) {
    addSolid(2.6, 2.1, 0.55, sx, 1.05, 7.6, mat('#8a5a2b'), true, true);
    for (let r = 0; r < 3; r++) {
      for (let b = 0; b < 5; b++) {
        scene.add(place(box(0.24, 0.4, 0.36, mat(['#d9c22b', '#2e9e5b', '#3f7fd9', '#d9822b', '#8b5cf6'][(r + b) % 5])), sx - 1.0 + b * 0.5, 0.55 + r * 0.62, 7.6));
      }
    }
  }
  addSolid(2.4, 0.78, 1.2, -8.6, 0.39, 4.2, tableMat, true, true);
  const libSign = makeSprite('PERPUSTAKAAN', 'Bu Rina', LIB.color, [3.0, 0.95], [-9, 3.0, 2.05]);
  scene.add(libSign);
  LIB.signMat = libSign.material;
  const buRina = buildTeacher({ gender: 'putri', color: '#b8863b', skin: '#eab890', hijab: '#4a2e5f' });
  buRina.position.set(-6.3, 0, 3.6);
  buRina.rotation.y = Math.PI;
  buRina.userData.rot0 = Math.PI;
  buRina.add(nameTag('Bu Rina', '#b8863b'));
  buRina.children[buRina.children.length - 1].position.y = 2.25;
  scene.add(buRina);
  addCollider(-6.8, -5.8, 3.1, 4.1);
  const bookMesh = place(box(0.5, 0.34, 0.12, mat('#39c2ff')), -8.6, 0.95, 4.2);
  bookMesh.castShadow = true;
  scene.add(bookMesh);

  const labFloor = mesh(new THREE.PlaneGeometry(10.15, 6), mat('#4a5058', { roughness: 1 }));
  labFloor.rotation.x = -Math.PI / 2;
  labFloor.position.set(1.075, 0.01, 5.3);
  labFloor.receiveShadow = true;
  scene.add(labFloor);
  addSolid(10.15, WALL_H, 0.3, 1.075, WALL_Y, 8.15, wallMat);
  decorate(1.075, 8.15, 10.15, 'x');
  for (const tx of [-1.2, 3.4]) addSolid(2.2, 0.85, 0.9, tx, 0.425, 5.6, tableMat, true, true);
  const beaker = (x, z, color) => {
    const b = mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.34, 12), mat(color, { transparent: true, opacity: 0.85 }));
    place(b, x, 1.02, z);
    scene.add(b);
  };
  beaker(-1.7, 5.4, '#e5484d');
  beaker(-0.7, 5.75, '#3f7fd9');
  beaker(-1.2, 5.15, '#8b5cf6');
  beaker(2.9, 5.4, '#39c2ff');
  beaker(3.9, 5.7, '#2e9e5b');
  const labSign = makeSprite('LAB IPA', 'Ibu Sari', '#2e9e5b', [3.0, 0.95], [0.5, 3.0, 2.05]);
  scene.add(labSign);
  const ENT_LAB = { id: 'lab', label: 'LAB IPA', teacher: 'Ibu Sari', color: '#2e9e5b', signMat: labSign.material };

  const musFloor = mesh(new THREE.PlaneGeometry(7, 5.5), mat('#2e6b4f', { roughness: 1 }));
  musFloor.rotation.x = -Math.PI / 2;
  musFloor.position.set(2.5, 0.01, -10.8);
  musFloor.receiveShadow = true;
  scene.add(musFloor);
  addSolid(0.3, WALL_H, 5.5, -1, WALL_Y, -10.825, wallMat);
  addSolid(0.3, WALL_H, 5.5, 6, WALL_Y, -10.825, wallMat);
  addSolid(7.3, WALL_H, 0.3, 2.5, WALL_Y, -13.5, wallMat);
  decorate(-1, -10.825, 5.5, 'z');
  decorate(6, -10.825, 5.5, 'z');
  decorate(2.5, -13.5, 7.3, 'x');
  addSolid(1.4, 2.2, 0.4, 2.5, 1.1, -13.28, mat('#c9a86a'), false, true);
  addSolid(1.0, 0.3, 0.3, 2.5, 2.35, -13.28, mat('#c9a86a'), false, true);
  for (const mx of [1.2, 2.5, 3.8]) for (const mz of [-10.0, -11.6]) scene.add(place(box(0.7, 0.06, 1.15, mat('#1f7a5c')), mx, 0.045, mz));
  const musSign = makeSprite('MUSHOLA', 'Ustadz Hasan', '#0e9f9f', [2.7, 0.9], [2.5, 3.0, -8.0]);
  scene.add(musSign);
  const ENT_MUS = { id: 'mus', label: 'MUSHOLA', teacher: 'Ustadz Hasan', color: '#0e9f9f', signMat: musSign.material };

  const bedPlant = [];
  GARDEN_BEDS.forEach(b => {
    addSolid(1.6, 0.35, 1.6, b.x, 0.175, b.z, mat('#6b4a2f'), true, true);
    scene.add(place(box(1.3, 0.1, 1.3, mat('#3e2b1a')), b.x, 0.4, b.z));
    const stem = place(box(0.14, 0.6, 0.14, mat('#3f7a3f')), b.x, 0.75, b.z);
    const leaves = place(box(0.55, 0.5, 0.55, mat('#7a8a5a')), b.x, 1.15, b.z);
    scene.add(stem);
    scene.add(leaves);
    bedPlant.push({ leaves, stem });
  });
  const kebunSign = makeSprite('KEBUN SEKOLAH', 'Pak Tono', '#2e9e5b', [2.7, 0.9], [-9, 2.7, -8.0]);
  scene.add(kebunSign);
  const ENT_KEBUN = { id: 'kebun', label: 'KEBUN SEKOLAH', teacher: 'Pak Tono', color: '#2e9e5b', signMat: kebunSign.material };

  const trashColors = ['#8a8f95', '#7a6f5f', '#9aa06a'];
  const trashMeshes = [];
  TRASH_POS.forEach(([tx, tz], i) => {
    const m = box(0.3, 0.24, 0.28, mat(trashColors[i % 3]));
    place(m, tx, 0.12, tz, [0, i * 0.7, 0]);
    scene.add(m);
    trashMeshes.push({ mesh: m, i });
  });

  const starMat = mat('#ffd24a', { roughness: 0.35, emissive: new THREE.Color('#b98a00'), emissiveIntensity: 0.5 });
  const stars = [];
  STAR_POS.forEach(([sx, sz], i) => {
    const s = box(0.32, 0.32, 0.32, starMat);
    place(s, sx, 0.55, sz, [0, Math.PI / 4, Math.PI / 4]);
    scene.add(s);
    stars.push({ mesh: s, i });
  });

  const huntMeshes = [];
  const huntMat = mat('#ffb347', { emissive: new THREE.Color('#8a5a00'), emissiveIntensity: 0.4 });
  HUNT_POS.forEach(([hx, hz], i) => {
    const b = box(0.42, 0.3, 0.1, huntMat);
    place(b, hx, 0.6, hz, [0, i * 0.8, 0]);
    scene.add(b);
    huntMeshes.push({ mesh: b, i });
  });

  for (const room of SCHOOL_ROOMS) {
    const cx = ROOM_CX[SCHOOL_ROOMS.indexOf(room)];
    const colorMat = mat(room.color);
    addSolid(0.26, 2.6, 0.26, cx - 1.65, 1.3, -2.15, colorMat, false);
    addSolid(0.26, 2.6, 0.26, cx + 1.65, 1.3, -2.15, colorMat, false);
    addSolid(3.6, 0.24, 0.34, cx, 2.62, -2.15, colorMat, false);
    addSolid(3.7, 1.9, 0.1, cx, 1.35, -7.9, frameMat, false);
    const board = mesh(new THREE.PlaneGeometry(3.5, 1.7), new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(lessonCanvas(room)), roughness: 0.9 }));
    place(board, cx, 1.35, -7.818);
    board.receiveShadow = true;
    scene.add(board);
    for (const dz of [-4.2, -5.9]) {
      for (const dx of [-1.7, 0, 1.7]) {
        addSolid(0.9, 0.72, 0.55, cx + dx, 0.36, dz, deskMat, true, false);
      }
    }
    const teacher = buildTeacher(room);
    teacher.position.set(cx, 0, -6.8);
    scene.add(teacher);
    addCollider(cx - 0.5, cx + 0.5, -7.4, -6.2);
    const sign = makeSprite(room.label, room.teacher, room.color, [3.4, 1.06], [cx, 2.95, -1.7]);
    scene.add(sign);
    room.cx = cx;
    room.signMat = sign.material;
  }

  const pakTono = buildTeacher({ gender: 'putra', color: '#2e9e5b', skin: '#d69f70' });
  pakTono.position.set(18.6, 0, 0);
  pakTono.rotation.y = -Math.PI / 2;
  pakTono.userData.rot0 = -Math.PI / 2;
  pakTono.add(nameTag('Pak Tono', '#2e9e5b'));
  pakTono.children[pakTono.children.length - 1].position.y = 2.25;
  scene.add(pakTono);
  addCollider(18.1, 19.1, -0.5, 0.5);

  const sportSigns = [
    ['SEPAK BOLA', 'Pak Tono', SPORTS[0].color, wx(23.4), 2.4, wz(0)],
    ['VOLI', 'Pak Tono', SPORTS[1].color, wx(31.5), 2.6, wz(0)],
    ['BASKET', 'Pak Tono', SPORTS[2].color, wx(37.4), 2.7, wz(-1.2)],
    ['BULU TANGKIS', 'Pak Tono', SPORTS[3].color, wx(31.5), 2.4, wz(6.4)]
  ];
  sportSigns.forEach(([t, sub, col, x, y, z], si) => {
    const s = makeSprite(t, sub, col, [2.9, 0.95], [x, y, z]);
    SPORTS[si].signMat = s.material;
    scene.add(s);
  });

  const player = buildCharacter(characterConfig);
  player.position.set(-20.5, 0, 0);
  player.rotation.y = Math.PI / 2;
  player.add(nameTag(characterConfig.name || 'Siswa', '#00a2ff'));
  player.children[player.children.length - 1].position.y = 2.15;
  scene.add(player);
  const legL = player.getObjectByName('legL');
  const legR = player.getObjectByName('legR');
  const armL = player.getObjectByName('armL');
  const armR = player.getObjectByName('armR');

  const prog = loadProgress();
  for (const room of SCHOOL_ROOMS) {
    if (prog.done[room.id]) setSignDone(room);
  }
  for (let i = trashMeshes.length - 1; i >= 0; i--) {
    if (prog.trash.includes(trashMeshes[i].i)) {
      scene.remove(trashMeshes[i].mesh);
      trashMeshes.splice(i, 1);
    }
  }
  for (let i = stars.length - 1; i >= 0; i--) {
    if (prog.stars.includes(stars[i].i)) {
      scene.remove(stars[i].mesh);
      stars.splice(i, 1);
    }
  }
  bedPlant.forEach((p, i) => waterBed(i, p, true));
  if (prog.done.lib) setSignDone(LIB);
  if (prog.done.lab) setSignDone(ENT_LAB);
  if (prog.done.mus) setSignDone(ENT_MUS);
  if (prog.done.kebun) setSignDone(ENT_KEBUN);
  for (const s of SPORTS) if (prog.done[s.id] && s.signMat) setSignDone(s);

  const hud = document.createElement('div');
  hud.id = 'gHud';
  hud.innerHTML = `
    <div class="g-top">
      <button id="gBack" type="button">Edit Karakter</button>
      <div class="g-mid"><b id="gName"></b><span id="gProg"></span><span id="gClock"></span></div>
      <div class="g-xp" id="gXp">XP 0</div>
      <button id="gOut" type="button">Keluar</button>
    </div>
    <canvas id="gMap" width="120" height="120"></canvas>
    <div id="gJoy"><div id="gKnob"></div></div>
    <button id="gAct" type="button" hidden></button>
    <div class="g-zoom">
      <button id="gZoomIn" type="button">+</button>
      <button id="gZoomOut" type="button">−</button>
      <button id="gSnd" type="button">SFX</button>
    </div>
    <div class="g-hint" id="gHint">Dekati objek lalu tap tombol aksi · Geser: kamera · Zoom: pinch / tombol</div>
    <div id="gDlg" hidden>
      <div class="g-dlg-head" id="gDlgHead"></div>
      <div class="g-dlg-body" id="gDlgBody"></div>
      <div class="g-dlg-actions" id="gDlgActions"></div>
    </div>
  `;
  document.body.appendChild(hud);

  const joyEl = hud.querySelector('#gJoy');
  const knobEl = hud.querySelector('#gKnob');
  const dlgEl = hud.querySelector('#gDlg');
  const dlgHead = hud.querySelector('#gDlgHead');
  const dlgBody = hud.querySelector('#gDlgBody');
  const dlgActions = hud.querySelector('#gDlgActions');

  hud.querySelector('#gName').textContent = characterConfig.name;
  const HINT_DEF = 'Dekati objek lalu tap tombol aksi · Geser: kamera · Zoom: pinch / tombol';
  const updateHud = () => {
    const dR = SCHOOL_ROOMS.filter(r => prog.done[r.id]).length;
    const acts = [...SPORTS.map(s => s.id), ...EXTRA_DONE];
    const dA = acts.filter(id => prog.done[id]).length;
    const dQ = QUESTS.filter(q => prog.quests[q.id] === 'done').length;
    hud.querySelector('#gProg').textContent = `Kelas ${dR}/${SCHOOL_ROOMS.length} · Aktivitas ${dA}/${acts.length} · Tugas ${dQ}/${QUESTS.length}`;
    hud.querySelector('#gXp').textContent = `XP ${prog.xp} · Rp${prog.uang.toLocaleString('id-ID')}`;
  };
  updateHud();
  hud.querySelector('#gXp').addEventListener('click', openObjectives);
  if (onLogout) hud.querySelector('#gOut').addEventListener('click', onLogout);
  else hud.querySelector('#gOut').hidden = true;
  const clockEl = hud.querySelector('#gClock');

  let skySec = -1;
  function updateSky() {
    const now = new Date();
    const sec = now.getSeconds() + now.getMinutes() * 60;
    if (sec === skySec) return;
    skySec = sec;
    const h = now.getHours() + now.getMinutes() / 60;
    const a = (h - 6) / 24 * Math.PI * 2;
    const elev = Math.sin(a);
    const dayF = Math.min(1, Math.max(0, (elev + 0.18) / 0.42));
    const t1 = Math.min(1, dayF * 2);
    const t2 = Math.max(0, dayF * 2 - 1);
    const bg = SKY.night.clone().lerp(SKY.dusk, t1).lerp(SKY.day, t2);
    scene.background = bg;
    scene.fog.color.copy(bg);
    sun.position.set(12 + Math.cos(a) * 70, Math.sin(a) * 55, -30);
    sun.visible = elev > -0.12;
    moon.position.set(12 - Math.cos(a) * 70, -Math.sin(a) * 55, -30);
    moon.visible = elev < 0.12;
    if (dayF > 0) {
      dir.color.copy(SKY.sunLow).lerp(SKY.sunDay, t2);
      dir.intensity = 0.2 + dayF * 0.65;
      dir.position.set(Math.cos(a) * 18, Math.max(7, Math.sin(a) * 18), -8);
    } else {
      dir.color.copy(SKY.moon);
      dir.intensity = 0.14;
      dir.position.set(8, 14, 6);
    }
    hemi.intensity = 0.26 + dayF * 0.5;
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${elev > 0.35 ? '☀️' : elev > 0 ? '🌇' : '🌙'} ${hh}:${mm}`;
  }

  const hintEl = hud.querySelector('#gHint');
  const updateHint = () => {
    hintEl.textContent = prog.carry ? `Tugas: bawa ${prog.carry.item} → ${prog.carry.targetLabel}` : HINT_DEF;
    hintEl.style.opacity = prog.carry ? '1' : '';
  };
  updateHint();
  const hintTimer = setTimeout(() => { if (!prog.carry) hintEl.style.opacity = '0'; }, 6000);

  const mapEl = hud.querySelector('#gMap');
  const mapCtx = mapEl.getContext('2d');
  const MAP_X0 = -55;
  const MAP_Z0 = -28;
  const W2M = (x, z) => [(x - MAP_X0) / 122 * 120, (z - MAP_Z0) / 56 * 120];
  const mapDots = [
    { x: () => 11.15, z: () => 5.3, c: '#c96f2e' },
    { x: () => -9, z: () => 5.5, c: '#b8863b' },
    { x: () => 1.075, z: () => 5.3, c: '#39c2ff' },
    { x: () => 2.5, z: () => -10.8, c: '#0e9f9f' },
    { x: () => 18.6, z: () => 0, c: '#2e9e5b' },
    { x: () => wx(23.4), z: () => wz(0), c: '#2e9e5b' },
    { x: () => wx(31.5), z: () => wz(0), c: '#3f7fd9' },
    { x: () => wx(37.4), z: () => wz(-1.2), c: '#d9822b' },
    { x: () => wx(31.5), z: () => wz(6.4), c: '#8b5cf6' },
    ...SCHOOL_ROOMS.map(r => ({ x: () => r.cx, z: () => -5, c: r.color }))
  ];
  function drawMap(t) {
    const c = mapCtx;
    c.clearRect(0, 0, 120, 120);
    const rect = (x1, z1, x2, z2, fill) => {
      const [ax, az] = W2M(x1, z1);
      const [bx, bz] = W2M(x2, z2);
      c.fillStyle = fill;
      c.fillRect(Math.min(ax, bx), Math.min(az, bz), Math.abs(bx - ax), Math.abs(bz - az));
    };
    const dot = (x, z, col, r) => {
      const [mx, mz] = W2M(x, z);
      c.fillStyle = col;
      c.beginPath();
      c.arc(mx, mz, r, 0, Math.PI * 2);
      c.fill();
    };
    rect(wx(16.8), wz(-8.8), wx(41.4), wz(8.8), '#2e5b3a');
    rect(-16.5, -8.3, 16.5, 2.3, '#3c4148');
    rect(6.0, 2.3, 16.3, 8.3, '#453522');
    rect(-14, 2.3, -4, 8.3, '#4a3f28');
    rect(-4, 2.3, 6.15, 8.3, '#2f3a45');
    rect(-1, -13.5, 6, -8.3, '#1f4a3a');
    rect(-52, -11, -24, 11, '#2e5b3a');
    for (const d of mapDots) dot(d.x(), d.z(), d.c, 2.4);
    for (const tm of trashMeshes) dot(tm.mesh.position.x, tm.mesh.position.z, '#9aa0a6', 1.4);
    GARDEN_BEDS.forEach((b, i) => {
      if (!prog.kebun.includes(i)) dot(b.x, b.z, '#3fae5f', 2 + Math.sin(t / 240) * 0.8);
    });
    if (!prog.done.hunt) {
      c.globalAlpha = 0.55 + Math.sin(t / 240) * 0.45;
      for (const hm of huntMeshes) dot(hm.mesh.position.x, hm.mesh.position.z, '#ffb347', 2.2);
      c.globalAlpha = 1;
    }
    if (prog.carry) {
      let tx = 0;
      let tz = 0;
      if (prog.carry.target === 'lib') {
        tx = -8.6;
        tz = 4.2;
      } else if (prog.carry.target === 'mus') {
        tx = 2.5;
        tz = -10.8;
      } else if (prog.carry.target === 'kantin') {
        tx = 11.15;
        tz = 5.3;
      } else {
        const tr = SCHOOL_ROOMS.find(r => r.id === prog.carry.target);
        if (tr) {
          tx = tr.cx;
          tz = -5;
        }
      }
      c.globalAlpha = 0.55 + Math.sin(t / 160) * 0.45;
      dot(tx, tz, '#e5484d', 4);
      c.globalAlpha = 1;
    }
    const [px, pz] = W2M(player.position.x, player.position.z);
    c.strokeStyle = '#ffffff';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(px, pz);
    c.lineTo(px + Math.sin(player.rotation.y) * 8, pz + Math.cos(player.rotation.y) * 8);
    c.stroke();
    dot(player.position.x, player.position.z, '#ffffff', 3.2);
  }

  const A = typeof window !== 'undefined' ? window.anime : null;
  const popIn = el => {
    if (!A) return;
    A({ targets: el, scale: [0.9, 1], translateY: [18, 0], opacity: [0, 1], duration: 320, easing: 'easeOutBack' });
  };
  const pulse = el => {
    if (!A) return;
    A({ targets: el, scale: [1.18, 1], duration: 260, easing: 'easeOutQuad' });
  };
  const shake = el => {
    if (!A) return;
    A({ targets: el, translateX: [-8, 8, -6, 6, 0], duration: 340, easing: 'easeOutQuad' });
  };
  const bumpXp = () => {
    if (!A) return;
    A({ targets: '#gXp', scale: [1.3, 1], duration: 420, easing: 'easeOutElastic(1, .5)' });
  };
  if (A) {
    A({ targets: '.g-top', translateY: [-40, 0], opacity: [0, 1], duration: 450, easing: 'easeOutCubic', delay: 60 });
    A({ targets: '#gJoy', scale: [0.6, 1], opacity: [0, 1], duration: 450, easing: 'easeOutBack', delay: 150 });
    A({ targets: '.g-zoom', opacity: [0, 1], translateX: [30, 0], duration: 400, easing: 'easeOutCubic', delay: 220 });
  }

  let camYaw = -Math.PI / 2;
  let camDist = 7.5;
  let camRatio = 0.55;
  const CAM_MIN = 3.0;
  const CAM_MAX = 34;
  const RATIO_MIN = 0.35;
  const RATIO_MAX = 1.0;
  const zoomBy = d => {
    camDist = Math.min(CAM_MAX, Math.max(CAM_MIN, camDist + d));
    pulse(d < 0 ? hud.querySelector('#gZoomIn') : hud.querySelector('#gZoomOut'));
  };
  hud.querySelector('#gZoomIn').addEventListener('click', () => zoomBy(-2.2));
  hud.querySelector('#gZoomOut').addEventListener('click', () => zoomBy(2.2));
  const sndBtn = hud.querySelector('#gSnd');
  sndBtn.classList.toggle('off', !soundOn);
  sndBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    sndBtn.classList.toggle('off', !soundOn);
    try {
      localStorage.setItem('sekolahRpg.sfx', soundOn ? '1' : '0');
    } catch (e) {}
    if (soundOn) {
      ensureAudio();
      sfx.pick();
    }
    toast(soundOn ? 'Efek suara: aktif' : 'Efek suara: mati');
  });

  const camPointers = new Map();
  let pinchDist = 0;
  const actBtn = hud.querySelector('#gAct');
  let actNow = null;
  let actShown = '';
  actBtn.addEventListener('click', () => {
    ensureAudio();
    intro = 0;
    if (actNow && !dialogOpen) actNow.run();
  });
  const camDown = e => {
    ensureAudio();
    intro = 0;
    camPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    canvas.setPointerCapture(e.pointerId);
    if (camPointers.size === 2) {
      const [a, b] = [...camPointers.values()];
      pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };
  const camMove = e => {
    const p = camPointers.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;
    if (camPointers.size === 1) {
      camYaw -= dx * 0.006;
      camRatio = Math.min(RATIO_MAX, Math.max(RATIO_MIN, camRatio + dy * 0.0025));
    } else if (camPointers.size === 2) {
      const [a, b] = [...camPointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDist > 0) {
        camDist = Math.min(CAM_MAX, Math.max(CAM_MIN, camDist * pinchDist / dist));
      }
      pinchDist = dist;
    }
  };
  const camUp = e => {
    camPointers.delete(e.pointerId);
    pinchDist = 0;
  };

  const joy = { x: 0, y: 0, id: null };
  const setKnob = (dx, dy) => {
    knobEl.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  };
  const joyDown = e => {
    ensureAudio();
    intro = 0;
    joy.id = e.pointerId;
    joyEl.setPointerCapture(e.pointerId);
    joyMove(e);
  };
  const joyMove = e => {
    if (e.pointerId !== joy.id) return;
    const r = joyEl.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy);
    const max = r.width / 2 - 16;
    if (len > max) {
      dx = dx / len * max;
      dy = dy / len * max;
    }
    joy.x = dx / max;
    joy.y = dy / max;
    setKnob(dx, dy);
  };
  const joyUp = e => {
    if (e.pointerId !== joy.id) return;
    joy.id = null;
    joy.x = 0;
    joy.y = 0;
    setKnob(0, 0);
  };

  const keys = {};
  const keyDown = e => {
    ensureAudio();
    intro = 0;
    const k = e.key.toLowerCase();
    keys[k] = true;
    if (k.startsWith('arrow') || k === ' ') e.preventDefault();
    if ((k === 'e' || k === ' ') && actNow && !dialogOpen) actNow.run();
  };
  const keyUp = e => { keys[e.key.toLowerCase()] = false; };

  canvas.addEventListener('pointerdown', camDown);
  canvas.addEventListener('pointermove', camMove);
  canvas.addEventListener('pointerup', camUp);
  canvas.addEventListener('pointercancel', camUp);
  joyEl.addEventListener('pointerdown', joyDown);
  joyEl.addEventListener('pointermove', joyMove);
  joyEl.addEventListener('pointerup', joyUp);
  joyEl.addEventListener('pointercancel', joyUp);
  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);

  let dialogOpen = false;
  let currentRoom = null;
  let quizEnt = null;
  let quizIdx = 0;
  let quizXp = 0;
  let entWasDone = false;
  const visits = {};
  let answerTimer = null;
  let canteenItem = null;
  let hasEntered = false;
  let kebunHinted = false;
  let intro = 3.2;
  let powerTimer = null;
  let landTimer = null;
  let shot = null;
  let mathXpLeft = 10;
  let sbGolCd = false;

  function closeDlg() {
    clearTimeout(answerTimer);
    clearInterval(powerTimer);
    powerTimer = null;
    dlgEl.hidden = true;
    dialogOpen = false;
  }

  const RANKS = [[50, 'Pemula'], [120, 'Siswa Rajin'], [200, 'Bintang Kelas'], [300, 'Juara Sekolah']];

  function addXp(n) {
    prog.xp += n;
    saveProgress(prog);
    updateHud();
    bumpXp();
    const r = RANKS.find(x => prog.xp >= x[0]);
    if (r && r[0] > prog.rank) {
      prog.rank = r[0];
      saveProgress(prog);
      sfx.quest();
      toast(`Rank baru: ${r[1]}!`);
    }
  }

  function checkAllDone() {
    const acts = [...SPORTS.map(s => s.id), ...EXTRA_DONE];
    const all = SCHOOL_ROOMS.every(r => prog.done[r.id])
      && acts.every(id => prog.done[id])
      && QUESTS.every(q => prog.quests[q.id] === 'done');
    if (all && !prog.notified) {
      prog.notified = true;
      saveProgress(prog);
      sfx.quest();
      buzz([80, 60, 80, 60, 120]);
      confetti();
      toast('MasyaAllah! Semua pelajaran, aktivitas, dan tugas sudah selesai. Kamu luar biasa!');
    }
  }

  function confetti() {
    if (!A) return;
    for (let i = 0; i < 44; i++) {
      const p = document.createElement('div');
      p.className = 'g-cft';
      p.style.left = `${Math.random() * 100}vw`;
      p.style.background = ['#00a2ff', '#2e9e5b', '#ffd24a', '#e5484d', '#8b5cf6'][i % 5];
      p.style.width = p.style.height = `${6 + Math.random() * 8}px`;
      document.body.appendChild(p);
      A({
        targets: p,
        translateY: [-40, window.innerHeight + 60],
        translateX: [(Math.random() - 0.5) * 220],
        rotate: Math.random() * 720 - 360,
        duration: 2200 + Math.random() * 1600,
        delay: Math.random() * 700,
        easing: 'easeInQuad',
        complete: () => p.remove()
      });
    }
  }

  function targetRoomOf(carry) {
    return carry && carry.target !== 'lib' ? carry.target : null;
  }

  function questGiverFor(rid) {
    if (prog.carry) return null;
    return QUESTS.find(q => q.giver === rid && prog.quests[q.id] === 'todo') || null;
  }

  function acceptQuest(q) {
    prog.quests[q.id] = 'carry';
    prog.carry = { id: q.id, target: q.target, item: q.item, targetLabel: q.targetLabel };
    saveProgress(prog);
    updateHint();
    closeDlg();
    sfx.coin();
    buzz(30);
    toast(`Tugas diterima: bawa ${q.item}`);
  }

  function openObjectives() {
    dialogOpen = true;
    canteenItem = null;
    setHead('#00a2ff', 'Daftar Tujuan');
    const line = (ok, txt) => `<p>${ok ? '<span class="g-chip" style="background:#2e9e5b"></span>' : '<span class="g-chip" style="background:#4a4f55"></span>'}${txt}</p>`;
    const parts = [];
    for (const r of SCHOOL_ROOMS) parts.push(line(!!prog.done[r.id], `${r.label} — ${r.teacher}`));
    for (const s of SPORTS) parts.push(line(!!prog.done[s.id], `Olahraga ${s.label}`));
    for (const [id, txt] of [['lib', 'Perpustakaan'], ['lab', 'Lab IPA'], ['mus', 'Wudhu di Mushola'], ['kebun', 'Menyiram Kebun'], ['bball', 'Mini-game Basket'], ['fb', 'Penalti'], ['sbplay', 'Giring bola ke gawang'], ['vbplay', 'Passing voli 5x'], ['btplay', 'Smash bulu tangkis 3x'], ['hunt', `Misi buku hilang (${prog.hunt.length}/${HUNT_POS.length})`], ['trash', `Bersih-bersih (${prog.trash.length}/12)`], ['stars', `Bintang (${prog.stars.length}/6)`]]) {
      parts.push(line(!!prog.done[id], txt));
    }
    for (const q of QUESTS) parts.push(line(prog.quests[q.id] === 'done', `Tugas: ${q.item}`));
    const mins = Math.floor((prog.playMs || 0) / 60000);
    parts.push(`<p><b>Rank:</b> ${(RANKS.filter(r => prog.xp >= r[0]).pop() || ['0', 'Pemula'])[1]} · <b>XP:</b> ${prog.xp} · <b>Waktu bermain:</b> ${mins} menit</p>`);
    dlgBody.innerHTML = parts.join('');
    dlgActions.innerHTML = '';
    const bOk = document.createElement('button');
    bOk.className = 'primary';
    bOk.textContent = 'Lanjut Bermain';
    bOk.onclick = closeDlg;
    dlgActions.append(bOk);
    const bRst = document.createElement('button');
    bRst.textContent = 'Mulai Ulang';
    bRst.onclick = () => {
      if (bRst.dataset.arm) {
        try {
          localStorage.removeItem('sekolahRpg.progres.v1');
          localStorage.removeItem('sekolahRpg.karakter.v1');
        } catch (e) {}
        location.reload();
      } else {
        bRst.dataset.arm = '1';
        bRst.textContent = 'Yakin? Tap lagi';
        toast('Tap sekali lagi untuk menghapus semua progres!');
      }
    };
    dlgActions.append(bRst);
    dlgEl.hidden = false;
    popIn(dlgEl);
  }
  function deliverQuest(zone) {
    const c = prog.carry;
    const q = QUESTS.find(x => x.id === c.id);
    prog.quests[q.id] = 'done';
    prog.carry = null;
    saveProgress(prog);
    updateHint();
    updateHud();
    checkAllDone();
    sfx.quest();
    buzz([60, 40, 60]);
    const isRoom = SCHOOL_ROOMS.some(r => r.id === zone.id);
    dialogOpen = true;
    setHead('#c9a86a', 'Tugas Selesai');
    dlgBody.innerHTML = `<p>${q.item} sudah disampaikan ke <b>${q.targetLabel}</b>.</p><p>Kamu mendapat <b>+${q.xp} XP</b>. Terima kasih sudah membantu!</p>`;
    dlgActions.innerHTML = '';
    const bNext = document.createElement('button');
    bNext.className = 'primary';
    bNext.textContent = isRoom ? 'Lanjut Pelajaran' : 'Lanjut Bermain';
    bNext.onclick = () => {
      closeDlg();
      if (isRoom) openLesson(zone);
    };
    const bOut = document.createElement('button');
    bOut.textContent = 'Keluar';
    bOut.onclick = closeDlg;
    dlgActions.append(bNext, bOut);
    dlgEl.hidden = false;
    popIn(dlgEl);
    addXp(q.xp);
    toast(`Tugas selesai! +${q.xp} XP`);
  }

  function setHead(color, text) {
    dlgHead.textContent = text;
    dlgHead.style.background = color || '#2a2d30';
  }

  function openLesson(ent) {
    dialogOpen = true;
    canteenItem = null;
    const done = !!prog.done[ent.id];
    setHead(ent.color, `${ent.label} — ${ent.teacher}`);
    let extra = '';
    if (done && TIPS[ent.id]) {
      visits[ent.id] = (visits[ent.id] || 0) + 1;
      const tips = TIPS[ent.id];
      extra = `<p><i>Tip ${ent.teacher}: "${tips[(visits[ent.id] - 1) % tips.length]}"</i></p>`;
    }
    dlgBody.innerHTML = `<p>${ent.lesson}</p>${done ? '<p><b>Kamu sudah menyelesaikan pelajaran ini.</b></p>' : ''}${extra}`;
    dlgActions.innerHTML = '';
    const bQuiz = document.createElement('button');
    bQuiz.className = 'primary';
    bQuiz.textContent = done ? 'Ulangi Kuis' : 'Mulai Kuis';
    bQuiz.onclick = () => startQuiz(ent);
    const qg = questGiverFor(ent.id);
    if (qg) {
      const bQ = document.createElement('button');
      bQ.className = 'pulse';
      bQ.textContent = `Tugas: ${qg.item}`;
      bQ.onclick = () => acceptQuest(qg);
      dlgActions.append(bQ);
    }
    const bOut = document.createElement('button');
    bOut.textContent = 'Keluar';
    bOut.onclick = closeDlg;
    dlgActions.append(bQuiz, bOut);
    dlgEl.hidden = false;
    popIn(dlgEl);
  }

  function openPjok() {
    dialogOpen = true;
    canteenItem = null;
    setHead('#2e9e5b', 'PJOK — Pak Tono');
    dlgBody.innerHTML = '<p>Selamat berolahraga! Dekati empat area: Sepak Bola, Voli, Basket, dan Bulu Tangkis. Ada mini-game lempar basket, penalti, giring bola ke gawang, passing voli, smash bulu tangkis, plus kebun sekolah yang perlu disiram. Fakta seru + pertanyaan menantimu!</p>';
    dlgActions.innerHTML = '';
    const bOk = document.createElement('button');
    bOk.className = 'primary';
    bOk.textContent = 'Mengerti';
    bOk.onclick = closeDlg;
    dlgActions.append(bOk);
    dlgEl.hidden = false;
    popIn(dlgEl);
  }

  function openExit() {
    dialogOpen = true;
    canteenItem = null;
    setHead('#c9a86a', 'Pintu Keluar');
    dlgBody.innerHTML = '<p>Kamu berada di pintu masuk/keluar sekolah.</p>';
    dlgActions.innerHTML = '';
    const bMenu = document.createElement('button');
    bMenu.className = 'primary';
    bMenu.textContent = 'Kembali ke Menu Karakter';
    bMenu.onclick = () => {
      closeDlg();
      onEdit();
    };
    const bNo = document.createElement('button');
    bNo.textContent = 'Batal';
    bNo.onclick = closeDlg;
    dlgActions.append(bMenu, bNo);
    dlgEl.hidden = false;
    popIn(dlgEl);
  }

  function openCanteen() {
    dialogOpen = true;
    canteenItem = null;
    setHead('#c96f2e', 'KANTIN — Bu Kantin');
    renderCanteen();
  }

  function renderCanteen() {
    dlgBody.innerHTML = `<p><b>Saldo: ${fmt(prog.uang)}</b> · Aritmetika sosial: <b>Total = harga × jumlah</b></p>`;
    CANTEEN_MENU.forEach(item => {
      const b = document.createElement('button');
      b.className = 'g-opt';
      b.innerHTML = `<span class="dot" style="background:${item.color}"></span><span>${item.name}</span><span class="price">${fmt(item.price)}</span>`;
      b.onclick = () => {
        canteenItem = item;
        openCanteenItem(item);
      };
      dlgBody.appendChild(b);
    });
    dlgActions.innerHTML = '';
    const qg = questGiverFor('kantin');
    if (qg) {
      const bQ = document.createElement('button');
      bQ.className = 'pulse primary';
      bQ.textContent = `Tugas: ${qg.item}`;
      bQ.onclick = () => acceptQuest(qg);
      dlgActions.append(bQ);
    }
    const bMath = document.createElement('button');
    bMath.textContent = 'Latihan Hitung Cepat';
    bMath.onclick = openMathDash;
    dlgActions.append(bMath);
    const bTop = document.createElement('button');
    bTop.textContent = `Isi Saldo ${fmt(10000)}`;
    bTop.onclick = () => {
      prog.uang += 10000;
      saveProgress(prog);
      toast(`Simulasi: saldo jadi ${fmt(prog.uang)}`);
      renderCanteen();
    };
    const bOut = document.createElement('button');
    bOut.textContent = 'Keluar';
    bOut.onclick = closeDlg;
    dlgActions.append(bTop, bOut);
    dlgEl.hidden = false;
    popIn(dlgEl);
  }

  function openCanteenItem(item) {
    setHead('#c96f2e', `${item.name} — Bu Kantin`);
    dlgBody.innerHTML = `<p>Harga: <b>${fmt(item.price)}</b> · Saldo: <b>${fmt(prog.uang)}</b></p><p>Pilih jumlah yang dibeli:</p>`;
    dlgActions.innerHTML = '';
    for (const qty of [1, 2, 3]) {
      const b = document.createElement('button');
      b.className = 'primary';
      b.textContent = `x${qty}`;
      b.onclick = () => buyCanteen(item, qty);
      dlgActions.append(b);
    }
    const bBack = document.createElement('button');
    bBack.textContent = 'Kembali';
    bBack.onclick = () => {
      canteenItem = null;
      setHead('#c96f2e', 'KANTIN — Bu Kantin');
      renderCanteen();
    };
    dlgActions.append(bBack);
    dlgEl.hidden = false;
  }

  function buyCanteen(item, qty) {
    const total = item.price * qty;
    if (prog.uang >= total) {
      prog.uang -= total;
      saveProgress(prog);
      sfx.coin();
      buzz(25);
      toast(`${item.name} x${qty} = ${fmt(total)} dibayar. Sisa saldo ${fmt(prog.uang)}`);
      setHead('#c96f2e', 'KANTIN — Bu Kantin');
      renderCanteen();
    } else {
      sfx.wrong();
      const old = dlgBody.querySelector('.g-err');
      if (old) old.remove();
      const errEl = document.createElement('p');
      errEl.textContent = `Saldo kurang! Butuh ${fmt(total)}, saldo ${fmt(prog.uang)}.`;
      errEl.className = 'g-err';
      dlgBody.appendChild(errEl);
      shake(dlgBody);
    }
  }

  function openMathDash() {
    dialogOpen = true;
    canteenItem = null;
    setHead('#c96f2e', 'Latihan Hitung Cepat');
    let streak = 0;
    const mkQ = () => {
      const op = ['+', '-', 'x'][Math.floor(Math.random() * 3)];
      let a, b, ans;
      if (op === 'x') {
        a = 2 + Math.floor(Math.random() * 8);
        b = 2 + Math.floor(Math.random() * 9);
        ans = a * b;
      } else if (op === '+') {
        a = 10 + Math.floor(Math.random() * 40);
        b = 5 + Math.floor(Math.random() * 40);
        ans = a + b;
      } else {
        a = 20 + Math.floor(Math.random() * 40);
        b = 2 + Math.floor(Math.random() * 18);
        ans = a - b;
      }
      const opts = new Set([ans]);
      while (opts.size < 3) {
        const d = Math.floor(Math.random() * 11) - 5;
        if (d) opts.add(ans + d);
      }
      return { text: `${a} ${op} ${b}`, opts: [...opts].sort(() => Math.random() - 0.5), ans };
    };
    const renderQ = () => {
      const q = mkQ();
      dlgBody.innerHTML = `<p>Jawab: <b>${q.text}</b> = ?</p>`;
      if (streak >= 2) {
        const sp = document.createElement('p');
        sp.innerHTML = `<b>Streak:</b> ${streak} benar berturut-turut`;
        dlgBody.appendChild(sp);
      }
      if (mathXpLeft <= 0) {
        const cp = document.createElement('p');
        cp.textContent = 'XP latihan sesi ini sudah habis — tetap jawab untuk poin streak!';
        dlgBody.appendChild(cp);
      }
      q.opts.forEach(opt => {
        const b = document.createElement('button');
        b.className = 'g-opt';
        b.textContent = opt;
        b.onclick = () => {
          const btns = [...dlgBody.querySelectorAll('.g-opt')];
          btns.forEach(x => { x.disabled = true; });
          const ci = q.opts.indexOf(q.ans);
          if (opt === q.ans) {
            b.classList.add('correct');
            pulse(b);
            sfx.correct();
            buzz(30);
            streak += 1;
            if (mathXpLeft > 0) {
              mathXpLeft -= 2;
              addXp(2);
            }
            answerTimer = setTimeout(renderQ, 650);
          } else {
            if (btns[ci]) btns[ci].classList.add('correct');
            b.classList.add('wrong');
            shake(b);
            sfx.wrong();
            streak = 0;
            answerTimer = setTimeout(renderQ, 1200);
          }
        };
        dlgBody.appendChild(b);
      });
      dlgActions.innerHTML = '';
      const bOut = document.createElement('button');
      bOut.textContent = 'Keluar';
      bOut.onclick = closeDlg;
      dlgActions.append(bOut);
      dlgEl.hidden = false;
    };
    renderQ();
    popIn(dlgEl);
  }

  function waterBed(i, p, silent) {
    p.leaves.material.color.set('#3fae5f');
    p.leaves.scale.setScalar(1.18);
    p.stem.material.color.set('#2e6b3f');
    if (!silent) scene.add(place(box(0.16, 0.16, 0.16, mat('#e86fa4')), GARDEN_BEDS[i].x, 1.52, GARDEN_BEDS[i].z));
  }

  function openWudhu() {
    dialogOpen = true;
    canteenItem = null;
    setHead('#0e9f9f', 'MUSHOLA — Urutan Wudhu');
    const order = [...WUDHU_STEPS].sort(() => Math.random() - 0.5);
    let step = 0;
    dlgBody.innerHTML = '<p>Tap gerakan wudhu sesuai urutan yang benar:</p><div class="g-steps" id="gWStep">Langkah 1/' + WUDHU_STEPS.length + '</div>';
    order.forEach(txt => {
      const b = document.createElement('button');
      b.className = 'g-opt';
      b.textContent = txt;
      b.onclick = () => {
        if (b.disabled) return;
        if (txt === WUDHU_STEPS[step]) {
          b.classList.add('correct');
          b.disabled = true;
          step += 1;
          pulse(b);
          hud.querySelector('#gWStep').textContent = `Langkah ${step}/${WUDHU_STEPS.length}`;
          if (step === WUDHU_STEPS.length) {
            const note = document.createElement('p');
            note.innerHTML = '<b>Wudhu selesai!</b> Wudhu dimulai dengan niat, lalu membasuh anggota wudhu secara berurutan. Setelah itu kita siap shalat.';
            dlgBody.appendChild(note);
            sfx.quest();
            buzz([60, 40, 60]);
            if (!prog.done.mus) {
              prog.done.mus = true;
              setSignDone(ENT_MUS);
              addXp(10);
              checkAllDone();
              toast('Wudhu sempurna! +10 XP');
            }
          }
        } else {
          shake(b);
        }
      };
      dlgBody.appendChild(b);
    });
    dlgActions.innerHTML = '';
    const bOut = document.createElement('button');
    bOut.textContent = 'Keluar';
    bOut.onclick = closeDlg;
    dlgActions.append(bOut);
    dlgEl.hidden = false;
    popIn(dlgEl);
  }

  function openLab() {
    dialogOpen = true;
    canteenItem = null;
    setHead('#2e9e5b', 'LAB IPA — Ibu Sari');
    let mix = '';
    const renderLab = msg => {
      const col = mix.includes('C') && mix.includes('A') ? '#ff4d4d'
        : mix.includes('C') && mix.includes('B') ? '#4d7dff'
        : mix.includes('A') && mix.includes('B') ? '#d9a44a'
        : mix.includes('C') ? '#b39ddb'
        : mix.includes('A') ? '#e5484d'
        : mix.includes('B') ? '#3f7fd9'
        : '#5f6a72';
      dlgBody.innerHTML = `<p>Isi labu: <span class="g-chip" style="background:${col}"></span><b>${mix ? mix.split('').join(' + ') : 'kosong'}</b></p><p id="gLabMsg">${msg}</p>`;
      dlgActions.innerHTML = '';
      if (mix.length < 2) {
        for (const k of ['A', 'B', 'C']) {
          const b = document.createElement('button');
          b.className = 'g-opt';
          b.innerHTML = `<span class="g-chip" style="background:${LAB_LIQUIDS[k].color}"></span>Tuang ${LAB_LIQUIDS[k].name}`;
          b.onclick = () => pour(k);
          dlgBody.appendChild(b);
        }
      }
      const bClr = document.createElement('button');
      bClr.textContent = 'Kosongkan Labu';
      bClr.onclick = () => {
        mix = '';
        renderLab('Labu dikosongkan. Coba kombinasi lain!');
      };
      const bEl = document.createElement('button');
      bEl.textContent = '⚡ Eksperimen Listrik';
      bEl.onclick = openLabElec;
      const bMg = document.createElement('button');
      bMg.textContent = '🧲 Eksperimen Magnet';
      bMg.onclick = openLabMag;
      const bOut = document.createElement('button');
      bOut.textContent = 'Keluar';
      bOut.onclick = closeDlg;
      dlgActions.append(bClr, bEl, bMg, bOut);
    };
      const mark = k => {
        if (prog.lab[k]) return;
        prog.lab[k] = true;
        saveProgress(prog);
        sfx.correct();
        buzz(40);
        labCheckDone();
      };
    const pour = l => {
      if (mix.length >= 2) return;
      mix += l;
      const combo = mix.split('').sort().join('');
      let msg;
      if (combo === 'AC') {
        msg = 'Indikator berubah MERAH — cairan bersifat ASAM!';
        mark('ac');
      } else if (combo === 'BC') {
        msg = 'Indikator berubah BIRU — cairan bersifat BASA!';
        mark('bc');
      } else if (combo === 'AB') {
        msg = 'Asam + basa saling menetralkan — cairan menjadi NETRAL.';
        mark('ab');
      } else if (l === 'A') {
        msg = 'Air asam dituang. Tambahkan indikator untuk menguji sifatnya.';
      } else if (l === 'B') {
        msg = 'Air basa dituang. Tambahkan indikator untuk menguji sifatnya.';
      } else {
        msg = 'Indikator universal dituang. Tambahkan asam atau basa.';
      }
      renderLab(msg);
    };
    renderLab('Pilih cairan untuk dituang ke labu.');
    dlgEl.hidden = false;
    popIn(dlgEl);
  }

  function labCheckDone() {
    if (prog.lab.ac && prog.lab.bc && prog.lab.ab && prog.lab.elec && prog.lab.mag && !prog.done.lab) {
      prog.done.lab = true;
      setSignDone(ENT_LAB);
      addXp(15);
      checkAllDone();
      toast('Semua eksperimen lab selesai! +15 XP');
    }
  }

  function openLabElec() {
    setHead('#2e9e5b', 'LAB IPA — Eksperimen Listrik');
    const steps = ['Pasang baterai', 'Sambungkan kabel', 'Pasang saklar', 'Pasang lampu'];
    const order = [...steps].sort(() => Math.random() - 0.5);
    let st = 0;
    dlgBody.innerHTML = `<p>Susun rangkaian agar lampu menyala — tap sesuai urutan:</p><div class="g-steps" id="gEStep">Langkah 1/${steps.length}</div>`;
    order.forEach(txt => {
      const b = document.createElement('button');
      b.className = 'g-opt';
      b.textContent = txt;
      b.onclick = () => {
        if (b.disabled) return;
        if (txt === steps[st]) {
          b.classList.add('correct');
          b.disabled = true;
          st += 1;
          pulse(b);
          sfx.pick();
          hud.querySelector('#gEStep').textContent = `Langkah ${st}/${steps.length}`;
          if (st === steps.length) {
            const p = document.createElement('p');
            p.innerHTML = '<b>Lampu menyala!</b> Arus listrik hanya mengalir jika rangkaian tertutup dan komponen terpasang berurutan.';
            dlgBody.appendChild(p);
            sfx.quest();
            buzz([60, 40, 60]);
            if (!prog.lab.elec) {
              prog.lab.elec = true;
              saveProgress(prog);
              labCheckDone();
            }
          }
        } else shake(b);
      };
      dlgBody.appendChild(b);
    });
    dlgActions.innerHTML = '';
    const bBack = document.createElement('button');
    bBack.textContent = 'Kembali';
    bBack.onclick = openLab;
    const bOut = document.createElement('button');
    bOut.textContent = 'Keluar';
    bOut.onclick = closeDlg;
    dlgActions.append(bBack, bOut);
    dlgEl.hidden = false;
    popIn(dlgEl);
  }

  function openLabMag() {
    setHead('#2e9e5b', 'LAB IPA — Eksperimen Magnet');
    const items = [
      { n: 'Paku besi', ok: true }, { n: 'Pensil kayu', ok: false },
      { n: 'Koin logam', ok: true }, { n: 'Karet gelang', ok: false },
      { n: 'Klip kertas', ok: true }, { n: 'Bola plastik', ok: false }
    ].sort(() => Math.random() - 0.5);
    let found = 0;
    dlgBody.innerHTML = '<p>Tap benda yang TARIK oleh magnet:</p><div class="g-steps" id="gMStep">Ditemukan 0/3</div>';
    items.forEach(it => {
      const b = document.createElement('button');
      b.className = 'g-opt';
      b.textContent = it.n;
      b.onclick = () => {
        if (b.disabled) return;
        if (it.ok) {
          b.classList.add('correct');
          b.disabled = true;
          found += 1;
          pulse(b);
          sfx.pick();
          hud.querySelector('#gMStep').textContent = `Ditemukan ${found}/3`;
          if (found === 3) {
            const p = document.createElement('p');
            p.innerHTML = '<b>Tepat!</b> Magnet menarik benda dari besi/baja, bukan kayu, karet, atau plastik.';
            dlgBody.appendChild(p);
            sfx.quest();
            buzz([60, 40, 60]);
            if (!prog.lab.mag) {
              prog.lab.mag = true;
              saveProgress(prog);
              labCheckDone();
            }
          }
        } else {
          shake(b);
          sfx.wrong();
        }
      };
      dlgBody.appendChild(b);
    });
    dlgActions.innerHTML = '';
    const bBack = document.createElement('button');
    bBack.textContent = 'Kembali';
    bBack.onclick = openLab;
    const bOut = document.createElement('button');
    bOut.textContent = 'Keluar';
    bOut.onclick = closeDlg;
    dlgActions.append(bBack, bOut);
    dlgEl.hidden = false;
    popIn(dlgEl);
  }

  function openShot(cfg) {
    dialogOpen = true;
    canteenItem = null;
    setHead(cfg.color, `${cfg.label} — Mini-game`);
    dlgBody.innerHTML = `<p>${cfg.hint}</p><div class="g-bar"><div class="g-zone" style="left:${cfg.z0 * 100}%;width:${(cfg.z1 - cfg.z0) * 100}%"></div><div class="g-fill" id="gFill"></div></div><p class="g-steps">Tap LEMPAR saat garis berada di area hijau!</p>${cfg.need > 1 ? `<p class="g-steps" id="gShotCnt">Berhasil: ${cfg.count}/${cfg.need}</p>` : ''}`;
    dlgActions.innerHTML = '';
    const fill = dlgBody.querySelector('#gFill');
    let power = 0;
    const t0 = performance.now();
    powerTimer = setInterval(() => {
      const p = (performance.now() - t0) / cfg.period;
      power = 1 - Math.abs(1 - (p % 2));
      fill.style.width = `${power * 100}%`;
    }, 33);
    const bGo = document.createElement('button');
    bGo.className = 'primary';
    bGo.textContent = 'Lempar!';
    bGo.onclick = () => {
      clearInterval(powerTimer);
      powerTimer = null;
      bGo.disabled = true;
      const hit = power >= cfg.z0 && power <= cfg.z1;
      const from = cfg.ball.position.clone();
      const to = hit
        ? cfg.target.clone()
        : cfg.target.clone().add(new THREE.Vector3((Math.random() - 0.5) * 3, -0.5, (Math.random() - 0.5) * 2.4));
      shot = { ball: cfg.ball, from, to, e: 0, arc: cfg.arc, hit, cfg, home: cfg.ball.userData.home.clone() };
    };
    const bOut = document.createElement('button');
    bOut.textContent = 'Keluar';
    bOut.onclick = closeDlg;
    dlgActions.append(bGo, bOut);
    dlgEl.hidden = false;
    popIn(dlgEl);
  }

  function startQuiz(ent) {
    quizEnt = ent;
    quizIdx = 0;
    quizXp = 0;
    entWasDone = !!prog.done[ent.id];
    renderQ();
  }

  function renderQ() {
    const ent = quizEnt;
    const item = ent.quiz[quizIdx];
    dialogOpen = true;
    setHead(ent.color, `${ent.label} — Kuis ${quizIdx + 1}/${ent.quiz.length}`);
    dlgBody.innerHTML = `<div class="g-q">${item.q}</div>`;
    item.o.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'g-opt';
      b.textContent = opt;
      b.onclick = () => answer(b, i);
      dlgBody.appendChild(b);
    });
    dlgActions.innerHTML = '';
    const bOut = document.createElement('button');
    bOut.textContent = 'Keluar';
    bOut.onclick = closeDlg;
    dlgActions.append(bOut);
    dlgEl.hidden = false;
    popIn(dlgEl);
  }

  function answer(btn, i) {
    const ent = quizEnt;
    const correct = ent.quiz[quizIdx].a;
    const buttons = dlgBody.querySelectorAll('.g-opt');
    buttons.forEach(b => { b.disabled = true; });
    if (i === correct) {
      btn.classList.add('correct');
      if (!entWasDone) quizXp += 10;
      pulse(btn);
      sfx.correct();
      buzz(40);
    } else {
      btn.classList.add('wrong');
      buttons[correct].classList.add('correct');
      shake(btn);
      sfx.wrong();
      buzz([40, 50, 40]);
    }
    answerTimer = setTimeout(() => {
      quizIdx += 1;
      if (quizIdx < ent.quiz.length) renderQ();
      else finishQuiz(ent);
    }, 900);
  }

  function finishQuiz(ent) {
    if (!entWasDone) {
      prog.done[ent.id] = true;
      prog.xp += quizXp;
      saveProgress(prog);
      if (ent.signMat) setSignDone(ent);
      updateHud();
      checkAllDone();
    }
    if (!entWasDone) {
      sfx.quest();
      buzz([60, 40, 60]);
      bumpXp();
    }
    dialogOpen = true;
    setHead(ent.color, `${ent.label} — Selesai`);
    dlgBody.innerHTML = entWasDone
      ? '<p>Kamu sudah menyelesaikan ini sebelumnya.</p>'
      : `<p>Kuis selesai! Kamu mendapat <b>+${quizXp} XP</b>.</p><p>${ent.teacher}: "MasyaAllah, kerja bagus!"</p>`;
    dlgActions.innerHTML = '';
    const bOk = document.createElement('button');
    bOk.className = 'primary';
    bOk.textContent = 'Lanjut Jalan-jalan';
    bOk.onclick = closeDlg;
    dlgActions.append(bOk);
    dlgEl.hidden = false;
    popIn(dlgEl);
  }

  function setSignDone(room) {
    const cv = drawSignCanvas(room.label, room.teacher, room.color, true);
    room.signMat.map.dispose();
    room.signMat.map = new THREE.CanvasTexture(cv);
    room.signMat.needsUpdate = true;
  }

  function resolveCollisions(px, pz, r) {
    for (const c of colliders) {
      if (px > c.x1 - r && px < c.x2 + r && pz > c.z1 - r && pz < c.z2 + r) {
        const dl = px - (c.x1 - r);
        const dr = (c.x2 + r) - px;
        const dn = pz - (c.z1 - r);
        const df = (c.z2 + r) - pz;
        const min = Math.min(dl, dr, dn, df);
        if (min === dl) px = c.x1 - r;
        else if (min === dr) px = c.x2 + r;
        else if (min === dn) pz = c.z1 - r;
        else pz = c.z2 + r;
      }
    }
    return [px, pz];
  }

  function roomAt(px, pz) {
    if (pz > -2.25) return null;
    for (const room of SCHOOL_ROOMS) {
      if (Math.abs(px - room.cx) < 2.4) return room;
    }
    return null;
  }

  function openBook() {
    dialogOpen = true;
    canteenItem = null;
    setHead('#b8863b', 'Perpustakaan');
    if (prog.carry && prog.carry.id === 'q3' && prog.carry.target === 'lib') {
      prog.carry = { id: 'q3', target: 'bing', item: 'Buku untuk Pak Rizal', targetLabel: QUESTS[2].targetLabel };
      saveProgress(prog);
      updateHint();
      dlgBody.innerHTML = '<p>Buku diambil dari rak! Sekarang bawa ke <b>Pak Rizal — Kelas B. Inggris</b>.</p>';
      dlgActions.innerHTML = '';
      const bOk = document.createElement('button');
      bOk.className = 'primary';
      bOk.textContent = 'Siap!';
      bOk.onclick = closeDlg;
      dlgActions.append(bOk);
    } else {
      const hr = prog.hunt.length;
      dlgBody.innerHTML = `<p>Rak buku perpustakaan: buku cerita, ensiklopedia, dan buku agama. Membaca 15 menit setiap hari membuatmu semakin pintar!</p><p><b>Misi Buku Hilang:</b> ${hr}/${HUNT_POS.length} ditemukan. ${prog.done.hunt ? 'Misi selesai, terima kasih sudah membantu Bu Rina!' : 'Ada 5 buku berserakan di halaman & sekitar sekolah — cari buku berkilau kuning!'}</p>`;
      dlgActions.innerHTML = '';
      const bOk = document.createElement('button');
      bOk.className = 'primary';
      bOk.textContent = prog.done.hunt ? 'Menarik' : 'Siap Mencari!';
      bOk.onclick = closeDlg;
      dlgActions.append(bOk);
    }
    dlgEl.hidden = false;
    popIn(dlgEl);
  }

  const SHOT_BB = { id: 'bball', label: 'LEMPAR BASKET', color: '#d9822b', hint: 'Masukkan bola basket ke ring!', ball: basketBall, target: new THREE.Vector3(wx(39.2), 2.15, wz(-1.2)), arc: 2.6, z0: 0.72, z1: 0.92, period: 1600 };
  const SHOT_FB = { id: 'fb', label: 'TENDANG PENALTI', color: '#2e9e5b', hint: 'Tendang bola ke gawang!', ball: footBall, target: new THREE.Vector3(wx(27.2), 0.7, wz(0)), arc: 1.8, z0: 0.7, z1: 0.94, period: 1500 };
  const SHOT_VB = { id: 'vbplay', label: 'PASSING VOLI', color: '#3f7fd9', hint: 'Pukul bola melewati net 5 kali beruntun!', ball: volleyBall, target: new THREE.Vector3(wx(32.6), 0.8, wz(-0.6)), arc: 2.2, z0: 0.7, z1: 0.92, period: 1400, need: 5, count: 0 };
  const SHOT_BT = { id: 'btplay', label: 'SMASH BULU TANGKIS', color: '#8b5cf6', hint: 'Smash shuttlecock melewati net 3 kali beruntun!', ball: shuttle, target: new THREE.Vector3(wx(32.4), 0.35, wz(7.15)), arc: 1.5, z0: 0.7, z1: 0.93, period: 1300, need: 3, count: 0 };

  const interactables = [
    { id: 'kantin', label: 'Kantin — Bu Kantin', x: 10.2, z: 4.9, r: 2.4, open: openCanteen },
    { id: 'book', label: 'Meja Buku — Bu Rina', x: -8.6, z: 4.2, r: 1.7, open: openBook },
    { id: 'lib', label: 'Pelajaran Perpustakaan', x: -9, z: 5.5, r: 2.8, open: () => openLesson(LIB) },
    { id: 'lab', label: 'Eksperimen Lab IPA', x: 1.075, z: 5.3, r: 2.8, open: openLab },
    { id: 'mus', label: 'Latihan Wudhu', x: 2.5, z: -10.8, r: 2.6, open: openWudhu },
    { id: 'tono', label: 'Bicara Pak Tono', x: 18.6, z: 0, r: 2.4, open: openPjok },
    { id: 'sb', label: 'Pelajaran Sepak Bola', x: wx(23.4), z: wz(0), r: 3.4, open: () => openLesson(SPORTS[0]) },
    { id: 'fb', label: 'Tendang Penalti', x: wx(25.6), z: wz(0), r: 2.6, open: () => openShot(SHOT_FB) },
    { id: 'vb', label: 'Pelajaran Voli', x: wx(31.5), z: wz(0), r: 3.4, open: () => openLesson(SPORTS[1]) },
    { id: 'bb', label: 'Pelajaran Basket', x: wx(37.4), z: wz(-1.2), r: 3.4, open: () => openLesson(SPORTS[2]) },
    { id: 'bball', label: 'Lempar Basket', x: wx(38.5), z: wz(-0.9), r: 2.9, open: () => openShot(SHOT_BB) },
    { id: 'bt', label: 'Pelajaran Bulu Tangkis', x: wx(31.5), z: wz(6.0), r: 3.4, open: () => openLesson(SPORTS[3]) },
    { id: 'vbplay', label: 'Passing Voli', x: wx(30.2), z: wz(1.0), r: 2.4, open: () => openShot(SHOT_VB) },
    { id: 'btplay', label: 'Smash Bulu Tangkis', x: wx(30.6), z: wz(5.8), r: 2.4, open: () => openShot(SHOT_BT) }
  ];

  const ringGeo = new THREE.RingGeometry(0.55, 0.75, 28);
  const ringMat = new THREE.MeshBasicMaterial({ color: '#00a2ff', transparent: true, opacity: 0.35, side: THREE.DoubleSide });
  for (const ia of interactables) {
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(ia.x, 0.03, ia.z);
    scene.add(ring);
  }

  const binGeo = new THREE.CylinderGeometry(0.42, 0.36, 0.9, 12);
  for (const [bx, bz] of [[-15.4, -3.2], [15.4, -2.6], [18.6, 7.4], [7.2, -12.4]]) {
    const bin = mesh(binGeo, mat('#2e6b4f'));
    place(bin, bx, 0.45, bz);
    scene.add(bin);
    addCollider(bx - 0.42, bx + 0.42, bz - 0.4, bz + 0.4);
  }

  function tick(dt, t) {
    ringMat.opacity = 0.22 + Math.sin(t / 300) * 0.14;
    updateSky();
    scene.fog.near = 22 + camDist * 1.9;
    scene.fog.far = 54 + camDist * 2.1;
    prog.playMs += dt * 1000;
    playSave += dt;
    if (playSave > 60) {
      playSave = 0;
      saveProgress(prog);
    }
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (h > 0 && Math.abs(camera.aspect - w / h) > 0.001) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    mapTick += dt;
    if (mapTick > 0.15) {
      mapTick = 0;
      drawMap(t);
    }

    let jx = joy.x;
    let jy = joy.y;
    if (!dialogOpen) {
      jx += (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0);
      jy += (keys.s || keys.arrowdown ? 1 : 0) - (keys.w || keys.arrowup ? 1 : 0);
    }
    const jLen = Math.hypot(jx, jy);
    if (jLen > 1) {
      jx /= jLen;
      jy /= jLen;
    }

    const fx = -Math.sin(camYaw);
    const fz = -Math.cos(camYaw);
    const rx = Math.cos(camYaw);
    const rz = -Math.sin(camYaw);
    let mx = fx * -jy + rx * jx;
    let mz = fz * -jy + rz * jx;
    const mLen = Math.hypot(mx, mz);
    const moving = mLen > 0.01 && !dialogOpen && intro <= 0;
    if (moving) {
      mx /= mLen;
      mz /= mLen;
      const speed = 3.4 * Math.min(1, jLen);
      let px = player.position.x + mx * speed * dt;
      let pz = player.position.z + mz * speed * dt;
      [px, pz] = resolveCollisions(px, pz, 0.32);
      player.position.x = px;
      player.position.z = pz;
      player.rotation.y = lerpAngle(player.rotation.y, Math.atan2(mx, mz), Math.min(1, dt * 10));
      if (!shot) {
        const bdx = footBall.position.x - player.position.x;
        const bdz = footBall.position.z - player.position.z;
        if (Math.hypot(bdx, bdz) < 0.85) {
          footBall.position.x = Math.min(wx(40.5), Math.max(wx(17.5), footBall.position.x + mx * speed * dt * 1.2));
          footBall.position.z = Math.min(wz(8.5), Math.max(wz(-8.5), footBall.position.z + mz * speed * dt * 1.2));
          footBall.rotation.x += dt * 10;
          if (footBall.position.x > wx(26.75) && Math.abs(footBall.position.z) < wd(1.45) && !sbGolCd) {
            sbGolCd = true;
            setTimeout(() => {
              footBall.position.copy(footBall.userData.home);
              sbGolCd = false;
            }, 1400);
            sfx.quest();
            buzz([60, 40, 60]);
            if (!prog.done.sbplay) {
              prog.done.sbplay = true;
              addXp(10);
              checkAllDone();
              toast('Gol! Bola berhasil digiring ke gawang +10 XP');
            } else {
              toast('Gol lagi!');
            }
          }
        }
      }
    }

    const amt = moving ? 1 : 0;
    phase += dt * 9 * (moving ? Math.min(1, jLen) : 0);
    const swing = Math.sin(phase) * 0.55 * amt;
    if (legL) legL.rotation.x = swing;
    if (legR) legR.rotation.x = -swing;
    if (shot) {
      if (armL) armL.rotation.x = -2.0;
      if (armR) armR.rotation.x = -2.0;
    } else {
      if (armL) armL.rotation.x = -swing * 0.8;
      if (armR) armR.rotation.x = swing * 0.8;
    }
    player.position.y = Math.abs(Math.sin(phase)) * 0.05 * amt;

    for (const g of npcList) {
      g.position.y = Math.abs(Math.sin(t * 0.002 + g.userData.phase)) * 0.03;
      const nd = Math.hypot(player.position.x - g.position.x, player.position.z - g.position.z);
      if (nd < 3.6) {
        g.rotation.y = lerpAngle(g.rotation.y, Math.atan2(player.position.x - g.position.x, player.position.z - g.position.z), Math.min(1, dt * 3.5));
      } else if (g.userData.rot0 !== undefined) {
        g.rotation.y = lerpAngle(g.rotation.y, g.userData.rot0, Math.min(1, dt * 2));
      }
    }

    if (shot) {
      shot.e = Math.min(1, shot.e + dt / 0.85);
      const se = shot.e;
      shot.ball.position.set(
        shot.from.x + (shot.to.x - shot.from.x) * se,
        shot.from.y + (shot.to.y - shot.from.y) * se + Math.sin(Math.PI * se) * shot.arc,
        shot.from.z + (shot.to.z - shot.from.z) * se
      );
      shot.ball.rotation.x += dt * 9;
      if (se >= 1) {
        const s0 = shot;
        shot = null;
        if (s0.hit) {
          if (s0.cfg.need > 1) {
            s0.cfg.count += 1;
            sfx.pick();
            buzz(25);
            if (s0.cfg.count >= s0.cfg.need) {
              sfx.quest();
              buzz([60, 40, 60]);
              closeDlg();
              if (!prog.done[s0.cfg.id]) {
                prog.done[s0.cfg.id] = true;
                addXp(12);
                checkAllDone();
                toast(`${s0.cfg.label} selesai! +12 XP`);
              } else {
                toast(`${s0.cfg.label} selesai lagi!`);
              }
            } else {
              toast(`Berhasil ${s0.cfg.count}/${s0.cfg.need}! Lanjut!`);
            }
          } else {
            sfx.quest();
            buzz([60, 40, 60]);
            if (!prog.done[s0.cfg.id]) {
              prog.done[s0.cfg.id] = true;
              addXp(10);
              checkAllDone();
              toast('Masuk! +10 XP');
            } else {
              toast('Masuk lagi! (XP sudah pernah diambil)');
            }
          }
        } else {
          sfx.wrong();
          toast('Meleset! Coba lagi.');
        }
        landTimer = setTimeout(() => {
          s0.ball.position.copy(s0.home);
          if (s0.cfg.need > 1) {
            if (s0.cfg.count >= s0.cfg.need) {
              s0.cfg.count = 0;
              closeDlg();
            } else openShot(s0.cfg);
          } else closeDlg();
        }, 1100);
      }
    }

    if (!dialogOpen) {
      for (const st of stars) {
        st.mesh.rotation.y += dt * 2.2;
        st.mesh.position.y = 0.55 + Math.sin(t / 350 + st.i) * 0.08;
      }
      for (let i = stars.length - 1; i >= 0; i--) {
        const st = stars[i];
        if (Math.hypot(player.position.x - st.mesh.position.x, player.position.z - st.mesh.position.z) < 0.65) {
          scene.remove(st.mesh);
          stars.splice(i, 1);
          prog.stars.push(st.i);
          sfx.coin();
          buzz(20);
          if (prog.stars.length === STAR_POS.length) {
            prog.done.stars = true;
            addXp(15);
            toast('Semua bintang terkumpul! Bonus +15 XP');
            checkAllDone();
          } else {
            addXp(3);
            toast(`Bintang terkumpul +3 XP (${prog.stars.length}/${STAR_POS.length})`);
          }
        }
      }
      for (const tm of trashMeshes) tm.mesh.rotation.y += dt * 1.4;
      for (let i = huntMeshes.length - 1; i >= 0; i--) {
        const hb = huntMeshes[i];
        hb.mesh.rotation.y += dt * 1.8;
        hb.mesh.position.y = 0.6 + Math.sin(t / 380 + hb.i) * 0.07;
        if (Math.hypot(player.position.x - hb.mesh.position.x, player.position.z - hb.mesh.position.z) < 0.7) {
          scene.remove(hb.mesh);
          huntMeshes.splice(i, 1);
          prog.hunt.push(hb.i);
          saveProgress(prog);
          sfx.coin();
          buzz(20);
          if (prog.hunt.length === HUNT_POS.length) {
            prog.done.hunt = true;
            addXp(20);
            toast('Semua buku hilang ditemukan! +20 XP');
            checkAllDone();
          } else {
            addXp(4);
            toast(`Buku ditemukan +4 XP (${prog.hunt.length}/${HUNT_POS.length})`);
          }
        }
      }
      for (let i = trashMeshes.length - 1; i >= 0; i--) {
        const tm = trashMeshes[i];
        if (Math.hypot(player.position.x - tm.mesh.position.x, player.position.z - tm.mesh.position.z) < 0.62) {
          scene.remove(tm.mesh);
          trashMeshes.splice(i, 1);
          prog.trash.push(tm.i);
          sfx.pick();
          buzz(25);
          if (prog.trash.length === TRASH_POS.length) {
            prog.done.trash = true;
            addXp(20);
            toast('Sekolah bersih! Bonus +20 XP');
            checkAllDone();
          } else {
            addXp(5);
            toast(`Sampah terambil +5 XP (${prog.trash.length}/${TRASH_POS.length})`);
          }
        }
      }
      GARDEN_BEDS.forEach((b, i) => {
        if (!prog.kebun.includes(i) && Math.hypot(player.position.x - b.x, player.position.z - b.z) < 1.35) {
          prog.kebun.push(i);
          waterBed(i, bedPlant[i], false);
          saveProgress(prog);
          sfx.pick();
          buzz(25);
          if (prog.kebun.length === GARDEN_BEDS.length) {
            prog.done.kebun = true;
            setSignDone(ENT_KEBUN);
            addXp(10);
            sfx.quest();
            buzz([60, 40, 60]);
            toast('Kebun sekolah terawat! +10 XP');
            checkAllDone();
          } else {
            toast(`Tanaman disiram (${prog.kebun.length}/${GARDEN_BEDS.length})`);
          }
        }
      });
      if (!kebunHinted && !prog.done.kebun && Math.hypot(player.position.x + 9, player.position.z + 10.5) < 7) {
        kebunHinted = true;
        toast('Kebun: dekati tiap tanaman untuk menyiramnya!');
      }
    }

    const room = roomAt(player.position.x, player.position.z);
    currentRoom = room;
    if (player.position.x > -15.5) hasEntered = true;

    actNow = null;
    if (!dialogOpen && intro <= 0) {
      const rid = targetRoomOf(prog.carry);
      if (rid && room && room.id === rid) {
        actNow = { label: `Antar ${prog.carry.item}`, run: () => deliverQuest(room) };
      } else if (rid) {
        const zoneIa = interactables.find(ia => ia.id === rid);
        if (zoneIa && Math.hypot(player.position.x - zoneIa.x, player.position.z - zoneIa.z) < zoneIa.r * 0.9) {
          actNow = { label: `Antar ${prog.carry.item}`, run: () => deliverQuest(zoneIa) };
        }
      }
      if (!actNow) {
        let best = null;
        let bd = 1e9;
        for (const ia of interactables) {
          const d = Math.hypot(player.position.x - ia.x, player.position.z - ia.z);
          if (d < ia.r && d < bd) {
            bd = d;
            best = ia;
          }
        }
        if (best) actNow = { label: best.label, run: best.open };
      }
      if (!actNow && room) actNow = { label: `Pelajaran ${room.label}`, run: () => openLesson(room) };
      if (!actNow && hasEntered && player.position.x < -16.9 && Math.abs(player.position.z) < 2.6) {
        actNow = { label: 'Pintu Keluar', run: openExit };
      }
    }
    const actLabel = actNow ? actNow.label : '';
    if (actLabel !== actShown) {
      actShown = actLabel;
      if (actLabel) {
        actBtn.textContent = actLabel;
        actBtn.hidden = false;
      } else {
        actBtn.hidden = true;
      }
    }

    if (intro > 0) {
      intro -= dt;
      if (intro <= 0) toast('Tap chip XP untuk melihat daftar tujuan!');
      const k = Math.max(0, intro) / 3.2;
      const iy = -Math.PI / 2 + k * Math.PI * 0.7;
      const id = 5.2 + k * 4.5;
      camera.position.set(
        player.position.x + Math.sin(iy) * id,
        1.0 + id * (0.62 + k * 0.2),
        player.position.z + Math.cos(iy) * id
      );
      camera.lookAt(player.position.x, 1.15, player.position.z);
    } else {
      const desired = new THREE.Vector3(
        player.position.x + Math.sin(camYaw) * camDist,
        player.position.y + camDist * camRatio,
        player.position.z + Math.cos(camYaw) * camDist
      );
      camera.position.lerp(desired, Math.min(1, dt * 7));
      camera.lookAt(player.position.x, player.position.y + 1.0, player.position.z);
    }

    renderer.render(scene, camera);
  }

  let phase = 0;
  let mapTick = 0;
  let playSave = 0;
  const npcList = [buKantin, pakTono, buRina];
  SCHOOL_ROOMS.forEach((r, i) => {
    const tm = scene.children.find(o => o.isGroup && Math.abs(o.position.x - r.cx) < 0.01 && Math.abs(o.position.z + 6.8) < 0.01);
    if (tm) {
      tm.userData.phase = i * 1.7;
      tm.userData.rot0 = tm.rotation.y;
      tm.add(nameTag(r.teacher, r.color));
      tm.children[tm.children.length - 1].position.y = 2.25;
      npcList.push(tm);
    }
  });
  buKantin.userData.phase = 0.9;
  pakTono.userData.phase = 2.4;

  function dispose() {
    clearTimeout(answerTimer);
    clearInterval(powerTimer);
    clearTimeout(landTimer);
    clearTimeout(hintTimer);
    canvas.removeEventListener('pointerdown', camDown);
    canvas.removeEventListener('pointermove', camMove);
    canvas.removeEventListener('pointerup', camUp);
    canvas.removeEventListener('pointercancel', camUp);
    window.removeEventListener('keydown', keyDown);
    window.removeEventListener('keyup', keyUp);
    hud.remove();
    scene.traverse(o => {
      if (o.isMesh || o.isSprite) {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach(m => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      }
    });
  }

  return { tick, dispose };
}
