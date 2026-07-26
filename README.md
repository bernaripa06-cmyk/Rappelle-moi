# Rappelle-moi

Prototype mobile Android et iPhone d’une mémoire quotidienne commandée à la voix.

## Fonctions de la version 0.1

- dictée vocale en français ;
- saisie manuelle de secours ;
- compréhension de « demain », « vendredi », « dans 20 minutes », « le 12 mars » et des heures ;
- classement automatique : appels, tâches, anniversaires, courses et notes ;
- notifications locales ;
- conservation des rappels sur le téléphone ;
- détection automatique du pays, de la langue, du format 12/24 h et du fuseau horaire ;
- affichage des rappels dans le fuseau actuel du téléphone, y compris après un voyage ;
- écran unique volontairement simple.

## Lancer le projet

```bash
npm install
npx expo prebuild
npx expo run:android
```

Pour iPhone, utiliser un Mac avec Xcode puis :

```bash
npx expo run:ios
```

La reconnaissance vocale utilise un module natif : l’application doit être lancée comme build de développement, pas dans Expo Go.

## Exemples compris

- « Demain à 14h appeler Stefano »
- « Dans 20 minutes sortir le gâteau »
- « Ajoute beurre et café à la liste de courses »
- « Anniversaire de maman le 12 mars »
- « Vendredi matin demander le devis »

## Étape suivante

Tester la compréhension réelle sur Android, ajouter la modification avant validation, les répétitions (« tous les lundis ») et les rappels liés à un lieu.
