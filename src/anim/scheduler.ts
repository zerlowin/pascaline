import type { Task } from './tween';

/**
 * The single clock. Runs queued tasks sequentially under one scalable, pausable,
 * single-steppable timebase — so slow-motion and step mode apply uniformly to
 * the mechanism and (later) camera moves alike.
 *
 * Each enqueued Task is treated as one "step": in step mode the scheduler pauses
 * after each Task completes until `requestStep()` is called. The Animator chooses
 * task granularity (per notch, per sautoir phase) to make stepping meaningful.
 */
export class Scheduler {
  speed = 1;
  paused = false;
  stepMode = false;

  /** Called once each time the queue drains from non-empty to empty. */
  onIdle?: () => void;

  private queue: Task[] = [];
  private awaitingStep = false;
  private wasBusy = false;

  enqueue(...tasks: Task[]): void {
    this.queue.push(...tasks);
    if (tasks.length > 0) this.wasBusy = true;
  }

  get busy(): boolean {
    return this.queue.length > 0;
  }

  clear(): void {
    this.queue.length = 0;
    this.awaitingStep = false;
  }

  /** Release exactly one step while in step mode. */
  requestStep(): void {
    this.awaitingStep = false;
  }

  tick(rawDtMs: number): void {
    if (this.queue.length === 0) {
      this.checkIdle();
      return;
    }
    if (this.paused) return;
    if (this.stepMode && this.awaitingStep) return;

    const dt = rawDtMs * this.speed;
    const task = this.queue[0];
    const done = task.update(dt);
    if (done) {
      this.queue.shift();
      if (this.stepMode) this.awaitingStep = true;
    }
    this.checkIdle();
  }

  private checkIdle(): void {
    if (this.wasBusy && this.queue.length === 0) {
      this.wasBusy = false;
      this.awaitingStep = false;
      this.onIdle?.();
    }
  }
}
