var db = require('../configDb');

module.exports.getListeCitation = function (callback){
  // connection à la base
  db.getConnection(function(err, connexion){
    if(!err){
      // s'il n'y a pas d'erreur de connexion
      // execution de la requête SQL
      var req = "SELECT c.cit_num, per_nom, cit_libelle, DATE_FORMAT(cit_date, '%d/%m/%y') as cit_date, AVG(vot_valeur) as cit_moy"
      req += " from citation c"
      req += " inner join vote v on c.cit_num = v.cit_num"
      req += " inner join personne p on c.per_num = p.per_num"
      req += " where cit_valide = 1 and cit_date_valide is not null"
      req += " group by c.cit_num, per_nom, cit_libelle, cit_date ";
      connexion.query(req, callback);

      //la connexion retourne dans le pool
      connexion.release();
    }
  });
};

module.exports.getListeCitationNonValide = function (callback) {

  db.getConnection(function (err, connexion) {
    if (!err) {
      connexion.query("SELECT cit_num, per_nom, per_prenom, cit_libelle, DATE_FORMAT(cit_date, '%d/%m/%Y') AS cit_date FROM citation c JOIN personne p ON c.per_num = p.per_num WHERE cit_valide = 0", callback);

      connexion.release();
    }
  });
};


// permet de valider une citation
module.exports.citationValidee = function (id, callback) {
  db.getConnection(function(err, connexion) {
    if(!err){
      var date = new Date();
      var dateValide = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();

      connexion.query('UPDATE citation SET cit_valide = 1, cit_date_valide = '+dateValide+' per_num_valide = '+request.session.per_num_co+' WHERE cit_num='+id, callback);
      connexion.release();
    }
  });
};

/**
* fonction d'insertion d'une citation
*/
module.exports.ajouterCitation = function (citation, callback){
  // connection à la base
  db.getConnection(function(err, connexion){
    if(!err){
      // s'il n'y a pas d'erreur de connexion
      // execution de la requête SQL
      var req = "INSERT INTO citation SET ? ";
      connexion.query(req, citation, callback);

      //la connexion retourne dans le pool
      connexion.release();
    }
  });
};


/**
* fonction de recherche de citations par date
*/
module.exports.getListeDateCitation = function(callback){
  // connection à la base
  db.getConnection(function(err, connexion){
    if(!err){
      // s'il n'y a pas d'erreur de connexion
      // execution de la requête SQL
      var req = "SELECT distinct date_format(cit_date, '%d/%m/%Y') as cit_date FROM citation c ";
      req += " where cit_valide = 1 AND cit_date_valide is not null"
      connexion.query(req, date, callback);

      //la connexion retourne dans le pool
      connexion.release();
    }

  });
};

module.exports.getListePersonneDepCitValide = function(callback){
  // connection à la base
  db.getConnection(function(err, connexion){
    if(!err){
      // s'il n'y a pas d'erreur de connexion
      // execution de la requête SQL
      var req = "SELECT distinct p.per_num, per_nom FROM personne p ";
      req += " inner join citation c on c.per_num = p.per_num";
      req += " where cit_valide = 1 AND cit_date_valide is not null"
      connexion.query(req, date, callback);

      //la connexion retourne dans le pool
      connexion.release();
    }

  });
};

/*
* Obtenir les numéros de citations d'une personne
*/
module.exports.getCitationPers = function (numPersonne, callback) {
  // connection à la base
  db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            // il est conseillé de passer la requête dans une variable
            req = "SELECT cit_num FROM citation WHERE per_num = "+numPersonne;
            connexion.query(req, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
      });
};

/*
* Supprimer les citations d'une personne
*/
module.exports.deleteCitationPers = function (numPersonne, callback) {
  // connection à la base
  db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            // il est conseillé de passer la requête dans une variable
            req = "DELETE FROM citation WHERE per_num = "+numPersonne;
            connexion.query(req, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
      });
};
