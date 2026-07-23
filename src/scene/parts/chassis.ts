import * as THREE from 'three';
import { materials } from '../materials';
import type { PartUserData } from '../../types';

/**
 * The case (carter): a wooden plinth, a brass back panel, side cheeks and top /
 * front rails. It frames the machine as a device while leaving the front open so
 * the wheels, gears and sautoirs stay visible. Phase 5 fades it for the
 * cross-section view.
 */
export function createChassis(count: number, pitch: number): THREE.Group {
  const g = new THREE.Group();
  g.name = 'chassis';

  const halfW = ((count - 1) / 2) * pitch + 1.5;
  const width = halfW * 2;

  const add = (
    mesh: THREE.Mesh,
    x: number,
    y: number,
    z: number,
  ): void => {
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { partId: 'chassis', stationIndex: -1 } satisfies PartUserData;
    g.add(mesh);
  };

  // Wooden plinth.
  add(new THREE.Mesh(new THREE.BoxGeometry(width, 0.6, 4.4), materials.wood), 0, 0.2, 0.4);

  // Brass back panel.
  add(new THREE.Mesh(new THREE.BoxGeometry(width, 2.3, 0.16), materials.brassDark), 0, 1.45, -1.55);

  // Side cheeks (wood).
  for (const sx of [-1, 1]) {
    add(new THREE.Mesh(new THREE.BoxGeometry(0.32, 2.5, 4.4), materials.wood), sx * halfW, 1.1, 0.4);
  }

  // Top rail and front sill (brass).
  add(new THREE.Mesh(new THREE.BoxGeometry(width, 0.2, 0.5), materials.brass), 0, 2.6, -1.4);
  add(new THREE.Mesh(new THREE.BoxGeometry(width, 0.28, 0.35), materials.brass), 0, 0.62, 2.45);

  return g;
}
