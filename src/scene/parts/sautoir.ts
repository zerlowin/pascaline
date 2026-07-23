import * as THREE from 'three';
import { materials } from '../materials';
import type { PartUserData } from '../../types';

/**
 * The sautoir: Pascal's carry lever. Pivots about the X axis (in the same YZ
 * plane the wheels turn in). Its tail is progressively armed (lifted) by the
 * carry pins of the sending wheel; at the 9→0 transition it is released and
 * falls under gravity, its beak (kicking pawl) shoving the next wheel one notch.
 *
 * Built around its pivot at the origin; rest state is rotation.x = 0. The
 * Animator lifts it to +arm then drops it back, advancing the neighbour on the
 * way down.
 */
export function createSautoir(stationIndex: number): THREE.Group {
  const g = new THREE.Group();
  g.name = 'sautoir';

  // Pivot axle along X.
  const axle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.7, 12),
    materials.steelDark,
  );
  axle.rotation.z = Math.PI / 2;
  g.add(axle);

  // Arming tail: reaches up toward the sending wheel's carry pins.
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.14), materials.brass);
  tail.position.set(0, 0.34, 0.02);
  tail.rotation.x = -0.5;
  g.add(tail);

  // Main arm: drops down-and-forward toward the receiving wheel.
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.95, 0.16), materials.brass);
  arm.position.set(0, -0.42, 0.12);
  arm.rotation.x = 0.28;
  g.add(arm);

  // Kicking pawl (beak) at the arm's end.
  const beak = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.34), materials.steel);
  beak.position.set(0, -0.86, 0.3);
  beak.rotation.x = -0.5;
  g.add(beak);

  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.userData = { partId: 'sautoir', stationIndex } satisfies PartUserData;
      o.castShadow = true;
    }
  });

  return g;
}
