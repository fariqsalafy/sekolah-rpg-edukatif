import * as THREE from 'three';
import { findTheme } from './options.js';

function clamp01(v) {
  return Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0.5));
}

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.85,
    metalness: 0.02,
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

function cyl(rt, rb, h, material, seg = 20) {
  return mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material);
}

function blocky(rt, rb, h, material) {
  const m = mesh(new THREE.CylinderGeometry(rt, rb, h, 4), material);
  m.rotation.y = Math.PI / 4;
  m.scale.z = 0.62;
  return m;
}

function torus(r, t, material, arc = Math.PI * 2) {
  return mesh(new THREE.TorusGeometry(r, t, 12, 28, arc), material);
}

function circle(r, material) {
  return mesh(new THREE.CircleGeometry(r, 24), material);
}

function place(m, x, y, z, rot = null) {
  m.position.set(x, y, z);
  if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
  return m;
}

const HW = 0.92;
const HH = 0.8;
const HD = 0.82;
const FACE_Z = HD / 2;

export function buildCharacter(cfg) {
  const root = new THREE.Group();
  const isPutri = cfg.gender === 'putri';
  const hf = 0.9 + clamp01(cfg.height) * 0.2;
  const wf = 0.88 + clamp01(cfg.width) * 0.24;

  const theme = findTheme(cfg.uniformTheme);
  const M = {
    skin: mat(cfg.skin),
    hair: mat(cfg.hairColor),
    hijab: mat(cfg.jilbabColor),
    shirt: mat(theme.shirt),
    bottom: mat(theme.bottom),
    accent: mat(cfg.accent),
    frame: mat(cfg.glassesColor, { roughness: 0.4 }),
    eye: mat('#241c18', { roughness: 0.35 }),
    white: mat('#ffffff', { roughness: 0.3 }),
    lens: mat('#cfe8f5', { transparent: true, opacity: 0.16, roughness: 0.15 }),
    lensTint: mat('#bfe3f2', { transparent: true, opacity: 0.25, roughness: 0.15 }),
    lensDark: mat('#15181f', { transparent: true, opacity: 0.85, roughness: 0.1 }),
    shoe: mat('#2b2b30')
  };

  let torsoBase;

  if (isPutri) {
    const skirtLen = 0.62 * hf;
    const skirt = blocky(0.52 * wf, 0.735 * wf, skirtLen, M.bottom);
    place(skirt, 0, 0.08 + skirtLen / 2, 0);
    root.add(skirt);
    const band = blocky(0.54 * wf, 0.54 * wf, 0.07, M.accent);
    place(band, 0, 0.08 + skirtLen + 0.03, 0);
    root.add(band);
    torsoBase = 0.08 + skirtLen + 0.02;
  } else {
    const legLen = 0.5 * hf;
    for (const [s, name] of [[1, 'legL'], [-1, 'legR']]) {
      const hip = new THREE.Group();
      hip.name = name;
      hip.position.set(s * 0.17 * wf, legLen, 0);
      const leg = box(0.24 * wf, legLen, 0.26 * wf, M.bottom);
      place(leg, 0, -legLen / 2, 0);
      hip.add(leg);
      const shoe = box(0.28, 0.12, 0.42, M.shoe);
      place(shoe, 0, -legLen + 0.06, 0.06);
      hip.add(shoe);
      root.add(hip);
    }
    torsoBase = legLen - 0.01;
  }

  const torsoH = 0.52 * hf;
  const torsoTop = torsoBase + torsoH;
  const torso = box(0.72 * wf, torsoH, 0.42 * wf, M.shirt);
  place(torso, 0, torsoBase + torsoH / 2, 0);
  root.add(torso);

  for (const s of [-1, 1]) {
    const flap = box(0.14, 0.09, 0.04, M.accent);
    place(flap, s * 0.2 * wf, torsoTop - 0.15, 0.21 * wf + 0.02);
    root.add(flap);
  }

  for (let i = 0; i < 3; i++) {
    const btn = box(0.07, 0.07, 0.03, M.eye);
    place(btn, 0, torsoTop - 0.2 - i * 0.12 * hf, 0.21 * wf + 0.02);
    root.add(btn);
  }

  const armLen = 0.46 * hf;
  const sleeveLen = isPutri ? armLen * 0.82 : armLen * 0.55;
  for (const s of [-1, 1]) {
    const arm = new THREE.Group();
    arm.name = s === 1 ? 'armL' : 'armR';
    arm.position.set(s * 0.47 * wf, torsoTop - 0.02, 0);
    arm.rotation.z = s * 0.1;
    const upper = box(0.2 * wf, armLen, 0.2 * wf, M.skin);
    place(upper, 0, -armLen / 2, 0);
    arm.add(upper);
    const sleeve = box(0.24 * wf, sleeveLen, 0.24 * wf, M.shirt);
    place(sleeve, 0, -sleeveLen / 2 + 0.01, 0);
    arm.add(sleeve);
    const cuff = box(0.26 * wf, 0.05, 0.26 * wf, M.accent);
    place(cuff, 0, -sleeveLen + 0.02, 0);
    arm.add(cuff);
    root.add(arm);
  }

  const head = box(HW, HH, HD, M.skin);
  head.position.set(0, torsoTop + 0.28, 0);
  const headXZ = 1 + (wf - 1) * 0.55;
  head.scale.set(headXZ, 1, headXZ);
  root.add(head);

  for (const s of [-1, 1]) {
    head.add(place(box(0.1, 0.17, 0.03, M.eye), s * 0.2, 0.02, FACE_Z + 0.015));
    head.add(place(box(0.035, 0.05, 0.012, M.white), s * 0.163, 0.075, FACE_Z + 0.034));
  }
  head.add(place(torus(0.11, 0.022, M.eye, Math.PI), 0, -0.16, FACE_Z + 0.025, [0, 0, Math.PI]));

  if (isPutri) {
    head.add(place(box(1.16, 0.28, 1.02, M.hijab), 0, 0.38, 0));
    head.add(place(box(1.06, 0.62, 0.16, M.hijab), 0, 0, -0.47));
    head.add(place(box(0.16, 0.6, 0.86, M.hijab), 0.5, 0, -0.03));
    head.add(place(box(0.16, 0.6, 0.86, M.hijab), -0.5, 0, -0.03));
    head.add(place(box(0.08, 0.08, 0.07, M.accent), 0.5, 0.22, 0.38));
    const chestY = torsoTop;
    root.add(place(blocky(0.56 * wf, 1.02 * wf, 0.8 * hf, M.hijab), 0, chestY - 0.4 * hf, 0));
  } else {
    const slab = (w, h, d, y, z = 0) => head.add(place(box(w, h, d, M.hair), 0, y, z));
    switch (cfg.hairStyle) {
      case 'two-block':
        slab(1.04, 0.24, 0.96, 0.4);
        head.add(place(box(0.12, 0.52, 0.86, M.hair), 0.5, -0.02, 0));
        head.add(place(box(0.12, 0.52, 0.86, M.hair), -0.5, -0.02, 0));
        break;
      case 'gantung':
        slab(1.0, 0.22, 0.94, 0.41);
        head.add(place(box(0.74, 0.26, 0.1, M.hair), 0, 0.31, FACE_Z + 0.02));
        break;
      case 'nape':
        slab(1.0, 0.24, 0.94, 0.4);
        head.add(place(box(0.9, 0.4, 0.12, M.hair), 0, -0.08, -0.47));
        break;
      case 'spiky': {
        slab(0.98, 0.2, 0.9, 0.46);
        const spikes = [
          [0.22, 0.6, 0.2, [0, 0, -0.25]],
          [-0.22, 0.6, 0.2, [0, 0, 0.25]],
          [0.18, 0.58, -0.24, [-0.2, 0, 0]],
          [-0.18, 0.58, -0.24, [-0.2, 0, 0]],
          [0, 0.64, 0.02, null]
        ];
        for (const [x, y, z, r] of spikes) head.add(place(box(0.16, 0.18, 0.16, M.hair), x, y, z, r));
        break;
      }
      case 'undercut':
        slab(1.0, 0.26, 0.94, 0.42);
        head.add(place(box(0.6, 0.12, 0.08, M.hair), 0, 0.34, FACE_Z + 0.02));
        break;
      default:
        slab(0.98, 0.3, 0.92, 0.37);
    }
  }

  if (cfg.glasses !== 'none') {
    for (const s of [-1, 1]) {
      const ex = s * 0.2;
      if (cfg.glasses === 'bulat') {
        head.add(place(torus(0.1, 0.02, M.frame), ex, 0.02, FACE_Z + 0.03));
        head.add(place(circle(0.088, M.lens), ex, 0.02, FACE_Z + 0.025));
      } else if (cfg.glasses === 'kotak' || cfg.glasses === 'hitam') {
        head.add(place(box(0.2, 0.15, 0.03, M.frame), ex, 0.02, FACE_Z + 0.03));
        const lensMat = cfg.glasses === 'hitam' ? M.lensDark : M.lens;
        head.add(place(box(0.15, 0.11, 0.02, lensMat), ex, 0.02, FACE_Z + 0.022));
      } else if (cfg.glasses === 'rimless') {
        head.add(place(circle(0.095, M.lens), ex, 0.02, FACE_Z + 0.02));
      } else if (cfg.glasses === 'aviator') {
        const ring = torus(0.105, 0.02, M.frame);
        ring.scale.set(1, 0.72, 1);
        head.add(place(ring, ex, 0.02, FACE_Z + 0.03));
        const lens = circle(0.093, M.lensTint);
        lens.scale.set(1, 0.72, 1);
        head.add(place(lens, ex, 0.02, FACE_Z + 0.025));
      }
    }
    head.add(place(box(0.09, 0.024, 0.02, M.frame), 0, 0.05, FACE_Z + 0.035));
  }

  return root;
}
