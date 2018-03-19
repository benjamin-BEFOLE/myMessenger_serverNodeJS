const SIZE_MAX 	= 2097152;
const WIDTH_MIN = 200;
const HEIGHT_MIN = 200;

/**
* Contrôle l'email de l'utilisateur
*
* @param {String} chaine - Information à analyser
* @return {String} Une chaine de caractères non vide en cas d'erreur
*/
var checkEmail = function (chaine, eventEmitter) {
	var user = require('../modele/user');

	user.getIdFromEmail(chaine, eventEmitter);
	
	eventEmitter.on('getIdFromEmail', function (id) {
		var errorEmail = null;
		var regexEmail = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;

		if (chaine == '' || chaine == null)
			errorEmail = 'Veuillez bien renseigner ce champ';

		else if (id)
			errorEmail = 'Cet email est déjà utilisé';

		else if (regexEmail.test(chaine))
			errorEmail = '';

		else
			errorEmail = 'Ce mail n\'est pas valide';

		// EVENEMENT: erreur sur l'email' traitée
		eventEmitter.emit('gotErrorEmail', errorEmail);
	});
}

/**
* Contrôle l'email de l'utilisateur
*
* @param {String} chaine - Information à analyser
* @return {String} Une chaine de caractères non vide en cas d'erreur
*/
var loginCheckEmail = function (chaine) {
		var errorEmail = '';
		var regexEmail = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;

		if (chaine == '' || chaine == null)
			errorEmail = 'Veuillez bien renseigner ce champ';

		else if (regexEmail.test(chaine))
			errorEmail = '';

		else
			errorEmail = 'Ce mail n\'est pas valide';

		return errorEmail;
}

/**
* Contrôle le nom de l'utilisateur
*
* @param {String} chaine - Information à analyser
* @return {String} Une chaine de caractères non vide en cas d'erreur
*/
var checkName = function (chaine, eventEmitter) {
	var user = require('../modele/user');

	user.getIdFromName(chaine, eventEmitter);
	
	eventEmitter.on('getIdFromName', function (id) {
		var errorName = null;
		var regexName = /^[a-zA-Z]+[a-zA-Z ]*$/;

		if (chaine == '' || chaine == null)
			errorName = 'Veuillez bien renseigner ce champ';

		else if (id)
			errorName = 'Ce nom est déjà utilisé';

		else if (regexName.test(chaine))
			errorName = '';

		else
			errorName = 'Ce champ ne doit contenir que des lettres (sans accent)';

		// EVENEMENT: erreur sur le nom traitée
		eventEmitter.emit('gotErrorName', errorName);
	});
}

/**
* Contrôle le mot de passe de l'utilisateur
*
* @param {String} chaine - Information à analyser
* @return {String} Une chaine de caractères non vide en cas d'erreur
*/
var checkPassword = function (chaine) {
	var regexPassword = /^[a-zA-z0-9]+$/;

	if (chaine == '' || chaine == null)
		return 'Veuillez bien renseigner ce champ';

	else if (chaine.length < 6)
		return 'Niveau de sécurité insuffisant';

	else if (regexPassword.test(chaine))
		return '';

	else
		return 'Ce mot de passe n\'est pas valide';
}

/**
* Contrôle le mot de passe de l'utilisateur
*
* @param {String} chaine - Information à analyser
* @return {String} Une chaine de caractères non vide en cas d'erreur
*/
var checkNewPassword = function (password1, password2) {
	if (password1 != password2)
		return 'Veuillez saisir le même mot de passe';

	else
		return checkPassword(password1);
}

/**
* Contrôle l'avatar de l'utilisateur
*
* @param {Object} info - Information à analyser
*/
var checkImage = function (info) {
	var extensions = 'jpg   jpeg   png';

	if (extensions.indexOf(info.extension) == -1) 
		return 'mauvaise extension';
	
	else {
		var sizeOf = require('image-size');
		var dimensions = sizeOf(info.path);

		if (info.size > SIZE_MAX)
			return 'poids max 2Mo';

		else if (dimensions.width < WIDTH_MIN || dimensions.height < HEIGHT_MIN) 
			return 'taille min ' + WIDTH_MIN + '*' + HEIGHT_MIN + 'px';

		else {
			info.width = dimensions.width;
			info.height = dimensions.height;
			return '';
		}
	}
}

/**
* Envoie un message de déconnexion au client
*
* @param {Object} resp - réponse serveur
*/
var deconnexion = function (resp) {
	resp.status(401)
		.json({
			error: false,
			msgError: 'utilisateur non authentifié',
		});
}

// Exports
exports.checkEmail = checkEmail;
exports.loginCheckEmail = loginCheckEmail;
exports.checkName = checkName;
exports.checkPassword = checkPassword;
exports.checkNewPassword = checkNewPassword;
exports.checkImage = checkImage;
exports.deconnexion = deconnexion;
