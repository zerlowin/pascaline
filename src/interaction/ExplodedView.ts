import * as THREE from 'three';
import type { Machine } from '../scene/Machine';

interface Item {
  obj: THREE.Object3D;
  home: THREE.Vector3;
  offset: THREE.Vector3;
}

/**
 * Exploded view: separates the parts along fixed offsets so each layer (input
 * wheel · gear + pinion · drum · sautoir) can be seen on its own. Whole groups
 * are translated (rotation is about their local axes, so this never disturbs the
 * mechanism), and the chassis drops away.
 *
 * `setTarget(0|1)` and `update(dt)` animate the spread smoothly.
 */
export class ExplodedView {
  private readonly items: Item[] = [];
  private t = 0;
  private target = 0;

  constructor(machine: Machine) {
    const add = (obj: THREE.Object3D, ox: number, oy: number, oz: number): void => {
      this.items.push({ obj, home: obj.position.clone(), offset: new THREE.Vector3(ox, oy, oz) });
    };

    machine.stations.forEach((st) => {
      add(st.inputWheel, 0, 0, 2.4); // dial forward
      add(st.rotor, 0, 0.4, -1.9); // counting shaft back
      add(st.drum, -1.0, 0, 0); // spread along the shaft
      add(st.gear, 0.5, 0, 0);
    });
    machine.sautoirs.forEach((s) => add(s, 0, 1.8, 0.6)); // sautoirs lift out
    add(machine.chassis, 0, -4.5, 0); // case drops away
  }

  get active(): boolean {
    return this.target > 0.5;
  }

  setExploded(on: boolean): void {
    this.target = on ? 1 : 0;
  }

  update(dtMs: number): void {
    if (this.t === this.target) return;
    const step = dtMs / 550;
    if (this.t < this.target) this.t = Math.min(this.target, this.t + step);
    else this.t = Math.max(this.target, this.t - step);
    const e = this.ease(this.t);
    for (const it of this.items) it.obj.position.copy(it.home).addScaledVector(it.offset, e);
  }

  private ease(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
}
