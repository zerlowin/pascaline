import * as THREE from 'three';
import { materials } from '../materials';
import { glyphTexture } from '../textTexture';

const TAU = Math.PI * 2;

export interface DrumOptions {
  radius?: number;
  length?: number;
}

/**
 * The display drum (tympan): a cylinder laid along the X axis carrying the
 * numerals 0–9 as upright canvas-texture planes, one per angular slot. Reading
 * window is at the top (+Y). Rotating the drum about X scrolls digits through
 * the window.
 *
 * Digit `d` sits at the top when the drum's rotation.x = d · (2π/10). Advancing
 * the register (d → d+1) therefore increases rotation.x by one notch.
 *
 * Returns a group whose own transform is identity — the caller (rotor) owns the
 * X-rotation so the counting gear turns with it.
 */
export function createDisplayDrum(opts: DrumOptions = {}): THREE.Group {
  const radius = opts.radius ?? 0.95;
  const length = opts.length ?? 1.3;
  const group = new THREE.Group();
  group.name = 'displayDrum';

  // Drum body: a Y-axis cylinder rotated to lie along X.
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 48, 1, false),
    materials.parchment,
  );
  body.rotation.z = Math.PI / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Two brass end caps for a finished look.
  for (const sx of [-1, 1]) {
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 1.02, radius * 1.02, 0.06, 48),
      materials.brassDark,
    );
    cap.rotation.z = Math.PI / 2;
    cap.position.x = sx * (length / 2);
    group.add(cap);
  }

  // Numeral planes on per-digit pivots around the X axis.
  const planeW = Math.min(length * 0.62, 0.85);
  const planeH = (radius * TAU) / 10 * 0.82;
  const planeGeo = new THREE.PlaneGeometry(planeW, planeH);

  for (let d = 0; d < 10; d++) {
    const pivot = new THREE.Object3D();
    pivot.rotation.x = -d * (TAU / 10); // digit d's angular slot
    const plane = new THREE.Mesh(
      planeGeo,
      new THREE.MeshStandardMaterial({
        map: glyphTexture(String(d)),
        roughness: 0.9,
        metalness: 0,
      }),
    );
    // Sit on the rim, normal pointing radially outward, numeral upright:
    plane.position.set(0, radius + 0.002, 0);
    plane.rotation.x = -Math.PI / 2;
    pivot.add(plane);
    group.add(pivot);
  }

  return group;
}
