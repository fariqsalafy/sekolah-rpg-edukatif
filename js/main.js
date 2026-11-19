import * as THREE from 'three';
import { buildCharacter } from './character.js';
import { createGame } from './game.js';
import { initCloud } from './cloud.js';
import { login, session, clearSession } from './auth.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
import {
  DEFAULT_CONFIG, HAIR_STYLES_PUTRA, HAIR_COLORS,
  JILBAB_COLORS, SKIN_TONES, GLASSES, GLASSES_COLORS,
  UNIFORM_THEMES, ACCENT_COLORS
} from './options.js';

const LS_KEY = 'sekolahRpg.karakter.v1';
const TABS = [
  { id: 'rambut', label: 'Rambut' },
  { id: 'kulit', label: 'Kulit' },
  { id: 'kacamata', label: 'Kacamata' },
  { id: 'badan', label: 'Badan' },
  { id: 'seragam', label: 'Seragam' }
];

function clamp01(v) {
  return Math.min(1, Math.max(0, Number.isFinite(+v) ? +v : 0.5));
}

function loadState() {
  let parsed = {};
  try {
    parsed = JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {};
  } catch (e) {
    parsed = {};
  }
  return {
    ...DEFAULT_CONFIG,
    ...parsed,
    height: clamp01(parsed.height ?? DEFAULT_CONFIG.height),
    width: clamp01(parsed.width ?? DEFAULT_CONFIG.width)
  };
}

let activeTab = 'rambut';
let needRebuild = true;
let charGroup = null;
let persistTimer = null;

const $ = sel => document.querySelector(sel);
const nameInput = $('#nameInput');
const genderSeg = $('#genderSeg');
const tabsEl = $('#tabs');
const panelBody = $('#panelBody');
const welcome = $('#welcome');
const welcomeText = $('#welcomeText');
const toastEl = $('#toast');

function ensureLogin() {
  const box = $('#login');
  const nisEl = $('#loginNis');
  const passEl = $('#loginPass');
  const errEl = $('#loginErr');
  const btn = $('#loginBtn');
  box.hidden = false;
  nisEl.focus();
  return new Promise(resolve => {
    const submit = async () => {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.textContent = 'Memeriksa...';
      errEl.hidden = true;
      try {
        const sesi = await login(nisEl.value, passEl.value);
        box.hidden = true;
        resolve(sesi);
      } catch (e) {
        errEl.textContent = e.message || 'Gagal masuk. Coba lagi.';
        errEl.hidden = false;
        passEl.value = '';
        passEl.focus();
      } finally {
        btn.disabled = false;
        btn.textContent = 'Masuk';
      }
    };
    btn.addEventListener('click', submit);
    nisEl.addEventListener('keydown', e => { if (e.key === 'Enter') passEl.focus(); });
    passEl.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  });
}

const user = session() || await ensureLogin();
await initCloud(user.id);
const hasProfile = !!localStorage.getItem(LS_KEY);
let state = loadState();
if (!state.name.trim()) state.name = user.nama;

function persistNow() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (e) {}
}

function persistDebounced() {
  clearTimeout(persistTimer);
  persistTimer = setTimeout(persistNow, 250);
}

let toastTimer = null;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const chip = (group, id, label, active) =>
  `<button class="chip${active ? ' active' : ''}" data-group="${group}" data-value="${id}">${label}</button>`;

const swatch = (group, value, active) =>
  `<button class="swatch${active ? ' active' : ''}" data-group="${group}" data-value="${value}" style="background:${value}" aria-label="Warna ${value}"></button>`;

const fieldLabel = text => `<div class="field-label">${text}</div>`;

function renderTabs() {
  tabsEl.innerHTML = TABS.map(t =>
    `<button data-tab="${t.id}" class="${t.id === activeTab ? 'active' : ''}">${t.label}</button>`
  ).join('');
}

function renderPanel() {
  const isPutri = state.gender === 'putri';
  let html = '';

  if (activeTab === 'rambut') {
    if (isPutri) {
      html += fieldLabel('Warna Jilbab');
      html += `<div class="swatches">${JILBAB_COLORS.map(c => swatch('jilbabColor', c, state.jilbabColor === c)).join('')}</div>`;
      html += `<p class="note">Jilbab syari wajib, melebar ke bawah. Tanpa poni, sesuai aturan sekolah.</p>`;
    } else {
      html += fieldLabel('Potongan Rambut');
      html += `<div class="chips">${HAIR_STYLES_PUTRA.map(s => chip('hairStyle', s.id, s.label, state.hairStyle === s.id)).join('')}</div>`;
      html += fieldLabel('Warna Rambut');
      html += `<div class="swatches">${HAIR_COLORS.map(c => swatch('hairColor', c, state.hairColor === c)).join('')}</div>`;
    }
  } else if (activeTab === 'kulit') {
    html += fieldLabel('Warna Kulit');
    html += `<div class="swatches big">${SKIN_TONES.map(c => swatch('skin', c, state.skin === c)).join('')}</div>`;
  } else if (activeTab === 'kacamata') {
    html += fieldLabel('Model Kacamata');
    html += `<div class="chips">${GLASSES.map(g => chip('glasses', g.id, g.label, state.glasses === g.id)).join('')}</div>`;
    if (state.glasses !== 'none') {
      html += fieldLabel('Warna Frame');
      html += `<div class="swatches">${GLASSES_COLORS.map(c => swatch('glassesColor', c, state.glassesColor === c)).join('')}</div>`;
    }
  } else if (activeTab === 'badan') {
    html += `<div class="slider-row">
      <label>Tinggi Badan</label>
      <input type="range" id="slHeight" min="0" max="1" step="0.01" value="${state.height}">
    </div>
    <div class="slider-row">
      <label>Lebar Badan</label>
      <input type="range" id="slWidth" min="0" max="1" step="0.01" value="${state.width}">
    </div>
    <p class="note">Geser untuk melihat perubahan pada karakter secara langsung.</p>`;
  } else if (activeTab === 'seragam') {
    html += fieldLabel('Tema Seragam');
    html += `<div class="themes">${UNIFORM_THEMES.map(t => `
      <button class="theme-card${state.uniformTheme === t.id ? ' active' : ''}" data-group="uniformTheme" data-value="${t.id}">
        <div class="theme-colors">
          <span style="background:${t.shirt}"></span>
          <span style="background:${t.bottom}"></span>
          <span style="background:${t.accent}"></span>
        </div>
        <div class="name">${t.label}</div>
      </button>`).join('')}</div>`;
    html += fieldLabel('Warna Aksen');
    html += `<div class="swatches">${ACCENT_COLORS.map(c => swatch('accent', c, state.accent === c)).join('')}</div>`;
    html += `<p class="note">Putri memakai rok panjang sesuai aturan sekolah.</p>`;
  }

  panelBody.innerHTML = html;

  const slH = panelBody.querySelector('#slHeight');
  const slW = panelBody.querySelector('#slWidth');
  if (slH) slH.addEventListener('input', e => {
    state.height = clamp01(e.target.value);
    needRebuild = true;
    persistDebounced();
  });
  if (slW) slW.addEventListener('input', e => {
    state.width = clamp01(e.target.value);
    needRebuild = true;
    persistDebounced();
  });
}

function syncGenderSeg() {
  genderSeg.querySelectorAll('button').forEach(b =>
    b.classList.toggle('active', b.dataset.gender === state.gender)
  );
}

const GROUP_SETTERS = {
  hairStyle: v => { state.hairStyle = v; },
  jilbabStyle: v => { state.jilbabStyle = v; },
  hairColor: v => { state.hairColor = v; },
  jilbabColor: v => { state.jilbabColor = v; },
  skin: v => { state.skin = v; },
  glasses: v => { state.glasses = v; },
  glassesColor: v => { state.glassesColor = v; },
  uniformTheme: v => { state.uniformTheme = v; },
  accent: v => { state.accent = v; }
};

panelBody.addEventListener('click', e => {
  const btn = e.target.closest('[data-group]');
  if (!btn) return;
  const { group, value } = btn.dataset;
  const setter = GROUP_SETTERS[group];
  if (!setter) return;
  setter(value);
  needRebuild = true;
  persistDebounced();
  renderPanel();
});

tabsEl.addEventListener('click', e => {
  const btn = e.target.closest('[data-tab]');
  if (!btn) return;
  activeTab = btn.dataset.tab;
  renderTabs();
  renderPanel();
});

genderSeg.addEventListener('click', e => {
  const btn = e.target.closest('[data-gender]');
  if (!btn) return;
  state.gender = btn.dataset.gender;
  syncGenderSeg();
  renderPanel();
  needRebuild = true;
  persistDebounced();
});

nameInput.addEventListener('input', () => {
  state.name = nameInput.value;
  persistDebounced();
});

$('#btnRandom').addEventListener('click', () => {
  state.gender = pick(['putra', 'putri']);
  state.hairStyle = pick(HAIR_STYLES_PUTRA).id;
  state.jilbabStyle = 'syari';
  state.hairColor = pick(HAIR_COLORS);
  state.jilbabColor = pick(JILBAB_COLORS);
  state.skin = pick(SKIN_TONES);
  state.glasses = pick(GLASSES).id;
  state.glassesColor = pick(GLASSES_COLORS);
  state.height = 0.25 + Math.random() * 0.5;
  state.width = 0.25 + Math.random() * 0.5;
  state.uniformTheme = pick(UNIFORM_THEMES).id;
  state.accent = pick(ACCENT_COLORS);
  syncGenderSeg();
  renderPanel();
  needRebuild = true;
  persistDebounced();
});

$('#btnReset').addEventListener('click', () => {
  state = { ...DEFAULT_CONFIG, name: state.name };
  nameInput.value = state.name;
  syncGenderSeg();
  renderPanel();
  needRebuild = true;
  persistNow();
  toast('Kustomisasi direset ke bawaan.');
});

$('#btnSave').addEventListener('click', () => {
  if (!state.name.trim()) {
    toast('Isi nama dulu, ya!');
    nameInput.focus();
    return;
  }
  persistNow();
  welcomeText.textContent = `Mantap, ${state.name.trim()}! Karaktermu siap berpetualang di SMP ABBS Surakarta.`;
  welcome.hidden = false;
});

function enterSchool() {
  if (!state.name.trim()) {
    toast('Isi nama dulu, ya!');
    nameInput.focus();
    return;
  }
  persistNow();
  welcome.hidden = true;
  document.body.classList.add('in-game');
  mode = 'game';
  game = createGame({ canvas, renderer, characterConfig: { ...state }, toast, onEdit: exitToEdit, onLogout: doLogout });
  toast(`Selamat datang di SMP ABBS Surakarta, ${state.name.trim()}!`);
}

function doLogout() {
  if (game) {
    game.dispose();
    game = null;
  }
  clearSession();
  location.reload();
}

function exitToEdit() {
  if (game) {
    game.dispose();
    game = null;
  }
  mode = 'custom';
  document.body.classList.remove('in-game');
  needRebuild = true;
}

$('#btnEdit').addEventListener('click', () => {
  welcome.hidden = true;
});

$('#btnEnter').addEventListener('click', enterSchool);
$('#btnSchool').addEventListener('click', enterSchool);

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas: $('#scene'), antialias: true });
} catch (e) {
  $('#webglError').hidden = false;
  $('#panel').hidden = true;
  $('#stage').hidden = true;
  throw e;
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#202326');
scene.fog = new THREE.Fog('#202326', 7, 13);

const stage = $('#stage');
const canvas = $('#scene');
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
const camTarget = new THREE.Vector3(0, 1.05, 0);
const camSph = { radius: 3.6, theta: 0.45, phi: 1.22 };

function updateCamera() {
  const { radius, theta, phi } = camSph;
  camera.position.set(
    camTarget.x + radius * Math.sin(phi) * Math.sin(theta),
    camTarget.y + radius * Math.cos(phi),
    camTarget.z + radius * Math.sin(phi) * Math.cos(theta)
  );
  camera.lookAt(camTarget);
}

scene.add(new THREE.HemisphereLight('#ffffff', '#43474d', 0.7));
const dir = new THREE.DirectionalLight('#ffffff', 0.95);
dir.position.set(2.5, 5.5, 3.5);
dir.castShadow = true;
dir.shadow.mapSize.set(1024, 1024);
dir.shadow.camera.left = -3;
dir.shadow.camera.right = 3;
dir.shadow.camera.top = 3.5;
dir.shadow.camera.bottom = -1;
dir.shadow.camera.near = 0.5;
dir.shadow.camera.far = 14;
scene.add(dir);

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(2.8, 48),
  new THREE.MeshStandardMaterial({ color: '#2b2f34', roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

function disposeGroup(group) {
  group.traverse(o => {
    if (o.isMesh) {
      o.geometry.dispose();
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach(m => m.dispose());
    }
  });
}

function rebuildCharacter() {
  if (charGroup) {
    scene.remove(charGroup);
    disposeGroup(charGroup);
  }
  charGroup = buildCharacter(state);
  scene.add(charGroup);
  needRebuild = false;
}

function resize() {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

const pointers = new Map();
let pinchDist = 0;
let hintShown = true;

canvas.addEventListener('pointerdown', e => {
  if (mode !== 'custom') return;
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
  }
});

canvas.addEventListener('pointermove', e => {
  if (mode !== 'custom' || !pointers.has(e.pointerId)) return;
  const prev = pointers.get(e.pointerId);
  const dx = e.clientX - prev.x;
  const dy = e.clientY - prev.y;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (hintShown) {
    hintShown = false;
    $('#hint').style.opacity = '0';
  }
  if (pointers.size === 1) {
    camSph.theta -= dx * 0.006;
    camSph.phi = Math.min(1.5, Math.max(0.5, camSph.phi - dy * 0.004));
  } else if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (pinchDist > 0) {
      camSph.radius = Math.min(5.6, Math.max(2.2, camSph.radius * pinchDist / dist));
    }
    pinchDist = dist;
  }
});

const clearPointer = e => {
  pointers.delete(e.pointerId);
  pinchDist = 0;
};
canvas.addEventListener('pointerup', clearPointer);
canvas.addEventListener('pointercancel', clearPointer);

canvas.addEventListener('wheel', e => {
  if (mode !== 'custom') return;
  e.preventDefault();
  camSph.radius = Math.min(5.6, Math.max(2.2, camSph.radius * (1 + e.deltaY * 0.001)));
}, { passive: false });

let mode = 'custom';
let game = null;
let lastT = 0;

renderer.setAnimationLoop(t => {
  const dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
  lastT = t;
  if (mode === 'game' && game) {
    game.tick(dt, t);
    return;
  }
  if (needRebuild) rebuildCharacter();
  if (charGroup) charGroup.position.y = Math.abs(Math.sin(t * 0.0015)) * 0.03;
  updateCamera();
  renderer.render(scene, camera);
});

nameInput.value = state.name;
syncGenderSeg();
renderTabs();
renderPanel();
resize();
if (hasProfile) enterSchool();
