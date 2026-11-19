const SB_URL = 'https://djybwvdjipxftxmtqjbt.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqeWJ3dmRqaXB4ZnR4bXRxamJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwODI5NzgsImV4cCI6MjA5NDY1ODk3OH0.vKFaGeIHieNQuXvepaA-GuUqlJ7QjIPmwB7ZKo3Kx8U';
const TBL = 'app_settings';
const PREFIX = 'rpg_save_';
const LAST_KEY = 'sekolahRpg.lastUser';
const CHAR_KEY = 'sekolahRpg.karakter.v1';
const PROG_KEY = 'sekolahRpg.progres.v1';
const WATCH = [CHAR_KEY, PROG_KEY];
let userId = '';

async function pull() {
  try {
    const res = await Promise.race([
      fetch(`${SB_URL}/rest/v1/${TBL}?key=eq.${PREFIX}${userId}&select=value&limit=1`, {
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
      }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000))
    ]);
    if (!res.ok) return null;
    const rows = await res.json();
    if (!rows.length) return null;
    return JSON.parse(rows[0].value);
  } catch (e) {
    return null;
  }
}

let pushTimer = null;

function queuePush() {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(push, 1500);
}

async function push() {
  try {
    const payload = {
      karakter: localStorage.getItem(CHAR_KEY) || '',
      progres: localStorage.getItem(PROG_KEY) || ''
    };
    const res = await Promise.race([
      fetch(`${SB_URL}/rest/v1/${TBL}?on_conflict=key`, {
        method: 'POST',
        keepalive: true,
        headers: {
          apikey: SB_KEY,
          Authorization: `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify([{ key: PREFIX + userId, value: JSON.stringify(payload), updated_at: new Date().toISOString() }])
      }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))
    ]);
    if (!res.ok) throw new Error('push gagal ' + res.status);
    try {
      localStorage.setItem('sekolahRpg.synced', String(Date.now()));
    } catch (e) {}
  } catch (e) {}
}

export function initCloud(uid) {
  userId = uid;
  try {
    const orig = localStorage.setItem.bind(localStorage);
    localStorage.setItem = (k, v) => {
      orig(k, v);
      if (WATCH.includes(k)) queuePush();
    };
    if (localStorage.getItem(LAST_KEY) !== userId) {
      localStorage.removeItem(CHAR_KEY);
      localStorage.removeItem(PROG_KEY);
      orig(LAST_KEY, userId);
    }
  } catch (e) {}
  window.addEventListener('pagehide', () => {
    clearTimeout(pushTimer);
    push();
  });
  return pull().then(cloud => {
    if (!cloud) return;
    try {
      if (!localStorage.getItem(CHAR_KEY) && cloud.karakter) localStorage.setItem(CHAR_KEY, cloud.karakter);
      if (!localStorage.getItem(PROG_KEY) && cloud.progres) localStorage.setItem(PROG_KEY, cloud.progres);
    } catch (e) {}
  }).catch(() => {});
}
