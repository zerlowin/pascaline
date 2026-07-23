/** Longer-form French copy: the welcome screen and the "how it works" panel. */
export const fr = {
  welcomeTitle: 'La Pascaline en 3D',
  welcomeBody:
    "<p>Une modélisation interactive du mécanisme de la machine à calculer de Blaise Pascal (vers 1642), en version décimale à 6 chiffres.</p>" +
    "<p>Additionnez, déclenchez une retenue, ralentissez le mouvement, ouvrez la machine, ou lancez la visite guidée.</p>",

  howItWorksTitle: 'Comment ça marche',
  howItWorks:
    '<h3>Saisir un nombre</h3>' +
    "<p>On tourne les roues d'entrée au stylet, chiffre par chiffre. Chaque roue correspond à une colonne (unités, dizaines…). La machine ne fait qu'<em>additionner</em>.</p>" +
    '<h3>La retenue : le sautoir</h3>' +
    "<p>Quand une roue passe de 9 à 0, un <em>sautoir</em> — armé par la rotation puis lâché par gravité — pousse la roue voisine d'un cran. Comme chaque sautoir agit seul, une longue retenue (999999 + 1) ne bloque jamais la machine : c'est l'invention géniale de Pascal.</p>" +
    '<h3>La soustraction</h3>' +
    "<p>La machine n'ôte pas : on lit la seconde rangée des tympans, le <em>complément à neuf</em>, dévoilée par la barre coulissante. Ajouter revient alors à soustraire.</p>",
} as const;
