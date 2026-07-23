import type * as THREE from 'three';
import type { Machine } from '../scene/Machine';
import { BAND } from '../scene/parts/displayDrum';
import { STATION } from '../scene/layout';

interface Cover {
  obj: THREE.Object3D;
  addX: number;
  subX: number;
}

/**
 * The sliding bar. In addition it masks the complement band (you read the
 * value); in subtraction it slides across to mask the value band (you read the
 * nine's-complement). Animates all six segments together.
 */
export class ComplementBar {
  private readonly covers: Cover[] = [];
  private t = 0; // 0 = addition, 1 = subtraction
  private target = 0;

  constructor(machine: Machine) {
    for (const st of machine.stations) {
      this.covers.push({
        obj: st.cover,
        addX: STATION.drumOffsetX + BAND.complement,
        subX: STATION.drumOffsetX + BAND.value,
      });
    }
  }

  setMode(mode: 'add' | 'sub'): void {
    this.target = mode === 'sub' ? 1 : 0;
  }

  update(dtMs: number): void {
    if (this.t === this.target) return;
    const step = dtMs / 260;
    if (this.t < this.target) this.t = Math.min(this.target, this.t + step);
    else this.t = Math.max(this.target, this.t - step);
    for (const c of this.covers) c.obj.position.x = c.addX + (c.subX - c.addX) * this.t;
  }
}
