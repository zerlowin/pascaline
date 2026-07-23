import { SceneManager } from '../scene/SceneManager';
import { Machine } from '../scene/Machine';
import { PascalineModel, WHEEL_COUNT } from '../model/PascalineModel';
import { Scheduler } from '../anim/scheduler';
import { Animator } from '../anim/Animator';
import { Store } from './store';
import { Commands } from './commands';
import { Picker } from '../interaction/Picker';
import { StylusController } from '../interaction/StylusController';
import { ExplodedView } from '../interaction/ExplodedView';
import { CrossSection } from '../interaction/CrossSection';
import { Hud } from '../ui/Hud';

/** Wires the model, scene, animation and UI into one running application. */
export class App {
  readonly scene: SceneManager;
  private readonly machine: Machine;
  private readonly scheduler: Scheduler;
  /** Public so the guided tour (and tests) can drive operations. */
  readonly commands: Commands;
  private readonly store: Store;

  constructor(stage: HTMLElement, hudRoot: HTMLElement) {
    this.scene = new SceneManager(stage);

    this.machine = new Machine(WHEEL_COUNT);
    this.scene.scene.add(this.machine.group);

    const model = new PascalineModel(WHEEL_COUNT);
    this.scheduler = new Scheduler();
    const animator = new Animator(this.machine.stations, this.machine.sautoirs);
    this.store = new Store({
      register: new Array<number>(WHEEL_COUNT).fill(0),
      value: 0,
      busy: false,
      speed: 1,
      paused: false,
      stepMode: false,
      mode: 'add',
      overflow: false,
      exploded: false,
      transparent: false,
    });

    this.commands = new Commands(model, this.machine, animator, this.scheduler, this.store);

    const exploded = new ExplodedView(this.machine);
    const crossSection = new CrossSection(this.machine);
    const view = {
      toggleExploded: (): void => {
        const on = !this.store.get().exploded;
        exploded.setExploded(on);
        this.store.set({ exploded: on });
      },
      toggleTransparent: (): void => {
        const on = !this.store.get().transparent;
        crossSection.setTransparent(on);
        this.store.set({ transparent: on });
      },
    };

    const picker = new Picker(this.scene.camera, this.scene.renderer.domElement);
    new StylusController(picker, this.scene.renderer.domElement, this.machine.holes, this.commands);
    new Hud(hudRoot, this.commands, this.store, view);

    this.scheduler.onIdle = () => this.commands.syncFromModel();
    this.scene.onFrame((dt) => {
      this.scheduler.tick(dt);
      exploded.update(dt);
      crossSection.update(dt);
    });
  }

  /** Current UI state snapshot (used by tests/automation). */
  snapshot() {
    return this.store.get();
  }

  start(): void {
    this.commands.syncFromModel();
    this.scene.start();
  }
}
