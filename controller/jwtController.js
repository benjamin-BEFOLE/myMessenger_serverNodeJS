// Constante(s)
const JWT_SECRET = '9qacP6B7af3d2nmj3ZHKAYMc59vD2yHrTK2MwS468996aHWfv2';


/**
* Crée un jeton JWT
*
* @param {int} id - l'identifiant de l'utilisateur
* @return {String} un jeton JWT
*/
exports.createJeton = function (id) {
	var jwt = require('jsonwebtoken');
	// Création jeton JWT
	var token = jwt.sign({ id: id }, JWT_SECRET, { expiresIn: 24 * 3600 });

	return token;
}

/**
* Contrôle le token 
*
* @param {String} chaine - Information à analyser
* @return {int} l'id de l'utilisateur
*/
exports.getId = function (chaine) {
	var jwt = require('jsonwebtoken');
	var id = 0;
	var token = (chaine != null)?chaine.replace('Bearer ', ''):null; 	// On isole le token
	
	if (token != null) {
		try {
			var jwtToken = jwt.verify(token, JWT_SECRET); 	// On vérifie le token
			if (jwtToken != null)
				id = jwtToken.id; 	// On stocke l'id
		} catch(error) {
			console.log(error.message);
		}
	}

	return id;
}
		