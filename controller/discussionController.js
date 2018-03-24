/**
* Contrôleur les envois de messages entre utilisateurs
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
	var userId = req.params.userId;
	var contactId = req.body.contactId;
	var message = req.body.message;
	var date = Date.now();
	var status = 0;
	var idJWT = jwtCtrl.getId(req.headers.authorization);
	var dataMsg = {
			emitter_id: userId,
			receiver_id: contactId,
			message: message,
			date: date,
			status: status
		};

	// Ecouteurs d'événements
	eventEmitter.on('getMsgId', function (id) {
		dataMsg.id = id;
		// Envoi réponse
		resp.status(200).json(dataMsg);

		// Notification
		req.myGlobalEvent.emit('Notification', dataMsg);
	})

	// Traitements des données
	if (idJWT && idJWT == userId) {
		var discussion = require('../modele/discussion');
		discussion.add(userId, contactId, message, date, status, eventEmitter);
	}

	else
		ctrl.deconnexion(resp);
}

/**
* Contrôleur les envois de messages entre utilisateurs
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.getLastMessages = function (req, resp) {
	var ctrl = require('./userController');
	var jwtCtrl = require('./jwtController');
	var events = require('events');
	var eventEmitter = new events.EventEmitter();

	// Données reçues
	var id = req.params.userId;
	var chaine = req.params.chaine;
	var idJWT = jwtCtrl.getId(req.headers.authorization);

	//Erreur
	errorChaine = ctrl.checkNameSync(chaine);

	// Ecouteurs d'événements
	eventEmitter.on('getLastMessages', function (data) {
		resp.status(200).json(data);
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
			var discussion = require('../modele/discussion');
			if ( chaine == '0')
				discussion.getLastMessages(id, '', eventEmitter);
			else
				discussion.getLastMessages(id, chaine, eventEmitter);
		}
	}

	else
		ctrl.deconnexion(resp);
}

/**
* Récupère tous les messages échangés entre userId et contactId
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.getAllMessages = function (req, resp) {
	var ctrl = require('./userController');
	var jwtCtrl = require('./jwtController');
	var events = require('events');
	var eventEmitter = new events.EventEmitter();

	// Données reçues
	var userId = req.params.userId;
	var contactId = req.params.contactId;
	var idJWT = jwtCtrl.getId(req.headers.authorization);

	// Ecouteurs d'événements
	eventEmitter.on('getAllMessages', function (data) {
		resp.status(200).json(data);
	})

	// Traitements des données
	if (idJWT && idJWT == userId) {
		var discussion = require('../modele/discussion');
		discussion.getAllMessages(userId, contactId, eventEmitter);
	}

	else
		ctrl.deconnexion(resp);
}

/**
* Mise à jour statut d'un message
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.updateStatus = function (req, resp) {
	var ctrl = require('./userController');
	var jwtCtrl = require('./jwtController');

	// Données reçues
	var userId = req.params.userId;
	var messageId = req.params.messageId;
	var idJWT = jwtCtrl.getId(req.headers.authorization);

	// Traitements des données
	if (idJWT && idJWT == userId) {
		var discussion = require('../modele/discussion');
		discussion.updateStatus(messageId);
		resp.status(200).json({});
	}

	else
		ctrl.deconnexion(resp);
}