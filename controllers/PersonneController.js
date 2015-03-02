var model = require('../models/personne.js');
var modelSalarie = require('../models/salarie.js');
var modelEtudiant = require('../models/etudiant.js');

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

module.exports.AjouterPersonneOK = function(request, response){
   response.title = 'Ajout des personnes';

   // Récupération des informations générales sur la personne
   request.session.personne = new Object();
   request.session.personne.nom = request.body.nom;
   request.session.personne.prenom = request.body.prenom;
   request.session.personne.tel = request.body.tel;
   request.session.personne.mail = request.body.mail;
   request.session.personne.login = request.body.login;
   request.session.personne.mdp = request.body.mdp;
   request.session.personne.categorie = request.body.categorie;

   // Redirection en fonction de la catégorie
   if(request.body.categorie == 'etudiant')
   {
     modelEtudiant.getListeAnnee( function (err, result) {
       if (err) {
         // gestion de l'erreur
         console.log(err);
         return;
       }
       response.listeAnnee = result;
       modelEtudiant.getListeDepartement( function (err, result) {
         if (err) {
           // gestion de l'erreur
           console.log(err);
           return;
         }
         response.listeDepartement = result;
         response.render('ajouterEtudiant', response);
       });
     });
   }
   else
   {
     modelSalarie.getListeFonction( function (err, result) {
       if (err) {
         // gestion de l'erreur
         console.log(err);
         return;
       }
       response.listeFonction = result;
       response.render('ajouterSalarie', response);
     });
   }
};

module.exports.AjouterEtudiantOK = function(request, response)
{
  response.title = 'Ajout d\'un étudiant';

  // Récupération des informations sur l'étudiant
  request.session.etudiant = new Object();
  request.session.etudiant.annee = request.body.annee;
  request.session.etudiant.departement = request.body.departement;

  model.ajouterEtudiant(request.session.personne, request.session.etudiant, function(err, result){
    if(err){
      // gestion de l'erreur
      console.log(err);
      return;
    }
  });

  response.render('ajouterEtudiantOK', response);
}

module.exports.AjouterSalarieOK = function(request, response)
{
  response.title = 'Ajout d\'un salarié';

  // Récupération des informations sur le salarié
  request.session.salarie = new Object();
  request.session.salarie.telpro = request.body.telpro;
  request.session.salarie.fonction = request.body.fonction;

  model.ajouterSalarie(request.session.personne, request.session.salarie, function(err, result){
    if(err){
      // gestion de l'erreur
      console.log(err);
      return;
    }
  });

  response.render('ajouterSalarieOK', response);
}

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
