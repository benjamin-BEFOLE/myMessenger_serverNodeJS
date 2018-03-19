/**
* Contrôleur s'occupant de la connexion
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
var index = function (req, resp) {
	ctrl = require('./userController');
	
	// Données
	var email = req.body.email;
	var password = req.body.password;
	
	// Messages erreurs
	var emailError = ctrl.checkEmail(email);
	var passwordError = ctrl.checkPassword(password);
	
	// Si les données sont valides
	if (emailError == '' && passwordError == '')
	{
		// TODO dooner token

		// On retourne les données
		resp.status(200).
			json({
				error: false,
				user: {
					id: 1,
					email: email,
					avatar: 'default.png',
					token: 'TODO TOKEN'
				},
				msg: {
					emailError: emailError,
					passwordError: passwordError
				}
		});
	}
	else
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
}

// Exportation
exports.index = index;