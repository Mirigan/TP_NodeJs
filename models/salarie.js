
var db = require('../configDb');

/*
* Récupérer l'intégralité des fonctions
*/
module.exports.getListeFonction = function (callback) {
  // connection à la base
  db.getConnection(function(err, connexion){
    if(!err){
      // s'il n'y a pas d'erreur de connexion
      // execution de la requête SQL
      // il est conseillé de passer la requête dans une variable
      connexion.query('SELECT fon_num, fon_libelle FROM fonction ORDER BY fon_num', callback);

      // la connexion retourne dans le pool
      connexion.release();
    }
  });
};
