import { glossary } from '../content/glossary';
import type { PartId } from '../types';

/**
 * The side drawer that explains a part (or shows the "how it works" text).
 * Reuses the #panel element from index.html.
 */
export class Panel {
  private readonly root: HTMLElement;
  private readonly titleEl: HTMLElement;
  private readonly bodyEl: HTMLElement;
  private onClose?: () => void;

  constructor(root: HTMLElement) {
    this.root = root;
    root.innerHTML = '';

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'panel-close';
    close.setAttribute('aria-label', 'Fermer');
    close.textContent = '✕';
    close.addEventListener('click', () => this.hide());

    this.titleEl = document.createElement('h2');
    this.titleEl.className = 'panel-title';
    this.bodyEl = document.createElement('div');
    this.bodyEl.className = 'panel-body';

    root.append(close, this.titleEl, this.bodyEl);
  }

  showPart(part: PartId): void {
    const entry = glossary[part];
    this.show(entry.nom, `<p>${entry.description}</p>`);
  }

  show(title: string, html: string, onClose?: () => void): void {
    this.onClose = onClose;
    this.titleEl.textContent = title;
    this.bodyEl.innerHTML = html;
    this.root.hidden = false;
  }

  hide(): void {
    this.root.hidden = true;
    this.onClose?.();
    this.onClose = undefined;
  }
}
