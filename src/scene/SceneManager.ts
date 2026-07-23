import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export type FrameCallback = (dtMs: number) => void;

/**
 * Owns the renderer, camera, lights, controls and the CSS2D label overlay, and
 * runs the render loop. Other modules add objects via `scene` and register
 * per-frame work via `onFrame`.
 */
export class SceneManager {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly labelRenderer: CSS2DRenderer;
  readonly controls: OrbitControls;

  private readonly clock = new THREE.Clock();
  private readonly container: HTMLElement;
  private readonly frameCallbacks: FrameCallback[] = [];

  constructor(container: HTMLElement) {
    this.container = container;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.classList.add('webgl');
    container.appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.classList.add('labels');
    container.appendChild(this.labelRenderer.domElement);

    this.scene.background = new THREE.Color(0x141b26);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500);
    this.camera.position.set(0.5, 7.5, 17);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 1.1, 0);
    this.controls.maxDistance = 70;
    this.controls.minDistance = 3;

    this.setupLights();
    this.setupGround();

    this.resize();
    window.addEventListener('resize', this.resize);
  }

  private setupLights(): void {
    this.scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x2a2620, 0.75));

    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(9, 14, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 50;
    key.shadow.camera.left = -14;
    key.shadow.camera.right = 14;
    key.shadow.camera.top = 14;
    key.shadow.camera.bottom = -14;
    key.shadow.bias = -0.0002;
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xaac6ff, 0.45);
    fill.position.set(-8, 5, -6);
    this.scene.add(fill);
  }

  private setupGround(): void {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshStandardMaterial({ color: 0x10161f, roughness: 1, metalness: 0 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  onFrame(cb: FrameCallback): void {
    this.frameCallbacks.push(cb);
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
    const dtMs = this.clock.getDelta() * 1000;
    for (const cb of this.frameCallbacks) cb(dtMs);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  };
}
