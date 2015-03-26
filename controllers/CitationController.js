var async=require('async');

var model=require('../models/citation.js');
var model_p=require('../models/personne.js');
var model_v=require('../models/vote.js');
var model_m = require('../models/mot.js');


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
module.exports.AjouterCitationOk = function(request, response){
  response.title = 'Ajouter une citation';
  //création d'une variable qui va contenir toutes informations de la citation

  model_m.getListeMot(function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    var citation = request.body.citation;
    var estCorrecte = true;
    var listeMotsChanges = [];
    for(var index=0; index<result.length; index++){
        var mot = result[index].mot_interdit;
        var motInterdit = citation.match(new RegExp(mot, "i"));
        while(motInterdit){
            estCorrecte = false;
            citation = citation.replace(new RegExp(motInterdit, "g"), '---');
            listeMotsChanges.push(motInterdit);
            motInterdit = citation.match(new RegExp(mot, "i"));
        }
    }

    if (estCorrecte == false){
        response.enseignant = request.body.selectEnseignant;
        response.date = request.body.date;
        response.citation = citation;
        response.motsInterdits = listeMotsChanges;
        model_p.getAllSalarie( function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            response.listeSalaries = result;
            response.render('ajouterCitation', response);
        });

    } else {
        var dateAnglaise = request.body.date;
        var membres = dateAnglaiajouterCitationOkse.split('/');
        dateAnglaise = new Date(membres[2],membres[1],membres[0]);
        data = {
            per_num: parseInt(request.body.selectEnseignant),
            per_num_valide: null,
            per_num_etu: request.session.per_num_co,
            cit_libelle: request.body.citation,
            cit_date: dateAnglaise,
            cit_valide: 0,
            cit_date_valide: null

        };
        console.log(data);
        model.ajouterCitation(data, function(err, result){
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
      }
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

  if (request.session.per_login){
    /*if(request.body.enseignant == "tout"){

    }*/



    response.render('rechercheCitationOk', response);
  }//fin si login
  else{
   response.redirect('/');
  }

};
