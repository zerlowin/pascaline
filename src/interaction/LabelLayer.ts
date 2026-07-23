import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import type { Machine } from '../scene/Machine';
import type { Panel } from '../ui/Panel';
import type { PartId } from '../types';
import { glossary } from '../content/glossary';
import { MACHINE_Y, STATION_PITCH, stationX } from '../scene/layout';

interface Anchor {
  partId: PartId;
  /** Non-rotating object the label rides on. */
  parent: THREE.Object3D;
  offset: THREE.Vector3;
  /** The actual part to outline when selected. */
  target: THREE.Object3D;
}

/**
 * Clickable CSS2D tags on the key parts. Labels ride on non-rotating parents so
 * they stay put while the mechanism turns; clicking one opens the glossary panel
 * and outlines the part. Toggled from the HUD.
 */
export class LabelLayer {
  private readonly labels: CSS2DObject[] = [];
  private highlight?: THREE.BoxHelper;
  private visible = false;

  constructor(
    private readonly scene: THREE.Scene,
    machine: Machine,
    private readonly panel: Panel,
  ) {
    const st = machine.stations;
    const sautoirX = stationX(2, machine.count) - STATION_PITCH / 2;
    const anchors: Anchor[] = [
      { partId: 'inputWheel', parent: st[0].group, offset: new THREE.Vector3(0, 1.05, 1.75), target: st[0].inputWheel },
      { partId: 'lanternPinion', parent: st[1].group, offset: new THREE.Vector3(1.1, 1.0, 0), target: st[1].pinion },
      { partId: 'countingWheel', parent: st[2].group, offset: new THREE.Vector3(0.6, 1.25, 0), target: st[2].gear },
      { partId: 'pawl', parent: st[3].group, offset: new THREE.Vector3(0.6, 1.4, 0.3), target: st[3].pawl },
      { partId: 'displayDrum', parent: st[4].group, offset: new THREE.Vector3(-0.4, 1.35, 0), target: st[4].drum },
      { partId: 'sautoir', parent: machine.group, offset: new THREE.Vector3(sautoirX, MACHINE_Y + 1.75, 0.2), target: machine.sautoirs[2] },
      { partId: 'chassis', parent: machine.group, offset: new THREE.Vector3(-stationX(0, machine.count) - 0.6, 1.9, 1.6), target: machine.chassis },
    ];
    anchors.forEach((a) => this.addLabel(a));
    this.setVisible(false);
  }

  private addLabel(a: Anchor): void {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'part-label';
    el.textContent = glossary[a.partId].nom;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.select(a);
    });
    const obj = new CSS2DObject(el);
    obj.position.copy(a.offset);
    a.parent.add(obj);
    this.labels.push(obj);
  }

  private select(a: Anchor): void {
    this.panel.showPart(a.partId);
    this.clearHighlight();
    const box = new THREE.BoxHelper(a.target, 0xffd479);
    this.scene.add(box);
    this.highlight = box;
  }

  private clearHighlight(): void {
    if (this.highlight) {
      this.scene.remove(this.highlight);
      this.highlight.geometry.dispose();
      this.highlight = undefined;
    }
  }

  get isVisible(): boolean {
    return this.visible;
  }

  setVisible(v: boolean): void {
    this.visible = v;
    for (const l of this.labels) l.visible = v;
    if (!v) this.clearHighlight();
  }

  update(): void {
    this.highlight?.update();
  }
}
