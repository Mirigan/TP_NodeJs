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
 		req= "SELECT per_num, per_login from personne where per_login =" + connexion.escape(data.login) + " and per_pwd = " +connexion.escape(resu);
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
			connexion.query('SELECT per_num, per_nom, per_prenom from personne ORDER BY per_nom, per_prenom', callback);

			// la connexion retourne dans le pool
			connexion.release();
		}
	});
};

/**
*
*/
module.exports.isEtudiant = function(numPersonne, callback){
	db.getConnection(function(err, connexion)
	{
		if(!err)
		{
			// S'il n'y a pas d'erreur de connexion
			req = "SELECT * FROM etudiant WHERE per_num = "+numPersonne;
			connexion.query(req, callback);
			connexion.release();
		}
	});
};

/**
*
*/
module.exports.getEtudiant = function(numPersonne, callback){
	// Connexion à la base
	db.getConnection(function(err, connexion)
	{
		if(!err)
		{
			// S'il n'y a pas d'errreur de connexion
			req = "SELECT per_nom, per_prenom, per_mail, per_tel, dep_nom, vil_nom FROM personne p INNER JOIN etudiant e ON p.per_num = e.per_num INNER JOIN departement d ON e.dep_num = d.dep_num INNER JOIN ville v ON d.vil_num = v.vil_num WHERE p.per_num = "+numPersonne;
			connexion.query(req, callback);

			connexion.release();
		}
	});
}

/**
*
*/
module.exports.getSalarie = function(numPersonne, callback){
	// Connexion à la base
	db.getConnection(function(err, connexion)
	{
		if(!err)
		{
			// S'il n'y a pas d'errreur de connexion
			req = "SELECT per_num, per_nom, per_prenom, per_mail, per_tel, sal_telprof, fon_libelle FROM personne p INNER JOIN salarie s ON p.per_num = s.per_num INNER JOIN fonction f ON s.fon_num = f.fon_num WHERE p.per_num = "+numPersonne;
			connexion.query(req, callback);

			connexion.release();
		}
	});
}

/**
* fonction qui nous permet d'avoir tout les salariés
*/
module.exports.getAllSalarie = function(callback){
	// Connexion à la base
	db.getConnection(function(err, connexion)
	{
		if(!err)
		{
			// S'il n'y a pas d'errreur de connexion
			req =  "SELECT p.per_num, per_nom, per_prenom, per_mail, per_tel, sal_telprof, fon_libelle ";
			req += "FROM personne p INNER JOIN salarie s ON p.per_num = s.per_num ";
			req += "INNER JOIN fonction f ON s.fon_num = f.fon_num ";
			connexion.query(req, callback);

			connexion.release();
		}
	});
}
