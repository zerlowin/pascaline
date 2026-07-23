import * as THREE from 'three';
import { materials } from '../materials';
import { glyphTexture } from '../textTexture';
import type { PartUserData } from '../../types';

const TAU = Math.PI * 2;

export interface InputWheelOptions {
  radius?: number;
  stationIndex: number;
}

export interface InputWheelBuild {
  group: THREE.Group;
  /** The clickable stylus-hole meshes (userData carries the digit to add). */
  holes: THREE.Mesh[];
}

/**
 * The stylus input wheel: a spoked dial facing the viewer (rotates about Z),
 * with ten numbered stylus holes like a rotary telephone dial. Clicking hole
 * `d` adds `d` to this station's counting wheel.
 */
export function createInputWheel(opts: InputWheelOptions): InputWheelBuild {
  const radius = opts.radius ?? 0.8;
  const group = new THREE.Group();
  group.name = 'inputWheel';

  // Face disc.
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 0.1, 40),
    materials.brass,
  );
  disc.rotation.x = Math.PI / 2; // Y-axis cylinder → axis along Z (faces viewer)
  disc.castShadow = true;
  disc.receiveShadow = true;
  group.add(disc);

  // Rim.
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.06, 12, 48),
    materials.brassDark,
  );
  group.add(rim);

  // Hub.
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.14, 20),
    materials.brassDark,
  );
  hub.rotation.x = Math.PI / 2;
  group.add(hub);

  const holes: THREE.Mesh[] = [];
  const holeRing = radius * 0.66;
  for (let d = 0; d < 10; d++) {
    const a = (d / 10) * TAU + Math.PI / 2; // 0 at top, clockwise
    const x = Math.cos(a) * holeRing;
    const y = Math.sin(a) * holeRing;

    // Recessed hole.
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.14, 16),
      materials.hole,
    );
    hole.rotation.x = Math.PI / 2;
    hole.position.set(x, y, 0.02);
    const data: PartUserData = { partId: 'inputWheel', stationIndex: opts.stationIndex, digit: d };
    hole.userData = data;
    group.add(hole);
    holes.push(hole);

    // Numeral beside the hole.
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.22),
      new THREE.MeshStandardMaterial({ map: glyphTexture(String(d)), roughness: 0.8, metalness: 0.1 }),
    );
    const lr = radius * 0.9;
    label.position.set(Math.cos(a) * lr, Math.sin(a) * lr, 0.06);
    group.add(label);

    // Spoke between hub and hole.
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(holeRing * 0.7, 0.05, 0.05),
      materials.brassDark,
    );
    spoke.position.set(Math.cos(a) * holeRing * 0.45, Math.sin(a) * holeRing * 0.45, 0.02);
    spoke.rotation.z = a;
    group.add(spoke);
  }

  return { group, holes };
}
