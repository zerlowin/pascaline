import { fr } from '../content/fr';

/**
 * The welcome overlay shown on first load: a short intro with two calls to
 * action — start the guided tour, or explore freely.
 */
export class Welcome {
  private readonly overlay: HTMLElement;

  constructor(onStartTour: () => void) {
    this.overlay = document.createElement('div');
    this.overlay.className = 'welcome-overlay';

    const card = document.createElement('div');
    card.className = 'welcome-card';

    const title = document.createElement('h1');
    title.className = 'welcome-title';
    title.textContent = fr.welcomeTitle;

    const body = document.createElement('div');
    body.className = 'welcome-body';
    body.innerHTML = fr.welcomeBody;

    const actions = document.createElement('div');
    actions.className = 'welcome-actions';

    const tourBtn = document.createElement('button');
    tourBtn.type = 'button';
    tourBtn.className = 'hud-btn welcome-primary';
    tourBtn.textContent = '▶ Visite guidée';
    tourBtn.addEventListener('click', () => {
      this.hide();
      onStartTour();
    });

    const exploreBtn = document.createElement('button');
    exploreBtn.type = 'button';
    exploreBtn.className = 'hud-btn';
    exploreBtn.textContent = 'Explorer librement';
    exploreBtn.addEventListener('click', () => this.hide());

    actions.append(tourBtn, exploreBtn);
    card.append(title, body, actions);
    this.overlay.append(card);
    document.body.append(this.overlay);
  }

  hide(): void {
    this.overlay.remove();
  }
}
