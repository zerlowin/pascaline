import * as THREE from 'three';

/** Shared raycaster: maps a pointer event to the first intersected object. */
export class Picker {
  private readonly ray = new THREE.Raycaster();
  private readonly ndc = new THREE.Vector2();

  constructor(
    private readonly camera: THREE.Camera,
    private readonly dom: HTMLElement,
  ) {}

  pick(event: { clientX: number; clientY: number }, targets: THREE.Object3D[]): THREE.Intersection | null {
    const rect = this.dom.getBoundingClientRect();
    this.ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.ray.setFromCamera(this.ndc, this.camera);
    const hits = this.ray.intersectObjects(targets, false);
    return hits[0] ?? null;
  }
}
