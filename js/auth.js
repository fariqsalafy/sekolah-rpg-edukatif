const SB_URL = 'https://drlsnhnqxkcgcuskswwx.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybHNuaG5xeGtjZ2N1c2tzd3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTI5NDMsImV4cCI6MjA4NzgyODk0M30.IbnoYC02FUwMsCbdwb5bPFEjnMvkVc2NGwfrWwR8BQs';
const SEKOLAH_ID = '503a0f26-abeb-4a0f-94a4-2f4a23fc96d2';
const SESI_KEY = 'sekolahRpg.sesi';

const readJson = res => res.json().catch(() => null);

export function session() {
  try {
    return JSON.parse(localStorage.getItem(SESI_KEY) || 'null');
  } catch (e) {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESI_KEY);
  } catch (e) {}
}

export async function login(nis, password) {
  const id = String(nis || '').trim();
  if (!id || !password) throw new Error('Isi NIS dan kata sandi.');

  const rpc = await fetch(`${SB_URL}/rest/v1/rpc/get_email_by_nis`, {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Content-Profile': 'public'
    },
    body: JSON.stringify({ p_nis: id, p_sekolah_id: SEKOLAH_ID })
  });
  if (!rpc.ok) throw new Error('Server login tidak merespons. Coba lagi.');
  const email = await readJson(rpc);
  if (!email) throw new Error('NIS tidak ditemukan.');

  const auth = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!auth.ok) throw new Error('NIS atau kata sandi salah.');
  const token = await readJson(auth);

  let profil = [];
  try {
    const prof = await fetch(`${SB_URL}/rest/v1/profiles?id=eq.${token.user.id}&select=nama,kelas&limit=1`, {
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${token.access_token}`,
        'Accept-Profile': 'public'
      }
    });
    if (prof.ok) profil = (await readJson(prof)) || [];
  } catch (e) {}

  const sesi = {
    id: token.user.id,
    nis: id,
    nama: (profil[0] && profil[0].nama) || `Siswa ${id}`,
    kelas: (profil[0] && profil[0].kelas) || ''
  };
  try {
    localStorage.setItem(SESI_KEY, JSON.stringify(sesi));
  } catch (e) {}
  return sesi;
}
