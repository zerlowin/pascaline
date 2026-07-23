import type { PartId } from '../types';

export interface GlossaryEntry {
  nom: string;
  description: string;
}

/** French names and explanations for each part — shared by labels and the panel. */
export const glossary: Record<PartId, GlossaryEntry> = {
  inputWheel: {
    nom: "Roue d'entrée",
    description:
      "On introduit un stylet dans le trou du chiffre voulu et on tourne jusqu'à la butée. C'est ainsi qu'on saisit un nombre, chiffre par chiffre, colonne par colonne. La machine ne fait qu'ajouter : on n'entre jamais un chiffre « à l'envers ».",
  },
  lanternPinion: {
    nom: 'Pignon à lanterne',
    description:
      "Un petit tambour formé de deux flasques réunis par des barreaux (les fuseaux). Il transmet le mouvement d'une roue à l'autre. Pascal l'a emprunté aux moulins et aux horloges de clocher, puis miniaturisé.",
  },
  countingWheel: {
    nom: 'Roue de comptage',
    description:
      "La roue dentée qui mémorise le chiffre d'une colonne. En tournant, elle porte les goupilles qui arment peu à peu le sautoir, jusqu'au passage de 9 à 0.",
  },
  displayDrum: {
    nom: "Tympan (tambour d'affichage)",
    description:
      "Le cylindre gravé des chiffres de 0 à 9. Il tourne solidairement avec la roue de comptage et présente le chiffre courant face à vous. (En soustraction, une seconde rangée montre le complément à 9.)",
  },
  sautoir: {
    nom: 'Sautoir',
    description:
      "L'invention maîtresse de Pascal, chargée de la retenue. Armé par la rotation de la roue, il est lâché par gravité au passage de 9 à 0 et son bec fait avancer d'un cran la roue voisine. Chaque sautoir agit indépendamment : une longue retenue (999999 + 1) ne bloque jamais la machine.",
  },
  pawl: {
    nom: 'Cliquet (rochet)',
    description:
      "Un cliquet à ressort qui empêche la roue de revenir en arrière et la positionne exactement entre deux crans, pour un affichage net.",
  },
  chassis: {
    nom: 'Carter',
    description:
      "Le boîtier de bois et de laiton qui protège et aligne tout le mécanisme. Utilisez « Transparence » ou « Vue éclatée » pour voir l'intérieur.",
  },
  complementBar: {
    nom: 'Barre de complément',
    description:
      "La barre coulissante qui masque une des deux rangées des tympans : on lit la valeur directe en position addition, ou le complément à 9 en position soustraction.",
  },
};
