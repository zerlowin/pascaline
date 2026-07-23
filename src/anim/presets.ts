import { easings } from './tween';

/** Durations (ms) for the mechanism's motions, tuned in one place. */
export const DUR = {
  /** One 36° notch of a user-dialed wheel. */
  dialNotch: 150,
  /** One 36° advance of a carry-driven drum. */
  carryAdvance: 170,
  /** Sautoir being armed (lifted) before it drops. */
  sautoirArm: 230,
  /** Sautoir falling and kicking the next wheel. */
  sautoirFall: 180,
} as const;

/** How far the sautoir lifts when armed, in radians. */
export const SAUTOIR_ARM = 0.42;

export const EASE = easings;
