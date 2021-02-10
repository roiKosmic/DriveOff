# DriveOFF

WebExtension for estore (drive) using Open Food Facts Database

## Compatible Browsers

* [x] Firefox
* [x] Chromium
* [x] Opera
* [x] Vivaldi
* [ ] Edge (*non testé*)

## Introduction

Fonctionne avec une poignée de drive pour l'instant, mais utilisant un système [modulaire](./docs/drive_config.md)  
Ajoute sur les fiches produits les informations suivantes :

* [x] Nutri-Score (qualité nutritionnelle de A à E)
* [x] Groupe Nova (transformation des aliments de 1 à 4)
* [x] Eco Score (impact environnemental de A à E)
* [ ] Taux de nutriments
* [ ] Additifs
* [ ] Code-barre

L'extension utilise les données d'[Open Food Facts](https://fr.openfoodfacts.org/) et la librairie de génération de code-barres [jsBarcode](https://github.com/lindell/JsBarcode)

## Build

**NPM**

```sh
npm install
npm run-script build
```

**Yarn**

```sh
yarn
yarn build
```

## Installation

_**DriveOFF** n'est pas encore disponible sur les store d'extensions, l'installation se fait depuis les sources._

* Télécharger la dernière release
* Décompresser l'archive à l'endroit de votre choix

### Chromium

* Lancer **Chromium**, **Chrome**, **Vivaldi** ou **Opera**
* Taper dans la barre d'URL `chrome://extensions`
* Activer le mode développeur
* Cliquer sur "Chargez l'extension non empaquetée"
* Sélectionner le dossier où vous avez décompressé la release téléchargée.
* Enjoy !

### Firefox

* Lancer **Firefox**
* Taper dans la barre d'URL `about:debugging#/runtime/this-firefox`
* Cliquer sur "Charger un module complémentaire temporaire…"
* Ouvrir le fichier `manifest.json` dans le dossier où vous avez décompressé la release téléchargée.
* Enjoy !

## Liste des drive compatibles

* [x] auchan.fr (*fiches produit uniquement*)
* [x] bio.coop (*fiches produit uniquement*)
* [x] carrefour.fr
* [ ] cora.fr
* [x] intermarche.com
* [ ] leclercdrive.fr
