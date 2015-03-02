var model = require('../models/personne.js');
var rand1;
var rand2;

  // ////////////////////////////////////////////// C O N N E C T   U T I L I S A T E U R
module.exports.Connect = function(request, response){

    rand1 = Math.floor(Math.random() * 9) + 1;
    rand2 = Math.floor(Math.random() * 9) + 1;
    response.nb1 = rand1;
    response.nb2 = rand2;

    response.render('connect', response);
};

module.exports.VerifConnect = function(request, response){

	response.title = 'Vérification du mot de passe';
  rep = request.body.somme;
  if(rand1+rand2 != rep){
    response.render('connect', response);
  }
	var data = {login:request.body.login, pass:request.body.pass};
	model.getLoginOk( data,function(err, result){
		if (err) {
				// gestion de l'erreur
				console.log(err);
				return;
		}

		if (result.length === 0){
			response.render('connect', response);
		}
		else
		{
      date = new Date();
      request.session.per_login = result[0].per_login;
      request.session.per_num_co = result[0].per_num;
      console.log("per_login :"+result[0].per_login);
      console.log("per_num_co :"+result[0].per_num);
      console.log("date : "+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
			response.render('connection', response);
		}
	});
};

 // ////////////////////////////////////////////// D E C O N N E C T   U T I L I S A T E U R
module.exports.Deconnect = function(request, response){
  if(request.session.per_login != null){
    request.session.per_login = null;

    response.render('deconnection', response);
  }

};
