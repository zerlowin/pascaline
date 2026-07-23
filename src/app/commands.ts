import type { PascalineModel } from '../model/PascalineModel';
import type { Machine } from '../scene/Machine';
import type { Animator } from '../anim/Animator';
import type { Scheduler } from '../anim/scheduler';
import type { Store } from './store';

/**
 * The only writer that touches the model. UI and interaction go through here;
 * every mutation flows model → animator → scheduler, then the store mirrors the
 * model when the animation settles.
 */
export class Commands {
  constructor(
    private readonly model: PascalineModel,
    private readonly machine: Machine,
    private readonly animator: Animator,
    private readonly scheduler: Scheduler,
    private readonly store: Store,
  ) {}

  /** Add `amount` (0–9) to the wheel at `pos` by dialing it. */
  addAt(pos: number, amount: number): void {
    if (amount <= 0) return;
    if (this.scheduler.busy) return; // one operation at a time (Phase 1)
    const steps = this.model.rotate(pos, amount);
    const tasks = this.animator.build(steps);
    this.store.set({ busy: true });
    this.scheduler.enqueue(...tasks);
  }

  reset(): void {
    if (this.scheduler.busy) return;
    this.model.reset();
    this.syncFromModel();
  }

  setSpeed(v: number): void {
    this.scheduler.speed = v;
    this.store.set({ speed: v });
  }

  setPaused(p: boolean): void {
    this.scheduler.paused = p;
    this.store.set({ paused: p });
  }

  setStepMode(on: boolean): void {
    this.scheduler.stepMode = on;
    this.store.set({ stepMode: on });
  }

  step(): void {
    this.scheduler.requestStep();
  }

  /**
   * Snap the view to the model and refresh the store. The snap is congruent
   * mod 2π, so it is invisible, but it keeps accumulated rotations bounded.
   * Called on scheduler idle and after reset.
   */
  syncFromModel(): void {
    this.machine.setRegister(this.model.read());
    this.store.set({
      register: this.model.read(),
      value: this.model.value(),
      busy: this.scheduler.busy,
    });
  }
}
