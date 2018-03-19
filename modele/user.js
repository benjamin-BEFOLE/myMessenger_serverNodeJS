/**
* Supprime une image au format JPG, JPEG ou PNG
*
* @param {int} id - identifiant de l'utilisateur
*/
function deleteAvatar (id) {
	var fs = require('fs');
	var modulePath = require('path'); 
	var path = modulePath.dirname(__dirname) + '/public/img/avatar/' + id;

	if (fs.existsSync(path + '.jpg'))
		fs.unlinkSync(path + '.jpg');

	if (fs.existsSync(path + '.jpeg'))
		fs.unlinkSync(path + '.jpeg');

	if (fs.existsSync(path + '.png'))
		fs.unlinkSync(path + '.png');
}


/**
* Ajoute un nouvel utilisateur à la BDD
*
* @param {Object} data - données de l'utilisateur
*/
exports.add = function (data, eventEmitter) {
	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();
	
	// Requête SQL
	var sql = 'INSERT INTO users(name, email, password, avatarName, avatarClass)'
		+ ' VALUES(?, ?, ?, ?, ?)';

	// Exécution
	sqlDB.query(sql, data, function (err) {
		if (err)
			console.log('Erreur création nouvel utilisateur');
		
		sqlDB.end(function (err) {
			if (err)
				console.log('Erreur déconnexion');
		})

		// EventEmitter
		eventEmitter.emit('addUser');	
	});
}

/**
* Obtenir l'id d'un utilisateur à partir de son nom
*
* @param {String} userName - nom de l'utilisateur
* @param {Object} eventEmitter 
*/
exports.getIdFromName = function (userName, eventEmitter) {
	var id = 0;
	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();
	
	// Requête SQL
	var sql = 'SELECT id from users'
		+ ' WHERE name = ?';

	// Exécution
	sqlDB.query(sql, [userName], function (err, rows) {
		if (err)
			console.log('getIdFromName: Erreur obtention de l\'id');

		if (rows.length)	
			id =  rows[0].id;

		sqlDB.end(function (err) {
			if (err)
				console.log('getIdFromName: Erreur déconnexion BDD');
		})

		// EventEmitter
		eventEmitter.emit('getIdFromName', id);
	});
}

/**
* Obtenir l'id d'un utilisateur à partir de son email
*
* @param {String} userEmail - email de l'utilisateur
* @param {Object} eventEmitter 
*/
exports.getIdFromEmail = function (userEmail, eventEmitter) {
	var id = 0;
	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();
	
	// Requête SQL
	var sql = 'SELECT id from users'
		+ ' WHERE email = ?';

	// Exécution
	sqlDB.query(sql, [userEmail], function (err, rows) {
		if (err)
			console.log('getIdFromEmail: Erreur obtention de l\'id');

		if (rows.length)	
			id =  rows[0].id;

		sqlDB.end(function (err) {
			if (err)
				console.log('getIdFromEmail: Erreur déconnexion BDD');
		})

		// EventEmitter
		eventEmitter.emit('getIdFromEmail', id);
	});
}

/**
* Modifie le token d'un utilisateur dans la BDD
*
* @param {int} id - id de l'utilisateur
* @param {String} token - jeton JWT 
*/
exports.setToken = function (id, token) {
	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();
	
	// Requête SQL
	var sql = 'UPDATE users'
			+ ' SET token = ?'
			+ ' WHERE id = ?';

	// Exécution
	sqlDB.query(sql, [token, id], function (err) {
		if (err)
			console.log('setToken: Erreur de modification du token');

		sqlDB.end(function (err) {
			if (err)
				console.log('setToken: Erreur déconnexion BDD');
		})
	});
}

/**
* Modifie l'avatar' d'un utilisateur dans la BDD
*
* @param {int} id - id de l'utilisateur
* @param {String} name - nom du fichier
* @param {String} oldPath 
* @param {String} newPath 
*/
exports.setAvatar = function (id, name, oldPath, newPath, avatarClass) {
	// Chargement modules
	var fs = require('fs');

	deleteAvatar(id);					// On supprime l'ancien fichier
	fs.renameSync(oldPath, newPath); 	// On déplace le fichier uploadé

	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();
	
	// Requête SQL
	var sql = 'UPDATE users'
			+ ' SET avatarName = ?, avatarClass = ?'
			+ ' WHERE id = ?';

	// Exécution
	sqlDB.query(sql, [name, avatarClass, id], function (err) {
		if (err)
			console.log('setAvatar: Erreur de modification de l\'avatar');

		sqlDB.end(function (err) {
			if (err)
				console.log('setAvatar: Erreur déconnexion BDD');
		})
	});
}



