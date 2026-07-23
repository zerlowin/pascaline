import * as THREE from 'three';

/**
 * Shared materials — reused across every station to keep draw calls and memory
 * down. Do not mutate these per-instance; clone if a part needs its own state
 * (e.g. highlight emissive).
 */
export const materials = {
  brass: new THREE.MeshStandardMaterial({ color: 0xc7962f, metalness: 0.85, roughness: 0.38 }),
  brassDark: new THREE.MeshStandardMaterial({ color: 0x8a6a24, metalness: 0.8, roughness: 0.5 }),
  steel: new THREE.MeshStandardMaterial({ color: 0xb4bcc4, metalness: 0.9, roughness: 0.3 }),
  steelDark: new THREE.MeshStandardMaterial({ color: 0x5a616a, metalness: 0.85, roughness: 0.45 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x5a3a22, metalness: 0.0, roughness: 0.85 }),
  parchment: new THREE.MeshStandardMaterial({ color: 0xece0c4, metalness: 0.0, roughness: 0.9 }),
  hole: new THREE.MeshStandardMaterial({ color: 0x1c140c, metalness: 0.1, roughness: 0.9 }),
} as const;

/** Make a highlightable clone of a material (own emissive channel). */
export function highlightableClone(base: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
  const m = base.clone();
  m.emissive = new THREE.Color(0x000000);
  return m;
}
