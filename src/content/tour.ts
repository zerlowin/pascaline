/** Actions a tour step can trigger on the machine. */
export interface TourApi {
  reset(): void;
  jumpTo(value: number): void;
  addAt(pos: number, amount: number): void;
  setSpeed(v: number): void;
  setMode(mode: 'add' | 'sub'): void;
  setExploded(on: boolean): void;
  setTransparent(on: boolean): void;
}

export interface TourStep {
  title: string;
  /** HTML body. */
  body: string;
  /** Camera pose: [position, target]. */
  cam: { pos: [number, number, number]; target: [number, number, number] };
  /** Optional demo run when the step is shown. */
  run?: (api: TourApi) => void;
}

/** The guided tour, in French. */
export const tourSteps: TourStep[] = [
  {
    title: 'La Pascaline',
    body: "<p>Voici la machine arithmétique de Blaise Pascal (vers 1642), ici en version décimale à 6 chiffres. Suivez la visite pour comprendre comment elle additionne — et comment elle gère les retenues.</p><p>À tout moment, faites glisser pour tourner la vue.</p>",
    cam: { pos: [0, 5.5, 15], target: [0, 1.4, 0] },
    run: (api) => {
      api.reset();
      api.setExploded(false);
      api.setTransparent(false);
      api.setSpeed(1);
    },
  },
  {
    title: "Les roues d'entrée",
    body: "<p>On saisit un nombre en tournant ces roues au stylet, chiffre par chiffre : on insère le stylet dans le trou du chiffre voulu et on tourne jusqu'à la butée. Chaque roue correspond à une colonne (unités, dizaines…).</p>",
    cam: { pos: [5.6, 2.4, 7.5], target: [5.5, 1, 1.4] },
  },
  {
    title: 'La transmission',
    body: "<p>Le mouvement passe par des <em>pignons à lanterne</em> (petits tambours à barreaux) jusqu'aux <em>roues de comptage</em>, les roues dentées qui mémorisent chaque chiffre.</p>",
    cam: { pos: [2.5, 3, 6.5], target: [3, 1.5, -0.2] },
  },
  {
    title: "L'affichage",
    body: "<p>Chaque <em>tympan</em> (tambour gravé de 0 à 9) tourne avec sa roue de comptage et présente le chiffre courant. On lit le résultat directement sur la rangée qui vous fait face.</p>",
    cam: { pos: [0, 4, 9.5], target: [0, 1.9, 0] },
  },
  {
    title: 'Le sautoir : la retenue',
    body: "<p>Voici l'invention géniale de Pascal. Regardez : la roue des unités passe de 9 à 0, le <em>sautoir</em> s'arme puis retombe par gravité et pousse la roue des dizaines d'un cran. On passe de 9 à 10.</p><p>Astuce : activez « Pas à pas » pour décomposer le mouvement.</p>",
    cam: { pos: [4.6, 2.4, 5.9], target: [4.6, 1.3, 0] },
    run: (api) => {
      api.reset();
      api.jumpTo(9);
      api.setSpeed(0.35);
      api.addAt(0, 1);
    },
  },
  {
    title: 'Une cascade de retenues',
    body: "<p>Et si toutes les roues sont à 9 ? En ajoutant 1 à 999999, la retenue se propage de proche en proche jusqu'à revenir à 000000. Comme chaque sautoir agit seul, rien ne se bloque.</p>",
    cam: { pos: [0, 6, 13], target: [0, 1.4, 0] },
    run: (api) => {
      api.reset();
      api.jumpTo(999999);
      api.setSpeed(0.6);
      api.addAt(0, 1);
    },
  },
  {
    title: 'La soustraction',
    body: "<p>La machine n'additionne jamais que. Pour soustraire, on lit la seconde rangée des tympans — le <em>complément à neuf</em> — grâce à la barre coulissante.</p><p>Démonstration de 500 − 123 : la fenêtre affiche d'abord 500, puis on additionne 123… et le complément descend jusqu'à <strong>377</strong>.</p>",
    cam: { pos: [0, 4, 10], target: [0, 1.7, 0] },
    run: (api) => {
      api.reset();
      api.setMode('sub');
      api.jumpTo(999999 - 500); // complement window shows 500
      api.setSpeed(0.6);
      api.addAt(0, 3);
      api.addAt(1, 2);
      api.addAt(2, 1); // + 123
    },
  },
  {
    title: "Voir l'intérieur",
    body: "<p>Utilisez « Vue éclatée » pour séparer les pièces, ou « Transparence » pour voir le mécanisme à travers le carter. « Étiquettes » nomme chaque pièce.</p>",
    cam: { pos: [-3, 4, 9], target: [0, 1.4, 0] },
    run: (api) => {
      api.setMode('add');
      api.setSpeed(1);
      api.setTransparent(true);
    },
  },
  {
    title: 'À vous de jouer',
    body: "<p>La visite est terminée. Composez un nombre au clavier ou au stylet, essayez une retenue, ralentissez le mouvement, ou passez en soustraction avec le bouton « Soustraction ».</p>",
    cam: { pos: [0, 5, 14], target: [0, 1.4, 0] },
    run: (api) => {
      api.setTransparent(false);
      api.setMode('add');
      api.reset();
    },
  },
];
