/**
* Contrôleur s'occupant de la recherche d'un nouveau contact
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.index = function (req, resp) {
	var ctrl = require('./userController');
	var jwtCtrl = require('./jwtController');
	var events = require('events');
	var eventEmitter = new events.EventEmitter();

	// Données reçues
	var id = req.params.userId;
	var idJWT = jwtCtrl.getId(req.headers.authorization);
	var chaine = req.params.chaine;

	//Erreur
	errorChaine = ctrl.checkNameSync(chaine);

	// Ecouteurs d'événements
	eventEmitter.on('getNewContacts', function (data) {
		if (data.length) {
			// On retourne les données
			resp.status(200).json(data);
		}
		// Erreur
		else
			eventEmitter.emit('error');
	})

	eventEmitter.on('error', function () {
		// On retourne les données
		resp.status(400).json([]);
	})

	// Traitements des données
	if (idJWT && idJWT == id) {
		// Erreur
		if (errorChaine) 
			eventEmitter.emit('error');

		else {
			var contact = require('../modele/contact');
			contact.getNewContacts(id, chaine, eventEmitter);
		}
	}

	else
		ctrl.deconnexion(resp);
}