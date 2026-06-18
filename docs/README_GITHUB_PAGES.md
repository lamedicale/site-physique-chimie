# Site prêt pour GitHub Pages

Ce dossier `docs/` contient la version prête à publier de ton site.

## Publication recommandée

1. Crée ou ouvre ton dépôt GitHub.
2. Mets le dossier `docs/` à la racine du dépôt.
3. Va dans `Settings` → `Pages`.
4. Dans `Build and deployment`, choisis :
   - Source : `Deploy from a branch`
   - Branch : `main`
   - Folder : `/docs`
5. Sauvegarde.

Ton site aura une adresse du type :
`https://tonpseudo.github.io/nom-du-repo/`

## Pages incluses

- `index.html` : page d’accueil.
- `sciences-5eme.html` : chapitres 5e.
- `sciences-4eme.html` : chapitres 4e.
- `sciences-3eme.html` : chapitres 3e, conservée car les menus internes la référencent.
- `sciences-jeux.html` : page jeux.
- `chapitre-5e.html`, `chapitre-4e.html`, `chapitre-3e.html`, `jeux.html` : alias/redirections pratiques.
- dossiers de jeux : `temple-quiz-pixel/`, `panique-au-labo-pixel/`, `labo-kart/`, `labs-up/`.

## Nettoyage effectué

- Suppression des fichiers macOS inutiles (`.DS_Store`, `__MACOSX`, `._*`).
- Suppression des fichiers de sauvegarde `.bak` et du dossier `.claude`.
- Ajout d’un fichier `.nojekyll` pour éviter que GitHub Pages modifie l’interprétation des fichiers statiques.
