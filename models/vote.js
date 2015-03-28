var db = require('../configDb');

/// permet d'obtenir la liste des votes
module.exports.getListeVote = function (callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT cit_num, per_num, vot_valeur FROM vote", callback);

            connexion.release();
        }
    });
};

/// permet de mettre une note a une citation
module.exports.noteCitation = function (data, callback) {
    db.getConnection(function(err, connexion) {
        if(!err){
            connexion.query('INSERT INTO vote SET ? ', data, callback);
            connexion.release();
    }
    });
};

/*
* Supprimer les votes d'une personne
*/
module.exports.deleteVotePers = function (numPersonne, callback) {
  // connection à la base
  db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            // il est conseillé de passer la requête dans une variable
            req = "DELETE FROM vote WHERE per_num = "+numPersonne;
            connexion.query(req, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
      });
};

/*
* Supprimer les votes sur une citation
*/
module.exports.deleteVoteCitation = function (numCitation, callback) {
  // connection à la base
  db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            // il est conseillé de passer la requête dans une variable
            req = "DELETE FROM vote WHERE cit_num = "+numCitation;
            connexion.query(req, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
      });
};
