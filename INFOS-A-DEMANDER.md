# Le Piri Piri : infos à demander au restaurant

Ce qu'on sait déjà (article LusoJornal, février 2026) : Philippe Salgado, natif d'Amiens, parents arrivés du Portugal au début des années 1970 ; société La Morada, ouverture le 1er juin 2022 ; sauce piri piri maison ; churrasco à la viande locale ; un corner Le Piri Piri aux Halles d'Amiens.

1. **Son prénom et son histoire** : valider le texte du bloc « Les spécialités » et des pages SEO (famille, Guimarães, le grand-père de 91 ans ?). Veut-il qu'on mentionne le corner des Halles d'Amiens ?
2. **La carte complète et les prix** : les 25 plats de data/carte.json sont une proposition (classiques du churrasco portugais) ; garder, retirer, ajouter, et donner chaque prix. Plat du jour ? Morue le vendredi ?
3. **Les horaires exacts** (midi / soir, jour de fermeture, congés) : data/horaires.json, puis `confirmed: true`.
4. **Les commandes pour les fêtes** : poulets entiers en quantité, plateaux, délai minimum (2 jours prévus), prix, acompte ?
5. **Un portable pour WhatsApp** (le 03 22 44 76 51 est un fixe) : data/site.json → whatsapp.
6. **L'e-mail** qui reçoit les commandes (+ accord pour Resend : clé API, domaine d'envoi).
7. **Des photos** des plats, de la grille / braise, de la façade, de la salle et de l'équipe (voir assets/A-PHOTOGRAPHIER.md).
8. **Le logo** : son vrai logo (badge « Churrasqueira · Rotisserie - Barbecue », coq dans une flamme) a été redessiné en SVG d’après l’image de sa fiche Google (public/logo.svg). Lui demander le fichier d’origine pour vérifier les détails.
9. **SIRET** et directeur de la publication (mentions légales).
10. Moyens de paiement acceptés (carte, espèces, titres-restaurant), places assises, stationnement, accès bus.
11. Accord pour reprendre de vrais avis Google sur le site (data/avis.json).
12. Paiement en ligne : le veut-il (Stripe, désactivé pour l'instant) ?
