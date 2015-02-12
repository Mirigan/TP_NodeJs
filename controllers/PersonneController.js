var model = require('../models/personne.js');

// ////////////////////////////////////////////// L I S T E R     P E R S O N N E S

module.exports.ListerPersonne = function(request, response){
   response.title = 'Liste des personnes';

   model.getListePersonne(function(err, result){
     if(err){
       // gestion de l'erreur
       console.log(err);
       return;
     }

     response.listePersonne = result;
     response.nbPersonne = result.length;
     response.render('listerPersonne', response);
   });
};

// ////////////////////////////////////////////// A J O U T E R     P E R S O N N E S

module.exports.AjouterPersonne = function(request, response){
   response.title = 'Ajout des personnes';

   response.render('ajouterPersonne', response);
};

// A REVOIR en fonction de étudiant ou personnel
module.exports.DetailsPersonne = function(request, response){

  numPersonne = request.params.numPersonne;

  model.isEtudiant(numPersonne, function(err, result){
    if(err){
      // gestion de l'erreur
      console.log(err);
      return;
    }

    if(typeof(result[0]) !== 'undefined')
    {
      model.getEtudiant(numPersonne, function(err, result){
        if(err){
          console.log(err);
          return;
        }

        response.etu = result[0];
        console.log(response.etu);
        response.render('detailsEtudiant', response);
      });
    }
    else
    {
      model.getSalarie(numPersonne, function(err, result){
        if(err){
          console.log(err);
          return;
        }

        response.sal = result[0];
        console.log(response.sal);
        response.render('detailsSalarie', response);
      });
    }
  });
};
