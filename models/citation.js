var db = require('../configDb');

module.exports.getListeCitation = function (callback){
  // connection à la base
  db.getConnection(function(err, connexion){
    if(!err){
      // s'il n'y a pas d'erreur de connexion
      // execution de la requête SQL
      var req = "SELECT c.cit_num, per_nom, cit_libelle, DATE_FORMAT(cit_date, '%d/%m/%y') as cit_date, AVG(vot_valeur) as cit_moy from citation c inner join vote v on c.cit_num = v.cit_num inner join personne p on c.per_num = p.per_num where cit_valide = 1 and cit_date_valide is not null group by c.cit_num, per_nom, cit_libelle, cit_date ";
      connexion.query(req, callback);

      //la connexion retourne dans le pool
      connexion.release();
    }
  });
};
