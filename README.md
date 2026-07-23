# La Pascaline — le mécanisme en 3D

Modélisation 3D **interactive et pédagogique** du mécanisme de la **Pascaline**, la
machine arithmétique inventée par Blaise Pascal vers 1642. L'application met en scène,
dans le navigateur, la version **décimale à 6 chiffres** et son invention maîtresse : le
**report par sautoir**, une retenue déclenchée par gravité qui rend les roues
indépendantes les unes des autres.

> 🚧 Projet en construction — développé par phases. Voir la feuille de route plus bas.

## Le mécanisme en bref

- On saisit un chiffre en tournant une **roue d'entrée** au stylet (comme un cadran de
  téléphone), jusqu'à une butée.
- Le mouvement est transmis par des **pignons à lanterne** aux **roues de comptage**.
- Chaque **tympan** (tambour d'affichage) montre le chiffre courant dans une fenêtre.
- Quand une roue passe de **9 à 0**, un **sautoir** — armé par la rotation puis lâché par
  gravité — pousse la roue voisine d'un cran : c'est la **retenue**. Comme chaque sautoir
  agit indépendamment, une longue propagation (par exemple 999999 + 1) ne bloque jamais.
- La **soustraction** se fait par **complément à neuf**, à l'aide d'une **barre
  coulissante** qui dévoile une seconde rangée de chiffres sur les tympans.

## Fonctionnalités

- **Saisie au stylet** : cliquez un chiffre sur une roue d'entrée pour l'ajouter
  à sa colonne ; ou tapez un nombre entier.
- **Report animé** : le sautoir s'arme puis retombe par gravité ; la retenue se
  propage en cascade (essayez 999999 + 1).
- **Ralenti & pas-à-pas** : réglez la vitesse, mettez en pause, ou avancez le
  mécanisme étape par étape.
- **Vue éclatée** et **transparence** pour voir l'intérieur du mécanisme.
- **Étiquettes cliquables** + glossaire français de chaque pièce.
- **Visite guidée** en français, avec déplacements de caméra et démonstrations.
- **Soustraction** par complément à neuf, avec la barre coulissante.

## Développement local

Prérequis : Node.js 20+.

```bash
npm install      # installe les dépendances
npm run dev      # serveur de développement (http://localhost:5173/pascaline/)
npm run build    # vérifie les types + build de production dans dist/
npm run preview  # prévisualise le build de production
npm test         # tests unitaires du modèle (Vitest)
```

> Note : le serveur de dev sert l'application sous le chemin `/pascaline/` (même `base`
> que sur GitHub Pages), afin de détecter tôt les erreurs de chemin.

## Mise en ligne (GitHub Pages)

Le déploiement est automatisé par GitHub Actions
(`.github/workflows/deploy.yml`) : à chaque push sur la branche de développement,
l'application est buildée puis publiée sur GitHub Pages à l'adresse
**https://zerlowin.github.io/pascaline/**.

**Étape manuelle unique à réaliser une fois** dans les réglages du dépôt :

> **Settings → Pages → Build and deployment → Source : « GitHub Actions »**

Sans cette activation, l'étape de déploiement échoue avec l'erreur « Pages not enabled ».

## Pile technique

- [Three.js](https://threejs.org/) (r181) — rendu 3D WebGL, géométrie procédurale.
- [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/) — build et typage.
- [Vitest](https://vitest.dev/) — tests unitaires de la logique de calcul.
- `CSS2DRenderer` — étiquettes HTML ancrées aux pièces 3D.

## Architecture

Le code sépare strictement trois responsabilités :

- **Modèle** (`src/model/`) — un registre de 6 chiffres et la logique de retenue, pur et
  testable, sans aucune dépendance à Three.js.
- **Scène** (`src/scene/`) — la construction procédurale des pièces (roues, pignons,
  tympans, sautoir, carter) et leur assemblage en « stations ».
- **Animation** (`src/anim/`) — un séquenceur qui traduit les étapes émises par le modèle
  en mouvements minutés, avec une horloge unique (vitesse, pause, pas-à-pas).

L'interface (`src/ui/`, `src/interaction/`) et les contenus pédagogiques français
(`src/content/`) s'appuient sur ces trois couches.

## Licence

À définir.
