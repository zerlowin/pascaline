import * as THREE from 'three';
import { createInputWheel } from './parts/inputWheel';
import { createCountingWheel } from './parts/countingWheel';
import { createDisplayDrum, BAND } from './parts/displayDrum';
import { createLanternPinion } from './parts/lanternPinion';
import { materials } from './materials';
import { READ_OFFSET, STATION } from './layout';
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

  // Lantern pinion on the same shaft, outboard of the gear.
  const pinion = createLanternPinion();
  pinion.position.x = STATION.gearOffsetX + 0.5;
  pinion.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.userData = { partId: 'lanternPinion', stationIndex: index } satisfies PartUserData;
    }
  });

  rotor.add(gear, drum, pinion);
  group.add(rotor);

  // Ratchet pawl: a small sprung detent resting on the counting wheel's teeth
  // (anti-return). Static — it just holds the wheel between notches.
  const pawl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.14), materials.steelDark);
  pawl.position.set(STATION.gearOffsetX, 0.92, 0.28);
  pawl.rotation.z = -0.35;
  pawl.castShadow = true;
  pawl.userData = { partId: 'pawl', stationIndex: index } satisfies PartUserData;
  group.add(pawl);

  // Sliding bar segment: masks one numeral band at the reading window. Rests in
  // the "addition" position (masking the complement band); ComplementBar slides
  // it to reveal the complement for subtraction.
  const coverY = Math.cos(READ_OFFSET) + 0.05;
  const coverZ = Math.sin(READ_OFFSET) + 0.05;
  const cover = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.7, 0.06), materials.brass);
  cover.position.set(STATION.drumOffsetX + BAND.complement, coverY, coverZ);
  cover.rotation.x = READ_OFFSET - Math.PI / 2;
  cover.castShadow = true;
  cover.userData = { partId: 'complementBar', stationIndex: index } satisfies PartUserData;
  group.add(cover);

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
    pinion,
    pawl,
    drum,
    cover,
  };
  return { refs, holes: input.holes };
}
