var HomeController = require('./../controllers/HomeController');
var ConnectController = require('./../controllers/ConnectController');
var PersonneController = require('./../controllers/PersonneController');
var CitationController = require('./../controllers/CitationController');
var VilleController = require('./../controllers/VilleController');

// Routes
module.exports = function(app){

// Main Routes
    app.get('/', HomeController.Index);

// citations
    app.get('/listerCitation', CitationController.ListerCitation);
    app.get('/ajouterCitation', CitationController.AjouterCitation);
    app.post('/verifCitation', CitationController.VerifCitation);
    app.get('/rechercherCitation', CitationController.RechercherCitation);
    //app.get('/rechercherCitationOk', CitationController.RechercherCitationOk);

 // villes
   app.get('/listerVille', VilleController.ListerVille);
   app.get('/ajouterVille', VilleController.AjouterVille);
   app.post('/ajouterVilleOK', VilleController.AjouterVilleOK);
   app.get('/modifierVille', VilleController.ModifierVille);

// connection
   app.get('/connect', ConnectController.Connect);
   app.post('/verifConnect', ConnectController.VerifConnect)
   app.get('/deconnect', ConnectController.Deconnect);


 //personne
  app.get('/supprimerPersonne', PersonneController.SupprimerPersonne);
  app.post('/supprimerPersonneOK', PersonneController.SupprimerPersonneOK);
  app.get('/modifierPersonne', PersonneController.ModifierPersonne);
  app.get('/modifierPersonne2/:numPersonne', PersonneController.ModifierPersonne2);
  app.post('/modifierPersonneOK', PersonneController.ModifierPersonneOK);
  app.post('/modifierEtudiantOK', PersonneController.ModifierEtudiantOK);
  app.post('/modifierSalarieOK', PersonneController.ModifierSalarieOK);
  app.get('/listerPersonne', PersonneController.ListerPersonne);
  app.get('/ajouterPersonne', PersonneController.AjouterPersonne);
  app.post('/ajouterPersonneOK', PersonneController.AjouterPersonneOK);
  app.post('/ajouterEtudiantOK', PersonneController.AjouterEtudiantOK);
  app.post('/ajouterSalarieOK', PersonneController.AjouterSalarieOK);
  app.get('/detailsPersonne/:numPersonne', PersonneController.DetailsPersonne);

// tout le reste
  app.get('*', HomeController.Index);
  app.post('*', HomeController.Index);

};
