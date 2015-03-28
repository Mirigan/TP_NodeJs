var async=require('async');

var model=require('../models/citation.js');
var model_p=require('../models/personne.js');
var model_v=require('../models/vote.js');
var model_m = require('../models/mot.js');


// ////////////////////////////////////////////// L I S T E R     C I T A T I O N

module.exports.ListerCitation = function (request, response) {
    response.title = 'Liste des citations';

    if (request.session.per_login){
      model.getListeCitation(function (err, result) {
          if (err) {
              console.log(err);
              return;
          }

          model_v.getListeVote(function (err, result2) {
              if (err) {
                  console.log(err);
                  return;
              }

              for (var I = 0; I < result.length; I++) {
                  result[I].estNotable = true;
                  for (var J = 0; J < result2.length; J++) {
                      if (result[I].cit_num == result2[J].cit_num && result2[J].per_num == request.session.per_num_co) {
                          result[I].estNotable = false;
                      }
                  }
              }

              response.listeCitation = result;
              response.nbCitation = result.length;

              response.render('listerCitation', response);
          });
      });
    }//fin si login

    else{
      response.redirect('/');
    }
};



//////////////////////////////////////////////// A J O U T E R     C I T A T I O N

module.exports.AjouterCitation = 	function(request, response){
  response.title = 'Ajouter des citations';

  if (request.session.per_login){
    model_p.getAllSalarie( function(err, result){
      if (err) {
        // gestion de l'erreur
        console.log(err);
        return;
      }
      response.listeSalaries = result;
      response.render('ajouterCitation', response);
    });
  }//fin si login

  else{
    response.redirect('/');
  }
} ;

/*
*/
module.exports.AjouterCitationOk = function(request, response){
  response.title = 'Ajouter une citation';
  //création d'une variable qui va contenir toutes informations de la citation

  if (request.session.per_login){
    model_m.getListeMot(function (err, result) {
      if (err) {
        console.log(err);
        return;
      }

      var citation = request.body.citation;
      var estCorrecte = true;
      var listeMotsChanges = [];
      for(var I=0; I<result.length; I++){
          var mot = result[I].mot_interdit;
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
  }//fin si login
  else{
    response.redirect('/');
  }
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


/////////////////// Notation d'une citation
module.exports.NoterCitation = function (request, response) {
  response.title = 'Noter une citation';

  if (request.session.per_login){
    var id = parseInt(request.param("id"));
    response.idCitation = id;
    response.render('noterCitation', response);
  }//fin si login
  else{
    response.redirect('/');
  }
};

module.exports.NoterCitationOk = function (request, response) {
  response.title = 'Noter une citation';

  if (request.session.per_login){
    var data = {
        cit_num: parseInt(request.param("id")),
        per_num: request.session.per_num_co,
        vot_valeur: request.body.note
    }
    model_v.noteCitation(data, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.render('noterCitationOk', response);
    });
  }//fin si login
  else{
    response.redirect('/');
  }
};
