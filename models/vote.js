var db = require('../configDb');

module.exports.getNote = function (callback){
  // connection à la base
  db.getConnection(function(err, connexion){
    if(!err){
      // s'il n'y a pas d'erreur de connexion
      // execution de la requête SQL
      var req = "SELECT vot_valeur "
      req += " from vote v inner join"
      req += " citation c on c.cit_num = v.cit_num ";
      connexion.query(req, callback);

      //la connexion retourne dans le pool
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
