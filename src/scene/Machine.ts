import * as THREE from 'three';
import { createDigitStation } from './DigitStation';
import { MACHINE_Y, NOTCH, stationX } from './layout';
import type { StationRefs } from '../types';

/**
 * The assembled Pascaline: a row of `count` digit stations sharing one factory.
 * Holds only view objects; the model + animator drive it from outside.
 */
export class Machine {
  readonly group = new THREE.Group();
  readonly stations: StationRefs[] = [];
  readonly holes: THREE.Mesh[] = [];
  readonly count: number;

  constructor(count: number) {
    this.count = count;
    this.group.name = 'machine';

    for (let i = 0; i < count; i++) {
      const built = createDigitStation(i);
      built.refs.group.position.set(stationX(i, count), MACHINE_Y, 0);
      this.group.add(built.refs.group);
      this.stations.push(built.refs);
      this.holes.push(...built.holes);
    }
  }

  /** Instantly snap a station's rotor to show digit `d` (no animation). */
  setDigit(index: number, d: number): void {
    this.stations[index].rotor.rotation.x = d * NOTCH;
  }

  /** Snap all rotors to the given register (index 0 = units). */
  setRegister(digits: readonly number[]): void {
    for (let i = 0; i < this.count; i++) this.setDigit(i, digits[i] ?? 0);
  }
}
