var model = require('../models/personne.js');
var modelSalarie = require('../models/salarie.js');
var modelEtudiant = require('../models/etudiant.js');
var modelCitation = require('../models/citation.js');
var modelVote = require('../models/vote.js');

//////////////////////////////////////////////// L I S T E R     P E R S O N N E S

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

//////////////////////////////////////////////// A J O U T E R     P E R S O N N E S

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

  modelEtudiant.ajouterEtudiant(request.session.personne, request.session.etudiant, function(err, result){
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
      response.nom = request.session.personne.nom;
      response.prenom = request.session.personne.prenom;
    }

    request.session.personne = null;
    request.session.etudiant = null;
    response.render('ajouterEtudiantOK', response);
  });
}

module.exports.AjouterSalarieOK = function(request, response)
{
  response.title = 'Ajout d\'un salarié';

  // Récupération des informations sur le salarié
  request.session.salarie = new Object();
  request.session.salarie.telpro = request.body.telpro;
  request.session.salarie.fonction = request.body.fonction;

  modelSalarie.ajouterSalarie(request.session.personne, request.session.salarie, function(err, result){
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
      response.nom = request.session.personne.nom;
      response.prenom = request.session.personne.prenom;
    }

    request.session.personne = null;
    request.session.salarie = null;
    response.render('ajouterSalarieOK', response);
  });
}

//////////////////////////////////////////////// A J O U T E R     P E R S O N N E S

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

//////////////////////////////////////////////// M O D I F I E R     P E R S O N N E S

module.exports.ModifierPersonne = function(request, response){
   response.title = 'Modifier une personne';

   model.getListePersonne(function(err, result){
     if(err){
       // gestion de l'erreur
       console.log(err);
       return;
     }

     response.listePersonne = result;
     response.nbPersonne = result.length;
     response.render('modifierPersonne', response);
   });
};

module.exports.ModifierPersonne2 = function(request, response){
   response.title = 'Modifier une personne';

   request.session.personne = new Object();
   request.session.personne.num = request.params.numPersonne;

   model.getPersonne(request.params.numPersonne, function(err, result){
     if(err){
       // gestion de l'erreur
       console.log(err);
       return;
     }
     response.personne = result[0];

     model.isEtudiant(request.params.numPersonne, function(err, result){
       if(err){
         // gestion de l'erreur
         console.log(err);
         return;
       }

       if(typeof(result[0]) !== 'undefined')
       {
         response.isEtudiant = true;
       }
       else
       {
         response.isEtudiant = false;
       }

       request.session.personne.isEtudiant = response.isEtudiant;
       response.render('modifierPersonne2', response);
   });
 });
};

module.exports.ModifierPersonneOK = function(request, response){
   response.title = 'Modifier une personne';

   // Récupération des informations générales sur la personne
   request.session.personne.nom = request.body.nom;
   request.session.personne.prenom = request.body.prenom;
   request.session.personne.tel = request.body.tel;
   request.session.personne.mail = request.body.mail;
   request.session.personne.login = request.body.login;
   request.session.personne.mdp = request.body.mdp;

   model.modifierPersonne(request.session.personne, function(err, result){
     if(err){
       // gestion de l'erreur
       console.log(err);
       return;
     }

     if(request.session.personne.isEtudiant) //étudiant
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
           request.session.personne.isEtudiant = null;
           response.render('modifierEtudiant', response);
         });
       });
     }
     else //salarié
     {
       model.getSalarie(request.session.personne.num, function(err, result){
         if(err){
           console.log(err);
           return;
         }

         response.sal = result[0];
         console.log(response.sal);

         modelSalarie.getListeFonction( function (err, result) {
           if (err) {
             // gestion de l'erreur
             console.log(err);
             return;
           }
           response.listeFonction = result;
           request.session.personne.isEtudiant = null;
           response.render('modifierSalarie', response);
         });
       });
     }
   });
};

module.exports.ModifierEtudiantOK = function(request, response)
{
  response.title = 'Modifier un étudiant';

  // Récupération des informations sur l'étudiant
  request.session.etudiant = new Object();
  request.session.etudiant.annee = request.body.annee;
  request.session.etudiant.departement = request.body.departement;

  modelEtudiant.modifierEtudiant(request.session.personne.num, request.session.etudiant, function(err, result){
    if(err){
      // gestion de l'erreur
      console.log(err);
      return;
    }

    if(result.length === 0){
      response.modifOk = false;
    }
    else{
      response.modifOk = true;
      response.nom = request.session.personne.nom;
      response.prenom = request.session.personne.prenom;
    }

    request.session.personne = null;
    request.session.etudiant = null;
    response.render('modifierEtudiantOK', response);
  });
}

module.exports.ModifierSalarieOK = function(request, response)
{
  response.title = 'Modifier un salarié';

  // Récupération des informations sur l'étudiant
  request.session.salarie = new Object();
  request.session.salarie.telpro = request.body.telpro;
  request.session.salarie.fonction = request.body.fonction;

  modelSalarie.modifierSalarie(request.session.personne.num, request.session.salarie, function(err, result){
    if(err){
      // gestion de l'erreur
      console.log(err);
      return;
    }

    if(result.length === 0){
      response.modifOk = false;
    }
    else{
      response.modifOk = true;
      response.nom = request.session.personne.nom;
      response.prenom = request.session.personne.prenom;
    }

    request.session.personne = null;
    request.session.salarie = null;
    response.render('modifierSalarieOK', response);
  });
}

//////////////////////////////////////////////// S U P P R I M E R     P E R S O N N E S

module.exports.SupprimerPersonne = function(request, response){
   response.title = 'Supprimer une personne';

   model.getListePersonne(function(err, result){
     if(err){
       // gestion de l'erreur
       console.log(err);
       return;
     }

     response.listePersonne = result;
     response.nbPersonne = result.length;
     response.render('supprimerPersonne', response);
   });
};

module.exports.SupprimerPersonneOK = function(request, response){
   response.title = 'Supprimer une personne';

   model.isEtudiant(request.body.numPersonne, function(err, result){ //test si étudiant ou salarié
     if(err){
       // gestion de l'erreur
       console.log(err);
       return;
     }

     if(typeof(result[0]) !== 'undefined')
     {
       var isEtudiant = true;
     }
     else
     {
       var isEtudiant = false;
     }

     if(isEtudiant){
       modelVote.deleteVotePers(request.body.numPersonne, function(err, result){
         if(err){
           // gestion de l'erreur
           console.log(err);
           return;
         }

         modelEtudiant.deleteEtudiant(request.body.numPersonne, function(err, result){
           if(err){
             // gestion de l'erreur
             console.log(err);
             return;
           }

           model.deletePersonne(request.body.numPersonne, function(err, result){
             if(err){
               // gestion de l'erreur
               console.log(err);
               return;
             }

             if(result.length === 0){
               response.supprOk = false;
             }
             else{
               response.supprOk = true;
             }

             response.render('supprimerPersonneOK', response);
          });
        });
       });
     }
     else //salarié
     {
       modelCitation.deleteCitationPers(request.body.numPersonne, function(err, result){
         if(err){
           // gestion de l'erreur
           console.log(err);
           return;
         }

         modelSalarie.deleteSalarie(request.body.numPersonne, function(err, result){
           if(err){
             // gestion de l'erreur
             console.log(err);
             return;
           }

           model.deletePersonne(request.body.numPersonne, function(err, result){
             if(err){
               // gestion de l'erreur
               console.log(err);
               return;
             }

             if(result.length === 0){
               response.supprOk = false;
             }
             else{
               response.supprOk = true;
             }

             response.render('supprimerPersonneOK', response);
          });
        });
       });
     }
   });
};
