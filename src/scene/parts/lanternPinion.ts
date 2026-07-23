import * as THREE from 'three';
import { materials } from '../materials';

const TAU = Math.PI * 2;

/**
 * A lantern pinion (pignon à lanterne): two end discs joined by a ring of pin
 * "rungs" — the pin-drum gear Pascal borrowed from mill and clock work. Built
 * with its axis along X so it can ride on the rotor shaft with the counting
 * wheel.
 */
export function createLanternPinion(radius = 0.26, length = 0.42, rungs = 8): THREE.Group {
  const g = new THREE.Group();
  g.name = 'lanternPinion';

  for (const sx of [-1, 1]) {
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, 0.05, 20),
      materials.brass,
    );
    disc.rotation.z = Math.PI / 2;
    disc.position.x = (sx * length) / 2;
    disc.castShadow = true;
    g.add(disc);
  }

  for (let i = 0; i < rungs; i++) {
    const a = (i / rungs) * TAU;
    const rung = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, length, 8),
      materials.steel,
    );
    rung.rotation.z = Math.PI / 2;
    rung.position.set(0, Math.cos(a) * radius, Math.sin(a) * radius);
    rung.castShadow = true;
    g.add(rung);
  }

  return g;
}
