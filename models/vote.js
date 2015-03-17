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
