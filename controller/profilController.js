/**
* Fonction retournant l'extension d'un fichier
*
* @param {String} name - nom du fichier
*/
function getExtension (name) {
	var index = name.lastIndexOf('.') + 1;
	var extension = name.substring(index);
	return extension.toLowerCase();
}


/**
* Contrôle l'avatar d'un utilisateur
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.checkAvatar = function (req, resp) {
	var ctrl = require('./userController');
	var jwtCtrl = require('./jwtController');
	var pathModule = require('path');  
	var formidable = require('formidable');
	var form = new formidable.IncomingForm();

	var id = req.params.id;
	var idJWT = jwtCtrl.getId(req.headers.authorization);

	if (idJWT && idJWT == id) {
		form.parse(req, function(err, fields, files) {
			// ERROR
			if (err) throw  err
			
			var file = files.image;
			var info = {
				extension 	: getExtension(file.name),
				path 		: file.path,
				width 		: -1,
				height  	: -1,
				size 		: file.size
			};


			var msgError = ctrl.checkImage(info);

			// ERROR
			if (msgError != '')
			{
				// Envoi des données au client
				resp.status(400)
					.json({
						error: true,
						msgError: msgError,
						avatar: {}
					});
			}

			else {
				var newName = id + '.' + info.extension;
				var newPath = pathModule.dirname(__dirname) + '/public/img/avatar/' + newName;
				var avatarClass = (info.height < info.width)?'mini-avatar-height':'mini-avatar-width';
				var userModule = require('../modele/user'); 	// Chargement modèle

				// Traitements de l'avatar
				userModule.setAvatar(id, newName, info.path, newPath, avatarClass); 	

				// Envoi des données au client
				resp.status(200)
					.json({
						error: false,
						msgError: msgError,
						avatar: {
							name: newName,
							class: avatarClass
						}
					});
			}
	    });
	}
	
	else
		ctrl.deconnexion(resp);
}

/**
* Contrôle le nom d'un utilisateur
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.checkName = function (req, resp) {
	var ctrl = require('./userController');
	var jwtCtrl = require('./jwtController');
	var events = require('events');
	var eventEmitter = new events.EventEmitter();
	
	// Données utilisateur
	var name = req.params.name;
	var id = req.params.id;
	var idJWT = jwtCtrl.getId(req.headers.authorization);

	if (idJWT && idJWT == id) {
		// Création d'événements
		ctrl.checkName(name, eventEmitter);

		// Ecouteurs d'événements
		eventEmitter.on('gotErrorName', function (error) {
			// ERROR
			if (error != '') {
				// Envoi des données au client
				resp.status(400)
					.json({
						error: true,
						msgError: error,
						name: ''
					});
			}

			else {
				// Traitements 
				var userModule = require('../modele/user'); // Chargement modèle
				userModule.setName(id, name);				// Modification de la BDD

				// Envoi des données au client
				resp.status(200)
					.json({
						error: false,
						msgError: error,
						name: name
					});
			}
		});
	}

	else
		ctrl.deconnexion(resp);
}

/**
* Contrôle l'email' d'un utilisateur
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.checkEmail = function (req, resp) {
	var ctrl = require('./userController');
	var jwtCtrl = require('./jwtController');
	var events = require('events');
	var eventEmitter = new events.EventEmitter();
	
	// Données utilisateur
	var email = req.params.email;
	var id = req.params.id;
	var idJWT = jwtCtrl.getId(req.headers.authorization);

	if (idJWT && idJWT == id) {
		// Création d'événements
		ctrl.checkEmail(email, eventEmitter);

		// Ecouteurs d'événements
		eventEmitter.on('gotErrorEmail', function (error) {
			// ERROR
			if (error != '') {
				// Envoi des données au client
				resp.status(400)
					.json({
						error: true,
						msgError: error,
						email: ''
					});
			}

			else {
				// Traitements 
				var userModule = require('../modele/user'); // Chargement modèle
				userModule.setEmail(id, email);				// Modification de la BDD

				// Envoi des données au client
				resp.status(200)
					.json({
						error: false,
						msgError: error,
						email: email
					});
			}
		});
	}

	else
		ctrl.deconnexion(resp);
}

/**
* Contrôle l'email' d'un utilisateur
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.checkNewPassword = function (req, resp) {
	var ctrl = require('./userController');
	var jwtCtrl = require('./jwtController');
	var events = require('events');
	var eventEmitter = new events.EventEmitter();
	
	// Données utilisateur
	var password1 = req.body.password1;
	var password2 = req.body.password2;
	var id = req.params.id;
	var idJWT = jwtCtrl.getId(req.headers.authorization);

	if (idJWT && idJWT == id) {
		// Contrôle du nouveau mot de passe
		error = ctrl.checkNewPassword(password1, password2);

		// ERROR
		if (error != '') {
			// Envoi des données au client
			resp.status(400)
				.json({
					error: true,
					msgError: error,
				});
		}

		else {
			// Traitements 
			var userModule = require('../modele/user'); // Chargement modèle
			userModule.setPassword(id, password1);		// Modification de la BDD

			// Envoi des données au client
			resp.status(200)
				.json({
					error: false,
					msgError: error,
				});
		}
	}

	else
		ctrl.deconnexion(resp);
}

/**
* Met l'avatar par défaut
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.setAvatarDefault = function (req, resp) {
	var ctrl = require('./userController');
	var jwtCtrl = require('./jwtController');

	var idJWT = jwtCtrl.getId(req.headers.authorization);
	var id = req.params.id;
	var name = 'default.png';
	var avatarClass = 'mini-avatar-height';

	if (idJWT && idJWT == id) {
		// Traitements 
		var userModule = require('../modele/user'); 		// Chargement modèle
		userModule.setAvatarDefault(id, name, avatarClass); // Modification de la BDD

		// Envoi des données au client
		resp.status(200)
			.json({
				error: false,
				avatar: {
					name: name,
					class: avatarClass
				}
			});
	}

	else
		ctrl.deconnexion(resp);
}
