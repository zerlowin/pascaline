import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

/**
 * Owns the renderer, camera, lights, controls and the CSS2D label overlay.
 * Everything else in the app adds objects to `scene` and reads `camera`.
 *
 * Phase 0: renders a lit reference stage with a placeholder, purely to prove
 * the WebGL + CSS2D + OrbitControls + resize + render-loop pipeline end to end.
 */
export class SceneManager {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly labelRenderer: CSS2DRenderer;
  private readonly controls: OrbitControls;
  private readonly clock = new THREE.Clock();
  private readonly container: HTMLElement;
  private placeholder?: THREE.Object3D;

  constructor(container: HTMLElement) {
    this.container = container;

    // --- WebGL renderer ---
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.classList.add('webgl');
    container.appendChild(this.renderer.domElement);

    // --- CSS2D label overlay (HTML anchored in 3D) ---
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.classList.add('labels');
    container.appendChild(this.labelRenderer.domElement);

    // --- Scene ---
    this.scene.background = new THREE.Color(0x141b26);

    // --- Camera ---
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);
    this.camera.position.set(6, 5, 11);

    // --- Controls (attached to the WebGL canvas; label overlay ignores events) ---
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 0.6, 0);
    this.controls.maxDistance = 60;
    this.controls.minDistance = 3;

    this.setupLights();
    this.setupPlaceholder();

    this.resize();
    window.addEventListener('resize', this.resize);
  }

  private setupLights(): void {
    const hemi = new THREE.HemisphereLight(0xdfe9ff, 0x2a2620, 0.75);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(8, 12, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 40;
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xa9c4ff, 0.4);
    fill.position.set(-6, 4, -5);
    this.scene.add(fill);
  }

  /** Temporary content — replaced by the Pascaline machine in Phase 1. */
  private setupPlaceholder(): void {
    const group = new THREE.Group();

    const grid = new THREE.GridHelper(20, 20, 0x3a4658, 0x232c39);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.5;
    group.add(grid);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({
        color: 0xd9a441,
        metalness: 0.6,
        roughness: 0.35,
      }),
    );
    box.position.y = 1.2;
    box.castShadow = true;
    box.receiveShadow = true;
    group.add(box);

    const labelEl = document.createElement('div');
    labelEl.className = 'scaffold-label';
    labelEl.textContent = 'La Pascaline — échafaudage (Phase 0)';
    const label = new CSS2DObject(labelEl);
    label.position.set(0, 2.8, 0);
    group.add(label);

    this.scene.add(group);
    this.placeholder = box;
  }

  private resize = (): void => {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.labelRenderer.setSize(w, h);
  };

  start(): void {
    this.renderer.setAnimationLoop(this.tick);
  }

  private tick = (): void => {
    const dt = this.clock.getDelta();
    if (this.placeholder) this.placeholder.rotation.y += dt * 0.5;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  };
}
