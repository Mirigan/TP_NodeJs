var async=require('async');

var model=require('../models/citation.js');
var model_p=require('../models/personne.js');
var model_v=require('../models/vote.js');


// ////////////////////////////////////////////// L I S T E R     C I T A T I O N

module.exports.ListerCitation = 	function(request, response){
   response.title = 'Liste des citations';

   model.getListeCitation( function(err, result){
     if (err) {
         // gestion de l'erreur
         console.log(err);
         return;
     }
     response.listeCitation = result;
     response.nbCitation = result.length;
     response.render('listerCitation', response);
     });
};

//////////////////////////////////////////////// A J O U T E R     C I T A T I O N

module.exports.AjouterCitation = 	function(request, response){
  response.title = 'Ajouter des citations';

  model_p.getAllSalarie( function(err, result){
    if (err) {
      // gestion de l'erreur
      console.log(err);
      return;
    }
    response.listeSalaries = result;
    response.render('ajouterCitation', response);
  });
} ;

/*
pour le teste des mots interdit voir avec le module string et replaceAll pour remplacer les mots
par des tierts
*/
module.exports.VerifCitation = function(request, response){
  response.title = 'Ajouter une citation';
  //création d'une variable qui va contenir toutes informations de la citation

  var tmp = new Array();
  tmp = request.body.date.split('/');

  var dateOk = tmp[2]+"-"+tmp[1]+"-"+tmp[0]

  citation = {
    per_num: request.body.enseignant,
    per_num_valide: null,
    per_num_etu: request.session.per_num_co,
    cit_libelle: request.body.citation,
    cit_date: dateOk,
    cit_valide: 0,
    cit_date_valide: null,
    cit_date_depo : date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
  };

  console.log(citation);

  model.ajouterCitation(citation, function(err, result){
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

    response.render('ajouterCitationOk', response);
  });

};


// ////////////////////////////////////////////// R E C H E R C H E R     C I T A T I O N

module.exports.RechercherCitation = function(request, response){
   response.title = 'Rechercher des citations';

   if (request.session.per_login){
     async.parallel([
       function(callback){
         model.getListePersonneDepCitValide(function (errSal, resultSal) {callback(null, resultSal) });
       },
       function(callback){
         model.getListeDateCitation(function (errDate, resultDate) { callback(null, resultDate) });
       },
       function(callback){
         model_v.getNote(function (errVote, resultVote) { callback(null, resultVote) });
       }
       ],
       function(err, result){
         response.listeSalaries = result[0];
         response.listeDate = result[1];
         response.listeVote = result[2];
         response.render('rechercherCitation', response);
       }
     );//async
   }//fin si login

   else{
     response.redirect('/');
   }
};

module.exports.RechercherCitationOk = function(request, response){
  response.title = 'Rechercher des citations';

};
