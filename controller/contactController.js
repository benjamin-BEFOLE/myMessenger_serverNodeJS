/**
* Contrôleur s'occupant des contacts
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.add = function (req, resp) {
	var ctrl = require('./userController');
	var jwtCtrl = require('./jwtController');
	var events = require('events');
	var eventEmitter = new events.EventEmitter();

	// Données reçues
	var userId = req.body.userId;
	var contactId = req.body.contactId;
	var idJWT = jwtCtrl.getId(req.headers.authorization);

	// Ecouteurs d'événements
	eventEmitter.on('add-contact', function (err) {
		// Contact pas ajouter
		if (err) {
			// On retourne les données
			resp.status(400).json({});
		}

		// Contact bien ajouter
		else
			// On retourne les données
			resp.status(200).json({
				userId: userId,
				contactId: contactId
			});
	})

	// Traitements des données
	if (idJWT && idJWT == userId) {
		var contact = require('../modele/contact');
		contact.add(userId, contactId, eventEmitter);
	}

	else
		ctrl.deconnexion(resp);
}