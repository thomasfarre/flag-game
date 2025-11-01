# Flags Quiz (SvelteKit)

Jeu solo de quiz sur les drapeaux réalisé avec SvelteKit, TypeScript strict et TailwindCSS. Identifie le pays, sa capitale, son continent ainsi que des tranches de population et de superficie pour marquer un maximum de points.

## 🚀 Prise en main

```bash
npm install
npm run dev
```

Scripts utiles :

- `npm run dev` : lance le serveur de développement.
- `npm run build` : build de production (doit être sans erreur ni warning).
- `npm run preview` : prévisualisation du build.
- `npm run lint` : vérification ESLint/Prettier.
- `npm run test` : tests unitaires (Vitest).

## 🧠 Règles du jeu

- Une partie compte 10 manches (paramétrable dans le store).
- À chaque manche, un drapeau est tiré au hasard (sans répétition).
- Questions (choix multiples) : pays, capitale, continent, population, superficie.
- Barème par manche (max 9 points) :
  - Pays : +2 si exact.
  - Capitale : +2 si exact.
  - Continent : +1 si exact.
  - Population : +2 bonne tranche, +1 tranche adjacente, 0 sinon.
  - Superficie : même principe que population.
- Écran final : score total, détail des réponses, bouton « Rejouer ».

## 📦 Données & assets

- Dataset local `src/lib/dataset/countries.json` (>=30 pays monde, valeurs population/superficie « snapshot indicatif »).
- Drapeaux rendus avec la librairie [`flag-icons`](https://www.npmjs.com/package/flag-icons) à partir des codes ISO 3166-1 alpha-2.
- Aucun asset local : les icônes sont fournies par la dépendance `flag-icons`.

## 🛠️ Stack

- [SvelteKit](https://kit.svelte.dev/) + TypeScript strict.
- [TailwindCSS](https://tailwindcss.com/) pour le style.
- Stores Svelte pour l'état de partie (aucune persistance).
- Tests unitaires avec [Vitest](https://vitest.dev/).

## ♿ Accessibilité

- Navigation clavier (radiogroup custom), focus visible.
- Libellés explicites, feedbacks textuels pour chaque correction.
- Alt text masqué pendant la question pour préserver la difficulté.

## 📈 Performances

- Aucune dépendance lourde ; rendu SVG uniquement.
- Génération de manches en mémoire, shuffle léger.

## 🗺️ Roadmap (idées futures)

1. Mode « Pass & Play » local.
2. Ajout d’indices (continent révélé, lettres capitales...).
3. Effets audio / feedbacks sonores.
4. Persistance locale (meilleurs scores).
5. Mode multi-joueur / classement en ligne.

## 🔍 Qualité de code

- ESLint + Prettier (config fournie).
- TypeScript strict, pas de `any` implicite.
- Tests unitaires couvrant le scoring et la génération de manches.

Bon jeu !
