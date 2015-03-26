/*
* config.Db contient les parametres de connection à la base de données
* il va créer aussi un pool de connexions utilisables
* sa méthode getConnection permet de se connecter à MySQL
*
*/
var db = require('../configDb');

/*
* Récupérer l'intégralité des Villes
* @return Un tableau de Ville avec le N° et le nom
*/
module.exports.getListeVille = function (callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						// il est conseillé de passer la requête dans une variable
            connexion.query('SELECT vil_num, vil_nom from ville', callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

/*
* Récupérer une ville par son numéro
* @return la ville
*/
module.exports.getVille = function (numVille, callback) {
	// connection à la base
	db.getConnection(function(err, connexion){
				if(!err){
						// s'il n'y a pas d'erreur de connexion
						// execution de la requête SQL
						// il est conseillé de passer la requête dans une variable
						req = 'SELECT vil_num, vil_nom FROM ville WHERE vil_num = '+numVille;
						connexion.query(req, callback);

						// la connexion retourne dans le pool
						connexion.release();
				}
			});
};

/*
* Ajouter une ville
*/
module.exports.ajouterVille = function (nomVille, callback) {
	// connection à la base
	db.getConnection(function(err, connexion){
				if(!err){
						// s'il n'y a pas d'erreur de connexion
						// execution de la requête SQL
						// il est conseillé de passer la requête dans une variable
						req = "INSERT INTO ville SET vil_nom = '"+nomVille+"'";
						connexion.query(req, callback);

						// la connexion retourne dans le pool
						connexion.release();
				}
			});
};

/*
* Modifier une ville
*/
module.exports.modifierVille = function (ville, callback) {
	// connection à la base
	db.getConnection(function(err, connexion){
				if(!err){
						// s'il n'y a pas d'erreur de connexion
						// execution de la requête SQL
						// il est conseillé de passer la requête dans une variable
						req = "UPDATE ville SET vil_nom = '"+ville.nouveauNom+"' WHERE vil_num = "+ville.num;
						connexion.query(req, callback);

						// la connexion retourne dans le pool
						connexion.release();
				}
			});
};

/*
* Supprimer une ville
*/
module.exports.deleteVille = function (numVille, callback) {
	// connection à la base
	db.getConnection(function(err, connexion){
				if(!err){
						// s'il n'y a pas d'erreur de connexion
						// execution de la requête SQL
						// il est conseillé de passer la requête dans une variable
						req = "DELETE FROM ville WHERE vil_num = "+numVille;
						connexion.query(req, callback);

						// la connexion retourne dans le pool
						connexion.release();
				}
			});
};
