var model = require('../models/personne.js');

  // ////////////////////////////////////////////// C O N N E C T   U T I L I S A T E U R
module.exports.Connect = function(request, response){

    response.render('connect', response);
};

module.exports.VerifConnect = function(request, response){

	response.title = 'Vérification du mot de passe';

	

	response.render('connect', response);
};




















 // ////////////////////////////////////////////// D E C O N N E C T   U T I L I S A T E U R
module.exports.Deconnect = function(request, response){

	 response.redirect('/connect');
};
