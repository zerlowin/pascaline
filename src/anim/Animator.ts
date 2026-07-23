import type * as THREE from 'three';
import type { Step } from '../model/steps';
import type { StationRefs } from '../types';
import { NOTCH } from '../scene/layout';
import { rotateBy, parallel, type Task } from './tween';
import { DUR, EASE, SAUTOIR_ARM } from './presets';

/**
 * Turns the model's ordered Step list into timed Tasks for the scheduler.
 *
 * - A user-dialed `advance` turns the input wheel + drum together.
 * - A `carry` plays the sautoir's arm→fall motion; the receiving wheel's own
 *   `advance` (which always follows the carry in the Step list) is folded into
 *   the fall, so the drum visibly advances as the beak kicks it.
 */
export class Animator {
  constructor(
    private readonly stations: StationRefs[],
    private readonly sautoirs: THREE.Object3D[],
  ) {}

  build(steps: Step[]): Task[] {
    const tasks: Task[] = [];
    const consumed = new Set<number>();

    for (let i = 0; i < steps.length; i++) {
      if (consumed.has(i)) continue;
      const s = steps[i];

      if (s.type === 'advance') {
        const st = this.stations[s.pos];
        if (st) tasks.push(this.dialAdvance(st));
      } else if (s.type === 'carry') {
        const sautoir = this.sautoirs[s.from]; // sautoir from wheel s.from → s.from+1
        const receiver = this.stations[s.to];

        // Fold the receiver's advance (next step) into the sautoir kick.
        const next = steps[i + 1];
        if (next && next.type === 'advance' && next.pos === s.to) consumed.add(i + 1);

        if (sautoir && receiver) {
          // Two tasks so step mode pauses between "armed" and "fallen".
          tasks.push(this.arm(sautoir));
          tasks.push(this.fallKick(sautoir, receiver));
        } else if (receiver) {
          tasks.push(this.carryAdvance(receiver));
        }
        // else: carry ran off the top wheel (overflow) — no visual receiver.
      }
      // overflow: nothing to animate
    }
    return tasks;
  }

  /** User turns the dial one notch: input wheel and rotor advance together. */
  private dialAdvance(st: StationRefs): Task {
    return parallel([
      rotateBy(st.rotor, 'x', NOTCH, DUR.dialNotch, EASE.easeInOutQuad),
      rotateBy(st.inputWheel, 'z', NOTCH, DUR.dialNotch, EASE.easeInOutQuad),
    ]);
  }

  /** Sautoir is armed (lifted) by the sending wheel reaching 9→0. */
  private arm(sautoir: THREE.Object3D): Task {
    return rotateBy(sautoir, 'x', SAUTOIR_ARM, DUR.sautoirArm, EASE.easeOutQuad);
  }

  /** Sautoir falls under gravity, its beak kicking the receiver forward a notch. */
  private fallKick(sautoir: THREE.Object3D, receiver: StationRefs): Task {
    return parallel([
      rotateBy(sautoir, 'x', -SAUTOIR_ARM, DUR.sautoirFall, EASE.easeInQuad),
      rotateBy(receiver.rotor, 'x', NOTCH, DUR.sautoirFall, EASE.easeOutCubic),
    ]);
  }

  /** Fallback advance with no sautoir (not used for internal carries). */
  private carryAdvance(st: StationRefs): Task {
    return rotateBy(st.rotor, 'x', NOTCH, DUR.carryAdvance, EASE.easeInOutQuad);
  }
}
