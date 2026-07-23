/** UI-facing state. The register is a read-only mirror of the model. */
export interface State {
  /** Digits, index 0 = units. Mirror of the model. */
  register: number[];
  value: number;
  /** True while an operation is animating. */
  busy: boolean;
  speed: number;
  paused: boolean;
  stepMode: boolean;
  mode: 'add' | 'sub';
  /** True for one update after a carry ran off the top wheel. */
  overflow: boolean;
}

type Listener = (s: State) => void;

/** Minimal observable store: get / set(patch) / subscribe. One writer path. */
export class Store {
  private state: State;
  private readonly listeners = new Set<Listener>();

  constructor(init: State) {
    this.state = init;
  }

  get(): State {
    return this.state;
  }

  set(patch: Partial<State>): void {
    this.state = { ...this.state, ...patch };
    for (const l of this.listeners) l(this.state);
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    l(this.state);
    return () => this.listeners.delete(l);
  }
}
