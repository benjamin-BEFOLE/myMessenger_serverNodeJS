/**
* Contrôleur s'occupant de la connexion
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
var index = function (req, resp) {
	var user = require('../modele/user');
	var ctrl = require('./userController');
	var events = require('events');
	var eventEmitter = new events.EventEmitter();
	
	// Données
	var userId;
	var email = req.params.email;
	var password = req.params.password;
	var token = null;

	// Contrôle des données
	var emailError = ctrl.checkEmailSync(email);
	var passwordError = ctrl.checkPassword(password);

	// Ecouteurs d'événements
	eventEmitter.on('error', function () {
		// On retourne les messages d'erreur
		resp.status(400).
			json({
				error: true,
				user: null,
				msg: {
					emailError: emailError,
					passwordError: passwordError
				}
		});
	});

	eventEmitter.on('getUserData', function (data) {
		// Création d'un jeton JWT
		var jwtCtrl = require('./jwtController');
		token = jwtCtrl.createJeton(data.id);
		user.setToken(data.id, token);

		// On retourne les données
		resp.status(200).
			json({
				error: false,
				user: {
					id: data.id,
					name: data.name,
					email: data.email,
					token: token,
					avatarName: data.avatarName,
					avatarClass: data.avatarClass
				},
				msg: {
					emailError: emailError,
					passwordError: passwordError
				}
		});
	});

	eventEmitter.on('getUserId', function (id) {
		// Utilisateur trouvé dans la BDD
		if (id) 
			user.getUserData(id, eventEmitter);

		// Utilisateur introuvable dans la BDD
		else 
			eventEmitter.emit('error');
	});

	// Les données sont valides
	if (emailError == '' && passwordError == '')
		user.getUserId(email, password, eventEmitter);

	// Données non valides
	else
		eventEmitter.emit('error');

}

// Exportation
exports.index = index;