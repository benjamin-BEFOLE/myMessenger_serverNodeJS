/**
* Contrôleur s'occupant de l'inscription
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.index = function (req, resp) {
	var user = require('../modele/user');
	var ctrl = require('./userController');
	var events = require('events');
	var eventEmitter = new events.EventEmitter();
	var eventEmitter2 = new events.EventEmitter();
	
	// Données
	var email = req.body.email;
	var name = req.body.name;
	var password = req.body.password;
	
	// Messages erreurs
	var emailError = null;
	var nameError = null;
	var passwordError = ctrl.checkPassword(password);

	// Ecouteurs d'événements
	eventEmitter.on('gotErrorName', function (error) {
		// Erreur sur le nom
		nameError = error;
		eventEmitter.emit('gotAllError');
	});

	eventEmitter.on('gotErrorEmail', function (error) {
		// Erreur sur l'email
		emailError = error;
		eventEmitter.emit('gotAllError');
	});
	
	eventEmitter.on('gotAllError', function () {
		// Si on a tous les messages d'erreur
		if (emailError != null && nameError != null) {
			// Si les données sont valides
			if (emailError == '' && nameError == '' && passwordError == '') {
				// Données utilisateur
				userData = [
					name,
					email,
					password,
					'default.png',
					'mini-avatar-height'
				];

				// On stocke les données dans la BDD
				user.add(userData, eventEmitter2);
			}
			else
				// On retourne les messages d'erreur
				resp.status(400).
					json({
						error: true,
						user: null,
						msg: {
							emailError: emailError,
							nameError: nameError,
							passwordError: passwordError
						}
				});
		}
	});

	eventEmitter2.on('addUser', function () {
		user.getIdFromEmail(email, eventEmitter2);
	})

	eventEmitter2.on('getIdFromEmail', function (id) {
		// Création jeton JWT
		var jwtCtrl = require('./jwtController');
		var token = jwtCtrl.createJeton(id);

		// Insertion du jeton JWT dans la BDD
		user.setToken(id, token);

		// On retourne les données
		resp.status(200).
			json({
				error: false,
				user: {
					id: id,
					name: name,
					email: email,
					token: token,
					avatarName: 'default.png',
					avatarClass: 'mini-avatar-height'
				},
				msg: {
					emailError: emailError,
					nameError: nameError,
					passwordError: passwordError
				}
		});
		
	});

	// Contrôle des données
	ctrl.checkName(name, eventEmitter);
	ctrl.checkEmail(email, eventEmitter);
}