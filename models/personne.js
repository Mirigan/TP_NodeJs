// appel du module pour le cryptage du mot de passe
var crypto=require('crypto');
var db = require('../configDb');


/*
* Vérifie le nom utilisateur et son mot de passe
*
* @param     data.login : le login de l'utilisateur
* @param     data.pass : le mot de passe
* @return l'identifiant de la personne si le mot de passe et le login sont bons
*     Rien sinon
*
*/
module.exports.getLoginOk = function (data, callback) {
	db.getConnection(function(err, connexion){
 	if(!err){
   	var sha256 = crypto.createHash("sha256"); // cryptage en sha256
   	sha256.update(data.pass, "utf8");
   	var resu = sha256.digest("base64");
	//console.log ('Mot de passe en clair : ' + data.pass);
	//console.log ('Mot de passe crypté : ' + resu);
 		req= "SELECT per_num from personne where per_login =" + connexion.escape(data.login) + " and per_pwd = " +connexion.escape(resu);
   //console.log(req);
   	connexion.query(req, callback);
   	connexion.release();
   }
   	});
};

/*
* Récupérer l'intégralité des personnes
* @return Un tableau de personnes avec le numéro, le nom et le prénom
*/
module.exports.getListePersonne = function (callback) {
	// connection à la base
	db.getConnection(function(err, connexion){
		if(!err){
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL
			// il est conseillé de passer la requête dans une variable
			connexion.query('SELECT per_num, per_nom, per_prenom from personne ORDER BY per_nom, per_prenom ASC', callback);

			// la connexion retourne dans le pool
			connexion.release();
		}
	});
};
