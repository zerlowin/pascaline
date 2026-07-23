import type { Commands } from '../app/commands';
import type { State, Store } from '../app/store';

function button(label: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'hud-btn';
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

/** The on-screen control bar: numeric readout + operation controls. */
export class Hud {
  private readonly readout: HTMLElement;
  private readonly pauseBtn: HTMLButtonElement;
  private readonly stepBtn: HTMLButtonElement;
  private readonly stepModeBtn: HTMLButtonElement;

  constructor(root: HTMLElement, commands: Commands, store: Store) {
    root.innerHTML = '';

    const bar = document.createElement('div');
    bar.className = 'hud-bar';

    // --- Readout ---
    this.readout = document.createElement('div');
    this.readout.className = 'readout';
    this.readout.setAttribute('role', 'status');
    this.readout.setAttribute('aria-label', 'Valeur affichée');

    // --- Controls ---
    const controls = document.createElement('div');
    controls.className = 'hud-controls';

    this.pauseBtn = button('Pause', () => commands.setPaused(!store.get().paused));
    this.stepModeBtn = button('Pas à pas', () => commands.setStepMode(!store.get().stepMode));
    this.stepBtn = button('Pas suivant ▸', () => commands.step());
    const resetBtn = button('Réinitialiser', () => commands.reset());

    const speedWrap = document.createElement('label');
    speedWrap.className = 'hud-speed';
    speedWrap.textContent = 'Vitesse ';
    const speed = document.createElement('input');
    speed.type = 'range';
    speed.min = '0.25';
    speed.max = '2';
    speed.step = '0.25';
    speed.value = '1';
    speed.addEventListener('input', () => commands.setSpeed(parseFloat(speed.value)));
    speedWrap.appendChild(speed);

    controls.append(this.pauseBtn, this.stepModeBtn, this.stepBtn, speedWrap, resetBtn);
    bar.append(this.readout, controls);

    const hint = document.createElement('p');
    hint.className = 'hud-hint';
    hint.textContent =
      "Cliquez un chiffre sur une roue d’entrée (à l’avant) pour l’ajouter à cette colonne. Faites glisser pour tourner la vue.";

    root.append(bar, hint);

    store.subscribe((s) => this.update(s));
  }

  private update(s: State): void {
    // Big-endian readout (highest digit on the left).
    this.readout.textContent = '';
    const digits = s.register.slice().reverse();
    digits.forEach((d) => {
      const cell = document.createElement('span');
      cell.className = 'digit';
      cell.textContent = String(d);
      this.readout.appendChild(cell);
    });

    this.pauseBtn.textContent = s.paused ? 'Lecture ▶' : 'Pause';
    this.pauseBtn.classList.toggle('active', s.paused);
    this.stepModeBtn.classList.toggle('active', s.stepMode);
    this.stepBtn.disabled = !s.stepMode;
  }
}
