var model = require('../models/personne.js');
var db = require('../configDb');

/*
* Récupérer l'intégralité des années (divisions)
*/
module.exports.getListeAnnee = function (callback) {
  // connection à la base
  db.getConnection(function(err, connexion){
    if(!err){
      // s'il n'y a pas d'erreur de connexion
      // execution de la requête SQL
      // il est conseillé de passer la requête dans une variable
      connexion.query('SELECT div_num, div_nom FROM division ORDER BY div_num', callback);

      // la connexion retourne dans le pool
      connexion.release();
    }
  });
};

/*
* Récupérer l'intégralité des départements
*/
module.exports.getListeDepartement = function (callback) {
  // connection à la base
  db.getConnection(function(err, connexion){
    if(!err){
      // s'il n'y a pas d'erreur de connexion
      // execution de la requête SQL
      // il est conseillé de passer la requête dans une variable
      connexion.query('SELECT dep_num, dep_nom FROM departement ORDER BY dep_num', callback);

      // la connexion retourne dans le pool
      connexion.release();
    }
  });
};

/*
* Ajouter un salarié
*/
module.exports.ajouterEtudiant = function (personne, etudiant, callback) {
  // connection à la base
  db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            // il est conseillé de passer la requête dans une variable
            model.ajouterPersonne(personne, function(err, result){
              if(err){
                // gestion de l'erreur
                console.log(err);
                return;
              }
              else
              {
                req = "INSERT INTO etudiant SET per_num = '"+result.insertId+"', dep_num = '"+etudiant.departement+"', div_num = '"+etudiant.annee+"'";
                connexion.query(req, callback);
              }

              // la connexion retourne dans le pool
              connexion.release();
            });
        }
      });
};
