import * as THREE from 'three';
import { createInputWheel } from './parts/inputWheel';
import { createCountingWheel } from './parts/countingWheel';
import { createDisplayDrum } from './parts/displayDrum';
import { STATION } from './layout';
import type { PartUserData, StationRefs } from '../types';

export interface StationBuild {
  refs: StationRefs;
  /** Clickable stylus holes for this station (for the picker). */
  holes: THREE.Mesh[];
}

/**
 * Reusable factory for one digit station: an input wheel (front, about Z) plus a
 * rotor (about X) carrying the counting gear and the display drum, which turn
 * together. Every pickable mesh is stamped with its PartId + station index.
 */
export function createDigitStation(index: number): StationBuild {
  const group = new THREE.Group();
  group.name = `station-${index}`;

  // Rotor: counting gear + drum, turning together about X.
  const rotor = new THREE.Group();
  rotor.name = 'rotor';

  const gear = createCountingWheel();
  gear.position.x = STATION.gearOffsetX;
  gear.userData = { partId: 'countingWheel', stationIndex: index } satisfies PartUserData;

  const drum = createDisplayDrum();
  drum.position.x = STATION.drumOffsetX;
  drum.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.userData = { partId: 'displayDrum', stationIndex: index } satisfies PartUserData;
    }
  });

  rotor.add(gear, drum);
  group.add(rotor);

  // Input wheel at the front.
  const input = createInputWheel({ stationIndex: index });
  input.group.position.set(0, STATION.inputY, STATION.inputZ);
  group.add(input.group);

  const refs: StationRefs = {
    index,
    group,
    inputWheel: input.group,
    rotor,
    gear,
    drum,
  };
  return { refs, holes: input.holes };
}
