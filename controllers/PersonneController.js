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


//////////////////////////////////////////////// A J O U T E R     P E R S O N N E

module.exports.AjouterPersonne = function(request, response){
   response.title = 'Ajout des personnes';

   // Seules les personnes connectées peuvent ajouter une personne
   if (request.session.per_login){
     response.render('ajouterPersonne', response);
   }//fin si login
   else{
     response.redirect('/');
   }
};

module.exports.AjouterPersonneOK = function(request, response){
   response.title = 'Ajout des personnes';

   // Seules les personnes connectées peuvent ajouter une personne
   if (request.session.per_login){
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
     if(request.body.categorie == 'etudiant') //étudiant
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
     else //salarié
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
   }//fin si login
   else{
     response.redirect('/');
   }
};

module.exports.AjouterEtudiantOK = function(request, response)
{
  response.title = 'Ajout d\'un étudiant';

  // Seules les personnes connectées peuvent ajouter un étudiant
  if (request.session.per_login){
    // Récupération des informations sur l'étudiant
    request.session.etudiant = new Object();
    request.session.etudiant.annee = request.body.annee;
    request.session.etudiant.departement = request.body.departement;

    modelEtudiant.ajouterEtudiant(request.session.personne, request.session.etudiant, function(err, result){
      if(err){
        // gestion de l'erreur
        console.log(err);
        response.ajoutOk = false;
      }
      else //si pas d'erreur
      {
        response.ajoutOK = true;
      }

      response.nom = request.session.personne.nom;
      response.prenom = request.session.personne.prenom;
      // On vide les variables de session
      request.session.personne = null;
      request.session.etudiant = null;
      response.render('ajouterEtudiantOK', response);
    });
  }//fin si login
  else{
    response.redirect('/');
  }
}

module.exports.AjouterSalarieOK = function(request, response)
{
  response.title = 'Ajout d\'un salarié';

  // Seules les personnes connectées peuvent ajouter un salarié
  if (request.session.per_login){
    // Récupération des informations sur le salarié
    request.session.salarie = new Object();
    request.session.salarie.telpro = request.body.telpro;
    request.session.salarie.fonction = request.body.fonction;

    modelSalarie.ajouterSalarie(request.session.personne, request.session.salarie, function(err, result){
      if(err){
        // gestion de l'erreur
        console.log(err);
        response.ajoutOk = false;
      }
      else{ //si pas d'erreur
        response.ajoutOK = true;
      }

      response.nom = request.session.personne.nom;
      response.prenom = request.session.personne.prenom;
      // On vide les variables de session
      request.session.personne = null;
      request.session.salarie = null;
      response.render('ajouterSalarieOK', response);
    });
  }//fin si login
  else{
    response.redirect('/');
  }
}

//////////////////////////////////////////////// D E T A I L S     P E R S O N N E

module.exports.DetailsPersonne = function(request, response){

  numPersonne = request.params.numPersonne;

  model.isEtudiant(numPersonne, function(err, result){
    if(err){
      // gestion de l'erreur
      console.log(err);
      return;
    }

    if(typeof(result[0]) !== 'undefined') //étudiant
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
    else //salarié
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

//////////////////////////////////////////////// M O D I F I E R     P E R S O N N E

module.exports.ModifierPersonne = function(request, response){
   response.title = 'Modifier une personne';

   // Seules les personnes connectées peuvent modifier une personne
   if (request.session.per_login){
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
   }//fin si login
   else{
     response.redirect('/');
   }
};

module.exports.ModifierPersonne2 = function(request, response){
   response.title = 'Modifier une personne';

   // Seules les personnes connectées peuvent modifier une personne
   if (request.session.per_login){
     request.session.personne = new Object();
     request.session.personne.num = request.params.numPersonne; //numéro de la personne à modifier

     if(!request.session.per_admin){
       response.render('modifierPersonne2', response);
     }
     else{
       response.connexionOk = true;

       model.getPersonne(request.session.personne.num, function(err, result){
         if(err){
           // gestion de l'erreur
           console.log(err);
           return;
         }
         response.personne = result[0];

         model.isEtudiant(request.session.personne.num, function(err, result){
           if(err){
             // gestion de l'erreur
             console.log(err);
             return;
           }

           if(typeof(result[0]) !== 'undefined') //étudiant
           {
             response.isEtudiant = true;
           }
           else //salarié
           {
             response.isEtudiant = false;
           }

           request.session.personne.isEtudiant = response.isEtudiant;
           response.render('modifierPersonne3', response);
         });
       });
     }
   }//fin si login
   else{
     response.redirect('/');
   }
};

module.exports.ModifierPersonne3 = function(request, response){
   response.title = 'Modifier une personne';

   // Seules les personnes connectées peuvent modifier une personne
   if (request.session.per_login){
     //Authentification de la personne
     var data = {login:request.body.login, pass:request.body.pass};
     model.getLoginOk(data,function(err, result){
       if (err) {
           // gestion de l'erreur
           console.log(err);
           return;
       }

       if(result.length === 0)
       {
         console.log('mot de passe ou login non valide');
         response.connexionOk = false;
         request.session.personne = null;
       }
       else
       {
         response.connexionOk = true;

         model.getPersonne(request.session.personne.num, function(err, result){
           if(err){
             // gestion de l'erreur
             console.log(err);
             return;
           }
           response.personne = result[0];

           model.isEtudiant(request.session.personne.num, function(err, result){
             if(err){
               // gestion de l'erreur
               console.log(err);
               return;
             }

             if(typeof(result[0]) !== 'undefined') //étudiant
             {
               response.isEtudiant = true;
             }
             else //salarié
             {
               response.isEtudiant = false;
             }

             request.session.personne.isEtudiant = response.isEtudiant;
             response.render('modifierPersonne3', response);
           });
         });
       }
    });
   }//fin si login
   else{
     response.redirect('/');
   }
};

module.exports.ModifierPersonneOK = function(request, response){
   response.title = 'Modifier une personne';

   // Seules les personnes connectées peuvent modifier une personne
   if (request.session.per_login){

     // Récupération des informations générales sur la personne
     request.session.personne.nom = request.body.nom;
     request.session.personne.prenom = request.body.prenom;
     request.session.personne.tel = request.body.tel;
     request.session.personne.mail = request.body.mail;
     request.session.personne.login = request.body.login;
     request.session.personne.mdp = request.body.mdp;

     // Modification des informations générales sur la personne
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
             // On vide les variables de session
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
             // On vide les variables de session
             request.session.personne.isEtudiant = null;
             response.render('modifierSalarie', response);
           });
         });
       }
     });
   }//fin si login
   else{
     response.redirect('/');
   }
};

module.exports.ModifierEtudiantOK = function(request, response)
{
  response.title = 'Modifier un étudiant';

  // Seules les personnes connectées peuvent modifier un étudiant
  if (request.session.per_login){

    // Récupération des informations sur l'étudiant
    request.session.etudiant = new Object();
    request.session.etudiant.annee = request.body.annee;
    request.session.etudiant.departement = request.body.departement;

    // Modification des informations sur l'étudiant
    modelEtudiant.modifierEtudiant(request.session.personne.num, request.session.etudiant, function(err, result){
      if(err){
        // gestion de l'erreur
        console.log(err);
        response.modifOk = false;
      }
      else{ //pas d'erreur
        response.modifOk = true;
      }

      response.nom = request.session.personne.nom;
      response.prenom = request.session.personne.prenom;
      // On vide les variables de session
      request.session.personne = null;
      request.session.etudiant = null;
      response.render('modifierEtudiantOK', response);
    });
  }//fin si login
  else{
    response.redirect('/');
  }
}

module.exports.ModifierSalarieOK = function(request, response)
{
  response.title = 'Modifier un salarié';

  // Seules les personnes connectées peuvent modifier un salarié
  if (request.session.per_login){

    // Récupération des informations sur l'étudiant
    request.session.salarie = new Object();
    request.session.salarie.telpro = request.body.telpro;
    request.session.salarie.fonction = request.body.fonction;

    // Modification des informations sur le salarié
    modelSalarie.modifierSalarie(request.session.personne.num, request.session.salarie, function(err, result){
      if(err){
        // gestion de l'erreur
        console.log(err);
        response.modifOk = false;
      }
      else{
        response.modifOk = true;
      }

      response.nom = request.session.personne.nom;
      response.prenom = request.session.personne.prenom;
      // On vide les variables de session
      request.session.personne = null;
      request.session.salarie = null;
      response.render('modifierSalarieOK', response);
    });
  }//fin si login
  else{
    response.redirect('/');
  }
}

//////////////////////////////////////////////// S U P P R I M E R     P E R S O N N E

module.exports.SupprimerPersonne = function(request, response){
   response.title = 'Supprimer une personne';

   // Seul l'admin peut supprimer une personne
   if (request.session.per_admin){
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
   }//fin si login
   else{
     response.redirect('/');
   }
};

module.exports.SupprimerPersonneOK = function(request, response){
   response.title = 'Supprimer une personne';

   // Seul l'admin peut supprimer une personne
   if (request.session.per_admin){

     model.getPersonne(request.body.numPersonne, function(err, result){
       if(err){
         // gestion de l'erreur
         console.log(err);
         return;
       }

       request.session.personne = new Object();
       request.session.personne.prenom = result[0].per_prenom;
       request.session.personne.nom = result[0].per_nom;

       model.isEtudiant(request.body.numPersonne, function(err, result){ //test si étudiant ou salarié
         if(err){
           // gestion de l'erreur
           console.log(err);
           return;
         }

         if(typeof(result[0]) !== 'undefined') //étudiant
         {
           var isEtudiant = true;
         }
         else //salarié
         {
           var isEtudiant = false;
         }

         if(isEtudiant){ //étudiant
           // On supprime tous ses votes
           modelVote.deleteVotePers(request.body.numPersonne, function(err, result){
             if(err){
               // gestion de l'erreur
               console.log(err);
               return;
             }

             // On supprime l'étudiant
             modelEtudiant.deleteEtudiant(request.body.numPersonne, function(err, result){
               if(err){
                 // gestion de l'erreur
                 console.log(err);
                 return;
               }

               // On supprime la personne
               model.deletePersonne(request.body.numPersonne, function(err, result){
                 if(err){
                   // gestion de l'erreur
                   console.log(err);
                   response.supprOk = false;
                 }
                 else{ //pas d'erreur
                   response.supprOk = true;
                 }

                 response.prenom = request.session.personne.prenom;
                 response.nom = request.session.personne.nom;
                 // On vide les variables de session
                 request.session.personne = null;
                 response.render('supprimerPersonneOK', response);
              });
            });
           });
         }
         else //salarié
         {
           // On récupère le numéro de toutes ses citations
           modelCitation.getCitationPers(request.body.numPersonne, function(err, result){
             if(err){
               // gestion de l'erreur
               console.log(err);
               return;
             }

             var i;
             for(i=0; i<result.length; i++)
             {
               // On supprime les votes sur les citations de la personne
               modelVote.deleteVoteCitation(result[i].cit_num, function(err, result){
                 if(err){
                   // gestion de l'erreur
                   console.log(err);
                   return;
                 }
               })
             }

             // On supprime les citations de la personne
             modelCitation.deleteCitationPers(request.body.numPersonne, function(err, result){
               if(err){
                 // gestion de l'erreur
                 console.log(err);
                 return;
               }

               // On supprime le salarié
               modelSalarie.deleteSalarie(request.body.numPersonne, function(err, result){
                 if(err){
                   // gestion de l'erreur
                   console.log(err);
                   return;
                 }

                 // On supprime la personne
                 model.deletePersonne(request.body.numPersonne, function(err, result){
                   if(err){
                     // gestion de l'erreur
                     console.log(err);
                     response.supprOk = false;
                   }
                   else{
                     response.supprOk = true;
                   }

                   response.prenom = request.session.personne.prenom;
                   response.nom = request.session.personne.nom;
                   // On vide les variables de session
                   request.session.personne = null;
                   response.render('supprimerPersonneOK', response);
                    });
                  });
               });
           });
         }
       });
    });
   }//fin si login
   else{
     response.redirect('/');
   }
};
