# Drive Off
Chrome extension for estore (drive) based on OpenFood Database

## Introduction
Fonctionne avec le site www.auchandrive.fr , www.leclercdrive.fr, www.carrefour.fr (Autre drive à venir)  Ajoute une icone sur les produits. Si on glisse la souris sur l'icone openfood, une recherche est faite sur la base openfoodfact et les informations suivantes sont affichées:
* Nutriscore
* NovaLevel
* Taux nutriments
* Additifs
* Code barre

Premières releases en beta et non disponible sur le store des extnesions.

L'extension utilise les données d'openfoodfact https://fr.openfoodfacts.org/ et la librairie de génération de codebarre jsBarcode https://github.com/lindell/JsBarcode

## Installation
* Télécharger la dernière release
* Décompresser l'archive à l'endroit de votre choix
* Lancer Chrome
* Dans la barre d'URL taper chrome://extensions
* Activer le mode développeur
* Cliquer sur "Chargez l'extension non empaquetée"
* Sélectionner le dossier où vous avez décompressé la release téléchargée.
* Enjoy !

## Liste des drive compatibles
* www.auchandrive.fr
* www.leclercdrive.fr
* www.carrefourdrive.fr


## Améliorations à prévoir
* Mise en avant de la marque sur les images ou dans l'encart détails
* Ajout d'une mention sur le fait que le produit peut ne pas être bon, ex. produit ayant changé mais n'étant pas encore à jour sur OFF
* Bug sur JsBarcode avec les code barre court ex. 26020853

## Changelogs

# v1.0.1
* Refactorisation du code
* Gestion i18n (en et fr)
* Ajout de 9 drives
* Correction de bugs
