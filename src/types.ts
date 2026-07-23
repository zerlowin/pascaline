import type * as THREE from 'three';

/** Stable identifiers for the mechanism's parts (labels, picking, glossary). */
export type PartId =
  | 'inputWheel'
  | 'lanternPinion'
  | 'countingWheel'
  | 'displayDrum'
  | 'sautoir'
  | 'pawl'
  | 'chassis'
  | 'complementBar';

/** Data stamped on every pickable mesh so a raycast hit maps back to a part. */
export interface PartUserData {
  partId: PartId;
  stationIndex: number;
  /** For input-wheel holes: the amount added when dialing this hole. */
  digit?: number;
}

/**
 * View handles for one digit "station". Dumb view object: holds no logic,
 * the Animator and controllers reach in and set rotations/positions.
 */
export interface StationRefs {
  index: number;
  /** Station root, positioned along X in the machine row. */
  group: THREE.Group;
  /** Front-facing numbered dial, rotates about Z (stylus target). */
  inputWheel: THREE.Group;
  /** X-axis rotor carrying the counting gear + display drum (they turn together). */
  rotor: THREE.Group;
  /** The toothed counting wheel mesh (carry pins added in Phase 2). */
  gear: THREE.Object3D;
  /** The lantern pinion on the same shaft. */
  pinion: THREE.Object3D;
  /** The ratchet pawl resting on the counting wheel. */
  pawl: THREE.Object3D;
  /** The numeral drum group (value + complement bands). */
  drum: THREE.Group;
  /** The sliding bar segment masking one band of this drum. */
  cover: THREE.Object3D;
}
