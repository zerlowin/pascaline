/** A unit of animated work. `update` is called with elapsed ms (already scaled
 * by the scheduler's speed) and returns true once finished. */
export interface Task {
  update(dtMs: number): boolean;
}

export type Easing = (t: number) => number;

export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => 1 - (1 - t) * (1 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
} as const;

export interface TweenOptions {
  durationMs: number;
  ease?: Easing;
  onUpdate: (v: number) => void;
  onComplete?: () => void;
}

/** Tween a normalized value 0→1 over `durationMs`, easing applied. */
export function tween(opts: TweenOptions): Task {
  const ease = opts.ease ?? easings.linear;
  let elapsed = 0;
  return {
    update(dt: number): boolean {
      elapsed += dt;
      const raw = Math.min(1, elapsed / Math.max(1, opts.durationMs));
      opts.onUpdate(ease(raw));
      if (raw >= 1) {
        opts.onComplete?.();
        return true;
      }
      return false;
    },
  };
}

/** Run tasks one after another. Advances one boundary per frame (seeding the
 * next task at t=0 to avoid a visible gap). */
export function sequence(tasks: Task[]): Task {
  let i = 0;
  return {
    update(dt: number): boolean {
      if (i >= tasks.length) return true;
      const done = tasks[i].update(dt);
      if (done) {
        i++;
        if (i < tasks.length) tasks[i].update(0); // seed start state
        else return true;
      }
      return false;
    },
  };
}

/** Run tasks concurrently; done when all are done. */
export function parallel(tasks: Task[]): Task {
  let active = tasks.slice();
  return {
    update(dt: number): boolean {
      active = active.filter((t) => !t.update(dt));
      return active.length === 0;
    },
  };
}

/** A no-op task that simply waits. */
export function delay(durationMs: number): Task {
  return tween({ durationMs, onUpdate: () => {} });
}

/** Rotate an object's single axis by `delta` radians over `durationMs`. */
export function rotateBy(
  obj: { rotation: { x: number; y: number; z: number } },
  axis: 'x' | 'y' | 'z',
  delta: number,
  durationMs: number,
  ease?: Easing,
): Task {
  let start = 0;
  let seeded = false;
  return tween({
    durationMs,
    ease,
    onUpdate: (v) => {
      if (!seeded) {
        start = obj.rotation[axis];
        seeded = true;
      }
      obj.rotation[axis] = start + delta * v;
    },
  });
}
