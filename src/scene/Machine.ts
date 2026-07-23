import * as THREE from 'three';
import { createDigitStation } from './DigitStation';
import { createSautoir } from './parts/sautoir';
import { MACHINE_Y, NOTCH, STATION_PITCH, stationX } from './layout';
import type { StationRefs } from '../types';

/**
 * The assembled Pascaline: a row of `count` digit stations sharing one factory,
 * with a sautoir bridging each adjacent pair (count − 1 of them). Holds only
 * view objects; the model + animator drive it from outside.
 */
export class Machine {
  readonly group = new THREE.Group();
  readonly stations: StationRefs[] = [];
  readonly sautoirs: THREE.Group[] = [];
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

    // Sautoir i carries from wheel i to wheel i+1, sitting in the gap between.
    for (let i = 0; i < count - 1; i++) {
      const sautoir = createSautoir(i);
      const xMid = stationX(i, count) - STATION_PITCH / 2;
      sautoir.position.set(xMid, MACHINE_Y + 0.95, 0.15);
      this.group.add(sautoir);
      this.sautoirs.push(sautoir);
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
