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

/**
* Contrôleur s'occupant de la liste de contacts
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.getList = function (req, resp) {
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
	eventEmitter.on('getContacts', function (data) {
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
		if (chaine != '0' && errorChaine) 
			eventEmitter.emit('error');

		else {
			var contact = require('../modele/contact');
			if ( chaine == '0')
				contact.getContacts(id, '', eventEmitter);
			else
				contact.getContacts(id, chaine, eventEmitter);
		}
	}

	else
		ctrl.deconnexion(resp);
}