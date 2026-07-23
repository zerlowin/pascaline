import type { Step } from './steps';

/** Number of counting wheels on this Pascaline (decimal, 6 digits). */
export const WHEEL_COUNT = 6;

/**
 * Pure model of the Pascaline's totaliser: a register of `count` decimal digits
 * plus the carry logic. No Three.js, no timing — this is the source of truth for
 * the *numbers*, and it is fully unit-testable.
 *
 * Digit indexing is little-endian: index 0 = units (rightmost wheel),
 * index `count-1` = the highest wheel.
 */
export class PascalineModel {
  readonly count: number;
  private readonly digits: number[];

  constructor(count: number = WHEEL_COUNT) {
    this.count = count;
    this.digits = new Array<number>(count).fill(0);
  }

  /** Digit currently shown by wheel `pos` (0 = units). */
  digitAt(pos: number): number {
    return this.digits[pos];
  }

  /** Snapshot of all digits, index 0 = units. Returns a copy. */
  read(): number[] {
    return this.digits.slice();
  }

  /** Integer value of the register (0 … 10^count − 1). */
  value(): number {
    let v = 0;
    for (let i = this.count - 1; i >= 0; i--) v = v * 10 + this.digits[i];
    return v;
  }

  /** Big-endian, zero-padded readout, e.g. "000042". */
  format(): string {
    let out = '';
    for (let i = this.count - 1; i >= 0; i--) out += String(this.digits[i]);
    return out;
  }

  /** Reset every wheel to 0 (no Steps emitted). */
  reset(): void {
    this.digits.fill(0);
  }

  /** Force the register to `next` (index 0 = units), no Steps emitted. Used to seed. */
  setDigits(next: readonly number[]): void {
    for (let i = 0; i < this.count; i++) {
      const d = next[i] ?? 0;
      this.digits[i] = ((d % 10) + 10) % 10;
    }
  }

  /** Seed the register from an integer value (clamped into 0 … 10^count − 1). */
  setValue(value: number): void {
    let v = ((Math.trunc(value) % this.modulus()) + this.modulus()) % this.modulus();
    for (let i = 0; i < this.count; i++) {
      this.digits[i] = v % 10;
      v = Math.floor(v / 10);
    }
  }

  /** 10^count — the value at which the register wraps. */
  modulus(): number {
    return 10 ** this.count;
  }

  /**
   * Advance wheel `pos` by `notches` single steps (each = +1). Mutates the
   * register and returns the ordered causal Step list, carry cascade included.
   */
  rotate(pos: number, notches: number): Step[] {
    const steps: Step[] = [];
    for (let k = 0; k < notches; k++) this.advanceOne(pos, steps);
    return steps;
  }

  /** One single-notch advance with its (possibly cascading) carry. */
  private advanceOne(pos: number, steps: Step[]): void {
    if (pos >= this.count) {
      steps.push({ type: 'overflow' });
      return;
    }
    const from = this.digits[pos];
    const to = (from + 1) % 10;
    this.digits[pos] = to;
    const crossedZero = to === 0;
    steps.push({ type: 'advance', pos, from, to, crossedZero });
    if (crossedZero) {
      steps.push({ type: 'carry', from: pos, to: pos + 1 });
      this.advanceOne(pos + 1, steps); // the next wheel's independent event
    }
  }
}
