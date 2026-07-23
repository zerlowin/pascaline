/**
 * The mechanism's causal event vocabulary.
 *
 * `PascalineModel.rotate()` returns an ordered list of these Steps. The order
 * *is* the choreography: an `advance` that crosses 9→0 is immediately followed
 * by a `carry` and then the neighbour's own `advance` — mirroring how each
 * sautoir acts independently on the next wheel.
 */
export type Step =
  | AdvanceStep
  | CarryStep
  | OverflowStep;

/** A wheel steps forward one notch (from → to, base 10). */
export interface AdvanceStep {
  type: 'advance';
  /** Wheel index, 0 = units (rightmost). */
  pos: number;
  from: number;
  to: number;
  /** True when the wheel rolled over 9 → 0 (this is what arms the sautoir). */
  crossedZero: boolean;
}

/** A carry is handed from wheel `from` to wheel `to` (= from + 1). */
export interface CarryStep {
  type: 'carry';
  from: number;
  to: number;
}

/** A carry ran off the highest wheel — the top digit is lost (register wraps). */
export interface OverflowStep {
  type: 'overflow';
}

export const isAdvance = (s: Step): s is AdvanceStep => s.type === 'advance';
export const isCarry = (s: Step): s is CarryStep => s.type === 'carry';
export const isOverflow = (s: Step): s is OverflowStep => s.type === 'overflow';
