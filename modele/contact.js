/**
* Obtenir l'id d'un utilisateur à partir de son nom
*
* @param {int} userId - l'identifiant de l'utilisateur
* @param {Object} userDataContact - l'identifiant du contact
* @param {Object} eventEmitter 
*/
var isContact = function (userId, userDataContact, eventEmitter) {
	var id = 0;
	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();
	
	// Requête SQL
	var sql = 'SELECT id FROM contacts'
		+ ' WHERE user_id = ? AND contact_id = ?';

	// Exécution
	sqlDB.query(sql, [userId, userDataContact.id], function (err, rows) {
		if (err)
			console.log('isContact: ' + err.message);

		if (rows.length)	
			id =  rows[0].id;

		sqlDB.end(function (err) {
			if (err)
				console.log('isContact: ' + err.message);
		})

		// EventEmitter
		if (id || userId == userDataContact.id) 
			eventEmitter.emit('isContact', userDataContact, true);
		else 
			eventEmitter.emit('isContact', userDataContact, false);
	});
}

/**
* Ajoute un nouveau contact dans la BDD
*
* @param {int} userId - l'identifiant de l'utilisateur
* @param {int} contactId - l'identifiant du contact
* @param {Object} eventEmitter 
*/
var add = function (userId, contactId, eventEmitter) {
	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();
	
	// Requête SQL
	var sql = 'INSERT INTO contacts(user_id, contact_id)'
		+ ' VALUES(?, ?)';

	// Exécution
	sqlDB.query(sql, [userId, contactId], function (err) {
		if (err) {
			console.log('add-contact: ' + err.message);
			eventEmitter.emit('add-contact', true);
		}

		else
			eventEmitter.emit('add-contact', false);
		
		sqlDB.end(function (err) {
			if (err)
				console.log('add-contact: ' + err.message);
		})
	});
}


/**
* Obtenir les données des utilisateurs dont le nom commence par 'chaine'
*
* @param {String} chaine - identifiant de l'utilisateur
* @param {Object} eventEmitter 
*/
var getNewContacts = function (id, chaine, eventEmitter) {
	var events = require('events');
	var eventEmitter2 = new events.EventEmitter();
	

	var data = [];
	var nbrMax = 0; 	// Nombre de résultats de la requête SQL
	var nbr = 0; 		// Nombre d'événements 'isContact' traité

	// Ecouteurs d'événements
	eventEmitter2.on('isContact', function (info, bool) {
		// Ils ne sont pas contact
		if (!bool) 
			data.push(info);

		nbr++;
		// Dernière donnée traitée
		if (nbr == nbrMax) 
			eventEmitter.emit('getNewContacts', data) 	// On envoie les résultats
	})
	
	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();

	// Requête SQL
	var sql = 'SELECT * FROM users'
		+ ' WHERE name LIKE ? '
		+ 'ORDER BY name';

	// Exécution
	sqlDB.query(sql, [chaine + '%'], function (err, rows) {
		if (err)
			console.log('getNewContacts: Erreur obtention de l\'id');

		nbrMax = rows.length;
		// Il y a au moins un résultat
		rows.forEach(function (elm, index) {
			var tmp = {
				id: elm.id,
				name: elm.name,
				avatarName: elm.avatarName,
				avatarClass: elm.avatarClass
			};

			// On teste s'ils sont déjà contact
			isContact(id, tmp, eventEmitter2);
		})

		// Aucun résultat
		if (!nbrMax) 
			eventEmitter.emit('getNewContacts', data) 	// On envoie les résultats

		sqlDB.end(function (err) {
			if (err)
				console.log('getNewContacts: Erreur déconnexion BDD');
		})
	});
}

// Exports
exports.isContact = isContact;
exports.add = add;
exports.getNewContacts = getNewContacts;