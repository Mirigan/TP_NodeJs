var model = require('../models/ville.js');


//////////////////////////////////////////////// L I S T E R     V I L L E S

/*
* Ce module permet de récupérer l'intégralité des Villes
* en utilisant la méthode getListVille du model ville.js
* il passe listeVille  et nbVille à la vue listerVille.
* response.listeVille contient par exemple :
* [ { vil_num: 5, vil_nom: 'Tulle' },
* { vil_num: 6, vil_nom: 'Brive' },
* { vil_num: 17, vil_nom: 'Orléans' } ]

* response.nbVille contient par exemple : 3
* response.title est passé à main.handlebars via la vue listerVille
* il sera inclus dans cette balise : <title> {{title}}</title>
*/

module.exports.ListerVille = function(request, response){
  response.title = 'Liste des villes';

  model.getListeVille( function (err, result) {
    if (err) {
      // gestion de l'erreur
      console.log(err);
      return;
    }
    response.listeVille = result;
    response.nbVille = result.length;
    response.render('listerVille', response);
  });
};

//////////////////////////////////////////////// A J O U T E R     V I L L E

module.exports.AjouterVille = function(request, response){

   response.title = 'Ajouter des villes';
   response.render('ajouterVille', response);
};

module.exports.AjouterVilleOK = function(request, response){

   response.title = 'Ajouter des villes';
   model.ajouterVille(request.body.nomVille, function(err, result){
     if(err){
       // gestion de l'erreur
       console.log(err);
       return;
     }
     if(result.length === 0){
       response.ajoutOk = false;
     }
     else{
       response.ajoutOK = true;
     }

     response.nomVille = request.body.nomVille;
     response.render('ajouterVilleOK', response);
   });
};

//////////////////////////////////////////////// I N S E R E R     V I L L E

module.exports.InsertVille = function(request, response){

  response.title = 'Insertion d\'une ville';
 	response.render('ajouterVille', response);
};

//////////////////////////////////////////////// M O D I F I E R     V I L L E

module.exports.ModifierVille = function(request, response){

   response.title = 'Modifier une ville';

   model.getListeVille( function (err, result) {
     if (err) {
       // gestion de l'erreur
       console.log(err);
       return;
     }
     response.listeVille = result;
     response.nbVille = result.length;
     response.render('modifierVille', response);
   });
};

module.exports.ModifierVille2 = function(request, response){

   response.title = 'Modifier une ville';

   request.session.ville = new Object();
   request.session.ville.num = request.params.numVille;

   model.getVille(request.session.ville.num, function (err, result) {
     if (err) {
       // gestion de l'erreur
       console.log(err);
       return;
     }
     response.ville = result[0];
     request.session.ville.ancienNom = response.ville.vil_nom;
     response.render('modifierVille2', response);
   });
};

module.exports.ModifierVilleOK = function(request, response){

   response.title = 'Modifier une ville';
   request.session.ville.nouveauNom = request.body.nom;

   model.modifierVille(request.session.ville, function (err, result) {
     if (err) {
       // gestion de l'erreur
       console.log(err);
       return;
     }

     if(result.length === 0){
       response.modifOk = false;
     }
     else{
       response.modifOk = true;
       response.ancienNom = request.session.ville.ancienNom;
       response.nouveauNom = request.session.ville.nouveauNom;
     }

     request.session.ville = null;
     response.render('modifierVilleOK', response);
   });
};

//////////////////////////////////////////////// S U P P R I M E R     V I L L E

module.exports.SupprimerVille = function(request, response){

   response.title = 'Supprimer une ville';

   model.getListeVille( function (err, result) {
     if (err) {
       // gestion de l'erreur
       console.log(err);
       return;
     }
     response.listeVille = result;
     response.nbVille = result.length;
     response.render('supprimerVille', response);
   });
};
