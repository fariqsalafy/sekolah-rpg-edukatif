export const SKIN_TONES = [
  '#ffe3d3', '#f7cfae', '#eab890', '#d69f70',
  '#b97f52', '#9c6444', '#7d4a30', '#5b3323'
];

export const HAIR_COLORS = [
  '#161311', '#2b211a', '#42291a', '#5a3a22',
  '#7a4e2b', '#96703a', '#2d2d2d', '#6b4a32'
];

export const JILBAB_COLORS = [
  '#1b1b22', '#f2ead9', '#35507e', '#2e6b4f', '#7a2e3a',
  '#5b3a72', '#8a8f98', '#d98a9e', '#2f8f83', '#6b4a32'
];

export const HAIR_STYLES_PUTRA = [
  { id: 'cepak', label: 'Cepak' },
  { id: 'nape', label: 'Pendek Belakang' },
  { id: 'spiky', label: 'Spiky' }
];

export const GLASSES = [
  { id: 'none', label: 'Tanpa Kacamata' },
  { id: 'bulat', label: 'Bulat' },
  { id: 'kotak', label: 'Kotak' },
  { id: 'rimless', label: 'Rimless' },
  { id: 'aviator', label: 'Aviator' },
  { id: 'hitam', label: 'Kacamata Hitam' }
];

export const GLASSES_COLORS = [
  '#2b2b2b', '#6b4a32', '#33517d', '#7a2e3a', '#2f8f83', '#8a8f98'
];

export const UNIFORM_THEMES = [
  { id: 'putih-abu', label: 'Putih-Abu', shirt: '#f4f4f2', bottom: '#6b6f78', accent: '#4a4f57' },
  { id: 'biru-krem', label: 'Biru-Krem', shirt: '#33517d', bottom: '#2c3f60', accent: '#e8d8a8' },
  { id: 'hijau-putih', label: 'Hijau-Putih', shirt: '#f4f4f2', bottom: '#2e6b4f', accent: '#2e6b4f' },
  { id: 'maroon-krem', label: 'Maroon-Krem', shirt: '#7a2e3a', bottom: '#5c232c', accent: '#e8d8a8' },
  { id: 'navy-putih', label: 'Navy-Putih', shirt: '#22335a', bottom: '#1c2a4a', accent: '#f4f4f2' },
  { id: 'tosca-krem', label: 'Tosca-Krem', shirt: '#2f8f83', bottom: '#256b62', accent: '#e8d8a8' }
];

export const ACCENT_COLORS = [
  '#e8d8a8', '#f4f4f2', '#2e6b4f', '#7a2e3a', '#33517d', '#e8a13a'
];

export const DEFAULT_CONFIG = {
  name: '',
  gender: 'putra',
  hairStyle: 'cepak',
  jilbabStyle: 'syari',
  hairColor: HAIR_COLORS[0],
  jilbabColor: JILBAB_COLORS[0],
  skin: SKIN_TONES[2],
  glasses: 'none',
  glassesColor: GLASSES_COLORS[0],
  height: 0.5,
  width: 0.5,
  uniformTheme: 'putih-abu',
  accent: ACCENT_COLORS[0]
};

export function findStyle(list, id, fallback = 0) {
  return list.find(item => item.id === id) ?? list[fallback];
}

export function findTheme(id) {
  return UNIFORM_THEMES.find(t => t.id === id) ?? UNIFORM_THEMES[0];
}
