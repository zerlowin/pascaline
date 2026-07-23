import type * as THREE from 'three';
import type { Picker } from './Picker';
import type { Commands } from '../app/commands';
import type { PartUserData } from '../types';

const CLICK_TOLERANCE = 6; // px of movement below which a press counts as a click

/**
 * Stylus input: a click on a numbered hole of an input wheel adds that digit to
 * the wheel's column. Drags are left to OrbitControls (distinguished by pointer
 * travel), so dialing and orbiting never fight.
 */
export class StylusController {
  private downPos: { x: number; y: number } | null = null;

  constructor(
    private readonly picker: Picker,
    dom: HTMLElement,
    private readonly holes: THREE.Object3D[],
    private readonly commands: Commands,
  ) {
    dom.addEventListener('pointerdown', this.onDown);
    dom.addEventListener('pointerup', this.onUp);
  }

  private onDown = (e: PointerEvent): void => {
    if (e.button === 0) this.downPos = { x: e.clientX, y: e.clientY };
  };

  private onUp = (e: PointerEvent): void => {
    if (!this.downPos) return;
    const moved = Math.hypot(e.clientX - this.downPos.x, e.clientY - this.downPos.y);
    this.downPos = null;
    if (moved > CLICK_TOLERANCE) return; // was an orbit drag

    const hit = this.picker.pick(e, this.holes);
    if (!hit) return;
    const data = hit.object.userData as PartUserData;
    if (data.partId === 'inputWheel' && typeof data.digit === 'number') {
      this.commands.addAt(data.stationIndex, data.digit);
    }
  };
}
