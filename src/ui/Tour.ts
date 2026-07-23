import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { tourSteps, type TourApi } from '../content/tour';

/**
 * The guided tour: a narration card plus a camera that glides to each step's
 * pose and triggers its demo. Camera glide runs on its own short timer so it
 * works even while the mechanism is paused, and hands control back to the user
 * once it settles.
 */
export class Tour {
  private readonly card: HTMLElement;
  private readonly titleEl: HTMLElement;
  private readonly bodyEl: HTMLElement;
  private readonly counterEl: HTMLElement;
  private readonly prevBtn: HTMLButtonElement;
  private readonly nextBtn: HTMLButtonElement;

  private index = 0;
  private active = false;

  private readonly fromPos = new THREE.Vector3();
  private readonly toPos = new THREE.Vector3();
  private readonly fromTgt = new THREE.Vector3();
  private readonly toTgt = new THREE.Vector3();
  private animT = 1;

  constructor(
    private readonly api: TourApi,
    private readonly camera: THREE.PerspectiveCamera,
    private readonly controls: OrbitControls,
  ) {
    this.card = document.createElement('div');
    this.card.className = 'tour-card';
    this.card.hidden = true;

    const head = document.createElement('div');
    head.className = 'tour-head';
    this.titleEl = document.createElement('h2');
    this.titleEl.className = 'tour-title';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'tour-close';
    close.textContent = '✕';
    close.setAttribute('aria-label', 'Fermer la visite');
    close.addEventListener('click', () => this.close());
    head.append(this.titleEl, close);

    this.bodyEl = document.createElement('div');
    this.bodyEl.className = 'tour-body';

    const nav = document.createElement('div');
    nav.className = 'tour-nav';
    this.prevBtn = document.createElement('button');
    this.prevBtn.type = 'button';
    this.prevBtn.className = 'hud-btn';
    this.prevBtn.textContent = '◂ Précédent';
    this.prevBtn.addEventListener('click', () => this.prev());
    this.counterEl = document.createElement('span');
    this.counterEl.className = 'tour-counter';
    this.nextBtn = document.createElement('button');
    this.nextBtn.type = 'button';
    this.nextBtn.className = 'hud-btn';
    this.nextBtn.addEventListener('click', () => this.next());
    nav.append(this.prevBtn, this.counterEl, this.nextBtn);

    this.card.append(head, this.bodyEl, nav);
    document.body.appendChild(this.card);
  }

  start(): void {
    this.active = true;
    this.index = 0;
    this.card.hidden = false;
    this.apply();
  }

  close(): void {
    this.active = false;
    this.card.hidden = true;
  }

  private next(): void {
    if (this.index < tourSteps.length - 1) {
      this.index++;
      this.apply();
    } else {
      this.close();
    }
  }

  private prev(): void {
    if (this.index > 0) {
      this.index--;
      this.apply();
    }
  }

  private apply(): void {
    const s = tourSteps[this.index];
    this.titleEl.textContent = s.title;
    this.bodyEl.innerHTML = s.body;
    this.counterEl.textContent = `${this.index + 1} / ${tourSteps.length}`;
    this.prevBtn.disabled = this.index === 0;
    this.nextBtn.textContent =
      this.index === tourSteps.length - 1 ? 'Terminer' : 'Suivant ▸';

    this.fromPos.copy(this.camera.position);
    this.toPos.set(...s.cam.pos);
    this.fromTgt.copy(this.controls.target);
    this.toTgt.set(...s.cam.target);
    this.animT = 0;

    s.run?.(this.api);
  }

  update(dtMs: number): void {
    if (!this.active || this.animT >= 1) return;
    this.animT = Math.min(1, this.animT + dtMs / 900);
    const e = this.animT < 0.5 ? 2 * this.animT * this.animT : 1 - Math.pow(-2 * this.animT + 2, 2) / 2;
    this.camera.position.lerpVectors(this.fromPos, this.toPos, e);
    this.controls.target.lerpVectors(this.fromTgt, this.toTgt, e);
  }
}
