import * as THREE from 'three';
import { materials } from '../materials';
import { glyphTexture } from '../textTexture';

const TAU = Math.PI * 2;

export interface DrumOptions {
  radius?: number;
  length?: number;
}

/** Offsets (along the drum axis X) of the two numeral bands. */
export const BAND = {
  value: -0.34,
  complement: 0.34,
} as const;

/**
 * The display drum (tympan): a cylinder along X carrying TWO numeral bands —
 * the value (digit d) and its nine's-complement (9 − d) — side by side. At the
 * reading window both a digit and its complement appear; the sliding bar
 * (added per station) masks whichever band is not in use.
 *
 * Digit `d` sits at the reading window when rotation.x = d·NOTCH + READ_OFFSET;
 * because the complement numeral (9−d) shares slot d, it lands at the window at
 * the same moment.
 */
export function createDisplayDrum(opts: DrumOptions = {}): THREE.Group {
  const radius = opts.radius ?? 0.95;
  const length = opts.length ?? 1.4;
  const group = new THREE.Group();
  group.name = 'displayDrum';

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 48, 1, false),
    materials.parchment,
  );
  body.rotation.z = Math.PI / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  for (const sx of [-1, 1]) {
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 1.02, radius * 1.02, 0.06, 48),
      materials.brassDark,
    );
    cap.rotation.z = Math.PI / 2;
    cap.position.x = sx * (length / 2);
    group.add(cap);
  }

  // Thin rib between the two bands.
  const rib = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.005, radius * 1.005, 0.04, 48),
    materials.brassDark,
  );
  rib.rotation.z = Math.PI / 2;
  group.add(rib);

  const planeW = 0.5;
  const planeH = ((radius * TAU) / 10) * 0.8;
  const planeGeo = new THREE.PlaneGeometry(planeW, planeH);

  const makePlane = (text: string, bandX: number): THREE.Mesh => {
    const plane = new THREE.Mesh(
      planeGeo,
      new THREE.MeshStandardMaterial({ map: glyphTexture(text), roughness: 0.9, metalness: 0 }),
    );
    plane.position.set(bandX, radius + 0.002, 0);
    plane.rotation.x = -Math.PI / 2;
    return plane;
  };

  for (let d = 0; d < 10; d++) {
    const pivot = new THREE.Object3D();
    pivot.rotation.x = -d * (TAU / 10);
    pivot.add(makePlane(String(d), BAND.value)); // value band
    pivot.add(makePlane(String(9 - d), BAND.complement)); // complement band
    group.add(pivot);
  }

  return group;
}
