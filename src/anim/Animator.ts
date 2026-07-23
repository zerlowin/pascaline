import type { Step } from '../model/steps';
import type { StationRefs } from '../types';
import { NOTCH } from '../scene/layout';
import { rotateBy, parallel, type Task } from './tween';
import { DUR, EASE } from './presets';

/**
 * Turns the model's ordered Step list into a list of timed Tasks for the
 * scheduler. Distinguishes a *user-dialed* advance (turn the input wheel + drum)
 * from a *carry-driven* advance (Phase 2 wraps this in the sautoir motion).
 */
export class Animator {
  constructor(private readonly stations: StationRefs[]) {}

  build(steps: Step[]): Task[] {
    const tasks: Task[] = [];
    let prevWasCarry = false;

    for (const s of steps) {
      if (s.type === 'advance') {
        const st = this.stations[s.pos];
        if (st) tasks.push(prevWasCarry ? this.carryAdvance(st) : this.dialAdvance(st));
        prevWasCarry = false;
      } else if (s.type === 'carry') {
        // Phase 2 inserts the sautoir arm→fall→kick motion at this point.
        prevWasCarry = true;
      } else {
        prevWasCarry = false; // overflow
      }
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

  /** Carry pushes the next wheel one notch (drum only for now). */
  private carryAdvance(st: StationRefs): Task {
    return rotateBy(st.rotor, 'x', NOTCH, DUR.carryAdvance, EASE.easeInOutQuad);
  }
}
