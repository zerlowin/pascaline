/** Spatial constants shared by the machine's geometry and its animations. */

export const TAU = Math.PI * 2;
/** One digit step of a wheel, in radians (36°). */
export const NOTCH = TAU / 10;

/** Horizontal spacing between adjacent digit stations. */
export const STATION_PITCH = 2.4;

/** Height of the rotor axis (counting wheel + drum) above the ground plane. */
export const MACHINE_Y = 1.1;

/** Local placement of parts within a single station group. */
export const STATION = {
  drumOffsetX: -0.42,
  gearOffsetX: 0.58,
  inputY: 0,
  inputZ: 1.75,
} as const;

/**
 * X position of station `index` in a row of `count`. Index 0 (units) sits on
 * the right so the row reads like a written number (higher digits to the left).
 */
export function stationX(index: number, count: number): number {
  return ((count - 1) / 2 - index) * STATION_PITCH;
}
