import { easings } from './tween';

/** Durations (ms) for the mechanism's motions, tuned in one place. */
export const DUR = {
  /** One 36° notch of a user-dialed wheel. */
  dialNotch: 150,
  /** One 36° advance of a carry-driven drum. */
  carryAdvance: 170,
} as const;

export const EASE = easings;
