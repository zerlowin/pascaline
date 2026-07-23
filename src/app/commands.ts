import type { PascalineModel } from '../model/PascalineModel';
import type { Machine } from '../scene/Machine';
import type { Animator } from '../anim/Animator';
import type { Scheduler } from '../anim/scheduler';
import type { Store } from './store';
import { isOverflow } from '../model/steps';

/**
 * The only writer that touches the model. UI and interaction go through here;
 * every mutation flows model → animator → scheduler, then the store mirrors the
 * model when the animation settles. Operations queue on the scheduler, so
 * several clicks (or a whole number) chain naturally.
 */
export class Commands {
  private pendingOverflow = false;

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
    const steps = this.model.rotate(pos, amount);
    if (steps.some(isOverflow)) this.pendingOverflow = true;
    this.store.set({ busy: true });
    this.scheduler.enqueue(...this.animator.build(steps));
  }

  /** Add a whole number, dialed column by column (units first), like the machine. */
  addValue(value: number): void {
    let x = Math.max(0, Math.trunc(value));
    if (x === 0) return;
    for (let i = 0; i < this.model.count && x > 0; i++) {
      const d = x % 10;
      x = Math.floor(x / 10);
      if (d > 0) this.addAt(i, d);
    }
  }

  reset(): void {
    this.scheduler.clear();
    this.model.reset();
    this.pendingOverflow = false;
    this.syncFromModel();
  }

  /** Instantly set the register (no animation) — for demos, the tour, and tests. */
  jumpTo(value: number): void {
    this.scheduler.clear();
    this.model.setValue(value);
    this.pendingOverflow = false;
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
    const overflowed = this.pendingOverflow;
    this.pendingOverflow = false;
    this.store.set({
      register: this.model.read(),
      value: this.model.value(),
      busy: this.scheduler.busy,
      overflow: overflowed,
    });
  }
}
