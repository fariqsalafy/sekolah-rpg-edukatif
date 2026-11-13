import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const jsDir = path.join(here, '..', 'js');

const src = readFileSync(path.join(jsDir, 'character.js'), 'utf8');
const patched = src.replace(/from\s+'three'/, "from '../vendor/three.module.min.js'");
if (patched === src) throw new Error('Import three tidak ditemukan di character.js');

const tmp = path.join(jsDir, '_character_smoke.mjs');
writeFileSync(tmp, patched);

try {
  const { buildCharacter } = await import(pathToFileURL(tmp).href);
  const opt = await import(pathToFileURL(path.join(jsDir, 'options.js')).href);

  const count = g => {
    let n = 0;
    g.traverse(o => { if (o.isMesh) n++; });
    return n;
  };

  const base = { ...opt.DEFAULT_CONFIG };
  const d = buildCharacter(base);
  console.log('default ok, meshes:', count(d));

  let total = 0;
  for (const gender of ['putra', 'putri']) {
    const styles = gender === 'putra'
      ? opt.HAIR_STYLES_PUTRA.map(s => s.id)
      : ['syari'];
    for (const style of styles) {
      for (const glasses of opt.GLASSES.map(x => x.id)) {
        for (const theme of opt.UNIFORM_THEMES.map(x => x.id)) {
          const cfg = {
            ...base,
            gender,
            hairStyle: style,
            jilbabStyle: style,
            glasses,
            uniformTheme: theme,
            height: Math.random(),
            width: Math.random()
          };
          const g = buildCharacter(cfg);
          const n = count(g);
          if (n < 10) throw new Error(`Mesh terlalu sedikit untuk ${gender}/${style}/${glasses}: ${n}`);
          total += n;
        }
      }
    }
  }
  console.log('semua kombinasi ok, total mesh:', total);

  const school = await import(pathToFileURL(path.join(jsDir, 'schoolData.js')).href);

  const gSrc = readFileSync(path.join(jsDir, 'game.js'), 'utf8')
    .replace(/from\s+'three'/, "from '../vendor/three.module.min.js'")
    .replace(/from\s+'\.\/character\.js'/, "from './_character_smoke.mjs'");
  if (!gSrc.includes('vendor/three.module.min.js')) throw new Error('Import three tidak ditemukan di game.js');
  const tmpGame = path.join(jsDir, '_game_smoke.mjs');
  writeFileSync(tmpGame, gSrc);

  try {
    const gameMod = await import(pathToFileURL(tmpGame).href);
    if (typeof gameMod.createGame !== 'function') throw new Error('createGame tidak ditemukan');
    if (school.SCHOOL_ROOMS.length !== 5) throw new Error('jumlah ruangan bukan 5');
    for (const r of school.SCHOOL_ROOMS) {
      if (!r.id || !r.label || !r.teacher || !r.lesson) throw new Error(`data ruangan tidak lengkap: ${r.id}`);
      for (const item of r.quiz) {
        if (!Array.isArray(item.o) || item.o.length !== 3) throw new Error(`opsi kuis tidak lengkap: ${r.id}`);
        if (!Number.isInteger(item.a) || item.a < 0 || item.a >= item.o.length) throw new Error(`jawaban kuis tidak valid: ${r.id}`);
      }
    }
    const roomIds = new Set(school.SCHOOL_ROOMS.map(r => r.id));
    for (const q of gameMod.QUESTS) {
      if (!roomIds.has(q.target) && q.target !== 'lib') throw new Error(`target quest tidak valid: ${q.id} -> ${q.target}`);
      if (q.giver !== 'kantin' && !roomIds.has(q.giver)) throw new Error(`giver quest tidak valid: ${q.id}`);
    }
    if (new Set(gameMod.WUDHU_STEPS).size !== 5) throw new Error('langkah wudhu tidak lengkap');
    if (gameMod.TRASH_POS.length !== 12) throw new Error('jumlah sampah bukan 12');
    if (gameMod.GARDEN_BEDS.length !== 3) throw new Error('jumlah bed kebun bukan 3');
    if (!gameMod.LIB.id || !gameMod.LIB.quiz) throw new Error('data perpustakaan tidak lengkap');
    if (Object.keys(gameMod.LAB_LIQUIDS).sort().join('') !== 'ABC') throw new Error('data lab tidak lengkap');
  } finally {
    unlinkSync(tmpGame);
  }
  console.log('data sekolah + aktivitas ok (kuis, quest, wudhu, sampah, kebun, lab)');
  console.log('SMOKE OK');
} finally {
  unlinkSync(tmp);
}
