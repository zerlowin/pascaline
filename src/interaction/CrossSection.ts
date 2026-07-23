import * as THREE from 'three';
import type { Machine } from '../scene/Machine';

/**
 * Transparency / cross-section: ghosts the *outer shell* — the case, the display
 * drums and the input wheels — so the working mechanism inside (counting gears,
 * lantern pinions, sautoirs, pawls) shows through. Each affected mesh gets a
 * cloned material so fading never touches the shared originals.
 *
 * `setTransparent(bool)` + `update(dt)` animate it. (A true capped section plane
 * needs stencil work; a clean opacity fade is the robust, honest reveal — the
 * exploded view handles physical separation.)
 */
export class CrossSection {
  private readonly mats: THREE.Material[] = [];
  private t = 0;
  private target = 0;

  constructor(machine: Machine) {
    const collect = (root: THREE.Object3D): void => {
      root.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          const cloned = (mesh.material as THREE.Material).clone();
          mesh.material = cloned;
          this.mats.push(cloned);
        }
      });
    };

    collect(machine.chassis);
    machine.stations.forEach((st) => {
      collect(st.drum);
      collect(st.inputWheel);
    });
  }

  get active(): boolean {
    return this.target > 0.5;
  }

  setTransparent(on: boolean): void {
    this.target = on ? 1 : 0;
  }

  update(dtMs: number): void {
    if (this.t === this.target) return;
    const step = dtMs / 300;
    if (this.t < this.target) this.t = Math.min(this.target, this.t + step);
    else this.t = Math.max(this.target, this.t - step);
    for (const m of this.mats) {
      const mat = m as THREE.MeshStandardMaterial;
      mat.transparent = this.t > 0.001;
      mat.opacity = 1 - 0.8 * this.t;
      mat.depthWrite = this.t < 0.5;
    }
  }
}
