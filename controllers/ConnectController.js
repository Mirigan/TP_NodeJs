var model = require('../models/personne.js');

  // ////////////////////////////////////////////// C O N N E C T   U T I L I S A T E U R
module.exports.Connect = function(request, response){

    response.render('connect', response);
};

module.exports.VerifConnect = function(request, response){

	response.title = 'Vérification du mot de passe';
	var data = {login:request.body.login, pass:request.body.pass};
	model.getLoginOk( data,function(err, result){
		if (err) {
				// gestion de l'erreur
				console.log(err);
				return;
		}

		console.log(result);

		if (result.length == 0){
			response.render('connect', response);
		}
		else
		{
			response.render('connection', response);
		}
	});
};




















 // ////////////////////////////////////////////// D E C O N N E C T   U T I L I S A T E U R
module.exports.Deconnect = function(request, response){

	 response.redirect('/connect');
};
